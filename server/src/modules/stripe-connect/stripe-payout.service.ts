import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { DatabaseService } from 'src/configs/database/database.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class StripePayoutService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripePayoutService.name);

  constructor(private readonly prisma: DatabaseService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Cron job: Run every day at 2 AM to process pending transfers
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async processPendingTransfers() {
    this.logger.log('Starting automated payout processing...');

    const now = new Date();

    try {
      // Find all transfers that are:
      // 1. Status = pending
      // 2. scheduledTransferDate <= today
      // 3. No refund issued
      const pendingTransfers = await this.prisma.stripeTransfer.findMany({
        where: {
          status: 'pending',
          scheduledTransferDate: {
            lte: now,
          },
          courseSale: {
            refund: null, // No refund issued
          },
        },
        include: {
          courseSale: {
            include: {
              course: true,
              student: true,
            },
          },
          connectAccount: {
            include: {
              teacher: true,
              organization: true,
            },
          },
        },
        take: 100, // Process in batches of 100
      });

      this.logger.log(
        `Found ${pendingTransfers.length} transfers to process`,
      );

      let successful = 0;
      let failed = 0;

      for (const transfer of pendingTransfers) {
        try {
          await this.processTransfer(transfer);
          successful++;
        } catch (error) {
          this.logger.error(
            `Failed to process transfer ${transfer.id}: ${error.message}`,
          );
          failed++;
        }
      }

      this.logger.log(
        `Automated payout processing completed: ${successful} successful, ${failed} failed`,
      );

      return {
        successful,
        failed,
        total: pendingTransfers.length,
      };
    } catch (error) {
      this.logger.error(`Fatal error in payout processing: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process individual transfer
   */
  async processTransfer(transfer: any) {
    const { connectAccount, netAmount, courseSale } = transfer;

    // Verify account is still active
    if (connectAccount.accountStatus !== 'active') {
      await this.prisma.stripeTransfer.update({
        where: { id: transfer.id },
        data: {
          status: 'failed',
          failureReason: 'Connect account not active',
        },
      });
      throw new Error('Connect account not active');
    }

    // Verify account can receive payouts
    if (!connectAccount.payoutsEnabled) {
      await this.prisma.stripeTransfer.update({
        where: { id: transfer.id },
        data: {
          status: 'failed',
          failureReason: 'Payouts not enabled on connect account',
        },
      });
      throw new Error('Payouts not enabled');
    }

    try {
      // Update status to processing
      await this.prisma.stripeTransfer.update({
        where: { id: transfer.id },
        data: { status: 'processing' },
      });

      // Create Stripe transfer
      const amountInCents = Math.round(netAmount * 100);

      const stripeTransfer = await this.stripe.transfers.create(
        {
          amount: amountInCents,
          currency: 'usd',
          destination: connectAccount.stripeAccountId,
          description: `Payout for course: ${courseSale.course.title}`,
          metadata: {
            courseSaleId: courseSale.id.toString(),
            courseId: courseSale.courseId.toString(),
            studentId: courseSale.studentId.toString(),
            transferId: transfer.id.toString(),
          },
        },
        {
          idempotencyKey: `transfer_${transfer.id}_${Date.now()}`,
        },
      );

      // Update transfer record
      await this.prisma.stripeTransfer.update({
        where: { id: transfer.id },
        data: {
          stripeTransferId: stripeTransfer.id,
          status: 'completed',
          actualTransferDate: new Date(),
        },
      });

      this.logger.log(
        `Successfully transferred $${netAmount} to ${connectAccount.stripeAccountId}`,
      );

      // TODO: Send email notification to teacher/organization

      return stripeTransfer;
    } catch (error) {
      // Handle transfer failure
      await this.prisma.stripeTransfer.update({
        where: { id: transfer.id },
        data: {
          status: 'failed',
          failureReason: error.message,
        },
      });

      this.logger.error(`Transfer failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Manual trigger for specific transfer (admin use)
   */
  async triggerManualTransfer(transferId: number) {
    const transfer = await this.prisma.stripeTransfer.findUnique({
      where: { id: transferId },
      include: {
        courseSale: {
          include: {
            course: true,
            student: true,
          },
        },
        connectAccount: {
          include: {
            teacher: true,
            organization: true,
          },
        },
      },
    });

    if (!transfer) {
      throw new Error('Transfer not found');
    }

    if (transfer.status !== 'pending') {
      throw new Error(
        `Transfer status is ${transfer.status}, expected pending`,
      );
    }

    return this.processTransfer(transfer);
  }

  /**
   * Retry failed transfer (admin use)
   */
  async retryFailedTransfer(transferId: number) {
    const transfer = await this.prisma.stripeTransfer.findUnique({
      where: { id: transferId },
      include: {
        courseSale: {
          include: {
            course: true,
            student: true,
          },
        },
        connectAccount: {
          include: {
            teacher: true,
            organization: true,
          },
        },
      },
    });

    if (!transfer) {
      throw new Error('Transfer not found');
    }

    if (transfer.status !== 'failed') {
      throw new Error(`Transfer status is ${transfer.status}, expected failed`);
    }

    // Reset to pending
    await this.prisma.stripeTransfer.update({
      where: { id: transferId },
      data: {
        status: 'pending',
        failureReason: null,
      },
    });

    return this.processTransfer(transfer);
  }

  /**
   * Get pending transfers (admin dashboard)
   */
  async getPendingTransfers(filters?: {
    connectAccountId?: number;
    limit?: number;
  }) {
    return this.prisma.stripeTransfer.findMany({
      where: {
        status: 'pending',
        connectAccountId: filters?.connectAccountId,
      },
      include: {
        courseSale: {
          include: {
            course: true,
            student: true,
          },
        },
        connectAccount: {
          include: {
            teacher: true,
            organization: true,
          },
        },
      },
      orderBy: { scheduledTransferDate: 'asc' },
      take: filters?.limit || 50,
    });
  }

  /**
   * Get failed transfers (admin dashboard)
   */
  async getFailedTransfers(filters?: { limit?: number }) {
    return this.prisma.stripeTransfer.findMany({
      where: {
        status: 'failed',
      },
      include: {
        courseSale: {
          include: {
            course: true,
            student: true,
          },
        },
        connectAccount: {
          include: {
            teacher: true,
            organization: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: filters?.limit || 50,
    });
  }

  /**
   * Get transfer history for user
   */
  async getTransferHistory(params: {
    userType: 'teacher' | 'organization';
    userId: number;
    status?: string;
    limit?: number;
  }) {
    const { userType, userId, status, limit = 50 } = params;

    const connectAccount = await this.prisma.stripeConnectAccount.findFirst({
      where:
        userType === 'teacher'
          ? { teacherId: userId }
          : { organizationId: userId },
    });

    if (!connectAccount) {
      return [];
    }

    return this.prisma.stripeTransfer.findMany({
      where: {
        connectAccountId: connectAccount.id,
        status: status as any,
      },
      include: {
        courseSale: {
          include: {
            course: true,
            student: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get earnings summary for user
   */
  async getEarningsSummary(params: {
    userType: 'teacher' | 'organization';
    userId: number;
  }) {
    const { userType, userId } = params;

    const connectAccount = await this.prisma.stripeConnectAccount.findFirst({
      where:
        userType === 'teacher'
          ? { teacherId: userId }
          : { organizationId: userId },
    });

    if (!connectAccount) {
      return {
        pendingAmount: 0,
        completedAmount: 0,
        failedAmount: 0,
        nextPayoutDate: null,
      };
    }

    const [pending, completed, failed, nextPayout] = await Promise.all([
      this.prisma.stripeTransfer.aggregate({
        where: {
          connectAccountId: connectAccount.id,
          status: 'pending',
        },
        _sum: { netAmount: true },
      }),
      this.prisma.stripeTransfer.aggregate({
        where: {
          connectAccountId: connectAccount.id,
          status: 'completed',
        },
        _sum: { netAmount: true },
      }),
      this.prisma.stripeTransfer.aggregate({
        where: {
          connectAccountId: connectAccount.id,
          status: 'failed',
        },
        _sum: { netAmount: true },
      }),
      this.prisma.stripeTransfer.findFirst({
        where: {
          connectAccountId: connectAccount.id,
          status: 'pending',
        },
        orderBy: { scheduledTransferDate: 'asc' },
        select: { scheduledTransferDate: true },
      }),
    ]);

    return {
      pendingAmount: pending._sum.netAmount || 0,
      completedAmount: completed._sum.netAmount || 0,
      failedAmount: failed._sum.netAmount || 0,
      nextPayoutDate: nextPayout?.scheduledTransferDate || null,
    };
  }
}

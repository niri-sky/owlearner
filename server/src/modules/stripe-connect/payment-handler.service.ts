import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/configs/database/database.service';

@Injectable()
export class PaymentHandlerService {
  private readonly logger = new Logger(PaymentHandlerService.name);
  private readonly PLATFORM_FEE = parseFloat(
    process.env.PLATFORM_FEE_PERCENT || '15',
  ) / 100;
  private readonly HOLD_PERIOD_DAYS = parseInt(
    process.env.HOLD_PERIOD_DAYS || '14',
  );

  constructor(private readonly prisma: DatabaseService) {}

  /**
   * Handle successful payment and create transfers
   * This should be called after student course access is created
   */
  async handleSuccessfulPayment(params: {
    paymentIntentId: string;
    invoiceId: number;
    courseSales: Array<{
      courseId: number;
      price: number;
      studentId: number;
      teacherEarningId: number;
    }>;
  }) {
    const { paymentIntentId, invoiceId, courseSales } = params;

    try {
      // Update invoice with payment intent
      await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: { stripePaymentIntentId: paymentIntentId },
      });

      // Process each course sale
      for (const saleData of courseSales) {
        await this.processSale({
          ...saleData,
          paymentIntentId,
        });
      }

      this.logger.log(
        `Successfully processed payment ${paymentIntentId} with ${courseSales.length} sales`,
      );

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to handle payment ${paymentIntentId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Process individual sale
   */
  private async processSale(params: {
    courseId: number;
    price: number;
    studentId: number;
    teacherEarningId: number;
    paymentIntentId: string;
  }) {
    const { courseId, price, studentId, teacherEarningId, paymentIntentId } =
      params;

    const originalPrice = price;
    const platformFee = originalPrice * this.PLATFORM_FEE;
    const teacherAmount = originalPrice * (1 - this.PLATFORM_FEE);

    // Find teacher to get connect account
    const teacherEarning = await this.prisma.teacherEarning.findUnique({
      where: { id: teacherEarningId },
      include: {
        teacher: {
          include: {
            stripeConnectAccount: true,
          },
        },
      },
    });

    // Create course sale with teacher amount (85%)
    const courseSale = await this.prisma.courseSale.create({
      data: {
        price: Number(teacherAmount.toFixed(2)),
        courseId,
        studentId,
        teacherEarningId,
        stripePaymentIntentId: paymentIntentId,
      },
    });

    // Record platform earning (15%)
    await this.prisma.platformEarning.create({
      data: {
        amount: Number(platformFee.toFixed(2)),
        courseSaleId: courseSale.id,
      },
    });

    // Schedule transfer if teacher has active Connect account
    if (
      teacherEarning?.teacher?.stripeConnectAccount &&
      teacherEarning.teacher.stripeConnectAccount.accountStatus === 'active' &&
      teacherEarning.teacher.stripeConnectAccount.payoutsEnabled
    ) {
      const transferDate = new Date();
      transferDate.setDate(
        transferDate.getDate() + this.HOLD_PERIOD_DAYS,
      );

      await this.prisma.stripeTransfer.create({
        data: {
          amount: originalPrice,
          platformFee: Number(platformFee.toFixed(2)),
          netAmount: Number(teacherAmount.toFixed(2)),
          status: 'pending',
          saleDate: new Date(),
          scheduledTransferDate: transferDate,
          courseSaleId: courseSale.id,
          connectAccountId: teacherEarning.teacher.stripeConnectAccount.id,
        },
      });

      this.logger.log(
        `Scheduled transfer for courseSale ${courseSale.id} on ${transferDate.toISOString()}`,
      );
    } else {
      this.logger.warn(
        `Teacher ${teacherEarning?.teacher?.id} does not have active Connect account. Transfer not scheduled.`,
      );
    }

    return courseSale;
  }

  /**
   * Calculate split amounts
   */
  calculateSplit(coursePrice: number) {
    const platformFee = coursePrice * this.PLATFORM_FEE;
    const teacherAmount = coursePrice * (1 - this.PLATFORM_FEE);

    return {
      platformFee: Number(platformFee.toFixed(2)),
      teacherAmount: Number(teacherAmount.toFixed(2)),
      platformFeePercent: this.PLATFORM_FEE * 100,
    };
  }
}

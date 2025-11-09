import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { DatabaseService } from 'src/configs/database/database.service';

@Injectable()
export class RefundService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(RefundService.name);
  private readonly REFUND_WINDOW_DAYS = 14;

  constructor(private readonly prisma: DatabaseService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Request a refund (within 14-day window)
   */
  async requestRefund(params: {
    courseSaleId: number;
    studentId: number;
    reason: string;
  }) {
    const { courseSaleId, studentId, reason } = params;

    // Find the course sale
    const courseSale = await this.prisma.courseSale.findUnique({
      where: { id: courseSaleId },
      include: {
        course: true,
        student: true,
        transfer: true,
        refund: true,
        teacherEarning: true,
      },
    });

    if (!courseSale) {
      throw new BadRequestException('Course sale not found');
    }

    // Check if already refunded
    if (courseSale.refund) {
      throw new BadRequestException('This purchase has already been refunded');
    }

    // Check if within 14-day window
    const daysSincePurchase =
      (Date.now() - courseSale.createdAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSincePurchase > this.REFUND_WINDOW_DAYS) {
      throw new BadRequestException(
        `Refund window has expired (${this.REFUND_WINDOW_DAYS} days after purchase)`,
      );
    }

    // Check if student owns this course
    if (courseSale.studentId !== studentId) {
      throw new BadRequestException('Unauthorized');
    }

    // Check if transfer has been completed
    if (courseSale.transfer?.status === 'completed') {
      throw new BadRequestException(
        'Cannot refund - funds have already been transferred to teacher',
      );
    }

    // Get the original payment intent from invoice
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        studentId: studentId,
        stripePaymentIntentId: courseSale.stripePaymentIntentId,
      },
    });

    if (!invoice?.stripePaymentIntentId) {
      throw new BadRequestException('Payment intent not found');
    }

    try {
      // Create refund in Stripe
      const refund = await this.stripe.refunds.create({
        payment_intent: invoice.stripePaymentIntentId,
        amount: Math.round(courseSale.price * 100), // Amount in cents
        reason: 'requested_by_customer',
        metadata: {
          courseSaleId: courseSale.id.toString(),
          courseId: courseSale.courseId.toString(),
          studentId: studentId.toString(),
          refundReason: reason,
        },
      });

      // Create refund record
      const refundRecord = await this.prisma.refund.create({
        data: {
          stripeRefundId: refund.id,
          amount: courseSale.price,
          reason: this.mapRefundReason(reason),
          status: 'processing',
          courseSaleId: courseSale.id,
          studentId: studentId,
          invoiceId: invoice.id,
        },
      });

      // Cancel the pending transfer
      if (courseSale.transfer) {
        await this.prisma.stripeTransfer.update({
          where: { id: courseSale.transfer.id },
          data: {
            status: 'refunded',
            failureReason: 'Course sale was refunded',
          },
        });
      }

      // Reverse teacher earning
      if (courseSale.teacherEarning) {
        await this.prisma.teacherEarning.update({
          where: { id: courseSale.teacherEarningId },
          data: {
            withdraw: {
              decrement: courseSale.price,
            },
          },
        });
      }

      // Remove student course access
      await this.prisma.studentCourse.deleteMany({
        where: {
          studentId: studentId,
          courseId: courseSale.courseId,
        },
      });

      // Update refund status
      await this.prisma.refund.update({
        where: { id: refundRecord.id },
        data: {
          status: 'completed',
          processedAt: new Date(),
        },
      });

      this.logger.log(
        `Refund processed successfully for courseSale ${courseSaleId}`,
      );

      return refundRecord;
    } catch (error) {
      this.logger.error(`Refund failed: ${error.message}`);
      throw new BadRequestException(`Refund failed: ${error.message}`);
    }
  }

  /**
   * Check if refund is allowed for a course sale
   */
  async canRefund(courseSaleId: number): Promise<{
    canRefund: boolean;
    reason?: string;
    daysRemaining?: number;
  }> {
    const courseSale = await this.prisma.courseSale.findUnique({
      where: { id: courseSaleId },
      include: {
        refund: true,
        transfer: true,
      },
    });

    if (!courseSale) {
      return { canRefund: false, reason: 'Course sale not found' };
    }

    if (courseSale.refund) {
      return { canRefund: false, reason: 'Already refunded' };
    }

    const daysSincePurchase =
      (Date.now() - courseSale.createdAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSincePurchase > this.REFUND_WINDOW_DAYS) {
      return {
        canRefund: false,
        reason: `Refund window expired (${this.REFUND_WINDOW_DAYS} days)`,
      };
    }

    if (courseSale.transfer?.status === 'completed') {
      return {
        canRefund: false,
        reason: 'Funds already transferred to teacher',
      };
    }

    return {
      canRefund: true,
      daysRemaining: Math.ceil(this.REFUND_WINDOW_DAYS - daysSincePurchase),
    };
  }

  /**
   * Get refund history for student
   */
  async getRefundHistory(studentId: number, limit = 50) {
    return this.prisma.refund.findMany({
      where: { studentId },
      include: {
        courseSale: {
          include: {
            course: true,
          },
        },
      },
      orderBy: { requestedAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get all refunds (admin)
   */
  async getAllRefunds(filters?: {
    status?: string;
    limit?: number;
  }) {
    return this.prisma.refund.findMany({
      where: {
        status: filters?.status as any,
      },
      include: {
        courseSale: {
          include: {
            course: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { requestedAt: 'desc' },
      take: filters?.limit || 50,
    });
  }

  /**
   * Map refund reason string to enum
   */
  private mapRefundReason(reason: string): any {
    const lowerReason = reason.toLowerCase();
    if (lowerReason.includes('not as described')) return 'course_not_as_described';
    if (lowerReason.includes('technical')) return 'technical_issues';
    if (lowerReason.includes('duplicate')) return 'duplicate_charge';
    if (lowerReason.includes('fraud')) return 'fraudulent';
    return 'student_request';
  }

  /**
   * Get refund statistics (admin)
   */
  async getRefundStatistics(dateRange?: {
    startDate: Date;
    endDate: Date;
  }) {
    const where: any = {};

    if (dateRange) {
      where.requestedAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const [total, completed, pending, totalAmount, byReason] = await Promise.all([
      this.prisma.refund.count({ where }),
      this.prisma.refund.count({
        where: { ...where, status: 'completed' },
      }),
      this.prisma.refund.count({
        where: { ...where, status: 'pending' },
      }),
      this.prisma.refund.aggregate({
        where: { ...where, status: 'completed' },
        _sum: { amount: true },
      }),
      this.prisma.refund.groupBy({
        by: ['reason'],
        where,
        _count: true,
      }),
    ]);

    return {
      total,
      completed,
      pending,
      totalAmount: totalAmount._sum.amount || 0,
      byReason: byReason.map((r) => ({
        reason: r.reason,
        count: r._count,
      })),
    };
  }
}

import { Injectable } from '@nestjs/common';
import { StripeService } from 'src/configs/stripe/stripe.service';

@Injectable()
export class PaymentService {
  constructor(private readonly stripeService: StripeService) {}

  async create(
    amount: number,
    metadata?: {
      courseIds?: string;
      teacherIds?: string;
      studentId?: string;
      [key: string]: string;
    },
  ) {
    const paymentMetadata = {
      ...metadata,
      platformFeePercent: process.env.PLATFORM_FEE_PERCENT || '15',
      holdPeriodDays: process.env.HOLD_PERIOD_DAYS || '14',
    };

    const intent = await this.stripeService.createPaymentIntends(
      amount,
      paymentMetadata,
    );

    return { clientSecret: intent.client_secret, status: 'Success' };
  }
}

import { Injectable } from '@nestjs/common';
import { StripeService } from 'src/configs/stripe/stripe.service';

@Injectable()
export class PaymentService {
  constructor(private readonly stripeService: StripeService) {}

  async create(amount: number) {
    const intent = await this.stripeService.createPaymentIntends(amount);
    return { clientSecret: intent.client_secret, status: 'Success' };
  }
}

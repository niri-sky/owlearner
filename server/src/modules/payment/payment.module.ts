import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeService } from 'src/configs/stripe/stripe.service';
import { PaymentResolver } from './payment.resolver';
import { DatabaseService } from 'src/configs/database/database.service';

@Module({
  providers: [PaymentResolver, PaymentService, StripeService, DatabaseService],
})
export class PaymentModule {}

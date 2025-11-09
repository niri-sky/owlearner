import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseService } from 'src/configs/database/database.service';
import { StripeConnectService } from './stripe-connect.service';
import { StripePayoutService } from './stripe-payout.service';
import { RefundService } from './refund.service';
import { PaymentHandlerService } from './payment-handler.service';
import { StripeConnectResolver } from './stripe-connect.resolver';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [WebhookController],
  providers: [
    DatabaseService,
    StripeConnectService,
    StripePayoutService,
    RefundService,
    PaymentHandlerService,
    StripeConnectResolver,
  ],
  exports: [
    StripeConnectService,
    StripePayoutService,
    RefundService,
    PaymentHandlerService,
  ],
})
export class StripeConnectModule {}

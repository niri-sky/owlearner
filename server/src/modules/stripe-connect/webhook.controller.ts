import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  RawBodyRequest,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { DatabaseService } from 'src/configs/database/database.service';
import { StripeConnectService } from './stripe-connect.service';

@Controller('webhooks')
export class WebhookController {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly prisma: DatabaseService,
    private readonly stripeConnectService: StripeConnectService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  @Post('stripe')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      this.logger.error('Stripe webhook secret not configured');
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Webhook secret not configured',
      });
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `Webhook Error: ${err.message}`,
      });
    }

    this.logger.log(`Received webhook event: ${event.type}`);

    try {
      // Handle the event
      switch (event.type) {
        case 'account.updated':
          await this.handleAccountUpdate(event.data.object as Stripe.Account);
          break;

        case 'transfer.created':
        case 'transfer.updated':
          await this.handleTransferUpdate(event.data.object as Stripe.Transfer);
          break;

        case 'transfer.failed':
          await this.handleTransferFailed(event.data.object as Stripe.Transfer);
          break;

        case 'charge.refunded':
          await this.handleRefund(event.data.object as Stripe.Charge);
          break;

        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(
            event.data.object as Stripe.PaymentIntent,
          );
          break;

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }

      res.status(HttpStatus.OK).json({ received: true });
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Error processing webhook',
      });
    }
  }

  private async handleAccountUpdate(account: Stripe.Account) {
    try {
      await this.stripeConnectService.syncAccountStatus(account.id);
      this.logger.log(`Updated account status for ${account.id}`);
    } catch (error) {
      this.logger.error(`Failed to sync account ${account.id}: ${error.message}`);
    }
  }

  private async handleTransferUpdate(transfer: Stripe.Transfer) {
    try {
      const stripeTransfer = await this.prisma.stripeTransfer.findUnique({
        where: { stripeTransferId: transfer.id },
      });

      if (stripeTransfer) {
        await this.prisma.stripeTransfer.update({
          where: { id: stripeTransfer.id },
          data: {
            status: transfer.reversed ? 'failed' : 'completed',
            actualTransferDate: transfer.created
              ? new Date(transfer.created * 1000)
              : new Date(),
          },
        });
        this.logger.log(`Updated transfer ${transfer.id}`);
      }
    } catch (error) {
      this.logger.error(`Failed to update transfer: ${error.message}`);
    }
  }

  private async handleTransferFailed(transfer: Stripe.Transfer) {
    try {
      const stripeTransfer = await this.prisma.stripeTransfer.findUnique({
        where: { stripeTransferId: transfer.id },
      });

      if (stripeTransfer) {
        await this.prisma.stripeTransfer.update({
          where: { id: stripeTransfer.id },
          data: {
            status: 'failed',
            failureReason: 'Transfer failed in Stripe',
          },
        });
        this.logger.log(`Marked transfer ${transfer.id} as failed`);
      }
    } catch (error) {
      this.logger.error(`Failed to handle transfer failure: ${error.message}`);
    }
  }

  private async handleRefund(charge: Stripe.Charge) {
    try {
      const refunds = charge.refunds?.data || [];

      for (const refund of refunds) {
        const refundRecord = await this.prisma.refund.findUnique({
          where: { stripeRefundId: refund.id },
        });

        if (refundRecord && refundRecord.status !== 'completed') {
          await this.prisma.refund.update({
            where: { id: refundRecord.id },
            data: {
              status: 'completed',
              processedAt: new Date(),
            },
          });
          this.logger.log(`Updated refund ${refund.id} to completed`);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to handle refund: ${error.message}`);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    // This is optional - payment processing can be handled in the frontend
    // after successful payment, or you can handle it here
    this.logger.log(`Payment succeeded: ${paymentIntent.id}`);
    // The actual processing happens in PaymentHandlerService when called from frontend
  }
}

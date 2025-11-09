import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StripeConnectService } from './stripe-connect.service';
import { StripePayoutService } from './stripe-payout.service';
import { RefundService } from './refund.service';

@Resolver()
export class StripeConnectResolver {
  constructor(
    private readonly connectService: StripeConnectService,
    private readonly payoutService: StripePayoutService,
    private readonly refundService: RefundService,
  ) {}

  // ============================================
  // CONNECT ACCOUNT MUTATIONS
  // ============================================

  @Mutation(() => String, { description: 'Create Stripe Connect account' })
  async createConnectAccount(
    @Args('email') email: string,
    @Args('userType') userType: string,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('country', { nullable: true, defaultValue: 'US' }) country?: string,
  ) {
    const result = await this.connectService.createConnectAccount({
      email,
      userType: userType as 'teacher' | 'organization',
      userId,
      country,
    });
    return JSON.stringify(result);
  }

  @Mutation(() => String, { description: 'Refresh onboarding link' })
  async refreshOnboardingLink(
    @Args('userType') userType: string,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.connectService.refreshOnboardingLink({
      userType: userType as 'teacher' | 'organization',
      userId,
    });
    return JSON.stringify(result);
  }

  @Mutation(() => String, { description: 'Get Stripe dashboard link' })
  async getDashboardLink(
    @Args('userType') userType: string,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const account = await this.connectService.getConnectAccount({
      userType: userType as 'teacher' | 'organization',
      userId,
    });

    if (!account) {
      throw new Error('Connect account not found');
    }

    const url = await this.connectService.createDashboardLink(
      account.stripeAccountId,
    );
    return url;
  }

  // ============================================
  // CONNECT ACCOUNT QUERIES
  // ============================================

  @Query(() => String, {
    nullable: true,
    description: 'Get Connect account status',
  })
  async getConnectAccount(
    @Args('userType') userType: string,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const account = await this.connectService.getConnectAccount({
      userType: userType as 'teacher' | 'organization',
      userId,
    });
    return account ? JSON.stringify(account) : null;
  }

  @Query(() => String, { description: 'Get all Connect accounts (admin)' })
  async getAllConnectAccounts(
    @Args('status', { nullable: true }) status?: string,
    @Args('userType', { nullable: true }) userType?: string,
  ) {
    const accounts = await this.connectService.getAllConnectAccounts({
      status,
      userType: userType as 'teacher' | 'organization',
    });
    return JSON.stringify(accounts);
  }

  // ============================================
  // TRANSFER/PAYOUT QUERIES
  // ============================================

  @Query(() => String, { description: 'Get earnings summary' })
  async getEarningsSummary(
    @Args('userType') userType: string,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const summary = await this.payoutService.getEarningsSummary({
      userType: userType as 'teacher' | 'organization',
      userId,
    });
    return JSON.stringify(summary);
  }

  @Query(() => String, { description: 'Get transfer history' })
  async getTransferHistory(
    @Args('userType') userType: string,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('status', { nullable: true }) status?: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit?: number,
  ) {
    const history = await this.payoutService.getTransferHistory({
      userType: userType as 'teacher' | 'organization',
      userId,
      status,
      limit,
    });
    return JSON.stringify(history);
  }

  @Query(() => String, { description: 'Get pending transfers (admin)' })
  async getPendingTransfers(
    @Args('connectAccountId', { type: () => Int, nullable: true })
    connectAccountId?: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit?: number,
  ) {
    const transfers = await this.payoutService.getPendingTransfers({
      connectAccountId,
      limit,
    });
    return JSON.stringify(transfers);
  }

  @Query(() => String, { description: 'Get failed transfers (admin)' })
  async getFailedTransfers(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit?: number,
  ) {
    const transfers = await this.payoutService.getFailedTransfers({
      limit,
    });
    return JSON.stringify(transfers);
  }

  // ============================================
  // TRANSFER/PAYOUT MUTATIONS
  // ============================================

  @Mutation(() => String, { description: 'Manually trigger transfer (admin)' })
  async triggerManualTransfer(
    @Args('transferId', { type: () => Int }) transferId: number,
  ) {
    const result = await this.payoutService.triggerManualTransfer(transferId);
    return JSON.stringify(result);
  }

  @Mutation(() => String, { description: 'Retry failed transfer (admin)' })
  async retryFailedTransfer(
    @Args('transferId', { type: () => Int }) transferId: number,
  ) {
    const result = await this.payoutService.retryFailedTransfer(transferId);
    return JSON.stringify(result);
  }

  // ============================================
  // REFUND QUERIES
  // ============================================

  @Query(() => String, { description: 'Check if refund is allowed' })
  async canRefund(
    @Args('courseSaleId', { type: () => Int }) courseSaleId: number,
  ) {
    const result = await this.refundService.canRefund(courseSaleId);
    return JSON.stringify(result);
  }

  @Query(() => String, { description: 'Get refund history' })
  async getRefundHistory(
    @Args('studentId', { type: () => Int }) studentId: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit?: number,
  ) {
    const history = await this.refundService.getRefundHistory(studentId, limit);
    return JSON.stringify(history);
  }

  @Query(() => String, { description: 'Get all refunds (admin)' })
  async getAllRefunds(
    @Args('status', { nullable: true }) status?: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit?: number,
  ) {
    const refunds = await this.refundService.getAllRefunds({
      status,
      limit,
    });
    return JSON.stringify(refunds);
  }

  @Query(() => String, { description: 'Get refund statistics (admin)' })
  async getRefundStatistics(
    @Args('startDate', { nullable: true }) startDate?: Date,
    @Args('endDate', { nullable: true }) endDate?: Date,
  ) {
    const stats = await this.refundService.getRefundStatistics(
      startDate && endDate ? { startDate, endDate } : undefined,
    );
    return JSON.stringify(stats);
  }

  // ============================================
  // REFUND MUTATIONS
  // ============================================

  @Mutation(() => String, { description: 'Request refund for a course' })
  async requestRefund(
    @Args('courseSaleId', { type: () => Int }) courseSaleId: number,
    @Args('studentId', { type: () => Int }) studentId: number,
    @Args('reason') reason: string,
  ) {
    const result = await this.refundService.requestRefund({
      courseSaleId,
      studentId,
      reason,
    });
    return JSON.stringify(result);
  }
}

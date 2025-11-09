import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { DatabaseService } from 'src/configs/database/database.service';

@Injectable()
export class StripeConnectService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeConnectService.name);

  constructor(private readonly prisma: DatabaseService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Create Stripe Connect Express Account for Teacher/Organization
   */
  async createConnectAccount(params: {
    email: string;
    userType: 'teacher' | 'organization';
    userId: number;
    country?: string;
  }) {
    const { email, userType, userId, country = 'US' } = params;

    // Check if account already exists
    const existing = await this.prisma.stripeConnectAccount.findFirst({
      where:
        userType === 'teacher'
          ? { teacherId: userId }
          : { organizationId: userId },
    });

    if (existing) {
      throw new BadRequestException('Connect account already exists');
    }

    try {
      // Create Stripe Express account
      const account = await this.stripe.accounts.create({
        type: 'express',
        country: country,
        email: email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        settings: {
          payouts: {
            schedule: {
              interval: 'manual', // Platform controls payouts
            },
          },
        },
      });

      // Store in database
      const connectAccount = await this.prisma.stripeConnectAccount.create({
        data: {
          stripeAccountId: account.id,
          accountStatus: 'incomplete',
          detailsSubmitted: false,
          chargesEnabled: false,
          payoutsEnabled: false,
          email: email,
          country: country,
          ...(userType === 'teacher'
            ? { teacherId: userId }
            : { organizationId: userId }),
        },
      });

      // Generate onboarding link
      const onboardingLink = await this.createAccountOnboardingLink(
        account.id,
        userType,
        userId,
      );

      this.logger.log(
        `Created Connect account ${account.id} for ${userType} ${userId}`,
      );

      return {
        connectAccount,
        onboardingUrl: onboardingLink.url,
      };
    } catch (error) {
      this.logger.error(`Failed to create Connect account: ${error.message}`);
      throw new BadRequestException(
        `Failed to create Connect account: ${error.message}`,
      );
    }
  }

  /**
   * Create onboarding link for account completion
   */
  async createAccountOnboardingLink(
    stripeAccountId: string,
    userType: 'teacher' | 'organization',
    userId: number,
  ) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const accountLink = await this.stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${baseUrl}/${userType}/settings/payout?refresh=true`,
      return_url: `${baseUrl}/${userType}/settings/payout?success=true`,
      type: 'account_onboarding',
    });

    // Update database with link expiry
    await this.prisma.stripeConnectAccount.update({
      where: { stripeAccountId },
      data: {
        onboardingUrl: accountLink.url,
        onboardingExpiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min
      },
    });

    return accountLink;
  }

  /**
   * Refresh onboarding link (when expired)
   */
  async refreshOnboardingLink(params: {
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
      throw new BadRequestException('Connect account not found');
    }

    if (connectAccount.accountStatus === 'active') {
      throw new BadRequestException('Account is already active');
    }

    const accountLink = await this.createAccountOnboardingLink(
      connectAccount.stripeAccountId,
      userType,
      userId,
    );

    return {
      onboardingUrl: accountLink.url,
    };
  }

  /**
   * Sync account status from Stripe
   */
  async syncAccountStatus(stripeAccountId: string) {
    try {
      const account = await this.stripe.accounts.retrieve(stripeAccountId);

      await this.prisma.stripeConnectAccount.update({
        where: { stripeAccountId },
        data: {
          detailsSubmitted: account.details_submitted,
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
          accountStatus: this.determineAccountStatus(account),
        },
      });

      this.logger.log(`Synced account status for ${stripeAccountId}`);

      return account;
    } catch (error) {
      this.logger.error(
        `Failed to sync account status: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Determine account status based on Stripe data
   */
  private determineAccountStatus(
    account: Stripe.Account,
  ): 'incomplete' | 'pending' | 'active' | 'restricted' | 'rejected' {
    if (!account.details_submitted) return 'incomplete';
    if (account.charges_enabled && account.payouts_enabled) return 'active';
    if (account.requirements?.disabled_reason) return 'restricted';
    return 'pending';
  }

  /**
   * Create login link for account dashboard
   */
  async createDashboardLink(stripeAccountId: string) {
    try {
      const loginLink = await this.stripe.accounts.createLoginLink(
        stripeAccountId,
      );
      return loginLink.url;
    } catch (error) {
      this.logger.error(
        `Failed to create dashboard link: ${error.message}`,
      );
      throw new BadRequestException('Failed to create dashboard link');
    }
  }

  /**
   * Get Connect account by user
   */
  async getConnectAccount(params: {
    userType: 'teacher' | 'organization';
    userId: number;
  }) {
    const { userType, userId } = params;

    const connectAccount = await this.prisma.stripeConnectAccount.findFirst({
      where:
        userType === 'teacher'
          ? { teacherId: userId }
          : { organizationId: userId },
      include: {
        teacher: userType === 'teacher',
        organization: userType === 'organization',
      },
    });

    if (!connectAccount) {
      return null;
    }

    // Sync latest status from Stripe
    await this.syncAccountStatus(connectAccount.stripeAccountId);

    // Return updated account
    return this.prisma.stripeConnectAccount.findUnique({
      where: { id: connectAccount.id },
      include: {
        teacher: userType === 'teacher',
        organization: userType === 'organization',
      },
    });
  }

  /**
   * Get all Connect accounts (admin use)
   */
  async getAllConnectAccounts(filters?: {
    status?: string;
    userType?: 'teacher' | 'organization';
  }) {
    const where: any = {};

    if (filters?.status) {
      where.accountStatus = filters.status;
    }

    if (filters?.userType === 'teacher') {
      where.teacherId = { not: null };
    } else if (filters?.userType === 'organization') {
      where.organizationId = { not: null };
    }

    return this.prisma.stripeConnectAccount.findMany({
      where,
      include: {
        teacher: true,
        organization: true,
        transfers: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

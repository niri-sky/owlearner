# Stripe Connect Implementation Plan
## Teacher & Organization Payouts with 14-Day Hold Period

---

## 🎯 Executive Summary

This plan details the implementation of Stripe Connect to automate payouts to teachers and organizations with:
- **15% platform fee** (85% to teacher/organization)
- **14-day money hold period** for returns processing
- **Automatic payouts** after hold period
- **Tax handling** through Stripe Connect (1099-K forms)
- **Refund/return system** during hold period

---

## 📊 Current vs Proposed System

### Current System
```
Student Purchase ($100)
    ↓
Platform Stripe Account (+$100)
    ↓
CourseSale records $100 to teacher
    ↓
Teacher requests withdrawal
    ↓
Admin manually processes payment
```

### Proposed System with Stripe Connect
```
Student Purchase ($100)
    ↓
Platform Stripe Account (+$100)
    ↓
Split: $15 Platform Fee + $85 Teacher Earning (HELD)
    ↓
14-Day Hold Period (returns allowed)
    ↓
After 14 days: Automatic Transfer to Teacher's Stripe Connect Account
    ↓
Teacher receives funds directly in their bank
```

---

## 🏗️ Architecture Overview

### Stripe Products We'll Use

1. **Stripe Connect - Express Accounts**
   - Teachers/organizations create Express accounts
   - Fastest onboarding (2-5 minutes)
   - Stripe handles compliance, tax forms, identity verification
   - Users manage payouts through Stripe dashboard

2. **Payment Intents with Application Fees**
   - Capture 100% payment to platform
   - Track 15% platform fee
   - Schedule transfers after 14 days

3. **Transfers API**
   - Automated transfers to Connect accounts
   - Transfer the 85% after hold period

4. **Refunds API**
   - Process refunds during 14-day window
   - Automatically adjust teacher earnings

---

## 📐 Database Schema Changes

### New Models Required

```prisma
// Add to schema.prisma

model StripeConnectAccount {
  id                    Int      @id @default(autoincrement())
  stripeAccountId       String   @unique  // Stripe Connect account ID (acct_xxx)
  accountStatus         ConnectAccountStatus @default(incomplete)
  detailsSubmitted      Boolean  @default(false)
  chargesEnabled        Boolean  @default(false)
  payoutsEnabled        Boolean  @default(false)
  
  // Onboarding
  onboardingUrl         String?
  onboardingExpiresAt   DateTime?
  
  // Account info (cached from Stripe)
  email                 String?
  businessType          String?   // individual or company
  country               String?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  // Relations
  teacherId             Int?     @unique
  teacher               Teacher? @relation(fields: [teacherId], references: [id])
  
  organizationId        Int?     @unique
  organization          Organization? @relation(fields: [organizationId], references: [id])
  
  transfers             StripeTransfer[]
}

enum ConnectAccountStatus {
  incomplete    // Not yet completed onboarding
  pending       // Submitted, awaiting Stripe verification
  active        // Verified and ready for payouts
  restricted    // Has restrictions (needs action)
  rejected      // Rejected by Stripe
}

model StripeTransfer {
  id                    Int      @id @default(autoincrement())
  stripeTransferId      String   @unique  // Stripe transfer ID (tr_xxx)
  
  amount                Float    // Amount transferred (in dollars)
  platformFee           Float    // Platform fee amount (15%)
  netAmount             Float    // Net amount to recipient (85%)
  
  status                TransferStatus @default(pending)
  
  // Timing
  saleDate              DateTime // When the original sale occurred
  scheduledTransferDate DateTime // 14 days after sale
  actualTransferDate    DateTime? // When transfer actually completed
  
  failureReason         String?  // If transfer failed
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  // Relations
  courseSaleId          Int
  courseSale            CourseSale @relation(fields: [courseSaleId], references: [id])
  
  connectAccountId      Int
  connectAccount        StripeConnectAccount @relation(fields: [connectAccountId], references: [id])
}

enum TransferStatus {
  pending       // Scheduled, waiting for 14 days
  processing    // Being processed by Stripe
  completed     // Successfully transferred
  failed        // Transfer failed
  refunded      // Sale was refunded, transfer cancelled
}

model Refund {
  id                    Int      @id @default(autoincrement())
  stripeRefundId        String   @unique  // Stripe refund ID (re_xxx)
  
  amount                Float    // Refund amount
  reason                RefundReason
  status                RefundStatus @default(pending)
  
  // Timing constraints
  requestedAt           DateTime @default(now())
  processedAt           DateTime?
  
  // Relations
  courseSaleId          Int      @unique
  courseSale            CourseSale @relation(fields: [courseSaleId], references: [id])
  
  studentId             Int
  student               Student  @relation(fields: [studentId], references: [id])
  
  invoiceId             Int
  invoice               Invoice  @relation(fields: [invoiceId], references: [id])
}

enum RefundReason {
  student_request
  course_not_as_described
  technical_issues
  duplicate_charge
  fraudulent
  other
}

enum RefundStatus {
  pending       // Requested, not yet processed
  processing    // Being processed by Stripe
  completed     // Refund completed
  rejected      // Refund request rejected
  cancelled     // Refund cancelled
}

model PlatformEarning {
  id                    Int      @id @default(autoincrement())
  
  amount                Float    // Platform's 15% fee
  
  createdAt             DateTime @default(now())
  
  // Relations
  courseSaleId          Int      @unique
  courseSale            CourseSale @relation(fields: [courseSaleId], references: [id])
}
```

### Modifications to Existing Models

```prisma
// Add to Teacher model
model Teacher {
  // ... existing fields
  stripeConnectAccount  StripeConnectAccount?
}

// Add to Organization model
model Organization {
  // ... existing fields
  stripeConnectAccount  StripeConnectAccount?
}

// Add to CourseSale model
model CourseSale {
  // ... existing fields
  stripePaymentIntentId String?  // Link to original payment
  transfer              StripeTransfer?
  refund                Refund?
  platformEarning       PlatformEarning?
}

// Add to Student model
model Student {
  // ... existing fields
  refunds               Refund[]
}

// Add to Invoice model
model Invoice {
  // ... existing fields
  stripePaymentIntentId String?  // Link to payment intent
  refunds               Refund[]
}
```

---

## 💰 Payment Flow Implementation

### Phase 1: Student Purchase with Platform Fee

#### Current Flow (payment.service.ts)
```typescript
async createPaymentIntends(amount: number) {
  amount = Number((amount * 100).toFixed(0));
  return this.stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });
}
```

#### New Flow with Metadata
```typescript
async createPaymentIntends(
  amount: number, 
  courseIds: number[],
  teacherIds: number[],
  metadata?: any
) {
  const amountInCents = Math.round(amount * 100);
  
  return this.stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    payment_method_types: ['card'],
    
    // Store metadata for later processing
    metadata: {
      courseIds: JSON.stringify(courseIds),
      teacherIds: JSON.stringify(teacherIds),
      platformFeePercent: '15',
      holdDays: '14',
      ...metadata,
    },
    
    // Enable capturing payment later (for potential modifications)
    capture_method: 'automatic',
  });
}
```

#### After Successful Payment
```typescript
async handleSuccessfulPayment(
  paymentIntentId: string,
  courseSales: CourseSaleCreateInput[]
) {
  const PLATFORM_FEE = 0.15;
  
  // Process each course sale
  for (const saleData of courseSales) {
    const originalPrice = saleData.price;
    const platformFee = originalPrice * PLATFORM_FEE;
    const teacherAmount = originalPrice * (1 - PLATFORM_FEE);
    
    // Create course sale with reduced price (85%)
    const courseSale = await this.prisma.courseSale.create({
      data: {
        price: teacherAmount,  // 85% to teacher
        courseId: saleData.courseId,
        studentId: saleData.studentId,
        teacherEarningId: saleData.teacherEarningId,
        stripePaymentIntentId: paymentIntentId,
      },
    });
    
    // Record platform earning (15%)
    await this.prisma.platformEarning.create({
      data: {
        amount: platformFee,
        courseSaleId: courseSale.id,
      },
    });
    
    // Get teacher's Stripe Connect account
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: saleData.teacherId },
      include: { stripeConnectAccount: true },
    });
    
    // Schedule transfer if account is active
    if (
      teacher?.stripeConnectAccount?.accountStatus === 'active' &&
      teacher?.stripeConnectAccount?.payoutsEnabled
    ) {
      const transferDate = new Date();
      transferDate.setDate(transferDate.getDate() + 14); // 14 days later
      
      await this.prisma.stripeTransfer.create({
        data: {
          amount: originalPrice,
          platformFee: platformFee,
          netAmount: teacherAmount,
          status: 'pending',
          saleDate: new Date(),
          scheduledTransferDate: transferDate,
          courseSaleId: courseSale.id,
          connectAccountId: teacher.stripeConnectAccount.id,
        },
      });
    }
  }
}
```

---

## 🔗 Stripe Connect Onboarding

### New Service: stripe-connect.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { DatabaseService } from 'src/configs/database/database.service';

@Injectable()
export class StripeConnectService {
  private readonly stripe: Stripe;

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

    // Create Stripe Express account
    const account = await this.stripe.accounts.create({
      type: 'express',
      country: country,
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual', // or 'company'
      settings: {
        payouts: {
          schedule: {
            interval: 'manual', // We control payouts
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
    const accountLink = await this.createAccountOnboardingLink(
      account.id,
      userType,
      userId,
    );

    return {
      connectAccount,
      onboardingUrl: accountLink.url,
    };
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
   * Sync account status from Stripe
   */
  async syncAccountStatus(stripeAccountId: string) {
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

    return account;
  }

  /**
   * Determine account status based on Stripe data
   */
  private determineAccountStatus(account: Stripe.Account): string {
    if (!account.details_submitted) return 'incomplete';
    if (account.charges_enabled && account.payouts_enabled) return 'active';
    if (account.requirements?.disabled_reason) return 'restricted';
    return 'pending';
  }

  /**
   * Create login link for account dashboard
   */
  async createDashboardLink(stripeAccountId: string) {
    const loginLink = await this.stripe.accounts.createLoginLink(
      stripeAccountId,
    );
    return loginLink.url;
  }
}
```

---

## ⏰ Automated Payout System

### New Service: stripe-payout.service.ts

```typescript
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

    // Find all transfers that are:
    // 1. Status = pending
    // 2. scheduledTransferDate <= today
    // 3. No refund issued
    const now = new Date();
    
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
    });

    this.logger.log(`Found ${pendingTransfers.length} transfers to process`);

    for (const transfer of pendingTransfers) {
      try {
        await this.processTransfer(transfer);
      } catch (error) {
        this.logger.error(
          `Failed to process transfer ${transfer.id}: ${error.message}`,
        );
      }
    }

    this.logger.log('Automated payout processing completed');
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
      return;
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
      return;
    }

    try {
      // Update status to processing
      await this.prisma.stripeTransfer.update({
        where: { id: transfer.id },
        data: { status: 'processing' },
      });

      // Create Stripe transfer
      const amountInCents = Math.round(netAmount * 100);
      
      const stripeTransfer = await this.stripe.transfers.create({
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
      });

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
      throw new Error(`Transfer status is ${transfer.status}, expected pending`);
    }

    return this.processTransfer(transfer);
  }
}
```

---

## 🔄 Refund/Return System

### New Service: refund.service.ts

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { DatabaseService } from 'src/configs/database/database.service';

@Injectable()
export class RefundService {
  private readonly stripe: Stripe;

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
    
    if (daysSincePurchase > 14) {
      throw new BadRequestException(
        'Refund window has expired (14 days after purchase)',
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

    // Get the original payment intent
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        studentId: studentId,
        courses: {
          some: {
            id: courseSale.courseId,
          },
        },
      },
    });

    if (!invoice?.stripePaymentIntentId) {
      throw new BadRequestException('Payment intent not found');
    }

    // Create refund in Stripe
    const refund = await this.stripe.refunds.create({
      payment_intent: invoice.stripePaymentIntentId,
      amount: Math.round(courseSale.price * 100), // Amount in cents
      reason: 'requested_by_customer',
      metadata: {
        courseSaleId: courseSale.id.toString(),
        courseId: courseSale.courseId.toString(),
        studentId: studentId.toString(),
      },
    });

    // Create refund record
    const refundRecord = await this.prisma.refund.create({
      data: {
        stripeRefundId: refund.id,
        amount: courseSale.price,
        reason: reason as any,
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
    await this.prisma.teacherEarning.update({
      where: { id: courseSale.teacherEarningId },
      data: {
        withdraw: {
          decrement: courseSale.price,
        },
      },
    });

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

    return refundRecord;
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
    
    if (daysSincePurchase > 14) {
      return { canRefund: false, reason: 'Refund window expired (14 days)' };
    }

    if (courseSale.transfer?.status === 'completed') {
      return {
        canRefund: false,
        reason: 'Funds already transferred to teacher',
      };
    }

    return {
      canRefund: true,
      daysRemaining: Math.ceil(14 - daysSincePurchase),
    };
  }
}
```

---

## 🎨 Frontend Implementation

### Teacher/Organization Onboarding Flow

#### 1. Connect Account Setup Page

**Component: `ConnectAccountSetup.tsx`**

```typescript
// clients/teacher-dashboard/src/modules/payout/ConnectAccountSetup.tsx

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Card, Alert } from '@/components/ui';

const CREATE_CONNECT_ACCOUNT = gql`
  mutation CreateConnectAccount($email: String!) {
    createConnectAccount(email: $email) {
      onboardingUrl
      status
    }
  }
`;

const GET_CONNECT_ACCOUNT_STATUS = gql`
  query GetConnectAccountStatus($teacherId: Int!) {
    stripeConnectAccount(teacherId: $teacherId) {
      id
      accountStatus
      detailsSubmitted
      chargesEnabled
      payoutsEnabled
      onboardingUrl
    }
  }
`;

export default function ConnectAccountSetup() {
  const [createAccount, { loading }] = useMutation(CREATE_CONNECT_ACCOUNT);
  const { data, refetch } = useQuery(GET_CONNECT_ACCOUNT_STATUS);

  const handleCreateAccount = async () => {
    try {
      const { data } = await createAccount({
        variables: { email: user.email },
      });
      
      // Redirect to Stripe onboarding
      window.location.href = data.createConnectAccount.onboardingUrl;
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  const account = data?.stripeConnectAccount;

  if (!account) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Set Up Payouts</h2>
        <p className="mb-4">
          Connect your Stripe account to receive automatic payouts for your course sales.
        </p>
        <ul className="list-disc ml-6 mb-6 space-y-2">
          <li>Earn 85% of every course sale (15% platform fee)</li>
          <li>Automatic payouts 14 days after each sale</li>
          <li>Stripe handles all tax forms (1099-K)</li>
          <li>Secure and compliant payment processing</li>
        </ul>
        <Button onClick={handleCreateAccount} loading={loading}>
          Connect Stripe Account
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Payout Account Status</h2>
      
      {account.accountStatus === 'incomplete' && (
        <Alert variant="warning" className="mb-4">
          Your account setup is incomplete. Please complete the onboarding process.
          <Button
            variant="link"
            onClick={() => window.location.href = account.onboardingUrl}
          >
            Complete Setup
          </Button>
        </Alert>
      )}

      {account.accountStatus === 'active' && (
        <Alert variant="success" className="mb-4">
          ✓ Your payout account is active and ready to receive payments!
        </Alert>
      )}

      <div className="space-y-3">
        <StatusItem
          label="Account Verified"
          status={account.detailsSubmitted}
        />
        <StatusItem
          label="Payouts Enabled"
          status={account.payoutsEnabled}
        />
        <StatusItem
          label="Charges Enabled"
          status={account.chargesEnabled}
        />
      </div>
    </Card>
  );
}
```

#### 2. Earnings Dashboard

**Component: `EarningsDashboard.tsx`**

```typescript
// Show pending, processing, and completed transfers

const GET_EARNINGS = gql`
  query GetTeacherEarnings($teacherId: Int!) {
    teacherEarning(teacherId: $teacherId) {
      sales {
        id
        price
        createdAt
        course { title }
        transfer {
          status
          scheduledTransferDate
          actualTransferDate
          netAmount
        }
        refund {
          status
          amount
        }
      }
    }
    
    pendingTransfers: stripeTransfers(
      where: { status: "pending", teacherId: $teacherId }
    ) {
      id
      netAmount
      scheduledTransferDate
      courseSale {
        course { title }
      }
    }
    
    completedTransfers: stripeTransfers(
      where: { status: "completed", teacherId: $teacherId }
    ) {
      id
      netAmount
      actualTransferDate
      courseSale {
        course { title }
      }
    }
  }
`;

export default function EarningsDashboard() {
  const { data } = useQuery(GET_EARNINGS);

  const pendingAmount = data?.pendingTransfers.reduce(
    (sum, t) => sum + t.netAmount,
    0
  );
  
  const completedAmount = data?.completedTransfers.reduce(
    (sum, t) => sum + t.netAmount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Pending Payouts"
          value={`$${pendingAmount.toFixed(2)}`}
          sublabel="Transfers in 14-day hold"
        />
        <StatCard
          label="Completed Payouts"
          value={`$${completedAmount.toFixed(2)}`}
          sublabel="Total transferred"
        />
        <StatCard
          label="Next Payout"
          value={getNextPayoutDate(data?.pendingTransfers)}
          sublabel="Scheduled date"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Sale Date</TableHead>
                <TableHead>Transfer Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.pendingTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>{transfer.courseSale.course.title}</TableCell>
                  <TableCell>${transfer.netAmount}</TableCell>
                  <TableCell>{formatDate(transfer.saleDate)}</TableCell>
                  <TableCell>{formatDate(transfer.scheduledTransferDate)}</TableCell>
                  <TableCell>
                    <Badge variant="warning">Pending</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🔐 Security Considerations

### 1. Webhook Verification
```typescript
// Verify Stripe webhooks to handle account updates and transfer status
app.post('/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case 'account.updated':
      await handleAccountUpdate(event.data.object);
      break;
    case 'transfer.created':
    case 'transfer.updated':
      await handleTransferUpdate(event.data.object);
      break;
    case 'charge.refunded':
      await handleRefund(event.data.object);
      break;
  }

  res.json({ received: true });
});
```

### 2. Authorization Checks
- Only account owners can view earnings
- Only students can request refunds for their purchases
- Admin override for manual transfers

### 3. Idempotency
- Use idempotency keys for all Stripe API calls
- Prevent duplicate transfers

---

## 📋 Implementation Phases

### Phase 1: Database & Core Services (Week 1)
- [ ] Update Prisma schema with new models
- [ ] Run database migrations
- [ ] Create `StripeConnectService`
- [ ] Create `StripePayoutService`
- [ ] Create `RefundService`
- [ ] Set up cron jobs

### Phase 2: Payment Flow Changes (Week 1-2)
- [ ] Modify `PaymentService` to include metadata
- [ ] Update `SaleService` to handle platform fee split
- [ ] Create `PlatformEarning` records on each sale
- [ ] Schedule transfers automatically on sale

### Phase 3: Connect Account Onboarding (Week 2)
- [ ] GraphQL mutations for Connect account creation
- [ ] Frontend: Teacher onboarding page
- [ ] Frontend: Organization onboarding page
- [ ] Account status sync from Stripe

### Phase 4: Earnings Dashboard (Week 3)
- [ ] GraphQL queries for transfers
- [ ] Frontend: Earnings overview
- [ ] Frontend: Transfer history
- [ ] Frontend: Pending transfers timeline

### Phase 5: Refund System (Week 3)
- [ ] GraphQL mutations for refunds
- [ ] Frontend: Student refund request page
- [ ] Admin: Refund approval system
- [ ] Transfer cancellation logic

### Phase 6: Webhook Integration (Week 4)
- [ ] Set up Stripe webhook endpoint
- [ ] Handle account.updated events
- [ ] Handle transfer events
- [ ] Handle refund events

### Phase 7: Testing & Deployment (Week 4-5)
- [ ] Unit tests for all services
- [ ] Integration tests with Stripe test mode
- [ ] End-to-end testing
- [ ] Load testing for cron jobs
- [ ] Production deployment

### Phase 8: Migration of Existing Data (Week 5)
- [ ] Migrate existing teachers to Connect accounts
- [ ] Handle existing pending withdrawals
- [ ] Data validation and reconciliation

---

## 🧪 Testing Strategy

### Stripe Test Mode
- Use Stripe test API keys
- Test Connect account onboarding
- Test payment flow with test cards
- Test transfer creation
- Test refund flow

### Test Scenarios
1. **Happy Path**: Student purchases → 14 days pass → Transfer completes
2. **Refund Within Window**: Student purchases → Requests refund day 10 → Refund approved
3. **Refund After Window**: Student purchases → Requests refund day 15 → Denied
4. **Account Not Ready**: Sale occurs → Transfer scheduled → Account inactive → Transfer fails
5. **Multiple Courses**: Student purchases 3 courses → 3 separate transfers scheduled

---

## 💰 Cost Analysis

### Stripe Fees
- **Payment Processing**: 2.9% + $0.30 per transaction
- **Connect Fee**: $0 (included in payment processing)
- **Transfer Fee**: $0 (domestic transfers)
- **Payout Fee**: $0 (standard payouts)

### Example Transaction ($100 course)
```
Student pays: $100.00
Stripe fee: -$3.20 (2.9% + $0.30)
Net to platform: $96.80

Platform keeps (15%): $15.00
Teacher receives (85%): $85.00

Platform net profit: $15.00 - $3.20 = $11.80 (11.8%)
```

---

## 📊 Admin Dashboard Features

### Monitoring Tools Needed
1. **Transfer Queue Monitor**
   - View all pending transfers
   - See scheduled dates
   - Manually trigger transfers
   - View failed transfers

2. **Platform Earnings Report**
   - Total platform fees collected
   - Platform fees by date range
   - Platform fees by teacher/organization

3. **Refund Management**
   - Pending refund requests
   - Approve/deny refunds
   - Refund history

4. **Connect Account Management**
   - View all connected accounts
   - See verification status
   - Resend onboarding links

---

## 🚨 Edge Cases & Solutions

### 1. Teacher Deletes Account Before Transfer
**Solution**: Keep transfer data even if teacher deleted. Hold funds, contact teacher.

### 2. Student Requests Refund on Day 14
**Solution**: Check exact time, not just date. Allow within 14 * 24 hours.

### 3. Multiple Courses in One Purchase
**Solution**: Create separate CourseSale and StripeTransfer records for each course.

### 4. Teacher Account Gets Restricted
**Solution**: Cron job catches this, marks transfer as failed, notifies admin.

### 5. Stripe Transfer Fails
**Solution**: Retry logic (3 attempts), then mark as failed and notify admin + teacher.

### 6. Partial Refunds
**Solution**: Initial implementation: all-or-nothing refunds. Phase 2: support partial refunds.

---

## 📈 Metrics to Track

### Business Metrics
- Total platform fees collected
- Average payout amount
- Payout frequency per teacher
- Refund rate
- Refund reasons

### Technical Metrics
- Transfer success rate
- Transfer processing time
- Failed transfer reasons
- Connect account onboarding completion rate
- Webhook processing time

---

## 🔄 Migration Plan for Existing System

### Step 1: Deprecate Manual Withdrawals
- Add banner: "New automatic payout system coming"
- Give teachers 30-day notice
- Stop accepting new withdrawal requests

### Step 2: Process Existing Withdrawals
- Admin processes all pending PaymentInvoice records
- Mark all as paid or declined

### Step 3: Onboard Existing Teachers
- Email all teachers with onboarding instructions
- Provide deadline (e.g., 60 days)
- Teachers with new sales must complete onboarding

### Step 4: Handle Non-Compliant Teachers
- After deadline, hold earnings for teachers without Connect accounts
- Email reminders every week
- Eventually: Disable course creation for non-compliant teachers

---

## 🌍 International Considerations

### Multi-Currency Support (Future)
- Stripe Connect supports 40+ countries
- Each Connect account can have its own currency
- Platform can still charge in USD, payout in local currency

### Tax Compliance
- Stripe Connect handles 1099-K for US accounts
- International tax forms handled by Stripe
- Teachers responsible for their own tax compliance

---

## 📖 Documentation Needed

### For Teachers/Organizations
1. "Getting Started with Payouts" guide
2. "Understanding the 14-Day Hold Period"
3. "How to Handle Refund Requests"
4. "Tax Information and 1099-K Forms"
5. FAQs

### For Admins
1. "Managing Connect Accounts"
2. "Monitoring Transfer Queue"
3. "Handling Failed Transfers"
4. "Refund Approval Process"
5. "Platform Earnings Reports"

### For Developers
1. API documentation for all new endpoints
2. Webhook handling guide
3. Testing guide with Stripe test mode
4. Deployment checklist

---

## 🎯 Success Criteria

### Launch Ready When:
- [ ] All existing teachers migrated to Connect accounts (>95%)
- [ ] Zero manual withdrawal requests in queue
- [ ] Automated transfers running successfully for 2 weeks
- [ ] Refund system tested with real transactions
- [ ] Admin dashboard monitoring tools functional
- [ ] Documentation complete and published
- [ ] Support team trained on new system

---

## 🚀 Go-Live Checklist

### Pre-Launch (1 Week Before)
- [ ] All code deployed to staging
- [ ] End-to-end testing completed
- [ ] Load testing passed
- [ ] Database migrations ready
- [ ] Stripe webhook endpoint configured
- [ ] Monitoring/alerting set up
- [ ] Rollback plan documented

### Launch Day
- [ ] Database migration executed
- [ ] Deploy to production
- [ ] Verify cron jobs scheduled
- [ ] Test webhook endpoint
- [ ] Monitor first 10 transfers
- [ ] Send launch announcement

### Post-Launch (First Week)
- [ ] Daily monitoring of transfer queue
- [ ] Review failed transfers
- [ ] Support ticket review
- [ ] Performance metrics analysis
- [ ] Bug fixes as needed

---

## 📞 Support & Escalation

### Teacher Support Issues
- "I haven't received my payout" → Check transfer status, verify account
- "How do I update my bank info?" → Direct to Stripe dashboard
- "Can I expedite a payout?" → No, 14-day hold is mandatory

### Admin Escalation
- Multiple failed transfers → Check Stripe API status
- Webhook not processing → Verify endpoint, check logs
- Mass refunds needed → Use batch refund script

---

## 🎓 Training Requirements

### Development Team
- Stripe Connect API training
- Transfer API usage
- Webhook handling best practices

### Support Team
- Understanding 14-day hold period
- Connect account troubleshooting
- Refund policy and process

### Admin Team
- Monitoring dashboard usage
- Manual transfer triggers
- Platform earnings reporting

---

## ✅ Summary

This implementation plan provides a complete roadmap for transitioning from manual payouts to automated Stripe Connect payouts with:

✅ **15% platform fee** automatically deducted
✅ **14-day hold period** for returns processing  
✅ **Automatic payouts** after hold period  
✅ **Full refund system** within 14-day window  
✅ **Tax handling** via Stripe Connect (1099-K)  
✅ **Scalable architecture** using cron jobs  
✅ **Monitoring tools** for admins  
✅ **Teacher-friendly onboarding** (2-5 minutes)  

**Estimated Timeline**: 5-6 weeks for full implementation  
**Team Required**: 2-3 developers, 1 QA, 1 DevOps

---

## 📄 Related Documents

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Stripe Transfers API](https://stripe.com/docs/connect/charges-transfers)
- [Current Payment Flow](/STRIPE_PAYMENT_FLOW.md)
- Database Schema: `/server/prisma/schema.prisma`

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-09  
**Author**: AI Assistant  
**Status**: Ready for Review

# Stripe Connect Quick Reference Guide

## 🚀 Quick Start for Developers

### Environment Variables Needed
```bash
# Add to .env
STRIPE_SECRET_KEY=sk_test_...                    # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_...               # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_...                  # Webhook signing secret
FRONTEND_URL=http://localhost:3000               # Frontend base URL
PLATFORM_FEE_PERCENT=15                          # Platform fee (15%)
HOLD_PERIOD_DAYS=14                              # Hold period before payout
```

---

## 💰 Payment Flow Cheat Sheet

### Student Purchase Flow
```
1. Student adds courses to cart
2. Frontend creates Payment Intent (with metadata)
3. Student completes payment with Stripe
4. Backend webhook receives payment_intent.succeeded
5. Create CourseSale records (85% to teacher)
6. Create PlatformEarning records (15% platform fee)
7. Create StripeTransfer records (status: pending, scheduled +14 days)
```

### Automatic Payout Flow
```
1. Cron job runs daily at 2 AM
2. Query StripeTransfer where status=pending AND scheduledDate <= today
3. Check if Connect account is active and payouts enabled
4. Check if course was NOT refunded
5. Create Stripe Transfer to Connect account
6. Update StripeTransfer status to completed
```

### Refund Flow
```
1. Student requests refund (within 14 days)
2. Validate refund eligibility
3. Create Stripe Refund
4. Mark StripeTransfer as refunded (cancel payout)
5. Reverse TeacherEarning
6. Remove StudentCourse access
7. Create Refund record
```

---

## 📐 Key Database Queries

### Get Teacher Pending Earnings
```typescript
const pendingEarnings = await prisma.stripeTransfer.aggregate({
  where: {
    connectAccount: { teacherId: teacherId },
    status: 'pending',
  },
  _sum: { netAmount: true },
});
```

### Get Teacher Total Completed Payouts
```typescript
const completedPayouts = await prisma.stripeTransfer.aggregate({
  where: {
    connectAccount: { teacherId: teacherId },
    status: 'completed',
  },
  _sum: { netAmount: true },
});
```

### Get Platform Earnings This Month
```typescript
const platformEarnings = await prisma.platformEarning.aggregate({
  where: {
    createdAt: {
      gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
  },
  _sum: { amount: true },
});
```

### Find Transfers Due Today
```typescript
const transfersDueToday = await prisma.stripeTransfer.findMany({
  where: {
    status: 'pending',
    scheduledTransferDate: {
      lte: new Date(),
    },
    courseSale: {
      refund: null, // Not refunded
    },
  },
  include: {
    connectAccount: true,
    courseSale: {
      include: { course: true, student: true },
    },
  },
});
```

### Check Refund Eligibility
```typescript
const courseSale = await prisma.courseSale.findUnique({
  where: { id: courseSaleId },
  include: { refund: true, transfer: true },
});

const daysSincePurchase = 
  (Date.now() - courseSale.createdAt.getTime()) / (1000 * 60 * 60 * 24);

const canRefund = 
  !courseSale.refund &&                           // Not already refunded
  daysSincePurchase <= 14 &&                      // Within 14 days
  courseSale.transfer?.status !== 'completed';    // Not yet paid out
```

---

## 🔌 GraphQL Mutations & Queries

### Create Connect Account
```graphql
mutation CreateConnectAccount($email: String!, $userType: String!, $userId: Int!) {
  createConnectAccount(email: $email, userType: $userType, userId: $userId) {
    connectAccount {
      id
      stripeAccountId
      accountStatus
    }
    onboardingUrl
  }
}
```

### Get Connect Account Status
```graphql
query GetConnectAccount($teacherId: Int!) {
  stripeConnectAccount(teacherId: $teacherId) {
    id
    stripeAccountId
    accountStatus
    detailsSubmitted
    chargesEnabled
    payoutsEnabled
    onboardingUrl
  }
}
```

### Get Teacher Earnings
```graphql
query GetTeacherEarnings($teacherId: Int!) {
  teacherEarning(teacherId: $teacherId) {
    id
    earn
    withdraw
    sales {
      id
      price
      createdAt
      course { id title }
      transfer {
        id
        status
        netAmount
        scheduledTransferDate
        actualTransferDate
      }
      platformEarning { amount }
      refund { id status amount }
    }
  }
  
  # Summary stats
  pendingTransfers: stripeTransfers(
    where: { status: "pending", connectAccount: { teacherId: $teacherId } }
  ) {
    netAmount
    scheduledTransferDate
  }
  
  completedTransfers: stripeTransfers(
    where: { status: "completed", connectAccount: { teacherId: $teacherId } }
  ) {
    netAmount
    actualTransferDate
  }
}
```

### Request Refund
```graphql
mutation RequestRefund($courseSaleId: Int!, $reason: String!) {
  requestRefund(courseSaleId: $courseSaleId, reason: $reason) {
    id
    stripeRefundId
    amount
    status
    requestedAt
  }
}
```

### Check Refund Eligibility
```graphql
query CheckRefundEligibility($courseSaleId: Int!) {
  canRefund(courseSaleId: $courseSaleId) {
    canRefund
    reason
    daysRemaining
  }
}
```

---

## 🔧 Stripe API Calls

### Create Express Account
```typescript
const account = await stripe.accounts.create({
  type: 'express',
  country: 'US',
  email: 'teacher@example.com',
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
  settings: {
    payouts: {
      schedule: { interval: 'manual' }, // Platform controls payouts
    },
  },
});
// Returns: { id: 'acct_xxx', ... }
```

### Create Account Onboarding Link
```typescript
const accountLink = await stripe.accountLinks.create({
  account: 'acct_xxx',
  refresh_url: 'https://yoursite.com/teacher/settings/payout?refresh=true',
  return_url: 'https://yoursite.com/teacher/settings/payout?success=true',
  type: 'account_onboarding',
});
// Returns: { url: 'https://connect.stripe.com/setup/...', expires_at: ... }
```

### Retrieve Account Status
```typescript
const account = await stripe.accounts.retrieve('acct_xxx');
// Check: account.details_submitted, account.charges_enabled, account.payouts_enabled
```

### Create Transfer to Connect Account
```typescript
const transfer = await stripe.transfers.create({
  amount: 8500, // $85.00 in cents
  currency: 'usd',
  destination: 'acct_xxx', // Teacher's Connect account
  description: 'Payout for Course: Advanced React',
  metadata: {
    courseSaleId: '123',
    courseId: '456',
    studentId: '789',
  },
});
// Returns: { id: 'tr_xxx', ... }
```

### Create Refund
```typescript
const refund = await stripe.refunds.create({
  payment_intent: 'pi_xxx',
  amount: 10000, // $100.00 in cents (optional, defaults to full amount)
  reason: 'requested_by_customer',
  metadata: {
    courseSaleId: '123',
    refundReason: 'Student not satisfied',
  },
});
// Returns: { id: 're_xxx', status: 'succeeded', ... }
```

### Create Payment Intent (Updated)
```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 10000, // $100.00 in cents
  currency: 'usd',
  payment_method_types: ['card'],
  metadata: {
    courseIds: JSON.stringify([1, 2, 3]),
    teacherIds: JSON.stringify([10, 11]),
    studentId: '123',
    platformFeePercent: '15',
  },
});
// Returns: { id: 'pi_xxx', client_secret: 'pi_xxx_secret_xxx', ... }
```

---

## 🔔 Webhook Events to Handle

### account.updated
```typescript
// When Connect account status changes
const account = event.data.object; // Stripe.Account

await prisma.stripeConnectAccount.update({
  where: { stripeAccountId: account.id },
  data: {
    accountStatus: determineStatus(account),
    detailsSubmitted: account.details_submitted,
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
  },
});
```

### transfer.created / transfer.updated
```typescript
// When transfer status changes
const transfer = event.data.object; // Stripe.Transfer

await prisma.stripeTransfer.updateMany({
  where: { stripeTransferId: transfer.id },
  data: {
    status: transfer.status === 'paid' ? 'completed' : 'processing',
  },
});
```

### charge.refunded
```typescript
// When refund is processed
const charge = event.data.object; // Stripe.Charge
const refunds = charge.refunds.data;

for (const refund of refunds) {
  await prisma.refund.updateMany({
    where: { stripeRefundId: refund.id },
    data: {
      status: 'completed',
      processedAt: new Date(),
    },
  });
}
```

### payment_intent.succeeded
```typescript
// When payment succeeds
const paymentIntent = event.data.object; // Stripe.PaymentIntent

// Parse metadata and create course sales
const metadata = paymentIntent.metadata;
const courseIds = JSON.parse(metadata.courseIds);
// ... create CourseSale, PlatformEarning, StripeTransfer records
```

---

## ⏰ Cron Job Setup

### NestJS Cron Configuration

```typescript
// app.module.ts
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Enable cron jobs
    // ... other imports
  ],
})
export class AppModule {}
```

### Payout Processor Cron

```typescript
// stripe-payout.service.ts
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class StripePayoutService {
  
  // Run every day at 2 AM
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async processPendingTransfers() {
    // ... implementation
  }
  
  // Alternative: Run every hour (for more frequent payouts)
  @Cron(CronExpression.EVERY_HOUR)
  async processHourly() {
    // ... implementation
  }
}
```

---

## 🧪 Testing with Stripe Test Mode

### Test Cards
```
Successful: 4242 4242 4242 4242 (any CVC, future date)
Declined:   4000 0000 0000 0002
Requires authentication: 4000 0025 0000 3155
```

### Test Connect Accounts
```typescript
// Use test mode API keys (sk_test_...)
// Create test Connect accounts
// Test accounts will have "_test" in account ID
```

### Trigger Test Webhooks
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:4000/webhooks/stripe

# Trigger events
stripe trigger payment_intent.succeeded
stripe trigger account.updated
stripe trigger transfer.created
```

---

## 🎨 Frontend Components Needed

### Teacher Dashboard
- [ ] `ConnectAccountSetup.tsx` - Initial onboarding
- [ ] `AccountStatus.tsx` - Show connection status
- [ ] `EarningsOverview.tsx` - Summary cards
- [ ] `PendingTransfers.tsx` - List of upcoming payouts
- [ ] `TransferHistory.tsx` - Past payouts
- [ ] `PayoutSettings.tsx` - Link to Stripe dashboard

### Student Dashboard
- [ ] `RefundRequest.tsx` - Request refund for course
- [ ] `RefundEligibility.tsx` - Check if refund allowed
- [ ] `RefundHistory.tsx` - Past refunds

### Admin Dashboard
- [ ] `TransferQueue.tsx` - Monitor pending transfers
- [ ] `FailedTransfers.tsx` - View and retry failed transfers
- [ ] `PlatformEarnings.tsx` - Platform revenue dashboard
- [ ] `ConnectAccounts.tsx` - Manage all Connect accounts
- [ ] `RefundRequests.tsx` - Approve/deny refunds

---

## 📊 Calculations Reference

### Platform Fee Calculation
```typescript
const PLATFORM_FEE = 0.15; // 15%

function calculateSplit(coursePrice: number) {
  const platformFee = coursePrice * PLATFORM_FEE;
  const teacherAmount = coursePrice * (1 - PLATFORM_FEE);
  
  return {
    platformFee: Number(platformFee.toFixed(2)),
    teacherAmount: Number(teacherAmount.toFixed(2)),
  };
}

// Example:
calculateSplit(100);
// Returns: { platformFee: 15.00, teacherAmount: 85.00 }
```

### Transfer Schedule Calculation
```typescript
function calculateTransferDate(saleDate: Date, holdDays: number = 14): Date {
  const transferDate = new Date(saleDate);
  transferDate.setDate(transferDate.getDate() + holdDays);
  return transferDate;
}

// Example:
calculateTransferDate(new Date('2024-01-01'), 14);
// Returns: 2024-01-15
```

### Refund Eligibility Check
```typescript
function canRefund(saleDate: Date): boolean {
  const daysSincePurchase = 
    (Date.now() - saleDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysSincePurchase <= 14;
}
```

### Teacher Available Balance (Old System)
```typescript
// Old system: Sum of all sales minus withdrawn
const totalSales = await prisma.courseSale.aggregate({
  where: { teacherEarningId: teacherId },
  _sum: { price: true },
});

const teacherEarning = await prisma.teacherEarning.findUnique({
  where: { teacherId },
});

const availableBalance = totalSales._sum.price - teacherEarning.withdraw;
```

### Teacher Pending Balance (New System)
```typescript
// New system: Sum of pending transfers
const pendingBalance = await prisma.stripeTransfer.aggregate({
  where: {
    connectAccount: { teacherId },
    status: 'pending',
  },
  _sum: { netAmount: true },
});
```

---

## 🚨 Error Handling

### Common Errors & Solutions

#### Error: "No such destination"
```typescript
// Cause: Connect account ID is invalid
// Solution: Verify account exists and is properly linked
const account = await stripe.accounts.retrieve(stripeAccountId);
if (!account) {
  throw new Error('Connect account not found');
}
```

#### Error: "Account has insufficient funds"
```typescript
// Cause: Platform account doesn't have enough balance
// Solution: Ensure Payment Intent captured funds to platform
// Check: paymentIntent.status === 'succeeded'
```

#### Error: "Transfer destination not configured for transfers"
```typescript
// Cause: Connect account hasn't completed onboarding
// Solution: Check account.payouts_enabled === true
if (!connectAccount.payoutsEnabled) {
  throw new Error('Account not ready for payouts');
}
```

#### Error: "Refund amount exceeds available funds"
```typescript
// Cause: Already partially refunded
// Solution: Check remaining refundable amount
const charge = await stripe.charges.retrieve(chargeId);
const refundable = charge.amount - charge.amount_refunded;
```

---

## 📈 Performance Optimization

### Batch Processing Transfers
```typescript
// Process transfers in batches of 50
const BATCH_SIZE = 50;

async function processBatchTransfers() {
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const transfers = await prisma.stripeTransfer.findMany({
      where: { status: 'pending', scheduledTransferDate: { lte: new Date() } },
      take: BATCH_SIZE,
      skip: skip,
    });

    if (transfers.length === 0) {
      hasMore = false;
      break;
    }

    // Process in parallel (but rate-limit Stripe API calls)
    await Promise.all(
      transfers.map(t => processTransfer(t))
    );

    skip += BATCH_SIZE;
  }
}
```

### Cache Connect Account Status
```typescript
// Cache account status for 5 minutes
import { Cache } from '@nestjs/cache-manager';

async function getAccountStatus(accountId: string) {
  const cacheKey = `connect_account_${accountId}`;
  const cached = await this.cache.get(cacheKey);
  
  if (cached) return cached;
  
  const account = await stripe.accounts.retrieve(accountId);
  await this.cache.set(cacheKey, account, 300); // 5 min TTL
  
  return account;
}
```

---

## 🔒 Security Checklist

- [ ] Validate webhook signatures
- [ ] Never expose Stripe secret key in frontend
- [ ] Verify user owns Connect account before showing data
- [ ] Validate refund requests (student owns course, within window)
- [ ] Use environment variables for all keys
- [ ] Implement rate limiting on API endpoints
- [ ] Log all transfer attempts for audit trail
- [ ] Encrypt sensitive data in database
- [ ] Use HTTPS for all webhook endpoints

---

## 📞 Debugging Commands

### Check Transfer Status
```typescript
// In NestJS service or console
const transfer = await stripe.transfers.retrieve('tr_xxx');
console.log(transfer.status); // 'paid', 'pending', 'failed'
```

### Manually Trigger Transfer
```typescript
// Admin endpoint
async manuallyTriggerTransfer(transferId: number) {
  const transfer = await prisma.stripeTransfer.findUnique({
    where: { id: transferId },
    include: { connectAccount: true, courseSale: true },
  });
  
  return await stripePayoutService.processTransfer(transfer);
}
```

### View Webhook Logs
```bash
# Stripe Dashboard → Developers → Webhooks → View Logs
# Or use Stripe CLI
stripe logs tail
```

---

## 🎯 Key Metrics to Monitor

### Daily Checks
- Total pending transfers amount
- Total completed transfers today
- Failed transfer count
- Refund requests count
- Platform earnings today

### Weekly Reports
- Average payout amount
- Payout success rate
- Top earning teachers
- Refund rate by course
- Connect account onboarding completion rate

### Monthly Analytics
- Total platform fees collected
- Total payouts to teachers
- Growth in active Connect accounts
- Transfer failure reasons (chart)

---

## 🔗 Useful Links

- [Stripe Connect Docs](https://stripe.com/docs/connect)
- [Stripe Transfers API](https://stripe.com/docs/api/transfers)
- [Stripe Refunds API](https://stripe.com/docs/api/refunds)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

**Last Updated**: 2025-11-09  
**Version**: 1.0

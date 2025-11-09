# Stripe Connect Deployment Guide

## 🚀 Quick Start - Running the Implementation

This guide will help you deploy the Stripe Connect implementation to Supabase and get it running.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Supabase account and project
- ✅ Stripe account (get API keys from https://dashboard.stripe.com)
- ✅ Node.js v16+ and npm/yarn installed
- ✅ Access to your server codebase

---

## Step 1: Environment Variables

Add these environment variables to your `.env` file:

```bash
# Existing Stripe variables
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your Stripe publishable key

# New Stripe Connect variables
STRIPE_WEBHOOK_SECRET=whsec_...  # From Stripe Dashboard → Webhooks
PLATFORM_FEE_PERCENT=15  # Platform fee (15%)
HOLD_PERIOD_DAYS=14  # Hold period before payout

# Frontend URL (for onboarding redirects)
FRONTEND_URL=http://localhost:3000  # Change to your production URL

# Supabase Database
DATABASE_URL=postgresql://...  # Your Supabase connection string
```

---

## Step 2: Run Database Migration in Supabase

### Option A: Using Supabase SQL Editor (Recommended)

1. **Go to your Supabase project**
   - Navigate to: SQL Editor

2. **Run the migration script**
   - Copy the contents of `/server/prisma/migrations/001_stripe_connect_setup.sql`
   - Paste into Supabase SQL Editor
   - Click "Run"

3. **Verify the migration**
   ```sql
   -- Check if tables were created
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN (
     'StripeConnectAccount',
     'StripeTransfer',
     'Refund',
     'PlatformEarning'
   );
   ```

### Option B: Using Prisma Migrate

```bash
cd server

# Generate Prisma Client with new models
npx prisma generate

# Push schema to Supabase
npx prisma db push

# Or use Prisma migrate
npx prisma migrate dev --name stripe_connect_setup
```

---

## Step 3: Install Dependencies

```bash
cd server

# Install required packages
npm install @nestjs/schedule stripe@13.0.0

# Or with yarn
yarn add @nestjs/schedule stripe@13.0.0
```

---

## Step 4: Set Up Stripe Webhook

### 1. Create Webhook Endpoint in Stripe

Go to: https://dashboard.stripe.com/test/webhooks

1. Click **"Add endpoint"**
2. **Endpoint URL**: `https://your-api-domain.com/webhooks/stripe`
   - For local testing: Use ngrok or Stripe CLI
3. **Events to listen to**:
   - `account.updated`
   - `transfer.created`
   - `transfer.updated`
   - `transfer.failed`
   - `charge.refunded`
   - `payment_intent.succeeded`

4. Click **"Add endpoint"**

5. **Copy the Signing Secret**
   - It starts with `whsec_...`
   - Add it to your `.env` as `STRIPE_WEBHOOK_SECRET`

### 2. For Local Development (using Stripe CLI)

```bash
# Install Stripe CLI
# Mac: brew install stripe/stripe-cli/stripe
# Windows: scoop install stripe
# Linux: Download from https://github.com/stripe/stripe-cli/releases

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:4000/webhooks/stripe

# This will give you a webhook secret (whsec_...)
# Add it to your .env file
```

---

## Step 5: Configure Raw Body for Webhooks

The webhook endpoint needs the raw request body for signature verification.

### Update `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Enable raw body
  });

  // Configure JSON parsing with raw body
  app.use(
    json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  await app.listen(4000);
}
bootstrap();
```

---

## Step 6: Build and Deploy

### Development

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run in development mode
npm run start:dev
```

### Production

```bash
cd server

# Build the application
npm run build

# Run in production mode
npm run start:prod
```

---

## Step 7: Verify Installation

### 1. Check Database Tables

```sql
-- In Supabase SQL Editor
SELECT COUNT(*) FROM "StripeConnectAccount";
SELECT COUNT(*) FROM "StripeTransfer";
SELECT COUNT(*) FROM "Refund";
SELECT COUNT(*) FROM "PlatformEarning";
```

### 2. Test GraphQL Endpoint

Go to: `http://localhost:4000/graphql` (or your production URL)

Try this query:
```graphql
query {
  getAllConnectAccounts
}
```

### 3. Test Webhook Endpoint

```bash
curl -X POST http://localhost:4000/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

You should see a signature verification error (expected without proper signature).

---

## Step 8: Cron Job Verification

The payout cron job runs daily at 2 AM. To test it manually:

### Via GraphQL (Admin Only)

```graphql
# This won't work with the resolver as-is
# You'll need to add a manual trigger mutation
# Or test the service directly in your code
```

### Via Code

Create a test endpoint (remove after testing):

```typescript
// In stripe-payout.service.ts
@Get('test-cron') // Add this endpoint temporarily
async testCron() {
  return this.processPendingTransfers();
}
```

Then visit: `http://localhost:4000/test-cron`

---

## 📊 Testing the Full Flow

### 1. Create a Connect Account

**GraphQL Mutation:**

```graphql
mutation {
  createConnectAccount(
    email: "teacher@example.com"
    userType: "teacher"
    userId: 1
    country: "US"
  )
}
```

Response includes `onboardingUrl` - visit this URL to complete onboarding.

### 2. Make a Test Purchase

1. Student purchases a course
2. Check that:
   - `CourseSale` is created with 85% of price
   - `PlatformEarning` is created with 15% of price
   - `StripeTransfer` is created with status "pending"

```sql
SELECT * FROM "CourseSale" ORDER BY "createdAt" DESC LIMIT 1;
SELECT * FROM "PlatformEarning" ORDER BY "createdAt" DESC LIMIT 1;
SELECT * FROM "StripeTransfer" ORDER BY "createdAt" DESC LIMIT 1;
```

### 3. Test Refund

**GraphQL Mutation:**

```graphql
mutation {
  requestRefund(
    courseSaleId: 1
    studentId: 1
    reason: "student_request"
  )
}
```

Check that:
- Refund is created
- Transfer is marked as "refunded"
- Student course access removed

### 4. Test Manual Payout (Skip 14-Day Wait)

**GraphQL Mutation:**

```graphql
mutation {
  triggerManualTransfer(transferId: 1)
}
```

---

## 🔍 Monitoring and Debugging

### View Logs

```bash
# Watch application logs
tail -f logs/application.log

# Or if using PM2
pm2 logs
```

### Check Transfer Status

```sql
SELECT 
  st.id,
  st.status,
  st."netAmount",
  st."scheduledTransferDate",
  st."actualTransferDate",
  sca."stripeAccountId",
  t.name as teacher_name
FROM "StripeTransfer" st
JOIN "StripeConnectAccount" sca ON st."connectAccountId" = sca.id
LEFT JOIN "Teacher" t ON sca."teacherId" = t.id
ORDER BY st."createdAt" DESC;
```

### Check Platform Earnings

```sql
SELECT 
  DATE("createdAt") as date,
  COUNT(*) as sales_count,
  SUM(amount) as total_fees
FROM "PlatformEarning"
GROUP BY DATE("createdAt")
ORDER BY date DESC;
```

### Check Failed Transfers

```sql
SELECT * FROM "StripeTransfer" 
WHERE status = 'failed' 
ORDER BY "updatedAt" DESC;
```

---

## 🚨 Troubleshooting

### Issue: "Connect account not found"

**Solution:** Make sure the teacher has completed Stripe Connect onboarding.

```graphql
query {
  getConnectAccount(userType: "teacher", userId: 1)
}
```

### Issue: "Webhook signature verification failed"

**Solution:** 
1. Check that `STRIPE_WEBHOOK_SECRET` is correct
2. Make sure raw body is enabled in `main.ts`
3. Test with Stripe CLI locally first

### Issue: "Transfer not scheduled"

**Solution:** Check that:
1. Teacher has active Connect account
2. `payoutsEnabled` is `true`
3. `accountStatus` is `'active'`

```sql
SELECT * FROM "StripeConnectAccount" WHERE "teacherId" = 1;
```

### Issue: "Cron job not running"

**Solution:**
1. Check that `@nestjs/schedule` is installed
2. Check that `ScheduleModule.forRoot()` is imported in module
3. Check server logs for cron execution

### Issue: "Database migration failed"

**Solution:**
1. Check Supabase connection
2. Ensure you have proper permissions
3. Try running migration step by step
4. Check for conflicting table names

---

## 🔒 Security Checklist

Before going to production:

- [ ] Use production Stripe keys (not test keys)
- [ ] Set strong `STRIPE_WEBHOOK_SECRET`
- [ ] Use HTTPS for webhook endpoint
- [ ] Set correct `FRONTEND_URL`
- [ ] Enable authentication on admin GraphQL endpoints
- [ ] Review and secure database permissions
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Set up logging
- [ ] Test rollback procedure

---

## 📱 Next Steps

After deployment:

1. **Onboard Existing Teachers**
   - Send email to all teachers
   - Provide onboarding link
   - Set deadline for onboarding

2. **Test with Real Transactions**
   - Make small test purchases
   - Wait for 14-day hold period
   - Verify automatic payouts work

3. **Monitor First Week**
   - Check cron job logs daily
   - Review failed transfers
   - Monitor refund requests

4. **Set Up Alerts**
   - Alert on failed transfers
   - Alert on high refund rate
   - Alert on cron job failures

---

## 📞 Support

If you encounter issues:

1. Check server logs
2. Check Supabase logs
3. Check Stripe Dashboard for errors
4. Review the implementation plan: [STRIPE_CONNECT_IMPLEMENTATION_PLAN.md](STRIPE_CONNECT_IMPLEMENTATION_PLAN.md)
5. Check webhook logs in Stripe Dashboard

---

## 🔄 Rollback Procedure

If you need to rollback:

1. **Disable Cron Job**
   ```typescript
   // Comment out the @Cron decorator
   // @Cron(CronExpression.EVERY_DAY_AT_2AM)
   ```

2. **Run Rollback Migration**
   ```bash
   # In Supabase SQL Editor
   # Run: /server/prisma/migrations/002_stripe_connect_rollback.sql
   ```

3. **Revert Code Changes**
   ```bash
   git revert <commit-hash>
   ```

---

**Deployment Complete! 🎉**

Your Stripe Connect implementation is now live. Teachers and organizations can now receive automatic payouts 14 days after each sale, with a 15% platform fee automatically collected.

For more details, see:
- [Implementation Plan](STRIPE_CONNECT_IMPLEMENTATION_PLAN.md)
- [Quick Reference](STRIPE_CONNECT_QUICK_REFERENCE.md)
- [Flow Diagrams](STRIPE_CONNECT_FLOW_DIAGRAMS.md)

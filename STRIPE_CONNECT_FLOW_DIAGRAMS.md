# Stripe Connect Flow Diagrams

## 🔄 System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         STRIPE CONNECT SYSTEM                         │
│                     with 14-Day Hold & Auto Payouts                   │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   STUDENT    │────────▶│   PLATFORM   │────────▶│   TEACHER    │
│              │  $100   │              │  $85    │              │
│  Purchase    │         │  (Keep $15)  │  After  │  Receives    │
│  Course      │         │  Hold 14d    │  14 days│  Payout      │
└──────────────┘         └──────────────┘         └──────────────┘
                                │
                                │ Refund Window
                                ▼
                         ┌──────────────┐
                         │   REFUNDS    │
                         │  (0-14 days) │
                         │   Cancel     │
                         │   Transfer   │
                         └──────────────┘
```

---

## 💳 Payment Flow (Student Purchase)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PAYMENT FLOW                                  │
└─────────────────────────────────────────────────────────────────────┘

STUDENT                  FRONTEND              BACKEND                STRIPE              DATABASE
   │                        │                     │                     │                     │
   │  1. Add to Cart        │                     │                     │                     │
   │ ──────────────────────▶│                     │                     │                     │
   │                        │                     │                     │                     │
   │  2. Click Checkout     │                     │                     │                     │
   │ ──────────────────────▶│                     │                     │                     │
   │                        │  3. Create          │                     │                     │
   │                        │     Payment Intent  │                     │                     │
   │                        │────────────────────▶│                     │                     │
   │                        │                     │  4. Create PI       │                     │
   │                        │                     │────────────────────▶│                     │
   │                        │                     │  5. Return Secret   │                     │
   │                        │                     │◀────────────────────│                     │
   │                        │  6. Client Secret   │                     │                     │
   │                        │◀────────────────────│                     │                     │
   │                        │                     │                     │                     │
   │  7. Enter Card         │                     │                     │                     │
   │ ──────────────────────▶│                     │                     │                     │
   │                        │  8. Confirm Payment │                     │                     │
   │                        │────────────────────────────────────────▶│                     │
   │                        │                     │                     │                     │
   │                        │                     │  9. Webhook:        │                     │
   │                        │                     │     payment_intent  │                     │
   │                        │                     │     .succeeded      │                     │
   │                        │                     │◀────────────────────│                     │
   │                        │                     │                     │                     │
   │                        │                     │  10. Process Sale   │                     │
   │                        │                     │────────────────────────────────────────▶│
   │                        │                     │     • Create CourseSale ($85)            │
   │                        │                     │     • Create PlatformEarning ($15)       │
   │                        │                     │     • Create StripeTransfer (pending)    │
   │                        │                     │     • Create StudentCourse               │
   │                        │                     │     • Schedule Transfer (+14 days)       │
   │                        │                     │                     │                     │
   │  11. Success!          │                     │                     │                     │
   │ ◀──────────────────────│                     │                     │                     │
   │  (Access Course)       │                     │                     │                     │
```

### Detailed Breakdown

#### Step 1-2: Cart & Checkout
- Student browses courses
- Adds courses to cart
- Clicks checkout button

#### Step 3-6: Payment Intent Creation
```typescript
// Backend creates Payment Intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: 10000, // $100.00
  currency: 'usd',
  metadata: {
    courseIds: '[1,2,3]',
    teacherIds: '[10,11]',
    studentId: '123',
    platformFeePercent: '15',
  },
});

return { clientSecret: paymentIntent.client_secret };
```

#### Step 7-8: Payment Confirmation
- Frontend uses Stripe.js to handle card input securely
- Stripe processes payment (not your servers)
- 3D Secure authentication if needed

#### Step 9-10: Webhook Processing
```typescript
// Webhook handler
webhookHandler('payment_intent.succeeded', async (paymentIntent) => {
  const { courseIds, teacherIds, studentId } = paymentIntent.metadata;
  
  for (const courseId of courseIds) {
    const course = await getCourse(courseId);
    const originalPrice = course.price;
    
    // 85% to teacher
    const teacherAmount = originalPrice * 0.85;
    
    // 15% platform fee
    const platformFee = originalPrice * 0.15;
    
    // Create sale record
    const sale = await createCourseSale({
      price: teacherAmount,
      courseId,
      studentId,
      stripePaymentIntentId: paymentIntent.id,
    });
    
    // Record platform fee
    await createPlatformEarning({
      amount: platformFee,
      courseSaleId: sale.id,
    });
    
    // Schedule transfer (14 days later)
    const transferDate = addDays(new Date(), 14);
    
    await createStripeTransfer({
      amount: originalPrice,
      platformFee: platformFee,
      netAmount: teacherAmount,
      status: 'pending',
      scheduledTransferDate: transferDate,
      courseSaleId: sale.id,
    });
  }
});
```

---

## 🎓 Teacher Onboarding Flow (Stripe Connect)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STRIPE CONNECT ONBOARDING                          │
└─────────────────────────────────────────────────────────────────────┘

TEACHER              FRONTEND              BACKEND              STRIPE              DATABASE
   │                    │                     │                     │                     │
   │  1. Click "Setup   │                     │                     │                     │
   │     Payouts"       │                     │                     │                     │
   │───────────────────▶│                     │                     │                     │
   │                    │  2. Request Create  │                     │                     │
   │                    │     Connect Account │                     │                     │
   │                    │────────────────────▶│                     │                     │
   │                    │                     │  3. Create Express  │                     │
   │                    │                     │     Account         │                     │
   │                    │                     │────────────────────▶│                     │
   │                    │                     │  4. Account Created │                     │
   │                    │                     │  (acct_xxx)         │                     │
   │                    │                     │◀────────────────────│                     │
   │                    │                     │                     │                     │
   │                    │                     │  5. Create Onboard  │                     │
   │                    │                     │     Link            │                     │
   │                    │                     │────────────────────▶│                     │
   │                    │                     │  6. Onboard URL     │                     │
   │                    │                     │◀────────────────────│                     │
   │                    │                     │                     │                     │
   │                    │                     │  7. Save Account    │                     │
   │                    │                     │────────────────────────────────────────▶│
   │                    │                     │     • stripeAccountId                    │
   │                    │                     │     • teacherId                          │
   │                    │                     │     • status: incomplete                 │
   │                    │                     │                     │                     │
   │                    │  8. Return URL      │                     │                     │
   │                    │◀────────────────────│                     │                     │
   │                    │                     │                     │                     │
   │  9. Redirect to    │                     │                     │                     │
   │     Stripe         │                     │                     │                     │
   │◀───────────────────│                     │                     │                     │
   │                    │                     │                     │                     │
   │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ▶│                     │
   │  10. Fill Form on Stripe (name, DOB, SSN, bank info)           │                     │
   │◀ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│                     │
   │                    │                     │                     │                     │
   │  11. Redirect Back │                     │                     │                     │
   │     to Platform    │                     │                     │                     │
   │───────────────────▶│                     │                     │                     │
   │                    │  12. Webhook:       │                     │                     │
   │                    │      account        │                     │                     │
   │                    │      .updated       │                     │                     │
   │                    │                     │◀────────────────────│                     │
   │                    │                     │                     │                     │
   │                    │                     │  13. Update Status  │                     │
   │                    │                     │────────────────────────────────────────▶│
   │                    │                     │     • accountStatus: active              │
   │                    │                     │     • payoutsEnabled: true               │
   │                    │                     │     • chargesEnabled: true               │
   │                    │                     │                     │                     │
   │  14. Show "Active" │                     │                     │                     │
   │      Status        │                     │                     │                     │
   │◀───────────────────│                     │                     │                     │
```

### Account Statuses

```
incomplete ──▶ pending ──▶ active
                  │
                  ▼
              restricted
```

- **incomplete**: Not yet submitted onboarding
- **pending**: Submitted, awaiting Stripe verification
- **active**: Verified, can receive payouts
- **restricted**: Needs additional info or action

---

## ⏰ Automated Payout Flow (Cron Job)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      AUTOMATED PAYOUT (Daily)                         │
│                         Runs at 2 AM Daily                            │
└─────────────────────────────────────────────────────────────────────┘

CRON JOB             DATABASE              STRIPE              TEACHER
   │                     │                     │                     │
   │  1. Trigger Daily   │                     │                     │
   │     (2 AM)          │                     │                     │
   │                     │                     │                     │
   │  2. Query Pending   │                     │                     │
   │     Transfers       │                     │                     │
   │────────────────────▶│                     │                     │
   │                     │                     │                     │
   │  3. Return List     │                     │                     │
   │     WHERE:          │                     │                     │
   │     • status=pending│                     │                     │
   │     • scheduled<=now│                     │                     │
   │     • no refund     │                     │                     │
   │◀────────────────────│                     │                     │
   │                     │                     │                     │
   │  ┌──────────────────────────────────┐    │                     │
   │  │  FOR EACH TRANSFER:              │    │                     │
   │  │                                  │    │                     │
   │  │  4. Verify Account               │    │                     │
   │  │────────────────────▶             │    │                     │
   │  │     • status=active              │    │                     │
   │  │     • payoutsEnabled=true        │    │                     │
   │  │                                  │    │                     │
   │  │  5. Update Status                │    │                     │
   │  │     to 'processing'              │    │                     │
   │  │────────────────────▶             │    │                     │
   │  │                                  │    │                     │
   │  │  6. Create Stripe Transfer       │    │                     │
   │  │─────────────────────────────────────▶│                     │
   │  │     amount: $85.00               │    │                     │
   │  │     destination: acct_xxx        │    │                     │
   │  │                                  │    │                     │
   │  │  7. Transfer Complete            │    │                     │
   │  │◀─────────────────────────────────────│                     │
   │  │     (tr_xxx)                     │    │                     │
   │  │                                  │    │  8. Funds Arrive    │
   │  │                                  │    │────────────────────▶│
   │  │                                  │    │  (in 1-2 days)      │
   │  │                                  │    │                     │
   │  │  9. Update Status                │    │                     │
   │  │     to 'completed'               │    │                     │
   │  │     + stripeTransferId           │    │                     │
   │  │────────────────────▶             │    │                     │
   │  │                                  │    │                     │
   │  │  10. Send Email                  │    │                     │
   │  │     Notification                 │    │                     │
   │  │─────────────────────────────────────────────────────────▶│
   │  │     "Payout of $85 sent!"        │    │                     │
   │  │                                  │    │                     │
   │  └──────────────────────────────────┘    │                     │
   │                     │                     │                     │
   │  11. Log Summary    │                     │                     │
   │     (X successful,  │                     │                     │
   │      Y failed)      │                     │                     │
```

### Cron Job Logic

```typescript
@Cron(CronExpression.EVERY_DAY_AT_2AM)
async processPendingTransfers() {
  // 1. Find eligible transfers
  const transfers = await findEligibleTransfers();
  
  let successful = 0;
  let failed = 0;
  
  // 2. Process each transfer
  for (const transfer of transfers) {
    try {
      // Verify account is ready
      if (!transfer.connectAccount.payoutsEnabled) {
        await markFailed(transfer.id, 'Payouts not enabled');
        failed++;
        continue;
      }
      
      // Create Stripe transfer
      const stripeTransfer = await stripe.transfers.create({
        amount: Math.round(transfer.netAmount * 100),
        currency: 'usd',
        destination: transfer.connectAccount.stripeAccountId,
      });
      
      // Update database
      await updateTransfer(transfer.id, {
        status: 'completed',
        stripeTransferId: stripeTransfer.id,
        actualTransferDate: new Date(),
      });
      
      successful++;
      
      // Send notification
      await sendEmail(transfer.teacher.email, {
        subject: 'Payout Sent!',
        body: `Your payout of $${transfer.netAmount} has been sent.`,
      });
      
    } catch (error) {
      await markFailed(transfer.id, error.message);
      failed++;
    }
  }
  
  // 3. Log summary
  logger.log(`Payouts processed: ${successful} successful, ${failed} failed`);
}
```

---

## 🔄 Refund Flow (Within 14 Days)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         REFUND FLOW                                   │
│                  (Within 14-Day Window)                               │
└─────────────────────────────────────────────────────────────────────┘

STUDENT              FRONTEND              BACKEND              STRIPE              DATABASE
   │                    │                     │                     │                     │
   │  1. Click "Request │                     │                     │                     │
   │     Refund"        │                     │                     │                     │
   │───────────────────▶│                     │                     │                     │
   │                    │                     │                     │                     │
   │  2. Submit Request │                     │                     │                     │
   │    (reason)        │                     │                     │                     │
   │───────────────────▶│                     │                     │                     │
   │                    │  3. Request Refund  │                     │                     │
   │                    │────────────────────▶│                     │                     │
   │                    │                     │                     │                     │
   │                    │                     │  4. Validate        │                     │
   │                    │                     │────────────────────────────────────────▶│
   │                    │                     │     • Check < 14 days                    │
   │                    │                     │     • Check not refunded                 │
   │                    │                     │     • Check transfer not completed       │
   │                    │                     │                     │                     │
   │                    │                     │  5. If Valid:       │                     │
   │                    │                     │                     │                     │
   │                    │                     │  6. Create Stripe   │                     │
   │                    │                     │     Refund          │                     │
   │                    │                     │────────────────────▶│                     │
   │                    │                     │                     │                     │
   │                    │                     │  7. Refund Success  │                     │
   │                    │                     │◀────────────────────│                     │
   │                    │                     │                     │                     │
   │                    │                     │  8. Update Database │                     │
   │                    │                     │────────────────────────────────────────▶│
   │                    │                     │     • Create Refund record               │
   │                    │                     │     • Mark Transfer as 'refunded'        │
   │                    │                     │     • Reverse TeacherEarning             │
   │                    │                     │     • Delete StudentCourse access        │
   │                    │                     │                     │                     │
   │  9. Refund         │                     │                     │                     │
   │     Processed      │                     │                     │                     │
   │◀───────────────────│                     │                     │                     │
   │                    │                     │                     │                     │
   │ ┌────────────────────────────────────────────────────────────┐ │                     │
   │ │  Funds return to card in 5-10 business days               │ │                     │
   │ └────────────────────────────────────────────────────────────┘ │                     │
```

### Refund Validation Logic

```typescript
async validateRefund(courseSaleId: number) {
  const sale = await prisma.courseSale.findUnique({
    where: { id: courseSaleId },
    include: { refund: true, transfer: true },
  });
  
  // Check 1: Already refunded?
  if (sale.refund) {
    throw new Error('Already refunded');
  }
  
  // Check 2: Within 14 days?
  const daysSince = (Date.now() - sale.createdAt.getTime()) / (1000*60*60*24);
  if (daysSince > 14) {
    throw new Error('Refund window expired (14 days)');
  }
  
  // Check 3: Transfer already completed?
  if (sale.transfer?.status === 'completed') {
    throw new Error('Cannot refund - funds already transferred');
  }
  
  return true; // Refund allowed
}
```

### What Happens When Refund Processed

```typescript
async processRefund(courseSaleId: number) {
  // 1. Create Stripe refund
  const refund = await stripe.refunds.create({
    payment_intent: invoice.stripePaymentIntentId,
    amount: Math.round(sale.price * 100),
  });
  
  // 2. Create refund record
  await prisma.refund.create({
    data: {
      stripeRefundId: refund.id,
      amount: sale.price,
      courseSaleId: sale.id,
      status: 'completed',
    },
  });
  
  // 3. Cancel pending transfer
  await prisma.stripeTransfer.update({
    where: { courseSaleId: sale.id },
    data: {
      status: 'refunded',
      failureReason: 'Course sale was refunded',
    },
  });
  
  // 4. Reverse teacher earning
  await prisma.teacherEarning.update({
    where: { id: sale.teacherEarningId },
    data: {
      withdraw: { decrement: sale.price },
    },
  });
  
  // 5. Remove course access
  await prisma.studentCourse.deleteMany({
    where: {
      studentId: sale.studentId,
      courseId: sale.courseId,
    },
  });
}
```

---

## 📊 Money Flow Timeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMPLETE MONEY FLOW TIMELINE                       │
└─────────────────────────────────────────────────────────────────────┘

Day 0              Day 7              Day 14             Day 16
│                  │                  │                  │
│ STUDENT PURCHASE │                  │ AUTO TRANSFER    │ TEACHER RECEIVES
│                  │                  │                  │
▼                  │                  ▼                  ▼
$100 paid          │                  Transfer created   Funds in bank
│                  │                  to teacher         
├─ $85 (pending)   │                  acct_xxx          
│  to teacher      │                  
│                  │                  
└─ $15 platform    │                  
   fee (kept)      │                  
                   │                  
                   │                  
┌──────────────────┼──────────────────┐
│  REFUND WINDOW   │                  │
│  (Days 0-14)     │                  │
│                  │                  │
│  Student can     │                  │
│  request refund  │                  │
│                  │                  │
│  If refunded:    │                  │
│  • Money returns │                  │
│  • Transfer      │                  │
│    cancelled     │                  │
└──────────────────┴──────────────────┘

After Day 14:
• No refunds allowed
• Transfer cannot be cancelled
• Teacher keeps funds
```

### Real Example: $100 Course Purchase

```
Timeline:
─────────────────────────────────────────────────────────────────

Jan 1, 2024 (Day 0)
├─ Student purchases course for $100
├─ Stripe charges $100 to student's card
├─ Stripe takes $3.20 fee (2.9% + $0.30)
├─ Platform receives net $96.80
│
├─ System records:
│  ├─ CourseSale: $85.00 (to teacher)
│  ├─ PlatformEarning: $15.00 (platform fee)
│  └─ StripeTransfer: status='pending', scheduled=Jan 15
│
└─ Student gets course access immediately

Jan 1-14 (Hold Period)
├─ Student can request refund
├─ If refunded:
│  ├─ Student gets $100 back
│  ├─ Platform keeps Stripe fee ($3.20 loss)
│  ├─ Transfer cancelled
│  └─ Course access removed

Jan 15, 2024 (Day 14) - 2 AM
├─ Cron job runs
├─ Finds transfer scheduled for today
├─ Verifies teacher's Connect account active
├─ Creates Stripe Transfer:
│  ├─ Amount: $85.00
│  ├─ From: Platform account
│  ├─ To: Teacher's Connect account (acct_xxx)
│  └─ Fee: $0 (included)
│
└─ Transfer marked 'completed' in database

Jan 17, 2024 (Day 16)
└─ Teacher sees $85.00 in their bank account

FINAL BREAKDOWN:
─────────────────
Student paid:      $100.00
Stripe fee:        -$3.20
Platform net:      $96.80

Platform keeps:    $15.00
Teacher receives:  $85.00
                   ────────
Total:             $100.00 ✓

Platform profit:   $15.00 - $3.20 = $11.80 (11.8%)
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SYSTEM ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│  Student Dashboard    Teacher Dashboard    Organization Dashboard    │
│  ├─ Purchase Flow     ├─ Connect Setup    ├─ Connect Setup          │
│  ├─ Course Access     ├─ Earnings View    ├─ Earnings View          │
│  └─ Refund Request    └─ Transfer History └─ Transfer History        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ GraphQL
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          BACKEND LAYER (NestJS)                       │
├─────────────────────────────────────────────────────────────────────┤
│  GraphQL API                                                          │
│  ├─ PaymentResolver                                                   │
│  ├─ SaleResolver                                                      │
│  ├─ ConnectResolver                                                   │
│  └─ RefundResolver                                                    │
│                                                                       │
│  Services                                                             │
│  ├─ PaymentService       (Payment Intent creation)                   │
│  ├─ StripeConnectService (Account onboarding)                        │
│  ├─ StripePayoutService  (Automated transfers - CRON)                │
│  ├─ RefundService        (Refund processing)                         │
│  └─ SaleService          (Course sales, earnings)                    │
│                                                                       │
│  Cron Jobs                                                            │
│  └─ Daily at 2 AM        (Process pending transfers)                 │
│                                                                       │
│  Webhooks                                                             │
│  └─ /webhooks/stripe     (Handle Stripe events)                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│   STRIPE API     │  │  DATABASE    │  │  EMAIL       │
│                  │  │  (PostgreSQL)│  │  SERVICE     │
│  • Accounts      │  │              │  │              │
│  • Transfers     │  │  Models:     │  │  • Payout    │
│  • Refunds       │  │  ├─ Course   │  │    alerts    │
│  • Webhooks      │  │  ├─ Sale     │  │  • Refund    │
│  • Payment       │  │  ├─ Transfer │  │    confirm   │
│    Intents       │  │  ├─ Refund   │  │              │
│                  │  │  └─ Connect  │  │              │
└──────────────────┘  └──────────────┘  └──────────────┘
```

---

## 🗄️ Database Schema Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE RELATIONSHIPS                             │
└─────────────────────────────────────────────────────────────────────┘

Student                  Invoice                  Course
   │                        │                        │
   │ 1:N                    │ N:N                    │
   │                        │                        │
   └─────────────┬──────────┴────────────────────────┘
                 │                                   
                 │ 1:1                               
                 ▼                                   
           StudentCourse ◀─────────────┐
                 │                     │
                 │ 1:1                 │
                 ▼                     │
           CourseReview                │
                                       │
                                       │
           CourseSale                  │
                 │                     │
    ┌────────────┼────────────┐        │
    │            │            │        │
    ▼            ▼            ▼        │
PlatformEarning  │      StripeTransfer│
                 │            │        │
                 ▼            ▼        │
          TeacherEarning ─────┴────────┘
                 │
                 │
                 ▼
         StripeConnectAccount
                 │
                 │ 1:1
                 ▼
         Teacher / Organization


Refund
   │
   ├── 1:1 ──▶ CourseSale
   ├── N:1 ──▶ Student
   └── N:1 ──▶ Invoice
```

### Key Relationships

1. **Student → CourseSale** (1:N)
   - One student can purchase many courses

2. **CourseSale → StripeTransfer** (1:1)
   - Each sale has one transfer scheduled

3. **CourseSale → PlatformEarning** (1:1)
   - Each sale generates one platform fee

4. **CourseSale → Refund** (1:0..1)
   - Sale can have zero or one refund

5. **Teacher → StripeConnectAccount** (1:0..1)
   - Teacher may have Connect account

6. **StripeConnectAccount → StripeTransfer** (1:N)
   - One account receives many transfers

---

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SECURITY MEASURES                              │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ 1. PAYMENT SECURITY                                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Frontend ──────▶ Stripe.js ──────▶ Stripe Servers                │
│  (Never touches your servers)                                      │
│                                                                     │
│  ✓ PCI-DSS compliant                                               │
│  ✓ No card data in your database                                   │
│  ✓ 3D Secure authentication                                        │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ 2. WEBHOOK VERIFICATION                                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Stripe ───────▶ Your Webhook ───────▶ Verify Signature           │
│                       │                      │                     │
│                       │                      ▼                     │
│                       │              [Valid? Process : Reject]     │
│                       │                                            │
│  const sig = req.headers['stripe-signature'];                     │
│  const event = stripe.webhooks.constructEvent(                    │
│    req.body, sig, WEBHOOK_SECRET                                  │
│  );                                                                │
│                                                                     │
│  ✓ Prevents fake webhooks                                          │
│  ✓ Ensures data integrity                                          │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ 3. AUTHORIZATION CHECKS                                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Request ──▶ Auth Guard ──▶ Check User ID ──▶ Allow/Deny          │
│                                                                     │
│  • Teachers can only view their own earnings                       │
│  • Students can only refund their own purchases                    │
│  • Only admins can manually trigger transfers                      │
│  • Connect accounts tied to verified users                         │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ 4. IDEMPOTENCY                                                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Transfer Request ──▶ Check if already processed ──▶ Skip/Process  │
│                                                                     │
│  await stripe.transfers.create({                                   │
│    ...params,                                                      │
│    idempotency_key: `transfer_${courseSaleId}_${timestamp}`       │
│  });                                                               │
│                                                                     │
│  ✓ Prevents duplicate transfers                                    │
│  ✓ Safe retries                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

**Last Updated**: 2025-11-09  
**Version**: 1.0

# Stripe Payment Flow & Teacher Payouts Explained

## 🎯 Overview

Your LMS has a **complete payment ecosystem** with:
- ✅ Student course purchases via Stripe
- ✅ Teacher earnings tracking
- ✅ Teacher withdrawal/payout system
- ✅ Organization earnings (for multi-teacher organizations)
- ✅ Admin approval workflow for payouts

**Important**: The platform acts as a **middleman** - all money goes to your Stripe account first, then teachers request withdrawals which admins manually process.

---

## 💳 How Stripe is Integrated

### 1. Payment Processing

**When a student purchases a course:**

```
Student → Stripe Payment → Platform Stripe Account → Course Access Granted
```

**Flow:**
1. Student adds course(s) to cart
2. Clicks checkout
3. Frontend creates Stripe Payment Intent (via GraphQL API)
4. Student enters card details (handled by Stripe)
5. Payment processed through **YOUR platform's Stripe account**
6. Upon success:
   - Student gets course access (`StudentCourse` created)
   - Invoice is created
   - **CourseSale** is recorded with teacher's earning

**Code Location:**
- Frontend: `/clients/landing-page/src/modules/cart/PaymentModal.tsx` (lines 148-250)
- Backend: `/server/src/modules/payment/payment.service.ts`

### 2. What Stripe API is Used

**Stripe Payment Intents API**
- Creates payment intent: `stripe.paymentIntents.create()`
- Amount, currency (USD), payment method (card)
- Frontend confirms payment with card details

```typescript
// Backend creates intent
async createPaymentIntends(amount: number) {
  amount = Number((amount * 100).toFixed(0)); // Convert to cents
  return this.stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });
}
```

---

## 💰 Payment Flow Breakdown

### Step 1: Student Purchases Course ($100 example)

```
Student pays $100 → Goes to YOUR Stripe account
```

### Step 2: Sale is Recorded

After successful payment, the system creates:

**A. StudentCourse** (enrollment)
```typescript
{
  studentId: 123,
  courseId: 456,
  status: 'inprogress'
}
```

**B. Invoice** (purchase record)
```typescript
{
  studentId: 123,
  price: 100,
  courses: [courseId: 456],
  couponId: null // if coupon used
}
```

**C. CourseSale** (teacher's earning record)
```typescript
{
  price: 100,  // Full course price!
  studentId: 123,
  courseId: 456,
  teacherEarningId: 789  // Links to teacher's earning account
}
```

**Key Point**: The `CourseSale` is linked to the teacher's `TeacherEarning` account, tracking that $100 belongs to that teacher.

**Code Location:** `/clients/landing-page/src/modules/cart/PaymentModal.tsx` (lines 221-237)

```typescript
const createSalesArray = cartState.map((v) => ({
  price: reducePriceByPercentage(v.price, getCouponPercent(price, coupon)),
  courseId: Number(v.id),
  studentId: Number(userData?.id),
  teacherEarningId: Number(v?.teacher?.teacherEarning?.id),  // 👈 Links to teacher
}));
```

---

## 👨‍🏫 Teacher Earnings System

### Database Structure

**TeacherEarning Model:**
```prisma
model TeacherEarning {
  id       Int     @id @default(autoincrement())
  earn     Float   @default(0)      // Not used currently
  withdraw Float   @default(0)      // Total withdrawn amount
  
  sales    CourseSale[]              // All course sales
  
  teacherId Int    @unique
  teacher   Teacher
  
  paymentInvoices PaymentInvoice[]  // Withdrawal requests
}
```

**How It Works:**
- Each teacher has ONE `TeacherEarning` record
- All their `CourseSale` records link to this
- `withdraw` field tracks how much they've already been paid

### Calculating Available Balance

**Formula:**
```
Available Balance = (Sum of all CourseSale.price) - withdraw
```

**Example:**
- Teacher has 10 course sales × $100 = $1,000 total sales
- Teacher has withdrawn $400
- **Available balance = $600**

**Code Location:** `/server/src/modules/sale/sale.service.ts` (lines 125-127)

```typescript
const totalAmount =
  teacherEarning.sales.reduce((a, v) => a + v.price, 0) -
  teacherEarning.withdraw;
```

---

## 💸 Teacher Payout/Withdrawal System

### How Teachers Get Paid

**Important**: This is a **manual payout system**. There's NO automatic Stripe Connect integration.

**Workflow:**

```
1. Teacher checks earnings → 2. Requests withdrawal → 3. Admin reviews → 4. Admin manually pays teacher → 5. Admin marks as "paid"
```

### Step-by-Step Process

#### 1. Teacher Requests Withdrawal

**Teacher Dashboard:**
- Views their `TeacherEarning` balance
- Submits withdrawal request with:
  - Amount to withdraw
  - Bank details (text field - account number, routing, etc.)

**Code Location:** `/server/src/modules/sale/sale.service.ts` (lines 103-170)

**What Happens:**
```typescript
// Creates a PaymentInvoice
{
  userType: 'teacher',
  amount: 500,  // Amount requested
  bankDetails: "Bank: Chase, Account: 123456, Routing: 987654",
  status: 'pending',  // Starts as pending
  to: 'admin' or 'organization',  // Who processes it
  teacherId: 123
}

// Updates TeacherEarning
{
  withdraw: 400 + 500 = 900  // Increases withdrawn amount
}
```

**GraphQL Mutation:**
```graphql
mutation {
  requestTeacherWithdraw(input: {
    id: 123,
    amount: 500,
    bankDetails: "Bank info here"
  }) {
    status
  }
}
```

#### 2. Admin Reviews Request

**Admin Dashboard:**
- Views all `PaymentInvoice` records with `status: 'pending'`
- Sees:
  - Teacher name
  - Amount requested
  - Bank details
  - Request date

**Code Location:** Query payment invoices in admin dashboard

```graphql
query {
  paymentInvoices(where: { status: "pending" }) {
    id
    amount
    bankDetails
    teacher { name, email }
    requestDate
  }
}
```

#### 3. Admin Processes Payment

**Admin Actions:**

**Option A: Approve and Pay**
1. Admin manually transfers money (bank transfer, PayPal, etc.)
2. Admin updates invoice status to `'paid'`

```graphql
mutation {
  updatePaymentInvoice(
    id: 456,
    input: { status: "paid" }
  ) {
    status
  }
}
```

**Option B: Decline**
1. Admin updates status to `'declined'`
2. May need to manually adjust `TeacherEarning.withdraw` (currently not implemented)

---

## 🏢 Organization Earnings

### Multi-Teacher Organizations

**Structure:**
- Organizations can have multiple teachers
- Each teacher's earnings roll up to the organization
- Organization can request withdrawals for ALL teachers under them

**OrganizationEarning Model:**
```prisma
model OrganizationEarning {
  id       Int     @id @default(autoincrement())
  earn     Float   @default(0)
  withdraw Float   @default(0)
  
  teachersEarnings TeacherEarning[]  // Links to all teachers
  organizationId   Int @unique
}
```

**Available Balance Calculation:**
```typescript
// Sum ALL sales from ALL teachers in organization
const allSales = organizationEarning.teachersEarnings.flatMap(v => v.sales);
const totalAmount = allSales.reduce((a, v) => a + v.price, 0) - organizationEarning.withdraw;
```

**Withdrawal Process:**
- Same as teacher, but requests go to admin
- Organization provides their bank details
- Admin manually processes payment

---

## 🔴 What's NOT Implemented

### 1. Platform Commission/Fee
Currently, **100% of sale price goes to teacher**.

There's NO:
- Platform fee deduction (e.g., 20% commission)
- Split payment
- Platform revenue tracking

**To Implement Platform Fee:**

You'd need to modify `CourseSale` creation:

```typescript
// Current (line 221-229 in PaymentModal.tsx)
price: course.price  // Full price to teacher

// Should be (example: 80% to teacher, 20% to platform)
price: course.price * 0.8  // 80% to teacher
```

And create a separate `PlatformEarning` table to track your revenue.

### 2. Stripe Connect (Automated Payouts)
Currently manual payouts. No integration with:
- Stripe Connect (direct teacher payouts)
- Stripe Transfers
- Automated payment splitting

**To implement Stripe Connect:**
- Teachers would connect their Stripe accounts
- Use `transfer` or `destination` in payment intent
- Automate payouts via Stripe API

### 3. Refunds
No refund system implemented. You'd need to:
- Create `Refund` model
- Use Stripe Refund API
- Reverse `CourseSale` and `TeacherEarning`

### 4. Tax Handling
No tax calculation or reporting:
- No VAT/sales tax
- No 1099 forms for teachers
- No tax withholding

---

## 📊 Database Schema Summary

```
Student Payment ($100)
       ↓
   Invoice ($100)
       ↓
   CourseSale ($100)
       ↓
   TeacherEarning
       ├─ sales: [CourseSale1, CourseSale2, ...]
       └─ withdraw: $0 → $500 (after payout)
       ↓
   PaymentInvoice (withdrawal request)
       ├─ status: pending → paid
       └─ bankDetails: "..."
```

---

## 🛠️ How to Customize

### Add Platform Commission

**1. Update Sale Creation** (`PaymentModal.tsx`):

```typescript
const PLATFORM_FEE = 0.20; // 20% commission

const createSalesArray = cartState.map((v) => ({
  price: reducePriceByPercentage(v.price, getCouponPercent(price, coupon)) * (1 - PLATFORM_FEE),
  courseId: Number(v.id),
  studentId: Number(userData?.id),
  teacherEarningId: Number(v?.teacher?.teacherEarning?.id),
}));
```

**2. Create Platform Earnings Table:**

```prisma
model PlatformEarning {
  id        Int      @id @default(autoincrement())
  amount    Float    // Platform's cut
  saleId    Int      // Reference to CourseSale
  createdAt DateTime @default(now())
}
```

**3. Track Platform Revenue:**

```typescript
// After creating course sale
await prisma.platformEarning.create({
  data: {
    amount: coursePrice * PLATFORM_FEE,
    saleId: courseSale.id
  }
});
```

### Implement Stripe Connect (Automated Payouts)

**1. Add Stripe Account to Teacher:**

```prisma
model Teacher {
  // ... existing fields
  stripeAccountId String?  // Stripe Connect account ID
}
```

**2. Modify Payment Intent Creation:**

```typescript
async createPaymentIntends(amount: number, teacherStripeAccountId: string) {
  return this.stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'usd',
    payment_method_types: ['card'],
    transfer_data: {
      destination: teacherStripeAccountId,  // Direct to teacher
      amount: Math.floor(amount * 100 * 0.8)  // 80% to teacher
    },
    application_fee_amount: Math.floor(amount * 100 * 0.2)  // 20% to platform
  });
}
```

**3. Onboard Teachers to Stripe Connect:**

Use Stripe Connect onboarding flow to collect teacher account info.

---

## 🔐 Security Considerations

### Current Setup

✅ **Good:**
- Payment processing handled by Stripe (PCI compliant)
- No card details stored in your database
- Stripe handles fraud detection

⚠️ **Needs Attention:**
- Bank details stored as plain text in `PaymentInvoice.bankDetails`
- No validation on withdrawal amounts (could request negative?)
- No rate limiting on withdrawal requests

### Recommendations

**1. Encrypt Bank Details:**
```typescript
import * as crypto from 'crypto';

const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(bankDetails));
```

**2. Add Withdrawal Limits:**
```typescript
// In sale.service.ts
if (input.amount < 10) throw new Error('Minimum withdrawal is $10');
if (input.amount > totalAmount) throw new Error('Insufficient balance');
```

**3. Add Withdrawal Frequency Limits:**
```prisma
model TeacherEarning {
  // ... existing fields
  lastWithdrawalDate DateTime?
}
```

```typescript
// Limit to once per week
const daysSinceLastWithdrawal = 
  (Date.now() - teacherEarning.lastWithdrawalDate) / (1000 * 60 * 60 * 24);
if (daysSinceLastWithdrawal < 7) {
  throw new Error('Can only withdraw once per week');
}
```

---

## 📝 Summary

### Current State

| Feature | Status | Notes |
|---------|--------|-------|
| **Student Payments** | ✅ Implemented | Via Stripe Payment Intents |
| **Course Access** | ✅ Implemented | Automatic on payment success |
| **Teacher Earnings Tracking** | ✅ Implemented | All sales tracked per teacher |
| **Teacher Withdrawals** | ✅ Implemented | Manual request system |
| **Admin Approval** | ✅ Implemented | Manual review and payout |
| **Organization Earnings** | ✅ Implemented | Multi-teacher support |
| **Platform Commission** | ❌ Not Implemented | 100% goes to teacher |
| **Automated Payouts** | ❌ Not Implemented | Manual bank transfers |
| **Stripe Connect** | ❌ Not Implemented | No direct teacher payouts |
| **Refunds** | ❌ Not Implemented | No refund system |
| **Tax Reporting** | ❌ Not Implemented | No tax handling |

### Money Flow

```
[$100 Course Purchase]
       ↓
[Your Stripe Account receives $100]
       ↓
[CourseSale recorded: $100 to teacher]
       ↓
[Teacher Balance: $100]
       ↓
[Teacher requests $100 withdrawal]
       ↓
[Admin reviews and manually transfers money]
       ↓
[Admin marks as paid]
       ↓
[Teacher Balance: $0]
```

**Bottom Line:**
- ✅ All money goes to your platform's Stripe account
- ✅ Teachers can see their earnings
- ✅ Teachers can request withdrawals
- ✅ Admins manually process payouts
- ❌ No automatic platform fee deduction
- ❌ No automated Stripe payouts

---

## 🎯 Recommendations

### For MVP/Testing:
Current setup works fine! Manual payouts are acceptable for small-scale operations.

### For Production/Scale:

**1. Add Platform Commission** (1-2 hours)
- Decide on percentage (e.g., 15-30%)
- Modify sale creation to deduct fee
- Create PlatformEarning tracking

**2. Implement Stripe Connect** (1-2 days)
- Automate teacher payouts
- Reduce admin workload
- Faster payments to teachers

**3. Add Refund System** (4-6 hours)
- Handle student refund requests
- Reverse teacher earnings
- Stripe refund API integration

**4. Enhance Security** (2-4 hours)
- Encrypt bank details
- Add withdrawal validation
- Implement rate limiting

**5. Tax Reporting** (1-2 days)
- Generate 1099 forms (US)
- Track earnings per teacher per year
- Export tax reports

---

**Questions? Check the code:**
- Payment: `/server/src/modules/payment/`
- Sales: `/server/src/modules/sale/`
- Frontend: `/clients/landing-page/src/modules/cart/`
- Schema: `/server/prisma/schema.prisma`

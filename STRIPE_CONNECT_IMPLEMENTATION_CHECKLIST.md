# Stripe Connect Implementation Checklist

## 📋 Track Your Progress

Use this checklist to track implementation progress. Check off items as you complete them.

---

## Phase 1: Database & Core Services (Week 1)

### Database Schema
- [ ] Create `StripeConnectAccount` model
- [ ] Create `StripeTransfer` model
- [ ] Create `Refund` model
- [ ] Create `PlatformEarning` model
- [ ] Add `stripeConnectAccount` relation to `Teacher` model
- [ ] Add `stripeConnectAccount` relation to `Organization` model
- [ ] Add fields to `CourseSale` model (stripePaymentIntentId, etc.)
- [ ] Add fields to `Invoice` model (stripePaymentIntentId)
- [ ] Add `refunds` relation to `Student` model
- [ ] Run Prisma migration
- [ ] Verify database schema in Prisma Studio
- [ ] Seed test data (optional)

### Backend Services
- [ ] Create `stripe-connect.service.ts`
  - [ ] `createConnectAccount()`
  - [ ] `createAccountOnboardingLink()`
  - [ ] `syncAccountStatus()`
  - [ ] `determineAccountStatus()`
  - [ ] `createDashboardLink()`
- [ ] Create `stripe-payout.service.ts`
  - [ ] `processPendingTransfers()` cron job
  - [ ] `processTransfer()`
  - [ ] `triggerManualTransfer()`
- [ ] Create `refund.service.ts`
  - [ ] `requestRefund()`
  - [ ] `canRefund()`
  - [ ] `processRefund()`
- [ ] Add NestJS Schedule module to `app.module.ts`
- [ ] Write unit tests for all services

---

## Phase 2: Payment Flow Changes (Week 1-2)

### Payment Service Updates
- [ ] Modify `createPaymentIntends()` to accept metadata
  - [ ] Add courseIds to metadata
  - [ ] Add teacherIds to metadata
  - [ ] Add platformFeePercent to metadata
- [ ] Create `handleSuccessfulPayment()` method
- [ ] Update payment flow to calculate splits
  - [ ] Calculate platform fee (15%)
  - [ ] Calculate teacher amount (85%)
- [ ] Create CourseSale with reduced price (85%)
- [ ] Create PlatformEarning record (15%)
- [ ] Create StripeTransfer record (pending, +14 days)

### Sale Service Updates
- [ ] Update `createMany()` to support new flow
- [ ] Add platform fee calculation logic
- [ ] Test payment flow with test cards

### Testing
- [ ] Test payment with single course
- [ ] Test payment with multiple courses
- [ ] Test payment with coupon code
- [ ] Verify platform fee is recorded correctly
- [ ] Verify transfer is scheduled for 14 days later

---

## Phase 3: Connect Account Onboarding (Week 2)

### GraphQL API
- [ ] Create `stripe-connect.resolver.ts`
- [ ] Add `createConnectAccount` mutation
- [ ] Add `getConnectAccountStatus` query
- [ ] Add `refreshOnboardingLink` mutation
- [ ] Add `getDashboardLink` query
- [ ] Add input types for mutations
- [ ] Add return types
- [ ] Add authentication guards

### Frontend - Teacher Dashboard
- [ ] Create `ConnectAccountSetup.tsx` component
  - [ ] "Set Up Payouts" button
  - [ ] Onboarding status display
  - [ ] Redirect to Stripe onboarding
- [ ] Create `AccountStatus.tsx` component
  - [ ] Show verification status
  - [ ] Show payouts enabled status
  - [ ] Show charges enabled status
  - [ ] Link to Stripe dashboard
- [ ] Add navigation to payout settings
- [ ] Add success/error handling
- [ ] Add loading states

### Frontend - Organization Dashboard
- [ ] Create `ConnectAccountSetup.tsx` (organization version)
- [ ] Create `AccountStatus.tsx` (organization version)
- [ ] Add navigation to payout settings

### Testing
- [ ] Test onboarding flow with test account
- [ ] Test account status updates
- [ ] Test refresh onboarding link
- [ ] Test dashboard link generation
- [ ] Verify redirect URLs work correctly

---

## Phase 4: Earnings Dashboard (Week 3)

### GraphQL API
- [ ] Add `getTeacherEarnings` query
  - [ ] Include sales with transfers
  - [ ] Include platform earnings
  - [ ] Include refunds
- [ ] Add `getPendingTransfers` query
- [ ] Add `getCompletedTransfers` query
- [ ] Add `getTransferHistory` query
- [ ] Add filtering and pagination

### Frontend - Teacher Dashboard
- [ ] Create `EarningsOverview.tsx`
  - [ ] Pending earnings card
  - [ ] Completed earnings card
  - [ ] Next payout date card
  - [ ] Platform fee summary
- [ ] Create `PendingTransfers.tsx`
  - [ ] Table of upcoming transfers
  - [ ] Course name
  - [ ] Sale date
  - [ ] Transfer date
  - [ ] Amount
- [ ] Create `TransferHistory.tsx`
  - [ ] Table of completed transfers
  - [ ] Date transferred
  - [ ] Amount
  - [ ] Stripe transfer ID
  - [ ] Course details
- [ ] Create `PayoutSettings.tsx`
  - [ ] Link to Stripe dashboard
  - [ ] Account status
  - [ ] Refresh data button
- [ ] Add charts/graphs (optional)

### Frontend - Organization Dashboard
- [ ] Create earnings dashboard (organization version)
- [ ] Show aggregated earnings from all teachers
- [ ] Show transfer history

### Testing
- [ ] Verify earnings calculations are correct
- [ ] Test with multiple sales
- [ ] Test with refunded sales
- [ ] Test pagination
- [ ] Test date filters

---

## Phase 5: Refund System (Week 3)

### GraphQL API
- [ ] Create `refund.resolver.ts`
- [ ] Add `requestRefund` mutation
- [ ] Add `checkRefundEligibility` query
- [ ] Add `getRefundHistory` query
- [ ] Add authentication guards
- [ ] Add authorization checks (student owns course)

### Backend Logic
- [ ] Implement 14-day window check
- [ ] Implement transfer status check
- [ ] Implement Stripe refund creation
- [ ] Implement transfer cancellation
- [ ] Implement teacher earning reversal
- [ ] Implement course access removal
- [ ] Add refund notifications (email)

### Frontend - Student Dashboard
- [ ] Create `RefundRequest.tsx`
  - [ ] Refund eligibility check
  - [ ] Days remaining display
  - [ ] Reason selection dropdown
  - [ ] Confirm refund button
  - [ ] Success/error messages
- [ ] Create `RefundHistory.tsx`
  - [ ] Table of past refunds
  - [ ] Status display
  - [ ] Date requested
  - [ ] Date processed
  - [ ] Amount refunded
- [ ] Add "Request Refund" button to course list
- [ ] Add refund status badge

### Testing
- [ ] Test refund within 14-day window
- [ ] Test refund after 14-day window (should fail)
- [ ] Test refund after transfer completed (should fail)
- [ ] Test duplicate refund (should fail)
- [ ] Verify Stripe refund is created
- [ ] Verify transfer is cancelled
- [ ] Verify teacher earning is reversed
- [ ] Verify course access is removed

---

## Phase 6: Webhook Integration (Week 4)

### Webhook Endpoint
- [ ] Create `/webhooks/stripe` endpoint
- [ ] Implement webhook signature verification
- [ ] Add raw body parser for webhook route
- [ ] Configure webhook secret in environment

### Event Handlers
- [ ] Handle `account.updated` event
  - [ ] Sync account status to database
  - [ ] Update verification flags
  - [ ] Notify teacher if status changes
- [ ] Handle `transfer.created` event
  - [ ] Update transfer status in database
- [ ] Handle `transfer.updated` event
  - [ ] Update transfer status in database
- [ ] Handle `transfer.failed` event
  - [ ] Mark transfer as failed
  - [ ] Notify admin
  - [ ] Notify teacher
- [ ] Handle `charge.refunded` event
  - [ ] Update refund status in database
- [ ] Handle `payment_intent.succeeded` event
  - [ ] Process sale and create transfers
- [ ] Add error handling for unknown events
- [ ] Add logging for all events

### Stripe Dashboard Setup
- [ ] Register webhook endpoint in Stripe dashboard
- [ ] Select events to listen for
- [ ] Copy webhook signing secret
- [ ] Test webhook with Stripe CLI

### Testing
- [ ] Use Stripe CLI to trigger test events
- [ ] Verify webhook signature validation
- [ ] Test each event handler
- [ ] Test webhook retry logic
- [ ] Monitor webhook logs in Stripe dashboard

---

## Phase 7: Testing & QA (Week 4)

### Unit Tests
- [ ] StripeConnectService tests
- [ ] StripePayoutService tests
- [ ] RefundService tests
- [ ] PaymentService tests
- [ ] GraphQL resolver tests

### Integration Tests
- [ ] Payment flow end-to-end
- [ ] Onboarding flow end-to-end
- [ ] Transfer processing end-to-end
- [ ] Refund flow end-to-end

### Stripe Test Mode Testing
- [ ] Create test Connect accounts
- [ ] Test payment with test cards
- [ ] Test transfers to test accounts
- [ ] Test refunds
- [ ] Test webhook events

### Load Testing
- [ ] Test cron job with 100+ pending transfers
- [ ] Test concurrent webhook events
- [ ] Test database query performance
- [ ] Optimize slow queries

### Edge Cases
- [ ] Teacher deletes account before transfer
- [ ] Connect account gets restricted
- [ ] Stripe API returns error
- [ ] Transfer fails due to insufficient funds
- [ ] Multiple courses purchased at once
- [ ] Refund requested on day 14 exactly
- [ ] Network timeout during transfer
- [ ] Duplicate webhook events

---

## Phase 8: Deployment & Migration (Week 5)

### Environment Setup
- [ ] Add Stripe API keys to production environment
- [ ] Add webhook secret to production environment
- [ ] Set `PLATFORM_FEE_PERCENT=15` in environment
- [ ] Set `HOLD_PERIOD_DAYS=14` in environment
- [ ] Configure cron job schedule
- [ ] Set up monitoring/alerting

### Database Migration
- [ ] Backup production database
- [ ] Run Prisma migration in production
- [ ] Verify migration succeeded
- [ ] Test queries on production data

### Deployment
- [ ] Deploy backend to production
- [ ] Deploy frontend to production
- [ ] Verify webhook endpoint is accessible
- [ ] Verify cron job is scheduled
- [ ] Test basic functionality in production

### Existing User Migration
- [ ] Process all pending `PaymentInvoice` records
  - [ ] Mark as paid or declined
  - [ ] Notify teachers
- [ ] Email all teachers about new payout system
  - [ ] Explain benefits
  - [ ] Provide onboarding link
  - [ ] Set deadline (e.g., 60 days)
- [ ] Track onboarding completion rate
- [ ] Send reminder emails

### Feature Flags (Optional)
- [ ] Add feature flag for Stripe Connect
- [ ] Enable for beta testers first
- [ ] Monitor for issues
- [ ] Gradually roll out to all users

---

## Phase 9: Monitoring & Support (Ongoing)

### Monitoring Setup
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up logging (CloudWatch, etc.)
- [ ] Create dashboard for key metrics
  - [ ] Pending transfers count
  - [ ] Failed transfers count
  - [ ] Platform earnings
  - [ ] Refund rate
- [ ] Set up alerts
  - [ ] Failed transfer alert
  - [ ] High refund rate alert
  - [ ] Cron job failure alert
  - [ ] Webhook endpoint down alert

### Admin Dashboard
- [ ] Create `TransferQueue.tsx`
  - [ ] List pending transfers
  - [ ] Manual trigger button
  - [ ] Filter by date
- [ ] Create `FailedTransfers.tsx`
  - [ ] List failed transfers
  - [ ] Retry button
  - [ ] Failure reason display
- [ ] Create `PlatformEarnings.tsx`
  - [ ] Total earnings chart
  - [ ] Earnings by date
  - [ ] Top earning courses
- [ ] Create `ConnectAccountsManagement.tsx`
  - [ ] List all Connect accounts
  - [ ] Account status
  - [ ] Resend onboarding link
- [ ] Create `RefundManagement.tsx`
  - [ ] Pending refund requests
  - [ ] Approve/deny buttons
  - [ ] Refund history

### Documentation
- [ ] Write API documentation
- [ ] Write user guide for teachers
- [ ] Write user guide for students
- [ ] Write admin runbook
- [ ] Write troubleshooting guide
- [ ] Create video tutorials (optional)

### Support Team Training
- [ ] Train support on Stripe Connect
- [ ] Train on common issues
- [ ] Provide escalation path
- [ ] Create support FAQ

---

## Phase 10: Optimization & Enhancements (Future)

### Performance Optimization
- [ ] Batch transfer processing
- [ ] Cache Connect account status
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Implement pagination everywhere

### Feature Enhancements
- [ ] Partial refunds
- [ ] Pro-rated refunds
- [ ] Custom hold periods per course
- [ ] Bulk payout options
- [ ] Multi-currency support
- [ ] Instant payouts (for verified accounts)
- [ ] Payout schedules (weekly, bi-weekly)

### Analytics & Reporting
- [ ] Teacher earnings report (downloadable)
- [ ] Platform revenue report
- [ ] Refund analysis report
- [ ] Transfer success rate tracking
- [ ] Teacher payout history export

---

## 🎯 Pre-Launch Checklist

**Must complete before going live:**

- [ ] All Phase 1-6 items complete
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] End-to-end testing complete
- [ ] Load testing passed
- [ ] Security audit completed
- [ ] Stripe test mode fully tested
- [ ] Production environment configured
- [ ] Webhook endpoint verified in production
- [ ] Cron job scheduled and tested
- [ ] Monitoring and alerts set up
- [ ] Documentation complete
- [ ] Support team trained
- [ ] 95%+ teachers onboarded to Connect
- [ ] Zero pending manual withdrawals
- [ ] Beta testing completed (if applicable)
- [ ] Rollback plan documented
- [ ] Stakeholder approval obtained

---

## 📊 Progress Tracking

### Overall Completion
```
Phase 1: [    ] 0/12 items
Phase 2: [    ] 0/8 items
Phase 3: [    ] 0/12 items
Phase 4: [    ] 0/12 items
Phase 5: [    ] 0/12 items
Phase 6: [    ] 0/15 items
Phase 7: [    ] 0/15 items
Phase 8: [    ] 0/15 items
Phase 9: [    ] 0/15 items

Total: [    ] 0/116 items (0%)
```

### Time Tracking
- **Estimated Total**: 300 hours
- **Actual Time Spent**: ___ hours
- **Remaining**: ___ hours
- **On Track?**: Yes / No

### Team Assignments
- **Backend Lead**: _______________
- **Frontend Lead**: _______________
- **QA Lead**: _______________
- **DevOps Lead**: _______________

---

## 📝 Notes & Issues

### Blockers
- [ ] Issue #1: _______________________
- [ ] Issue #2: _______________________

### Decisions Needed
- [ ] Decision #1: _______________________
- [ ] Decision #2: _______________________

### Questions for Stripe Support
- [ ] Question #1: _______________________
- [ ] Question #2: _______________________

---

**Last Updated**: 2025-11-09  
**Version**: 1.0  
**Status**: Ready to Start

---

**How to use this checklist:**
1. Assign team members to each phase
2. Check off items as you complete them
3. Update progress tracking section weekly
4. Document blockers and decisions
5. Review with team during stand-ups
6. Celebrate milestones! 🎉

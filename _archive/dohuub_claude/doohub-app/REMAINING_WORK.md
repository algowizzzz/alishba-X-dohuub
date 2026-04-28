# DoHuub - Remaining Work (Verified)

> **Date:** January 12, 2026  
> **Based on:** Actual codebase review + Proposal Sections 5, 6, 7

---

## Summary

| Platform | Complete | Remaining | Est. Time |
|----------|----------|-----------|-----------|
| **Mobile App** | ~95% | Bug verification, minor fixes | 1-2 days |
| **Vendor Portal** | ~60% | API wiring, enhancements | 8-10 days |
| **Admin Panel** | ~40% | Missing pages, API wiring | 8-10 days |

**Total: ~18-22 days**

---

## MOBILE APP

### What's Built ✅
- All 6 service flows (Cleaning, Handyman, Beauty, Groceries, Rentals, Caregiving)
- Full auth flow (register, login, OTP, profile setup)
- All modals: ReportModal, DeleteAccountModal, LogoutModal, CartWarningModal
- Bookings with tracking
- Cart with error handling
- AI Chat screen
- Profile management (addresses, payments, settings)
- Notifications
- Reviews system

### To Verify/Fix

| Task | Priority | Est. |
|------|----------|------|
| Test registration button (may work now) | 🔴 High | 1h |
| Test bookings screen for crashes | 🔴 High | 1h |
| Test cart screen for crashes | 🔴 High | 1h |
| Fix "AI Assistant" tab label spacing | 🔴 High | 30m |
| End-to-end flow testing | 🟡 Medium | 4h |

---

## VENDOR PORTAL (Web)

### What's Built ✅

| Screen | Status | Notes |
|--------|--------|-------|
| `/vendor` Dashboard | ✅ Built | Stats, recent orders, quick actions |
| `/vendor/onboarding` | ✅ Built | 6-step wizard with API calls |
| `/vendor/listings` | ✅ Built | Table view |
| `/vendor/listings/new` | ✅ Built | Generic form, all 6 categories |
| `/vendor/orders` | ✅ Scaffolded | Static data |
| `/vendor/reviews` | ✅ Scaffolded | Static data |
| `/vendor/performance` | ✅ Scaffolded | Static data |
| `/vendor/subscription` | ✅ Scaffolded | Static data |
| `/vendor/settings` | ✅ Scaffolded | Static data |

### Remaining Work

| Task | Proposal Ref | Priority | Est. |
|------|--------------|----------|------|
| Wire dashboard to real API | 6.9 | 🔴 High | 4h |
| Wire orders page to API + actions (Accept/Decline/Complete) | 6.8 | 🔴 High | 6h |
| Wire reviews page to API | 6.9 | 🟡 Medium | 2h |
| Wire performance page to API | 6.9 | 🟡 Medium | 3h |
| Subscription page - Stripe integration | 6.5 | 🔴 High | 8h |
| Subscription - billing history | 6.5 | 🟡 Medium | 3h |
| Settings - service areas manager | 6.3 | 🟡 Medium | 4h |
| Settings - availability calendar | 6.4 | 🟡 Medium | 4h |
| Edit listing page (`/vendor/listings/[id]/edit`) | 6.7 | 🔴 High | 4h |
| Category-specific form fields | 6.6 | 🟢 Low | 6h |

**Vendor Total: ~44 hours (~8-10 days)**

---

## ADMIN PANEL (Web)

### What's Built ✅

| Screen | Status | Notes |
|--------|--------|-------|
| `/admin` Dashboard | ✅ Built | 6 metrics, recent vendors, pending reports |
| `/admin/vendors` | ✅ Scaffolded | Table view |
| `/admin/listings` | ✅ Scaffolded | Table view |
| `/admin/reports` | ✅ Scaffolded | Queue view |
| `/admin/michelle` | ✅ Built | Stats, search, grid, links to new/edit |

### Missing Screens (per Proposal Section 7)

| Screen | Proposal Ref | Priority | Est. |
|--------|--------------|----------|------|
| `/admin/customers` - Customer list | 7.8 | 🔴 High | 4h |
| `/admin/customers/[id]` - Customer detail | 7.8 | 🔴 High | 3h |
| `/admin/vendors/[id]` - Vendor detail + actions | 7.4 | 🔴 High | 4h |
| `/admin/subscriptions` - Monitor all subscriptions | 7.7 | 🟡 Medium | 4h |
| `/admin/reports/[id]` - Report detail + moderation | 7.6 | 🔴 High | 3h |
| `/admin/michelle/new` - Create DoHuub listing | 7.3 | 🟡 Medium | 3h |
| `/admin/michelle/[id]/edit` - Edit DoHuub listing | 7.3 | 🟡 Medium | 3h |
| `/admin/settings` - Admin account settings | 7.9 | 🟢 Low | 2h |

### API Wiring Needed

| Screen | Task | Est. |
|--------|------|------|
| Dashboard | Wire all 6 metrics to real counts | 3h |
| Vendors | Wire to API + suspend/reactivate actions | 4h |
| Listings | Wire to API + disable/restore actions | 4h |
| Reports | Wire to API + approve/remove actions | 3h |
| Michelle | Wire to API instead of static data | 3h |

**Admin Total: ~43 hours (~8-10 days)**

---

## SHARED INFRASTRUCTURE

| Task | Priority | Est. |
|------|----------|------|
| Verify NextAuth is wired to backend API | 🔴 High | 2h |
| Role-based route protection middleware | 🔴 High | 2h |
| Stripe webhook handlers for subscriptions | 🟡 Medium | 4h |

**Infrastructure Total: ~8 hours**

---

## PRIORITIZED TASK LIST

### Week 1: Critical Path
- [ ] Mobile: Verify all 3 reported bugs are fixed
- [ ] Mobile: Fix "AI Assistant" label
- [ ] Vendor: Wire orders page (accept/decline/complete)
- [ ] Vendor: Edit listing page
- [ ] Admin: Create customers page

### Week 2: Core Features
- [ ] Vendor: Stripe subscription integration
- [ ] Vendor: Service areas manager
- [ ] Admin: Vendor detail + suspend/reactivate
- [ ] Admin: Report detail + moderation actions
- [ ] Admin: Wire dashboard metrics

### Week 3: Polish
- [ ] Vendor: Availability calendar
- [ ] Vendor: Billing history
- [ ] Admin: Subscriptions monitoring page
- [ ] Admin: Michelle listing CRUD
- [ ] Mobile: Full E2E testing

---

## SUCCESS CRITERIA

### Mobile ✅ (already met, needs verification)
- [x] All service flows work
- [x] Error handling on API screens
- [x] Report listing works
- [ ] No crashes on any screen (verify)

### Vendor Portal
- [ ] New vendor can complete onboarding → create listing → receive order → complete order
- [ ] Vendor can manage subscription via Stripe
- [ ] All Section 6 proposal features functional

### Admin Panel
- [ ] Admin sees real platform metrics
- [ ] Admin can manage vendors (suspend/restore)
- [ ] Admin can moderate reports
- [ ] Admin can manage Michelle's priority listings
- [ ] All Section 7 proposal features functional

---

*Last Updated: January 12, 2026*


# DoHuub Web Portal Build Plan (Vendor + Admin)

> **Generated:** January 11, 2026  
> **Based on:** Dohuub_proposal.md (Sections 6 & 7)  
> **Scope:** Vendor Portal + Admin Panel (Customer features already in mobile app)

---

## Executive Summary

### What's Already Built

| Component | Status | Location |
|-----------|--------|----------|
| **Mobile App** | 95% Complete | `apps/mobile/` |
| - Customer browse/book | ✅ Done | `app/(tabs)/`, `app/services/` |
| - Booking tracking | ✅ Done | `app/bookings/` |
| - AI Chat | ✅ Done | `app/(tabs)/chat.tsx` |
| - Profile/Addresses | ✅ Done | `app/profile/` |
| - Reviews/Ratings | ✅ Done | `app/review/` |
| **Backend API** | 100% Complete | `apps/api/` |
| **Database Schema** | 100% Complete | `packages/database/prisma/schema.prisma` |

### What Needs to Be Built

| Component | Status | Purpose |
|-----------|--------|---------|
| **Vendor Portal** | 0% | Business owners manage listings, orders, subscriptions |
| **Admin Panel** | 0% | Michelle manages platform, vendors, moderation |

---

## Architecture: Unified Web Portal

Single Next.js app with role-based access (no separate apps):

```
┌─────────────────────────────────────────────────────────────┐
│                    DoHuub Web Portal                        │
│                   (apps/web-portal)                         │
├─────────────────────────────────────────────────────────────┤
│         VENDOR                  │         ADMIN             │
│      (UserRole.VENDOR)          │     (UserRole.ADMIN)      │
├─────────────────────────────────┼───────────────────────────┤
│ Business Onboarding (6 steps)   │ ✅ All Vendor features    │
│ My Listings (CRUD)              │ Platform Dashboard        │
│ Incoming Orders/Bookings        │ All Vendors management    │
│ Reviews & Performance           │ All Customers management  │
│ Service Areas                   │ All Listings oversight    │
│ Availability Schedule           │ Reported Content          │
│ Subscription & Billing          │ Michelle's Listings       │
│                                 │ Subscription Monitoring   │
└─────────────────────────────────┴───────────────────────────┘
```

---

## Project Metrics

| Metric | Value |
|--------|-------|
| **Total Screens** | ~25 screens |
| **Estimated Duration** | 20 days |
| **Tech Stack** | Next.js 14, Tailwind CSS, shadcn/ui, Zustand |
| **Backend** | Existing API (100% ready) |

---

## Directory Structure

```
apps/web-portal/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx              # Auth layout (centered card)
│   │   ├── login/page.tsx          # Email + OTP / Google
│   │   ├── register/page.tsx       # Vendor registration
│   │   └── verify-otp/page.tsx     # OTP verification
│   │
│   ├── (portal)/
│   │   ├── layout.tsx              # Dashboard layout (sidebar + header)
│   │   ├── page.tsx                # Role-based redirect
│   │   │
│   │   ├── # VENDOR ROUTES (/vendor/*)
│   │   ├── vendor/
│   │   │   ├── page.tsx                    # Vendor dashboard
│   │   │   ├── onboarding/
│   │   │   │   ├── page.tsx                # Step router
│   │   │   │   ├── business-name/page.tsx  # Step 1
│   │   │   │   ├── branding/page.tsx       # Step 2: Logo & Cover
│   │   │   │   ├── description/page.tsx    # Step 3
│   │   │   │   ├── contact/page.tsx        # Step 4
│   │   │   │   ├── categories/page.tsx     # Step 5
│   │   │   │   └── service-areas/page.tsx  # Step 6
│   │   │   ├── listings/
│   │   │   │   ├── page.tsx                # All listings table
│   │   │   │   ├── new/page.tsx            # Create listing
│   │   │   │   └── [id]/
│   │   │   │       └── edit/page.tsx       # Edit listing
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx                # Incoming orders
│   │   │   │   └── [id]/page.tsx           # Order detail
│   │   │   ├── reviews/page.tsx            # Customer reviews
│   │   │   ├── performance/page.tsx        # Stats & analytics
│   │   │   ├── areas/page.tsx              # Service areas
│   │   │   ├── availability/page.tsx       # Weekly schedule
│   │   │   ├── subscription/page.tsx       # Plan & billing
│   │   │   └── settings/page.tsx           # Account settings
│   │   │
│   │   ├── # ADMIN ROUTES (/admin/*)
│   │   └── admin/
│   │       ├── page.tsx                    # Admin dashboard
│   │       ├── vendors/
│   │       │   ├── page.tsx                # All vendors
│   │       │   └── [id]/page.tsx           # Vendor detail
│   │       ├── customers/
│   │       │   ├── page.tsx                # All customers
│   │       │   └── [id]/page.tsx           # Customer detail
│   │       ├── listings/page.tsx           # All listings
│   │       ├── reports/
│   │       │   ├── page.tsx                # Reported content
│   │       │   └── [id]/page.tsx           # Report detail
│   │       ├── michelle/
│   │       │   ├── page.tsx                # Michelle's listings
│   │       │   ├── new/page.tsx            # Create DoHuub listing
│   │       │   └── [id]/edit/page.tsx      # Edit listing
│   │       ├── subscriptions/page.tsx      # Monitor all
│   │       └── settings/page.tsx           # Admin settings
│   │
│   ├── api/                        # API routes (if needed)
│   └── layout.tsx                  # Root layout
│
├── components/
│   ├── ui/                         # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── layouts/
│   │   ├── AuthLayout.tsx          # Centered card
│   │   ├── PortalLayout.tsx        # Sidebar + header
│   │   ├── Sidebar.tsx             # Role-aware navigation
│   │   └── Header.tsx              # User menu, notifications
│   ├── forms/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── OTPInput.tsx
│   │   ├── OnboardingForms/
│   │   │   ├── BusinessNameForm.tsx
│   │   │   ├── BrandingForm.tsx
│   │   │   ├── DescriptionForm.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── CategoriesForm.tsx
│   │   │   └── ServiceAreasForm.tsx
│   │   └── ListingForms/
│   │       ├── CleaningListingForm.tsx
│   │       ├── HandymanListingForm.tsx
│   │       ├── GroceryListingForm.tsx
│   │       ├── BeautyListingForm.tsx
│   │       ├── RentalListingForm.tsx
│   │       └── CaregivingListingForm.tsx
│   ├── tables/
│   │   ├── ListingsTable.tsx
│   │   ├── OrdersTable.tsx
│   │   ├── VendorsTable.tsx
│   │   ├── CustomersTable.tsx
│   │   ├── ReportsTable.tsx
│   │   └── SubscriptionsTable.tsx
│   ├── cards/
│   │   ├── StatCard.tsx
│   │   ├── ListingCard.tsx
│   │   ├── OrderCard.tsx
│   │   ├── ReviewCard.tsx
│   │   └── SubscriptionCard.tsx
│   └── shared/
│       ├── ImageUploader.tsx
│       ├── ServiceAreaManager.tsx
│       ├── AvailabilityCalendar.tsx
│       ├── StatusBadge.tsx
│       ├── RatingDisplay.tsx
│       └── PoweredByBadge.tsx
│
├── lib/
│   ├── api.ts                      # Axios client
│   ├── auth.ts                     # NextAuth config
│   ├── utils.ts                    # cn(), formatters
│   └── validations/
│       ├── auth.ts                 # Login/register schemas
│       ├── onboarding.ts           # Business setup schemas
│       └── listings.ts             # Category-specific schemas
│
├── stores/
│   ├── authStore.ts                # User, auth state
│   ├── vendorStore.ts              # Vendor profile, listings
│   ├── ordersStore.ts              # Orders/bookings
│   └── adminStore.ts               # Admin-specific state
│
├── hooks/
│   ├── useAuth.ts
│   ├── useVendor.ts
│   └── useAdmin.ts
│
├── types/
│   └── index.ts                    # Shared TypeScript types
│
├── middleware.ts                   # Route protection
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## Phase 1: Project Setup (Days 1-2)

### 1.1 Create Next.js Project

```bash
cd apps
npx create-next-app@latest web-portal --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

### 1.2 Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-toast": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "zustand": "^4.5.0",
    "axios": "^1.6.0",
    "next-auth": "^4.24.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "recharts": "^2.10.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### 1.3 Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E3A5F",
          50: "#F0F4F8",
          100: "#D9E2EC",
          500: "#1E3A5F",
          600: "#18304F",
          700: "#122640",
        },
        secondary: {
          DEFAULT: "#FF6B35",
          500: "#FF6B35",
          600: "#E55A2B",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### 1.4 Middleware (Route Protection)

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as string;

    // Admin routes - ADMIN only
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/vendor", req.url));
    }

    // Vendor routes - VENDOR or ADMIN
    if (pathname.startsWith("/vendor") && !["VENDOR", "ADMIN"].includes(role)) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/vendor/:path*", "/admin/:path*"],
};
```

### 1.5 API Client

```typescript
// lib/api.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_BASE = `${API_URL}/api/v1`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    VERIFY_OTP: "/auth/verify-otp",
    GOOGLE_SIGNIN: "/auth/google-signin",
    ME: "/auth/me",
  },
  VENDORS: "/vendors",
  USERS: "/users",
  SERVICES: {
    CLEANING: "/services/cleaning",
    HANDYMAN: "/services/handyman",
    BEAUTY: "/services/beauty",
    GROCERIES: "/services/groceries",
    RENTALS: "/services/rentals",
    CAREGIVING: "/services/caregiving",
  },
  BOOKINGS: "/bookings",
  ORDERS: "/orders",
  REVIEWS: "/reviews",
  PAYMENTS: "/payments",
  NOTIFICATIONS: "/notifications",
};
```

---

## Phase 2: Authentication (Days 3-4)

### Screens

| # | Screen | Route | Purpose |
|---|--------|-------|---------|
| 1 | Login | `/auth/login` | Email+OTP or Google |
| 2 | Register | `/auth/register` | Vendor signup |
| 3 | OTP Verify | `/auth/verify-otp` | Code verification |

### Components to Build

- [ ] `AuthLayout` — Centered card with logo
- [ ] `LoginForm` — Email input, submit, Google button
- [ ] `RegisterForm` — Email, terms checkbox
- [ ] `OTPInput` — 6-digit code with auto-focus
- [ ] `GoogleSignInButton` — OAuth trigger

### Proposal Compliance (Section 6)

| Feature | Implementation |
|---------|----------------|
| Email + OTP or Gmail signup | `RegisterForm` with both options |
| Accept Terms & Conditions | Checkbox before submit |
| Secure login | JWT + httpOnly cookies |
| Safe logout | Clear tokens, redirect |
| Reset via OTP | Reuse OTP flow |

### Proposal Compliance (Section 7 - Admin)

| Feature | Implementation |
|---------|----------------|
| Secure login for Michelle and team | Admin role check |
| Password or OTP-based access | OTP flow (same as vendor) |
| Automatic session timeout | NextAuth session config |
| Manual logout option | Logout button in header |

---

## Phase 3: Vendor Onboarding Wizard (Days 5-6)

### Screens (6-Step Wizard per Proposal Section 6)

| Step | Route | Fields | DB Model |
|------|-------|--------|----------|
| 1 | `/vendor/onboarding/business-name` | Business Name | `Vendor.businessName` |
| 2 | `/vendor/onboarding/branding` | Logo, Cover Image | `Vendor.logo`, `Vendor.coverImage` |
| 3 | `/vendor/onboarding/description` | About/Description | `Vendor.description` |
| 4 | `/vendor/onboarding/contact` | Email, Phone | `Vendor.contactEmail`, `Vendor.contactPhone` |
| 5 | `/vendor/onboarding/categories` | Service Categories | `VendorCategory` records |
| 6 | `/vendor/onboarding/service-areas` | ZIP Codes, Regions | `VendorServiceArea` records |

### Components to Build

- [ ] `OnboardingLayout` — Progress stepper (1/6, 2/6...)
- [ ] `StepIndicator` — Visual progress bar
- [ ] `BusinessNameForm` — Text input + validation
- [ ] `BrandingForm` — Drag-drop image uploaders
- [ ] `DescriptionForm` — Textarea with character count
- [ ] `ContactForm` — Email + phone inputs
- [ ] `CategoriesForm` — 6 category checkboxes with icons
- [ ] `ServiceAreasForm` — ZIP code list with add/remove/toggle

### Proposal Compliance (Section 6)

| Feature | Implementation |
|---------|----------------|
| Enter Business Name | Step 1 |
| Upload Logo and Cover Image | Step 2 with ImageUploader |
| Write Business Description | Step 3 |
| Add Contact Details | Step 4 |
| Select service categories | Step 5 with all 6 options |
| Define service areas | Step 6 with ZIP codes |
| Add multiple regions | ServiceAreasForm allows multiple |
| Toggle ON/OFF without deleting | Toggle switch per area |
| Multi-region operation | Multiple VendorServiceArea records |

---

## Phase 4: Vendor Listings Management (Days 7-10)

### Screens

| # | Route | Purpose |
|---|-------|---------|
| 4 | `/vendor/listings` | All listings table |
| 5 | `/vendor/listings/new` | Create listing (category selector) |
| 6 | `/vendor/listings/[id]/edit` | Edit existing listing |
| 7 | `/vendor/availability` | Weekly schedule config |

### 6 Category-Specific Forms (per Proposal Section 6)

| Category | Form Fields |
|----------|-------------|
| **Cleaning** | type (deep/laundry/office), description, rate, images, schedule |
| **Handyman** | type (plumbing/electrical/install), description, base rate, photos, schedule |
| **Groceries** | name, description, category, price, stock, image |
| **Beauty** | type (makeup/hair/nails/wellness), duration, pricing, photos, availability |
| **Rentals** | photos, address, beds, baths, amenities, rates (nightly/weekly/monthly), calendar |
| **Caregiving** | type (ride/companion), description, pricing, availability, service area |

### Components to Build

- [ ] `ListingsTable` — Sortable, filterable, actions column
- [ ] `ListingStatusBadge` — ACTIVE, PAUSED, DRAFT, SUSPENDED
- [ ] `ListingToggle` — ON/OFF switch
- [ ] `CategorySelector` — Initial category choice
- [ ] `CleaningListingForm` — CleaningType enum fields
- [ ] `HandymanListingForm` — HandymanType enum fields
- [ ] `GroceryListingForm` — Product fields
- [ ] `BeautyListingForm` — BeautyType enum fields
- [ ] `RentalListingForm` — Property fields + calendar
- [ ] `CaregivingListingForm` — CaregivingType enum fields
- [ ] `AvailabilityCalendar` — Weekly schedule picker
- [ ] `ImageGalleryUploader` — Multi-image upload

### Proposal Compliance (Section 6)

| Feature | Implementation |
|---------|----------------|
| View all active listings | ListingsTable with status filter |
| Edit titles, descriptions, images, pricing | Edit form per category |
| Toggle listings ON/OFF | ListingToggle component |
| Delete listings | Delete action with confirm |
| Real-time updates | Refetch after mutation |
| Configure working days/hours | AvailabilityCalendar |
| Set per category or region | Category-specific schedule |
| Pause services temporarily | PAUSED status |

---

## Phase 5: Vendor Orders & Reviews (Days 11-13)

### Screens

| # | Route | Purpose |
|---|-------|---------|
| 8 | `/vendor/orders` | Incoming bookings/orders |
| 9 | `/vendor/orders/[id]` | Order detail + actions |
| 10 | `/vendor/reviews` | Customer reviews |
| 11 | `/vendor/performance` | Stats dashboard |

### Order Status Flow

```
PENDING → ACCEPTED → IN_PROGRESS → COMPLETED
    ↓         ↓           ↓
DECLINED  CANCELLED   CANCELLED
```

### Components to Build

- [ ] `OrdersTable` — Status filters, search, date range
- [ ] `OrderDetailCard` — Customer info, service details, schedule
- [ ] `StatusActions` — Accept, Decline, In Progress, Complete, Cancel
- [ ] `OrderTimeline` — Status history with timestamps
- [ ] `ReviewsGrid` — All reviews list
- [ ] `ReviewCard` — Rating, comment, customer, date
- [ ] `RatingDistribution` — Bar chart (5/4/3/2/1 stars)
- [ ] `PerformanceChart` — Bookings over time (recharts)
- [ ] `StatCard` — Metric with trend indicator

### Proposal Compliance (Section 6)

| Feature | Implementation |
|---------|----------------|
| View all incoming orders/requests | OrdersTable |
| View order details | OrderDetailCard |
| Manage status: Accept, Decline, In Progress, Completed, Cancel | StatusActions |
| System invites review after completion | Handled by mobile app |
| View completed orders count | StatCard |
| Track average rating | StatCard with RatingDisplay |
| Read reviews | ReviewsGrid |

---

## Phase 6: Vendor Subscription & Settings (Days 14-15)

### Screens

| # | Route | Purpose |
|---|-------|---------|
| 12 | `/vendor/subscription` | Plan management |
| 13 | `/vendor/settings` | Account settings |

### Components to Build

- [ ] `SubscriptionCard` — Current plan, status badge
- [ ] `SubscriptionStatusBadge` — TRIAL, TRIAL_ENDING, ACTIVE, EXPIRED, PAUSED
- [ ] `TrialCountdown` — Days remaining with progress bar
- [ ] `PlanDetails` — Features, pricing
- [ ] `BillingHistoryTable` — Past invoices with download
- [ ] `PaymentMethodCard` — Card on file
- [ ] `StripeCheckoutButton` — Subscribe/update payment
- [ ] `AccountSettingsForm` — Update profile, branding
- [ ] `DeleteAccountModal` — Confirmation flow

### Proposal Compliance (Section 6)

| Feature | Implementation |
|---------|----------------|
| 1-month free trial | TrialCountdown, TRIAL status |
| View status (Trial Active, Trial Ending Soon, Active, Expired) | SubscriptionStatusBadge |
| Countdown timer for trial days | TrialCountdown |
| Pause/cancel/reactivate subscription | Action buttons |
| Access billing history | BillingHistoryTable |
| Update profile/branding images | AccountSettingsForm |
| Manage subscriptions via Stripe | StripeCheckoutButton |
| Download receipts/invoices | Download links in table |
| Delete account option | DeleteAccountModal |
| Notifications for reported/suspended listings | Dashboard alerts |

---

## Phase 7: Admin Dashboard (Days 16-17)

### Screens

| # | Route | Purpose |
|---|-------|---------|
| 14 | `/admin` | Platform metrics dashboard |

### Dashboard Metrics (per Proposal Section 7)

| Metric | API Query |
|--------|-----------|
| Total registered customers | `COUNT(User WHERE role=CUSTOMER)` |
| Total registered business owners | `COUNT(Vendor)` |
| Active vendor subscriptions | `COUNT(Vendor WHERE subscriptionStatus=ACTIVE)` |
| Expired vendor subscriptions | `COUNT(Vendor WHERE subscriptionStatus=EXPIRED)` |
| Live listings count | `COUNT(*Listing WHERE status=ACTIVE)` |
| Reported listings awaiting review | `COUNT(Report WHERE status=PENDING)` |

### Components to Build

- [ ] `AdminDashboard` — Grid of metrics
- [ ] `MetricCard` — Large number, label, trend, icon
- [ ] `RecentActivityFeed` — Latest platform actions
- [ ] `QuickLinks` — Jump to common tasks
- [ ] `RevenueChart` — Subscription revenue over time
- [ ] `SubscriptionBreakdownChart` — Pie chart by status

### Proposal Compliance (Section 7)

| Feature | Implementation |
|---------|----------------|
| Total registered customers | MetricCard |
| Total registered business owners | MetricCard |
| Active and expired vendor subscriptions | MetricCard x2 |
| Live listings count | MetricCard |
| Reported listings awaiting review | MetricCard with link to /admin/reports |

---

## Phase 8: Admin Vendor & Customer Management (Days 18-19)

### Screens

| # | Route | Purpose |
|---|-------|---------|
| 15 | `/admin/vendors` | All vendors list |
| 16 | `/admin/vendors/[id]` | Vendor detail + actions |
| 17 | `/admin/customers` | All customers list |
| 18 | `/admin/customers/[id]` | Customer detail + actions |

### Components to Build

- [ ] `VendorsTable` — Search, filter by category/status
- [ ] `VendorDetailView` — Profile, listings, areas, activity log
- [ ] `VendorActions` — Suspend, Reactivate buttons
- [ ] `VendorActivityLog` — Recent actions timeline
- [ ] `CustomersTable` — Search, filter
- [ ] `CustomerDetailView` — Profile, orders, bookings history
- [ ] `CustomerActions` — Block, Restore buttons

### Proposal Compliance (Section 7)

| Feature | Implementation |
|---------|----------------|
| View all vendors with complete profiles | VendorsTable + VendorDetailView |
| Check subscription status (Trial Active, Active, Expired) | Status column + badge |
| Suspend/deactivate accounts for violations | VendorActions |
| Reactivate after resolution | VendorActions |
| Access listings, areas served, activity logs | VendorDetailView tabs |
| Filter by category or subscription tier | VendorsTable filters |
| View all registered customer accounts | CustomersTable |
| Deactivate/block spam users | CustomerActions |
| Restore accounts after review | CustomerActions |
| Review order histories and bookings | CustomerDetailView |

---

## Phase 9: Admin Listings & Moderation (Days 20-21)

### Screens

| # | Route | Purpose |
|---|-------|---------|
| 19 | `/admin/listings` | All platform listings |
| 20 | `/admin/reports` | Reported content queue |
| 21 | `/admin/reports/[id]` | Report detail + decision |

### Report Status Flow

```
PENDING → REVIEWED → APPROVED (listing restored)
              ↓
         REMOVED (listing deleted)
```

### Components to Build

- [ ] `AllListingsTable` — Cross-vendor, cross-category
- [ ] `ListingFilters` — Category, vendor, area, status
- [ ] `ListingActions` — Disable, Restore, View
- [ ] `ReportsTable` — Pending reports queue
- [ ] `ReportDetailView` — Listing info, reason, comment
- [ ] `ModerationActions` — Approve & Restore, Remove Permanently
- [ ] `ModerationLogTable` — Audit trail of decisions
- [ ] `VendorNotificationToggle` — Auto-notify vendor

### Proposal Compliance (Section 7)

| Feature | Implementation |
|---------|----------------|
| View all vendor listings across categories | AllListingsTable |
| Search/filter by category, vendor, geographic area | ListingFilters |
| Disable/hide violating listings | ListingActions |
| Restore after corrections | ListingActions |
| View all reported listings | ReportsTable |
| Review reason and comments | ReportDetailView |
| Mark as Approved and Restored | ModerationActions |
| Mark as Removed Permanently | ModerationActions |
| Optional automated notification to vendor | VendorNotificationToggle |
| Maintain moderation log for auditing | ModerationLogTable |

---

## Phase 10: Michelle's Listings & Subscriptions Monitor (Days 22-23)

### Screens

| # | Route | Purpose |
|---|-------|---------|
| 22 | `/admin/michelle` | Platform-owned listings |
| 23 | `/admin/michelle/new` | Create DoHuub listing |
| 24 | `/admin/michelle/[id]/edit` | Edit DoHuub listing |
| 25 | `/admin/subscriptions` | Monitor all vendor subscriptions |

### Components to Build

- [ ] `MichelleListingsTable` — Platform-owned services
- [ ] `MichelleListingForm` — All 6 category types
- [ ] `RegionSelector` — Where listing appears first
- [ ] `PoweredByBadge` — "Powered by DoHuub" preview
- [ ] `ListingPriorityToggle` — Enable/disable
- [ ] `SubscriptionsTable` — All vendor subscriptions
- [ ] `SubscriptionFilters` — Trial, Active, Expired, Paused
- [ ] `SubscriptionAnalytics` — Revenue charts, trends

### Proposal Compliance (Section 7)

| Feature | Implementation |
|---------|----------------|
| Add/edit platform-owned services | MichelleListingForm |
| Assign geographic regions | RegionSelector |
| Listings appear **first** with "Powered by DoHuub" badge | API sorting + PoweredByBadge |
| Update descriptions, pricing, availability | MichelleListingForm |
| Enable/disable listings | ListingPriorityToggle |
| Monitor all vendor subscription statuses | SubscriptionsTable |
| Track Trial, Active, Expired, Paused states | SubscriptionFilters |
| Generate analytics on subscriptions and revenue | SubscriptionAnalytics |
| Update password | Settings page |
| Single admin account setup | Admin user management |

---

## Timeline Summary

| Phase | Days | Focus | Screens |
|-------|------|-------|---------|
| 1 | 1-2 | Project Setup | - |
| 2 | 3-4 | Auth (Login, Register, OTP) | 3 |
| 3 | 5-6 | Vendor Onboarding (6 steps) | 6 |
| 4 | 7-10 | Vendor Listings (6 forms) | 4 |
| 5 | 11-13 | Vendor Orders & Reviews | 4 |
| 6 | 14-15 | Vendor Subscription & Settings | 2 |
| 7 | 16-17 | Admin Dashboard | 1 |
| 8 | 18-19 | Admin Users (Vendors + Customers) | 4 |
| 9 | 20-21 | Admin Moderation | 3 |
| 10 | 22-23 | Michelle Listings + Subscriptions | 4 |
| **TOTAL** | **23 days** | | **31 routes** |

---

## API Endpoints Used

All endpoints exist in `apps/api/src/routes/`:

| Domain | Endpoint | Used By |
|--------|----------|---------|
| Auth | `POST /auth/register` | Register |
| Auth | `POST /auth/login` | Login |
| Auth | `POST /auth/verify-otp` | OTP |
| Auth | `GET /auth/me` | Session |
| Vendors | `GET/POST/PUT /vendors` | Onboarding, Profile |
| Vendors | `GET /vendors/:id` | Admin detail |
| Services | `GET/POST/PUT/DELETE /services/cleaning` | Listings |
| Services | `GET/POST/PUT/DELETE /services/handyman` | Listings |
| Services | `GET/POST/PUT/DELETE /services/beauty` | Listings |
| Services | `GET/POST/PUT/DELETE /services/groceries` | Listings |
| Services | `GET/POST/PUT/DELETE /services/rentals` | Listings |
| Services | `GET/POST/PUT/DELETE /services/caregiving` | Listings |
| Bookings | `GET/PUT /bookings` | Orders |
| Orders | `GET/PUT /orders` | Grocery orders |
| Reviews | `GET /reviews` | Reviews |
| Payments | `POST /payments` | Subscription |
| Users | `GET /users` | Admin customers |

---

## Database Models (Already Exist)

From `packages/database/prisma/schema.prisma`:

| Model | Used For |
|-------|----------|
| `User` | All users (CUSTOMER, VENDOR, ADMIN) |
| `UserProfile` | Name, avatar |
| `Vendor` | Business profile, `isMichelle` flag |
| `VendorCategory` | Service categories offered |
| `VendorServiceArea` | ZIP codes, regions |
| `VendorAvailability` | Weekly schedule |
| `VendorSubscription` | Stripe subscription |
| `BillingHistory` | Invoices |
| `CleaningListing` | Cleaning services |
| `HandymanListing` | Handyman services |
| `BeautyListing` | Beauty services |
| `GroceryListing` | Grocery products |
| `RentalListing` | Rental properties |
| `CaregivingListing` | Caregiving services |
| `Booking` | Service bookings |
| `Order` | Grocery orders |
| `Review` | Customer reviews |
| `Report` | Flagged content |
| `Notification` | System notifications |

---

## Success Criteria

1. **Vendor** can register, complete 6-step onboarding, create listings
2. **Vendor** can manage incoming orders (accept/decline/complete)
3. **Vendor** can view reviews and performance stats
4. **Vendor** can manage subscription (trial → active → renew)
5. **Admin** can view platform metrics dashboard
6. **Admin** can manage vendors (suspend/reactivate)
7. **Admin** can manage customers (block/restore)
8. **Admin** can moderate reported content
9. **Michelle's listings** appear first with "Powered by DoHuub" badge
10. **All 47 proposal features** for Business Portal (Section 6) implemented
11. **All 23 proposal features** for Admin Panel (Section 7) implemented

---

## Next Steps

1. Run Phase 1 setup commands
2. Install dependencies
3. Configure Tailwind + shadcn/ui
4. Set up NextAuth with existing API
5. Begin Phase 2: Authentication screens

---

*Ready to begin implementation.*

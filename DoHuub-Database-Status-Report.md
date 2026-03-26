# DoHuub Database Status Report

**Date:** February 23, 2026
**Project:** DoHuub Multi-Service Marketplace
**Database:** Supabase PostgreSQL (Project ID: `qiotpmjbhjpegylqgrwd`)

---

## Executive Summary

The database currently has **39 tables** covering core marketplace functionality. The mobile app UI (99 screens) is largely built and maps well to the existing schema. However, the **Rewards & Loyalty system** (4+ wireframe screens) has **zero database support** -- no tables exist for it. Additionally, several existing tables are missing fields required by the wireframe, RLS (Row Level Security) is disabled on all tables, and most tables have no seed/test data.

---

## 1. EXISTING TABLES (39 Total)

### Users & Authentication (5 tables)

| Table | Rows | Status | Notes |
|-------|------|--------|-------|
| User | 0 | Schema OK | Roles: CUSTOMER, VENDOR, ADMIN |
| UserProfile | 0 | Schema OK | firstName, lastName, avatar, dateOfBirth |
| Address | 0 | Schema OK | Types: HOME, WORK, DOCTOR, PHARMACY, OTHER |
| PaymentMethod | 0 | Schema OK | Stripe integration fields present |
| OtpVerification | 0 | Schema OK | Email-based OTP with expiry |

### Vendor Management (7 tables)

| Table | Rows | Status | Notes |
|-------|------|--------|-------|
| Vendor | 0 | Schema OK | Includes `isMichelle` flag for platform-owned listings |
| VendorCategory | 1 | Schema OK | Links vendors to 9 service categories |
| VendorServiceArea | 0 | Schema OK | Multi-region support with zip codes |
| VendorAvailability | 0 | Schema OK | Day-of-week schedule |
| VendorSubscription | 0 | Schema OK | Trial/Active/Paused/Expired/Cancelled |
| BillingHistory | 0 | Schema OK | Vendor billing records |
| VendorStore | 8 | Schema OK | Multi-store per vendor |

### Regions (2 tables)

| Table | Rows | Status | Notes |
|-------|------|--------|-------|
| Region | 0 | Schema OK | US/Canada support |
| VendorStoreRegion | 0 | Schema OK | Junction table for store-region mapping |

### Service Listings (11 tables)

| Table | Rows | Status | Notes |
|-------|------|--------|-------|
| CleaningListing | 0 | Schema OK | Types: DEEP_CLEANING, LAUNDRY, OFFICE_CLEANING |
| HandymanListing | 0 | Schema OK | Types: PLUMBING, ELECTRICAL, INSTALLATION, GENERAL_REPAIR |
| BeautyListing | 0 | Schema OK | Types: MAKEUP, HAIR, NAILS, WELLNESS |
| BeautyProductListing | 8 | Schema OK | Cosmetics/skincare products |
| GroceryListing | 0 | Schema OK | Grocery items with stock tracking |
| FoodListing | 8 | Schema OK | Restaurant/prepared food items |
| RentalListing | 0 | Schema OK | Properties with pricing tiers (night/week/month) |
| RentalAvailability | 0 | Schema OK | Calendar availability per rental |
| CaregivingListing | 0 | DEPRECATED | Replaced by RideAssistance + Companionship |
| RideAssistanceListing | 3 | Schema OK | Senior transport, doctor visits, pharmacy pickups |
| CompanionshipListing | 3 | Schema OK | Wellness visits, personal assistance |

### Bookings & Orders (6 tables)

| Table | Rows | Status | Notes |
|-------|------|--------|-------|
| Booking | 0 | Missing Fields | See gaps below |
| BookingStatusHistory | 0 | Schema OK | Status timeline tracking |
| Order | 0 | Missing Fields | See gaps below |
| OrderItem | 0 | Schema OK | Supports grocery, food, beauty product types |
| Cart | 0 | Schema OK | Single-vendor cart lock |
| CartItem | 0 | Schema OK | Listing + quantity |

### Payments & Transactions (1 table)

| Table | Rows | Status | Notes |
|-------|------|--------|-------|
| Transaction | 0 | Schema OK | Stripe integration, platform fee split, refund support |

### Reviews & Reports (2 tables)

| Table | Rows | Status | Notes |
|-------|------|--------|-------|
| Review | 0 | Missing Fields | See gaps below |
| Report | 0 | Schema OK | Listing report with admin review workflow |

### Notifications & Chat (4 tables)

| Table | Rows | Status | Notes |
|-------|------|--------|-------|
| Notification | 0 | Schema OK | Push + in-app, broadcast support |
| PushToken | 0 | Schema OK | iOS/Android/Web tokens |
| ChatConversation | 0 | Schema OK | AI chat sessions |
| ChatMessage | 0 | Schema OK | User/assistant message history |

### Platform Config (1 table)

| Table | Rows | Status | Notes |
|-------|------|--------|-------|
| PlatformSettings | 0 | Schema OK | Fees, limits, support contact, feature flags |

---

## 2. MISSING TABLES (Not in Database)

These tables are required by the wireframe UI but **do not exist** in the database.

### Rewards & Loyalty System (CRITICAL - 5 tables needed)

The wireframe includes a full Rewards Wallet screen, Points History, Referral Program, and Streak/Milestone tracking. **None of this has any database support.**

| Missing Table | Purpose | Wireframe Screens Affected |
|---------------|---------|---------------------------|
| **RewardsWallet** | Stores user's point balance (total, pending, expiring) | Profile Screen, Rewards Wallet Screen |
| **PointsTransaction** | History of earned/redeemed/expired/bonus points | Points History Screen, Booking Confirmation |
| **Referral** | Referral codes, links, tracking referrer/referee | Referral Screen, Referral Code Setup |
| **UserStreak** | Weekly booking streak data (current, longest, milestones) | Rewards Wallet Screen |
| **CategoryMilestone** | Per-category order count milestones for bonus points | Rewards Wallet Screen |

**Required Schema (Proposed):**

```sql
-- RewardsWallet
CREATE TABLE "RewardsWallet" (
  id TEXT PRIMARY KEY,
  "userId" TEXT UNIQUE NOT NULL REFERENCES "User"(id),
  "totalPoints" INTEGER DEFAULT 0,
  "pendingPoints" INTEGER DEFAULT 0,
  "expiringPoints" INTEGER DEFAULT 0,
  "expiringDate" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP
);

-- PointsTransaction
CREATE TABLE "PointsTransaction" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id),
  type TEXT NOT NULL, -- 'earned','redeemed','expired','referral_bonus','signup_bonus','streak_bonus','milestone_bonus'
  amount INTEGER NOT NULL,
  description TEXT,
  "bookingId" TEXT REFERENCES "Booking"(id),
  "orderId" TEXT REFERENCES "Order"(id),
  "vendorName" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referral
CREATE TABLE "Referral" (
  id TEXT PRIMARY KEY,
  "referrerUserId" TEXT NOT NULL REFERENCES "User"(id),
  "refereeUserId" TEXT REFERENCES "User"(id),
  "referralCode" TEXT UNIQUE NOT NULL,
  "referralLink" TEXT,
  status TEXT DEFAULT 'pending', -- 'pending','completed'
  "pointsEarned" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UserStreak
CREATE TABLE "UserStreak" (
  id TEXT PRIMARY KEY,
  "userId" TEXT UNIQUE NOT NULL REFERENCES "User"(id),
  "currentStreak" INTEGER DEFAULT 0,
  "longestStreak" INTEGER DEFAULT 0,
  "lastActiveWeek" TEXT, -- e.g., '2026-W08'
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP
);

-- CategoryMilestone
CREATE TABLE "CategoryMilestone" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id),
  category TEXT NOT NULL, -- ServiceCategory enum
  "orderCount" INTEGER DEFAULT 0,
  "targetMilestone" INTEGER NOT NULL, -- e.g., 5, 10, 25
  "pointsEarned" INTEGER DEFAULT 0,
  achieved BOOLEAN DEFAULT FALSE,
  "achievedDate" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Password Reset (1 table needed)

| Missing Table | Purpose | Wireframe Screens Affected |
|---------------|---------|---------------------------|
| **PasswordReset** | Token-based password reset flow | Email Sign-In (Forgot Password link) |

The wireframe has a "Forgot Password?" link on the email sign-in screen, but there is no password reset table or mechanism in the database.

---

## 3. MISSING FIELDS ON EXISTING TABLES

### Booking Table

| Missing Field | Type | Purpose | Wireframe Screen |
|---------------|------|---------|-----------------|
| `paymentMethodId` | TEXT (FK) | Links booking to payment card used | Booking Form, Payment Screen |
| `referenceNumber` | TEXT | Human-readable booking reference (e.g., "BK-2026-001") | Booking Confirmation Screen |
| `pointsEarned` | INTEGER | Points earned from this booking | Booking Confirmation, My Bookings |
| `pointsRedeemed` | INTEGER | Points redeemed on this booking | Payment Screen, Booking Confirmation |

### Order Table

| Missing Field | Type | Purpose | Wireframe Screen |
|---------------|------|---------|-----------------|
| `paymentMethodId` | TEXT (FK) | Links order to payment card used | Checkout Screen |
| `orderNumber` | TEXT | Human-readable order number | Order Confirmation, Order Tracking |
| `pointsEarned` | INTEGER | Points earned from this order | Order Confirmation |
| `pointsRedeemed` | INTEGER | Points redeemed on this order | Checkout Screen |

### Review Table

| Missing Field | Type | Purpose | Wireframe Screen |
|---------------|------|---------|-----------------|
| `wouldRecommend` | BOOLEAN | "Would you recommend?" yes/no toggle | Review Submission Screen |

### User Table

| Missing Field | Type | Purpose | Wireframe Screen |
|---------------|------|---------|-----------------|
| `phoneCountryCode` | TEXT | Country code separate from phone number | Profile Setup, Edit Profile |

---

## 4. SECURITY CONCERNS

### Row Level Security (RLS) - ALL DISABLED

| Issue | Severity | Details |
|-------|----------|---------|
| RLS disabled on ALL 39 tables | **HIGH** | Any authenticated Supabase client can read/write any row in any table. Users could access other users' data, modify bookings, etc. |

**Recommendation:** Enable RLS on all tables and create policies for:
- Users can only read/write their own data
- Vendors can only manage their own listings/bookings
- Admin has full access
- Public read access for active listings only

---

## 5. DATA / SEED STATUS

### Tables With Data (5 of 39)

| Table | Row Count | Notes |
|-------|-----------|-------|
| VendorCategory | 1 | Single category entry |
| VendorStore | 8 | 8 stores created |
| FoodListing | 8 | 8 food items |
| BeautyProductListing | 8 | 8 beauty products |
| RideAssistanceListing | 3 | 3 ride providers |
| CompanionshipListing | 3 | 3 companions |

### Tables With Zero Data (34 of 39)

All other tables including User, Vendor, Booking, Order, Review, etc. have **0 rows**. The app cannot be demo'd or tested without seed data.

**Recommendation:** Create seed data for:
- At least 1 admin user (Michelle) + 2-3 customer accounts
- At least 3-5 vendors with Michelle's vendor marked `isMichelle: true`
- Listings across all 9 categories
- Sample bookings in different statuses
- Sample reviews
- Region data for at least 2-3 cities
- PlatformSettings with default values

---

## 6. WIREFRAME vs DATABASE FEATURE MATRIX

| Wireframe Feature | Database Support | App Code | Status |
|-------------------|-----------------|----------|--------|
| User Registration (Email + OTP) | User + OtpVerification | Complete | READY |
| Google Sign-In | User (firebaseUid field) | TODO in code | PARTIAL - needs code |
| Profile Setup | UserProfile | Complete | READY |
| Address Management | Address | Complete | READY |
| Payment Cards | PaymentMethod | TODO in code (Stripe) | PARTIAL - needs Stripe |
| Home Dashboard (6 categories) | VendorCategory + Listings | Complete | READY |
| Cleaning Services | CleaningListing | Complete | READY (needs data) |
| Handyman Services | HandymanListing | Complete | READY (needs data) |
| Beauty Services | BeautyListing | Complete | READY (needs data) |
| Beauty Products | BeautyProductListing | Complete | READY |
| Groceries | GroceryListing | Complete | READY (needs data) |
| Food Ordering | FoodListing | Complete | READY |
| Rental Properties | RentalListing + RentalAvailability | Complete | READY (needs data) |
| Ride Assistance | RideAssistanceListing | Complete | READY |
| Companionship | CompanionshipListing | Complete | READY |
| Booking Flow | Booking + BookingStatusHistory | Complete | READY (needs data) |
| Order Flow (Cart) | Cart + CartItem + Order + OrderItem | Complete | READY |
| Payments (Stripe) | Transaction + PaymentMethod | TODO in code | PARTIAL - needs Stripe |
| Reviews & Ratings | Review | Complete | READY |
| Report Listing | Report | Complete | READY |
| AI Chat Assistant | ChatConversation + ChatMessage | Complete | READY |
| Push Notifications | Notification + PushToken | Partial | PARTIAL |
| Vendor Subscriptions | VendorSubscription + BillingHistory | Backend ready | READY |
| Michelle Priority Listings | Vendor.isMichelle | Complete | READY |
| "Powered by DoHuub" Badge | Vendor.isMichelle | Complete | READY |
| **Rewards Wallet** | **NO TABLE** | **Not built** | **MISSING** |
| **Points History** | **NO TABLE** | **Not built** | **MISSING** |
| **Referral Program** | **NO TABLE** | **Not built** | **MISSING** |
| **Streak Tracking** | **NO TABLE** | **Not built** | **MISSING** |
| **Category Milestones** | **NO TABLE** | **Not built** | **MISSING** |
| **Forgot Password** | **NO TABLE** | **Not built** | **MISSING** |
| Location-based filtering | Region + VendorStoreRegion | Backend ready | NEEDS WIRING |
| Vendor Schedule (dynamic) | VendorAvailability | Backend ready | NEEDS WIRING |

---

## 7. PRIORITY ACTION ITEMS

### P0 - Critical (Blocking launch)

1. **Enable RLS** on all tables with proper policies
2. **Create seed data** for testing and demo purposes
3. **Add missing Booking/Order fields** (paymentMethodId, referenceNumber, points fields)
4. **Stripe payment integration** - Transaction table is ready but code needs wiring

### P1 - High (Required by wireframe)

5. **Create Rewards system tables** (RewardsWallet, PointsTransaction, Referral, UserStreak, CategoryMilestone)
6. **Build Rewards UI screens** in mobile app to match wireframe
7. **Create PasswordReset table** and forgot password flow
8. **Populate Region table** with supported cities

### P2 - Medium (Functional gaps)

9. **Google Sign-In** integration (OAuth)
10. **Image upload** infrastructure (Supabase Storage for profile photos, review images, listing images)
11. **Push notification** wiring (PushToken table exists, needs Expo push setup)
12. **Geocoding integration** for address lookup

### P3 - Low (Polish)

13. **Vendor schedule** dynamic loading from VendorAvailability
14. **Location-based filtering** using Region + VendorStoreRegion
15. **Review.wouldRecommend** field addition
16. **User.phoneCountryCode** field addition

---

## 8. SUMMARY TABLE

| Metric | Count |
|--------|-------|
| Total DB tables | 39 |
| Tables with data | 5 |
| Tables with zero data | 34 |
| Missing tables (needed by wireframe) | 6 |
| Missing fields on existing tables | 9 |
| Tables with RLS enabled | 0 of 39 |
| Mobile app screens built | 87 |
| Wireframe screens total | ~99 |
| Screens fully database-backed | ~80 |
| Screens with NO database support | ~8 (Rewards/Referral/Streak) |

---

*Report generated for DoHuub development team review.*

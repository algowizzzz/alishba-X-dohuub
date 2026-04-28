# Database Schema Updates Required - Comprehensive List

**Date:** January 17, 2026
**Last Updated:** January 18, 2026
**Status:** Schema Gap Analysis Complete (Revised)
**Priority:** CRITICAL - Required for Backend Build

---

## Executive Summary

This document identifies **all database schema gaps and required updates** to support the backend implementation as specified in `BACKEND_REQUIREMENTS_ANALYSIS.md`.

**Total Changes Required:**
- **2 new enums** (VendorStatus, UserStatus)
- **5 enum updates** (ReportStatus, OrderStatus, ListingStatus ✅ already done, ServiceCategory - remove CAREGIVING)
- **18+ field additions** across 11 models
- **7 relation additions** to VendorStore model (including orders)
- **1 model deprecation** (CaregivingListing)
- **Multiple field type changes** (optional/nullable adjustments)

**Impact:** These changes are **CRITICAL** - existing API routes in `admin.ts` and other route files **will fail** without these schema updates.

---

## Priority Matrix

| Priority | Category | Count | Impact |
|----------|----------|-------|--------|
| 🔴 **CRITICAL** | Schema Mismatches (Code expects, Schema missing) | 7 | **Blocking** - API routes will fail |
| 🟡 **HIGH** | Missing Required Fields | 7 | **Functional** - Features won't work |
| 🟢 **MEDIUM** | Enum Alignment | 3 | **Consistency** - Frontend/backend mismatch |

---

## 🔴 CRITICAL: Schema Mismatches (Code vs Schema)

These mismatches cause **runtime errors** because API code expects fields that don't exist in the schema.

### 1. Vendor Model - Missing `status` Field

**Problem:** `admin.ts` uses `vendor.status` (lines 143, 237, 279, 633) but schema only has `isActive`.

**Current Schema:**
```prisma
model Vendor {
  // ... existing fields
  isActive Boolean @default(true)  // Only this exists
}
```

**API Code Expects:**
```typescript
// admin.ts:143
status: 'APPROVED',

// admin.ts:279
data: { status: 'SUSPENDED' },

// admin.ts:633
if (!status || !['PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'].includes(status))
```

**Required Fix:**
```prisma
enum VendorStatus {
  PENDING
  APPROVED
  SUSPENDED
  REJECTED
}

model Vendor {
  // ... existing fields
  status        VendorStatus @default(PENDING)  // ADD THIS
  isActive      Boolean       @default(true)     // Keep for backward compatibility
  
  @@index([status])
}
```

**Migration Notes:**
- Map existing `isActive: true` → `status: APPROVED`
- Map existing `isActive: false` → `status: SUSPENDED`
- New vendors default to `PENDING` (require admin approval)

---

### 2. User Model - Missing `status` Field

**Problem:** `admin.ts` uses `user.status` (line 766) but schema only has `isActive`.

**Current Schema:**
```prisma
model User {
  // ... existing fields
  isActive Boolean @default(true)  // Only this exists
}
```

**API Code Expects:**
```typescript
// admin.ts:668
if (status) {
  where.status = status;
}

// admin.ts:766
if (!status || !['ACTIVE', 'SUSPENDED', 'BANNED'].includes(status))
```

**Required Fix:**
```prisma
enum UserStatus {
  ACTIVE
  SUSPENDED
  BANNED
}

model User {
  // ... existing fields
  status        UserStatus @default(ACTIVE)  // ADD THIS
  isActive      Boolean    @default(true)     // Keep for backward compatibility
  
  @@index([status])
}
```

**Migration Notes:**
- Map existing `isActive: true` → `status: ACTIVE`
- Map existing `isActive: false` → `status: SUSPENDED`
- `BANNED` status for admin-moderated permanent bans

---

### 3. Report Model - Enum and Relation Mismatches

**Problem 1:** `admin.ts` expects `ReportStatus.RESOLVED, DISMISSED` but schema has `APPROVED, REMOVED`.

**Current Schema:**
```prisma
enum ReportStatus {
  PENDING
  REVIEWED
  APPROVED   // Code expects RESOLVED
  REMOVED    // Code expects DISMISSED
}
```

**API Code Expects:**
```typescript
// admin.ts:1023
if (!status || !['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'].includes(status))
```

**Required Fix:**
```prisma
enum ReportStatus {
  PENDING
  REVIEWED
  RESOLVED   // CHANGE from APPROVED
  DISMISSED  // CHANGE from REMOVED
}
```

**Problem 2:** `admin.ts` line 992 references `report.reporter` but schema has `report.user`.

**Current Schema:**
```prisma
model Report {
  // ... existing fields
  user User @relation(fields: [userId], references: [id])
}
```

**API Code Expects:**
```typescript
// admin.ts:992
include: {
  reporter: { select: { firstName: true, lastName: true, email: true } }
}
```

**Options:**
1. **Keep `user` relation** and update API code to use `user` instead of `reporter`
2. **Add alias relation** named `reporter` (Prisma doesn't support aliases directly)
3. **Rename field** in schema from `user` to `reporter` (requires migration)

**Recommended Fix (Option 3):**
```prisma
model Report {
  // ... existing fields
  reporterId String
  reporter   User   @relation(name: "ReportReporter", fields: [reporterId], references: [id])
  
  // Update field name
  // userId → reporterId
  // user → reporter
}
```

**Migration Notes:**
- Rename `userId` → `reporterId` in data migration
- Update `ReportStatus` enum values in database
- Map existing `APPROVED` → `RESOLVED`
- Map existing `REMOVED` → `DISMISSED`

---

### 4. Notification Model - `userId` Should Be Optional

**Problem:** Admin push notifications (line 1060) create notifications without `userId` but schema requires it.

**Current Schema:**
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String   // Required - blocks broadcast notifications
  // ... existing fields
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**API Code Behavior:**
```typescript
// admin.ts:1060 - Creates notification without userId for broadcast
const notification = await prisma.notification.create({
  data: {
    type: 'PUSH',
    title,
    body,
    data: data || {},
    // No userId provided for broadcast notifications
  },
});
```

**Required Fix:**
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String?  // CHANGE to optional for broadcast notifications
  // ... existing fields
  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Optional: Add targeting fields for broadcast notifications
  targetType String?  // 'ALL', 'VENDORS', 'CUSTOMERS', 'SPECIFIC'
  targetIds  String[] // Array of user IDs for specific targeting
}
```

**Migration Notes:**
- Change `userId` to nullable
- Existing notifications keep their `userId`
- New broadcast notifications can have `userId = null`

---

### 5. Order Model - Missing `storeId` Field

**Problem:** Frontend and vendor order management shows store context, but Order model lacks `storeId`.

**Current Schema:**
```prisma
model Order {
  id        String @id @default(cuid())
  userId    String
  vendorId  String
  addressId String
  // ... existing fields
  // Missing: storeId
}
```

**Frontend Expects:**
```typescript
// VendorOrders.tsx shows store name per order
{
  orderNumber: string;
  storeName: string;  // Requires storeId relation
  customerName: string;
  // ...
}
```

**Required Fix:**
```prisma
model Order {
  id        String      @id @default(cuid())
  userId    String
  vendorId  String
  storeId   String?     // ADD THIS - nullable for backward compatibility
  addressId String
  // ... existing fields
  
  store     VendorStore? @relation(fields: [storeId], references: [id])
  
  @@index([storeId])
}
```

**Migration Notes:**
- Add `storeId` as nullable initially
- Migrate existing orders: derive `storeId` from order items' listing stores if possible
- New orders should set `storeId` when created

---

### 6. User Model - Missing `passwordHash` Field

**Problem:** `settings.ts` password change endpoint uses `user.passwordHash` but schema doesn't have it.

**Current Schema:**
```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  phone             String?
  firebaseUid       String?   @unique
  // ... other fields
  // Missing: passwordHash for password-based auth
}
```

**API Code Expects:**
```typescript
// settings.ts:248-249
if (user.passwordHash) {
  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

// settings.ts:256-261
const passwordHash = await bcrypt.hash(newPassword, 10);
await prisma.user.update({
  where: { id: user.id },
  data: { passwordHash },
});
```

**Required Fix:**
```prisma
model User {
  // ... existing fields
  passwordHash      String?   // ADD THIS - for password-based authentication
}
```

**Migration Notes:**
- Add `passwordHash` as nullable (existing users use Firebase auth)
- New users can set password during registration
- Supports hybrid auth (Firebase + password-based)

---

### 7. Vendor Model - Missing `website` Field

**Problem:** `settings.ts` references `vendor.website` but schema doesn't have it.

**Current Schema:**
```prisma
model Vendor {
  id                 String             @id @default(cuid())
  userId             String             @unique
  businessName       String
  description        String?
  logo               String?
  coverImage         String?
  contactEmail       String?
  contactPhone       String?
  // ... other fields
  // Missing: website
}
```

**API Code Expects:**
```typescript
// settings.ts:65
website: user.vendor.website,

// settings.ts:130, 138
if (businessName !== undefined || description !== undefined || logo !== undefined || businessPhone !== undefined || website !== undefined) {
  ...(website !== undefined && { website }),
```

**Required Fix:**
```prisma
model Vendor {
  // ... existing fields
  website            String?   // ADD THIS - vendor website URL
}
```

**Note:** The code also uses `phone` (line 64) but schema has `contactPhone`. Either:
- Add a `phone` alias field, OR
- The code at line 137 already maps `businessPhone` → `phone`, which works with `contactPhone`

**Recommendation:** Keep using `contactPhone` in schema, the API code maps `businessPhone` to it correctly.

---

## 🟡 HIGH PRIORITY: Missing Required Fields

### 8. VendorSubscription - Missing Plan Management Fields

**Gap:** Subscription management routes need `planId`, `trialEndDate`, and `cancellationReason` but schema lacks them.

**Current Schema:**
```prisma
model VendorSubscription {
  id                String             @id @default(cuid())
  vendorId          String             @unique
  stripeSubscriptionId String?
  status            SubscriptionStatus @default(TRIAL)
  currentPeriodStart DateTime?
  currentPeriodEnd   DateTime?
  cancelledAt        DateTime?
  // Missing: planId, trialEndDate, cancellationReason
}
```

**API Requirements:**
- `/api/v1/subscription/plans` - Needs `planId` to reference plan
- `/api/v1/vendor/subscription/change-plan` - Needs `planId` to track plan changes
- `/api/v1/vendor/subscription/cancel` - Needs `cancellationReason`

**Required Fix:**
```prisma
model VendorSubscription {
  // ... existing fields
  planId             String?            // ADD: Plan identifier (Basic, Professional, Enterprise)
  trialEndDate       DateTime?          // ADD: When trial period ends
  cancellationReason String?            // ADD: Why subscription was cancelled
  
  @@index([planId])
}
```

**Optional: Create SubscriptionPlan model:**
```prisma
model SubscriptionPlan {
  id            String   @id @default(cuid())
  name          String   @unique  // "Basic", "Professional", "Enterprise"
  price         Float
  currency      String   @default("USD")
  billingPeriod String   @default("monthly")  // "monthly", "yearly"
  features      String[] // Array of feature strings
  listingsLimit Int?
  storesLimit   Int?
  isPopular     Boolean  @default(false)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model VendorSubscription {
  // ... existing fields
  planId  String?
  plan    SubscriptionPlan? @relation(fields: [planId], references: [id])
}
```

---

### 9. CleaningListing - Missing `whatsIncluded` Field

**Gap:** Frontend form (`VendorCleaningServiceForm.tsx`) has `whatsIncluded` array but schema doesn't.

**Current Schema:**
```prisma
model CleaningListing {
  id           String        @id @default(cuid())
  vendorId     String
  title        String
  description  String
  cleaningType CleaningType
  basePrice    Float
  priceUnit    String
  images       String[]
  duration     Int?
  // Missing: whatsIncluded
}
```

**Frontend Data:**
```typescript
whatsIncluded: ["Professional equipment & supplies", "Trained professionals"]
```

**Required Fix:**
```prisma
model CleaningListing {
  // ... existing fields
  whatsIncluded String[] @default([])  // ADD THIS
}
```

---

### 10. HandymanListing - Missing `whatsIncluded` Field

**Gap:** Frontend form expects `whatsIncluded` array but schema doesn't have it.

**Current Schema:**
```prisma
model HandymanListing {
  id           String        @id @default(cuid())
  vendorId     String
  title        String
  description  String
  handymanType HandymanType
  basePrice    Float
  priceUnit    String
  images       String[]
  // Missing: whatsIncluded
}
```

**Required Fix:**
```prisma
model HandymanListing {
  // ... existing fields
  whatsIncluded String[] @default([])  // ADD THIS
}
```

---

### 11. VendorStore - Missing Listing Type Relations

**Gap:** `VendorStore` only relates to 4 listing types but needs all 9.

**Current Relations:**
```prisma
model VendorStore {
  // ... existing fields
  // Only has:
  foodListings            FoodListing[]
  beautyProductListings   BeautyProductListing[]
  rideAssistanceListings  RideAssistanceListing[]
  companionshipListings   CompanionshipListing[]
  
  // Missing:
  // cleaningListings
  // handymanListings
  // beautyListings
  // groceryListings
  // rentalListings
}
```

**Required Fix:**
```prisma
model VendorStore {
  // ... existing fields
  
  // ADD MISSING RELATIONS:
  cleaningListings        CleaningListing[]
  handymanListings        HandymanListing[]
  beautyListings          BeautyListing[]
  groceryListings         GroceryListing[]
  rentalListings          RentalListing[]
  
  // Keep existing:
  foodListings            FoodListing[]
  beautyProductListings   BeautyProductListing[]
  rideAssistanceListings  RideAssistanceListing[]
  companionshipListings   CompanionshipListing[]
}
```

**Note:** This requires adding `storeId` field to the missing listing models (see #10).

---

### 12. Listing Models - Missing `storeId` Relations

**Gap:** Only 4 listing models have `storeId`, but all 9 should have it for store-based organization.

**Models WITH `storeId` (already implemented):**
- ✅ `FoodListing`
- ✅ `BeautyProductListing`
- ✅ `RideAssistanceListing`
- ✅ `CompanionshipListing`

**Models MISSING `storeId` (need to add):**
- ❌ `CleaningListing`
- ❌ `HandymanListing`
- ❌ `BeautyListing`
- ❌ `GroceryListing`
- ❌ `RentalListing`

**Required Fix (for each missing model):**

```prisma
// CleaningListing
model CleaningListing {
  // ... existing fields
  storeId String?  // ADD THIS
  store   VendorStore? @relation(fields: [storeId], references: [id])
  
  @@index([storeId])
}

// HandymanListing
model HandymanListing {
  // ... existing fields
  storeId String?  // ADD THIS
  store   VendorStore? @relation(fields: [storeId], references: [id])
  
  @@index([storeId])
}

// BeautyListing
model BeautyListing {
  // ... existing fields
  storeId String?  // ADD THIS
  store   VendorStore? @relation(fields: [storeId], references: [id])
  
  @@index([storeId])
}

// GroceryListing
model GroceryListing {
  // ... existing fields
  storeId String?  // ADD THIS
  store   VendorStore? @relation(fields: [storeId], references: [id])
  
  @@index([storeId])
}

// RentalListing
model RentalListing {
  // ... existing fields
  storeId String?  // ADD THIS
  store   VendorStore? @relation(fields: [storeId], references: [id])
  
  @@index([storeId])
}
```

**Migration Notes:**
- Add `storeId` as nullable for backward compatibility
- Existing listings will have `storeId = null` initially
- Vendors can optionally assign listings to stores later
- New listings should set `storeId` when created

---

### 13. VendorServiceArea - Missing Canada Support Fields

**Gap:** Frontend supports Canadian cities but `VendorServiceArea` lacks `province` and proper `country` fields.

**Current Schema:**
```prisma
model VendorServiceArea {
  id        String   @id @default(cuid())
  vendorId  String
  name      String
  zipCodes  String[]
  city      String
  state     String   // Required - blocks Canadian provinces
  isActive  Boolean  @default(true)
  // Missing: province, country, countryCode
}
```

**Frontend Requirements:**
```typescript
// Regions include:
{ name: "Toronto, ON", province: "ON", country: "Canada", countryCode: "CA" }
{ name: "New York, NY", state: "NY", country: "USA", countryCode: "US" }
```

**Required Fix:**
```prisma
model VendorServiceArea {
  id          String   @id @default(cuid())
  vendorId    String
  name        String
  zipCodes    String[]
  city        String
  state       String?  // CHANGE to optional (US states)
  province    String?  // ADD: Canadian provinces (ON, BC, QC, etc.)
  country     String   @default("USA")  // UPDATE: Support "Canada"
  countryCode String   @default("US")   // ADD: "US" or "CA"
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  vendor Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  
  @@index([vendorId])
  @@index([country, city])
}
```

**Migration Notes:**
- Change `state` to nullable
- Add `province` as nullable
- Set `country = "USA"` and `countryCode = "US"` for existing records
- Add `country` and `countryCode` fields
- Update `Region` model already has these fields - align `VendorServiceArea` with `Region`

---

## 🟢 MEDIUM PRIORITY: Enum Alignment

### 14. OrderStatus - Frontend Mismatch

**Gap:** Frontend uses `ACCEPTED`, `IN_PROGRESS`, `COMPLETED` but schema has different values.

**Current Schema:**
```prisma
enum OrderStatus {
  PENDING
  CONFIRMED      // Frontend expects ACCEPTED
  PREPARING      // Could map to IN_PROGRESS
  OUT_FOR_DELIVERY
  DELIVERED      // Frontend expects COMPLETED
  CANCELLED
}
```

**Frontend Expects (VendorOrders.tsx):**
```typescript
status: "ACCEPTED" | "IN_PROGRESS" | "COMPLETED"
// Tab filters: ACCEPTED, IN_PROGRESS, COMPLETED
```

**Required Fix:**
```prisma
enum OrderStatus {
  PENDING
  ACCEPTED      // CHANGE from CONFIRMED
  IN_PROGRESS   // ADD (or use PREPARING, but rename for consistency)
  OUT_FOR_DELIVERY  // Keep for delivery tracking
  COMPLETED     // CHANGE from DELIVERED
  CANCELLED
}
```

**Alternative (Keep both):**
```prisma
enum OrderStatus {
  PENDING
  ACCEPTED
  PREPARING      // Keep for internal tracking
  IN_PROGRESS    // Add for frontend alignment
  OUT_FOR_DELIVERY
  DELIVERED      // Keep for tracking
  COMPLETED      // Add for frontend alignment
  CANCELLED
}
```

**Recommended:** Use simpler enum and map internal states to frontend:
- `ACCEPTED` = Vendor accepted order
- `IN_PROGRESS` = Order being prepared/fulfilled
- `COMPLETED` = Order delivered/picked up

**Migration Notes:**
- Map existing `CONFIRMED` → `ACCEPTED`
- Map existing `PREPARING` or `OUT_FOR_DELIVERY` → `IN_PROGRESS`
- Map existing `DELIVERED` → `COMPLETED`

---

## 🟢 MEDIUM PRIORITY: Enum Cleanup

### 15. ServiceCategory Enum - Remove CAREGIVING Value

**Gap:** When deprecating `CaregivingListing` model, the `CAREGIVING` value in `ServiceCategory` enum should also be removed.

**Current Schema:**
```prisma
enum ServiceCategory {
  CLEANING
  HANDYMAN
  BEAUTY
  BEAUTY_PRODUCTS
  GROCERIES
  FOOD
  RENTALS
  RIDE_ASSISTANCE
  COMPANIONSHIP
  // CAREGIVING - Currently exists but deprecated
}
```

**Required Fix:**
```prisma
enum ServiceCategory {
  CLEANING
  HANDYMAN
  BEAUTY
  BEAUTY_PRODUCTS
  GROCERIES
  FOOD
  RENTALS
  RIDE_ASSISTANCE
  COMPANIONSHIP
  // REMOVE: CAREGIVING (deprecated, replaced by RIDE_ASSISTANCE and COMPANIONSHIP)
}
```

**Migration Notes:**
- Remove `CAREGIVING` from enum after CaregivingListing data is migrated
- Update any references in `VendorCategory` or `Booking` to use new values
- This should be done in Phase 5 (after CaregivingListing migration)

---

### 16. VendorStore - Missing Orders Relation

**Gap:** If `Order` gets `storeId`, `VendorStore` needs the reverse relation for querying.

**Current Schema:**
```prisma
model VendorStore {
  // ... existing fields
  // Has listing relations
  // Missing: orders relation
}
```

**Required Fix:**
```prisma
model VendorStore {
  // ... existing fields

  // ADD: Reverse relation for orders
  orders              Order[]
}
```

**Migration Notes:**
- This is automatically created when `Order.store` relation is added
- Enables querying all orders for a specific store
- Used by vendor dashboard to show store-specific order counts

---

## 🗑️ DEPRECATION: Models to Remove

### 17. CaregivingListing - Deprecated Model

**Status:** Should be removed after data migration. Replaced by separate `RideAssistanceListing` and `CompanionshipListing` models.

**Current Schema:**
```prisma
model CaregivingListing {
  id             String         @id @default(cuid())
  vendorId       String
  title          String
  description    String
  caregivingType CaregivingType  // RIDE_ASSISTANCE or COMPANIONSHIP_SUPPORT
  // ... existing fields
  bookings       Booking[]
}

enum CaregivingType {
  RIDE_ASSISTANCE
  COMPANIONSHIP_SUPPORT
}
```

**Replacement:**
- `CaregivingListing` with `caregivingType = RIDE_ASSISTANCE` → `RideAssistanceListing`
- `CaregivingListing` with `caregivingType = COMPANIONSHIP_SUPPORT` → `CompanionshipListing`

**Migration Plan:**

1. **Data Migration Script:**
```typescript
// Migrate existing CaregivingListing records
const caregivingListings = await prisma.caregivingListing.findMany();

for (const listing of caregivingListings) {
  if (listing.caregivingType === 'RIDE_ASSISTANCE') {
    // Migrate to RideAssistanceListing
    await prisma.rideAssistanceListing.create({
      data: {
        vendorId: listing.vendorId,
        title: listing.title,
        description: listing.description,
        hourlyRate: listing.basePrice,
        // Map other fields...
        status: listing.status,
      },
    });
  } else if (listing.caregivingType === 'COMPANIONSHIP_SUPPORT') {
    // Migrate to CompanionshipListing
    await prisma.companionshipListing.create({
      data: {
        vendorId: listing.vendorId,
        title: listing.title,
        description: listing.description,
        hourlyRate: listing.basePrice,
        // Map other fields...
        status: listing.status,
      },
    });
  }
  
  // Update bookings to reference new listing
  // ... booking migration logic
}
```

2. **Schema Removal:**
```prisma
// Remove from Vendor model
model Vendor {
  // ... existing fields
  // REMOVE: caregivingListings CaregivingListing[]
}

// Remove from Booking model
model Booking {
  // ... existing fields
  // REMOVE: caregivingListingId String?
  // REMOVE: caregivingListing CaregivingListing?
}

// Delete model
// model CaregivingListing { ... }  // DELETE THIS

// Delete enum
// enum CaregivingType { ... }  // DELETE THIS
```

**Timeline:**
- Phase 1: Create new models (`RideAssistanceListing`, `CompanionshipListing`)
- Phase 2: Run data migration script
- Phase 3: Update API routes to use new models
- Phase 4: Remove `CaregivingListing` model (after all data migrated)

---

## Complete Schema Updates Summary

### New Enums Required

```prisma
enum VendorStatus {
  PENDING
  APPROVED
  SUSPENDED
  REJECTED
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  BANNED
}
```

### Enum Updates Required

```prisma
enum ReportStatus {
  PENDING
  REVIEWED
  RESOLVED   // Changed from APPROVED
  DISMISSED  // Changed from REMOVED
}

enum OrderStatus {
  PENDING
  ACCEPTED      // Changed from CONFIRMED
  IN_PROGRESS   // Added (or renamed from PREPARING)
  OUT_FOR_DELIVERY  // Keep if needed
  COMPLETED     // Changed from DELIVERED
  CANCELLED
}
```

### Model Field Additions

| Model | Fields to Add | Type |
|-------|--------------|------|
| `Vendor` | `status`, `website` | `VendorStatus @default(PENDING)`, `String?` |
| `User` | `status`, `passwordHash` | `UserStatus @default(ACTIVE)`, `String?` |
| `VendorSubscription` | `planId`, `trialEndDate`, `cancellationReason` | `String?`, `DateTime?`, `String?` |
| `CleaningListing` | `whatsIncluded`, `storeId` | `String[] @default([])`, `String?` |
| `HandymanListing` | `whatsIncluded`, `storeId` | `String[] @default([])`, `String?` |
| `BeautyListing` | `storeId` | `String?` |
| `GroceryListing` | `storeId` | `String?` |
| `RentalListing` | `storeId` | `String?` |
| `Order` | `storeId` | `String?` |
| `Notification` | `targetType`, `targetIds` (optional) | `String?`, `String[]` |
| `Report` | Rename `userId` → `reporterId`, `user` → `reporter` | Field rename |
| `VendorServiceArea` | `province`, `country`, `countryCode` | `String?`, `String`, `String` |

### Relation Additions

| Model | Relations to Add |
|-------|------------------|
| `VendorStore` | `cleaningListings`, `handymanListings`, `beautyListings`, `groceryListings`, `rentalListings`, `orders` |
| `CleaningListing` | `store VendorStore?` |
| `HandymanListing` | `store VendorStore?` |
| `BeautyListing` | `store VendorStore?` |
| `GroceryListing` | `store VendorStore?` |
| `RentalListing` | `store VendorStore?` |
| `Order` | `store VendorStore?` |
| `Notification` | `user User?` (change to optional) |

### Field Type Changes

| Model | Field | Current | New | Reason |
|-------|-------|---------|-----|--------|
| `Notification` | `userId` | `String` | `String?` | Support broadcast notifications |
| `VendorServiceArea` | `state` | `String` | `String?` | Support Canadian provinces |
| `Report` | `userId` | `String` | `reporterId String` | Rename for clarity |

---

## Migration Strategy

### Phase 1: Add New Fields (Non-Breaking)

1. **Add new enums:**
   - `VendorStatus`
   - `UserStatus`

2. **Add nullable fields:**
   - `Vendor.status` (default: `PENDING`)
   - `Vendor.website` (nullable)
   - `User.status` (default: `ACTIVE`)
   - `User.passwordHash` (nullable)
   - All `storeId` fields (nullable)
   - `whatsIncluded` arrays (default: `[]`)
   - `VendorSubscription` new fields (nullable)
   - `VendorServiceArea` new fields

3. **Make fields optional:**
   - `Notification.userId` → `String?`
   - `VendorServiceArea.state` → `String?`

**Migration Script:**
```bash
npx prisma migrate dev --name add_critical_fields
```

**Data Migration:**
```typescript
// Map existing data
await prisma.vendor.updateMany({
  where: { isActive: true },
  data: { status: 'APPROVED' },
});

await prisma.vendor.updateMany({
  where: { isActive: false },
  data: { status: 'SUSPENDED' },
});

await prisma.user.updateMany({
  where: { isActive: true },
  data: { status: 'ACTIVE' },
});

await prisma.user.updateMany({
  where: { isActive: false },
  data: { status: 'SUSPENDED' },
});
```

### Phase 2: Update Enum Values (Breaking)

1. **Update `ReportStatus` enum:**
   ```sql
   UPDATE "Report" SET "status" = 'RESOLVED' WHERE "status" = 'APPROVED';
   UPDATE "Report" SET "status" = 'DISMISSED' WHERE "status" = 'REMOVED';
   ```

2. **Update `OrderStatus` enum:**
   ```sql
   UPDATE "Order" SET "status" = 'ACCEPTED' WHERE "status" = 'CONFIRMED';
   UPDATE "Order" SET "status" = 'IN_PROGRESS' WHERE "status" = 'PREPARING';
   UPDATE "Order" SET "status" = 'COMPLETED' WHERE "status" = 'DELIVERED';
   ```

**Migration Script:**
```bash
npx prisma migrate dev --name update_enums
```

### Phase 3: Rename Fields (Breaking)

1. **Rename `Report` fields:**
   - `userId` → `reporterId`
   - `user` relation → `reporter`

**Migration Script:**
```bash
npx prisma migrate dev --name rename_report_fields
```

**Data Migration:**
```sql
-- No data changes needed, just column rename
ALTER TABLE "Report" RENAME COLUMN "userId" TO "reporterId";
```

### Phase 4: Add Relations

1. **Add `storeId` relations** to all listing models
2. **Add listing relations** to `VendorStore`
3. **Add `storeId` relation** to `Order`

**Migration Script:**
```bash
npx prisma migrate dev --name add_store_relations
```

### Phase 5: Migrate CaregivingListing (After API Updates)

1. Run data migration script (see section 13)
2. Update API routes to use new models
3. Remove `CaregivingListing` model

**Migration Script:**
```bash
npx prisma migrate dev --name remove_caregiving_listing
```

---

## Testing Checklist

After applying schema changes, verify:

- [ ] Vendor status enum works in admin routes
- [ ] Vendor.website field works in settings routes
- [ ] User status enum works in admin routes
- [ ] User.passwordHash works for password change in settings routes
- [ ] Report status enum values match API expectations
- [ ] Notification creation works without userId (broadcast)
- [ ] Order model can reference VendorStore
- [ ] All 9 listing types can reference VendorStore
- [ ] VendorStore.orders relation works for order queries
- [ ] VendorServiceArea supports Canadian provinces
- [ ] OrderStatus enum values match frontend expectations
- [ ] ServiceCategory enum no longer has CAREGIVING (after migration)
- [ ] CaregivingListing data migrated successfully (if applicable)
- [ ] All existing API routes still function
- [ ] Database indexes created correctly

---

## Risk Assessment

**High Risk Changes:**
- `ReportStatus` enum update (requires data migration)
- `OrderStatus` enum update (requires data migration)
- Renaming `Report.userId` → `reporterId` (requires API code update)

**Medium Risk Changes:**
- Adding `status` fields to `Vendor` and `User` (requires data migration)
- Making `Notification.userId` optional (API code should handle null)

**Low Risk Changes:**
- Adding nullable `storeId` fields (backward compatible)
- Adding `whatsIncluded` arrays (default to empty)

**Mitigation:**
1. Test all migrations on development database first
2. Run data migration scripts in transaction blocks
3. Update API code simultaneously with schema changes
4. Add database constraints to prevent invalid enum values
5. Create rollback scripts for each migration phase

---

## Estimated Effort

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | Add new fields & enums | 2 hours |
| Phase 2 | Update enum values | 1 hour |
| Phase 3 | Rename Report fields | 30 min |
| Phase 4 | Add relations | 1 hour |
| Phase 5 | Migrate CaregivingListing | 3 hours |
| **Testing** | Verify all changes | 2 hours |
| **Total** | | **~9.5 hours** |

---

## Next Steps

1. ✅ **Review this document** - Verify all gaps identified
2. 🔄 **Create Prisma migration files** - Generate migration scripts
3. 🔄 **Write data migration scripts** - Map existing data to new schema
4. 🔄 **Update API code** - Fix any breaking changes
5. 🔄 **Test migrations** - Run on development database
6. 🔄 **Deploy to staging** - Test with staging data
7. 🔄 **Deploy to production** - Apply migrations

---

**Status:** 📋 Ready for Implementation
**Last Updated:** January 18, 2026
**Document Version:** 1.1

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 17, 2026 | Initial schema gap analysis |
| 1.1 | Jan 18, 2026 | Added: User.passwordHash, Vendor.website, ServiceCategory.CAREGIVING removal, VendorStore.orders relation |

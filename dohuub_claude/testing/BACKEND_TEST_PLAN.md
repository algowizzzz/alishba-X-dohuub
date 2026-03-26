# Backend Test Plan

**Date:** January 17, 2026  
**Based On:** BACKEND_REQUIREMENTS_ANALYSIS.md  
**Scope:** Complete backend functionality testing for Vendor Portal, Admin Portal, and Mobile App integration

---

## Test Plan Overview

**Objective:** Verify all backend APIs, database operations, and integrations work correctly to support 100% frontend functionality.

**Test Coverage:**
- ✅ Vendor Portal (5 major areas)
- ✅ Admin Portal (5 major areas)
- ✅ Mobile App Integration (4 major areas)
- ✅ API Endpoints (~100 endpoints)
- ✅ Database Schema & Migrations
- ✅ Authentication & Authorization
- ✅ File Upload & Storage
- ✅ Error Handling & Edge Cases
- ✅ Browser MCP Testing (Frontend + Backend Integration)
  - UI Navigation & Routing
  - Signup/Login Flows (All Roles)
  - Role-Based Access Control
  - End-to-End Workflows
  - Form Submissions & Validations
  - Real-time Data Updates

**Test Environment:**
- Development/Staging environment
- Test database (PostgreSQL)
- Mock file storage (S3/R2 or local)
- Test OTP service (mock email/SMS)
- Test payment provider (Stripe test mode)

---

## Phase 1: Vendor Portal Testing

### 1.1 Store Management

#### Test Case 1.1.1: Create Store with Phone/Email
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/vendor/stores`

**Test Steps:**
1. Authenticate as vendor (OTP or OAuth)
2. Create store with:
   - businessName: "Test Cleaning Co."
   - category: CLEANING
   - description: "Professional cleaning services"
   - phone: "+1234567890"
   - email: "test@cleaningco.com"
   - logo: Upload image file
   - activateNow: "active"
3. Verify response includes storeId, phone, email

**Expected Results:**
- ✅ Status: 201 Created
- ✅ Store created with phone and email fields
- ✅ Store status is ACTIVE
- ✅ Logo URL returned in response
- ✅ Store appears in `GET /api/v1/vendor/stores`

**Negative Tests:**
- ❌ Missing required fields → 400 Bad Request
- ❌ Invalid phone format → 400 Bad Request
- ❌ Invalid email format → 400 Bad Request
- ❌ Unauthenticated request → 401 Unauthorized

---

#### Test Case 1.1.2: Create Multiple Stores Per Vendor
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/vendor/stores`

**Test Steps:**
1. Authenticate as vendor
2. Create Store 1: category CLEANING, name "Cleaning Store"
3. Create Store 2: category FOOD, name "Restaurant Store"
4. Create Store 3: category BEAUTY, name "Beauty Store"
5. List all stores: `GET /api/v1/vendor/stores`

**Expected Results:**
- ✅ All 3 stores created successfully
- ✅ Each store has unique ID
- ✅ Each store has correct category
- ✅ List endpoint returns all 3 stores
- ✅ Stores can be filtered by category

---

#### Test Case 1.1.3: Update Store Contact Info
**Priority:** 🟡 HIGH  
**Endpoint:** `PUT /api/v1/vendor/stores/:storeId`

**Test Steps:**
1. Create store with initial phone/email
2. Update phone: "+1987654321"
3. Update email: "newemail@store.com"
4. Verify changes persisted

**Expected Results:**
- ✅ Phone updated successfully
- ✅ Email updated successfully
- ✅ Other fields unchanged
- ✅ UpdatedAt timestamp changed

---

### 1.2 Region Assignment

#### Test Case 1.2.1: Assign US Regions to Store
**Priority:** 🔴 CRITICAL  
**Endpoint:** `PUT /api/v1/vendor/stores/:storeId/regions`

**Test Steps:**
1. Create store
2. Get available regions: `GET /api/v1/regions?country=USA`
3. Assign regions: ["New York, NY", "Brooklyn, NY", "Manhattan, NY"]
4. Verify store-region relationships created

**Expected Results:**
- ✅ Regions assigned successfully
- ✅ `GET /api/v1/vendor/stores/:storeId/regions` returns assigned regions
- ✅ Regions include state field (e.g., "NY")
- ✅ Country is "USA"

**Database Verification:**
- ✅ VendorStoreRegion records created
- ✅ Region records exist in database
- ✅ Many-to-many relationship works

---

#### Test Case 1.2.2: Assign Canadian Regions to Store
**Priority:** 🔴 CRITICAL  
**Endpoint:** `PUT /api/v1/vendor/stores/:storeId/regions`

**Test Steps:**
1. Create store
2. Get Canadian regions: `GET /api/v1/regions?country=Canada`
3. Assign regions: ["Toronto, ON", "Vancouver, BC", "Montreal, QC"]
4. Verify store-region relationships

**Expected Results:**
- ✅ Canadian regions assigned successfully
- ✅ Regions include province field (e.g., "ON", "BC")
- ✅ Country is "Canada"
- ✅ CountryCode is "CA"

**Database Verification:**
- ✅ VendorStoreRegion records created with correct regionId
- ✅ Region.province field populated (not state)

---

#### Test Case 1.2.3: Assign Mixed US/Canada Regions
**Priority:** 🟡 MEDIUM  
**Endpoint:** `PUT /api/v1/vendor/stores/:storeId/regions`

**Test Steps:**
1. Create store
2. Assign mixed regions: ["New York, NY", "Toronto, ON"]
3. Verify both regions assigned

**Expected Results:**
- ✅ Both US and Canadian regions assigned
- ✅ Each region has correct country/province/state
- ✅ No conflicts or errors

---

### 1.3 Listing Creation (All 9 Types)

#### Test Case 1.3.1: Create Cleaning Listing
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/cleaning`

**Test Steps:**
1. Create store (category: CLEANING)
2. Upload thumbnail image
3. Create cleaning listing with:
   - title, description, basePrice
   - cleaningType, duration, priceUnit
   - whatsIncluded: ["Equipment", "Supplies"]
   - images: Upload 3 gallery images
4. Verify listing created

**Expected Results:**
- ✅ Listing created with storeId
- ✅ Images uploaded and URLs returned
- ✅ whatsIncluded array saved
- ✅ Status defaults to ACTIVE
- ✅ Listing appears in store's listings

---

#### Test Case 1.3.2: Create Food Listing
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/food`

**Test Steps:**
1. Create store (category: FOOD)
2. Create food listing with:
   - name: "Chicken Tikka Masala"
   - cuisines: ["Indian", "Pakistani"]
   - category: "Main Courses"
   - portionSize: "Regular"
   - price: 15.99
   - image: Upload thumbnail
3. Verify listing created

**Expected Results:**
- ✅ FoodListing model created (not GroceryListing)
- ✅ Cuisines array saved correctly
- ✅ Restaurant name derived from store name
- ✅ Listing can be ordered (OrderItem supports it)

---

#### Test Case 1.3.3: Create Beauty Product Listing
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/beauty-products`

**Test Steps:**
1. Create store (category: BEAUTY_PRODUCTS)
2. Create beauty product with:
   - name: "Moisturizing Cream"
   - category: "Skincare"
   - brand: "TestBrand"
   - price: 29.99
   - quantityAmount: 50
   - quantityUnit: "ml"
   - inStock: true
   - stockCount: 100
3. Verify product created

**Expected Results:**
- ✅ BeautyProductListing model created (not BeautyListing)
- ✅ Stock fields saved correctly
- ✅ Product can be ordered
- ✅ Stock count decreases on order

---

#### Test Case 1.3.4: Create Ride Assistance Listing
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/ride-assistance`

**Test Steps:**
1. Create store (category: RIDE_ASSISTANCE)
2. Create ride assistance listing with:
   - title: "Airport Shuttle Service"
   - price: 50.00
   - priceType: "Per Trip"
   - vehicleTypes: ["Sedan", "SUV"]
   - totalSeats: 4
   - coverageArea: ["Manhattan", "Brooklyn"]
   - whatsIncluded: ["Driver", "Luggage assistance"]
3. Verify listing created

**Expected Results:**
- ✅ RideAssistanceListing model created
- ✅ vehicleTypes, totalSeats, coverageArea saved
- ✅ Listing can be booked (Booking supports it)
- ✅ Not using deprecated CaregivingListing

---

#### Test Case 1.3.5: Create Companionship Listing
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/companionship`

**Test Steps:**
1. Create store (category: COMPANIONSHIP)
2. Create companionship listing with:
   - title: "Elderly Care Support"
   - hourlyRate: 25.00
   - certifications: ["CPR", "First Aid"]
   - specialties: ["Dementia Care", "Medication Management"]
   - supportTypes: ["Companionship", "Personal Care"]
   - languages: ["English", "Spanish"]
3. Verify listing created

**Expected Results:**
- ✅ CompanionshipListing model created
- ✅ All arrays (certifications, specialties, etc.) saved
- ✅ Listing can be booked
- ✅ Not using deprecated CaregivingListing

---

#### Test Case 1.3.6: Create All 9 Listing Types
**Priority:** 🔴 CRITICAL  
**Endpoints:** All 9 listing type endpoints

**Test Steps:**
1. Create 9 stores (one per category)
2. Create one listing of each type:
   - Cleaning, Handyman, Beauty Service
   - Beauty Product, Grocery, Food
   - Rental, Ride Assistance, Companionship
3. Verify all created successfully

**Expected Results:**
- ✅ All 9 listing types created
- ✅ Each uses correct model (not shared model)
- ✅ All can be queried independently
- ✅ All support status updates (ACTIVE, PAUSED, TRIAL_PERIOD, SUSPENDED)

---

### 1.4 Dashboard Statistics

#### Test Case 1.4.1: Vendor Dashboard Stats - Earnings
**Priority:** 🔴 CRITICAL  
**Endpoint:** `GET /api/v1/vendor/dashboard/stats`

**Test Steps:**
1. Create vendor with stores and listings
2. Create completed orders (status: COMPLETED)
3. Call dashboard stats endpoint
4. Verify earnings calculated correctly

**Expected Results:**
- ✅ earnings.total = sum of all completed orders
- ✅ earnings.thisMonth = orders completed this month
- ✅ earnings.trend = percentage change from last month
- ✅ Response includes currency field

**Data Setup:**
- Create 5 orders: 3 completed (totals: $100, $150, $200)
- 2 in progress (not counted in earnings)
- Expected total: $450

---

#### Test Case 1.4.2: Vendor Dashboard Stats - Orders
**Priority:** 🔴 CRITICAL  
**Endpoint:** `GET /api/v1/vendor/dashboard/stats`

**Test Steps:**
1. Create orders with different statuses:
   - 3 ACCEPTED
   - 2 IN_PROGRESS
   - 5 COMPLETED
2. Call dashboard stats
3. Verify order counts

**Expected Results:**
- ✅ orders.total = 10
- ✅ orders.accepted = 3
- ✅ orders.inProgress = 2
- ✅ orders.completed = 5

---

#### Test Case 1.4.3: Vendor Dashboard Stats - Listings
**Priority:** 🔴 CRITICAL  
**Endpoint:** `GET /api/v1/vendor/dashboard/stats`

**Test Steps:**
1. Create listings with different statuses:
   - 5 ACTIVE
   - 2 PAUSED
   - 1 TRIAL_PERIOD
   - 1 SUSPENDED
2. Call dashboard stats
3. Verify listing counts

**Expected Results:**
- ✅ listings.total = 9
- ✅ listings.active = 5
- ✅ listings.paused = 2
- ✅ TRIAL_PERIOD and SUSPENDED counted in total

---

#### Test Case 1.4.4: Vendor Dashboard Stats - Recent Orders
**Priority:** 🟡 HIGH  
**Endpoint:** `GET /api/v1/vendor/dashboard/stats`

**Test Steps:**
1. Create 10 orders (mix of statuses)
2. Call dashboard stats
3. Verify recentOrders array

**Expected Results:**
- ✅ recentOrders array returned (max 10 items)
- ✅ Sorted by date/time (newest first)
- ✅ Includes: orderNumber, storeName, customerName, total, status
- ✅ Only includes ACCEPTED, IN_PROGRESS, COMPLETED

---

### 1.5 Subscription Management

#### Test Case 1.5.1: Get Available Plans
**Priority:** 🟡 HIGH  
**Endpoint:** `GET /api/v1/subscription/plans`

**Test Steps:**
1. Call plans endpoint (unauthenticated OK)
2. Verify plan structure

**Expected Results:**
- ✅ Returns array of plans
- ✅ Each plan has: id, name, price, features, listingsLimit, storesLimit, isPopular
- ✅ At least 3 plans (Basic, Professional, Enterprise)

---

#### Test Case 1.5.2: Create Subscription
**Priority:** 🟡 HIGH  
**Endpoint:** `POST /api/v1/vendor/subscription`

**Test Steps:**
1. Authenticate as vendor
2. Create subscription with planId
3. Verify subscription created

**Expected Results:**
- ✅ Subscription created
- ✅ Vendor.subscriptionStatus updated
- ✅ VendorSubscription record created
- ✅ Trial period set if applicable

---

#### Test Case 1.5.3: Change Subscription Plan
**Priority:** 🟡 HIGH  
**Endpoint:** `PUT /api/v1/vendor/subscription/change-plan`

**Test Steps:**
1. Vendor has Basic plan
2. Upgrade to Professional plan
3. Verify plan changed

**Expected Results:**
- ✅ Plan updated successfully
- ✅ Limits updated (listingsLimit, storesLimit)
- ✅ Billing updated (if applicable)
- ✅ Old plan data preserved in history

---

### 1.6 Settings Management

#### Test Case 1.6.1: Get Vendor Settings
**Priority:** 🟡 MEDIUM  
**Endpoint:** `GET /api/v1/vendor/settings`

**Test Steps:**
1. Authenticate as vendor
2. Get settings
3. Verify response structure

**Expected Results:**
- ✅ Returns profile settings
- ✅ Returns notification preferences
- ✅ Returns privacy settings
- ✅ Includes all vendor profile fields

---

#### Test Case 1.6.2: Update Vendor Settings
**Priority:** 🟡 MEDIUM  
**Endpoint:** `PUT /api/v1/vendor/settings`

**Test Steps:**
1. Get current settings
2. Update profile: name, email, phone
3. Update notifications: emailNotifications, smsNotifications
4. Verify changes saved

**Expected Results:**
- ✅ Profile updated successfully
- ✅ Notification preferences saved
- ✅ Changes reflected in next GET request

---

#### Test Case 1.6.3: Change Password
**Priority:** 🟡 MEDIUM  
**Endpoint:** `POST /api/v1/vendor/settings/password`

**Test Steps:**
1. Authenticate with current password
2. Change password: oldPassword, newPassword
3. Logout and login with new password
4. Verify login works

**Expected Results:**
- ✅ Password changed successfully
- ✅ Old password no longer works
- ✅ New password works for login
- ✅ Session invalidated (if required)

---

## Phase 2: Admin Portal Testing

### 2.1 Dashboard Statistics

#### Test Case 2.1.1: Admin Dashboard Stats - Users
**Priority:** 🔴 CRITICAL  
**Endpoint:** `GET /api/v1/admin/dashboard/stats`

**Test Steps:**
1. Create test users (customers + vendors)
2. Call admin dashboard stats
3. Verify user metrics

**Expected Results:**
- ✅ users.total = total count of all users
- ✅ users.trend = percentage change from last month
- ✅ users.trendPeriod = "from last month"

**Data Setup:**
- Create 100 users this month
- Last month had 90 users
- Expected trend: +11.1%

---

#### Test Case 2.1.2: Admin Dashboard Stats - Vendors
**Priority:** 🔴 CRITICAL  
**Endpoint:** `GET /api/v1/admin/dashboard/stats`

**Test Steps:**
1. Create vendors with different statuses
2. Call admin dashboard stats
3. Verify vendor metrics

**Expected Results:**
- ✅ vendors.active = count of active vendors
- ✅ vendors.trend = percentage change
- ✅ vendors.newThisWeek = vendors created in last 7 days

---

#### Test Case 2.1.3: Admin Dashboard Stats - Revenue
**Priority:** 🔴 CRITICAL  
**Endpoint:** `GET /api/v1/admin/dashboard/stats`

**Test Steps:**
1. Create completed orders with revenue
2. Call admin dashboard stats
3. Verify revenue metrics

**Expected Results:**
- ✅ revenue.thisMonth = sum of all completed orders this month
- ✅ revenue.trend = percentage change from last month
- ✅ revenue.currency = "USD" (or configured currency)

---

#### Test Case 2.1.4: Admin Dashboard Stats - Orders
**Priority:** 🔴 CRITICAL  
**Endpoint:** `GET /api/v1/admin/dashboard/stats`

**Test Steps:**
1. Create orders (some today, some yesterday)
2. Call admin dashboard stats
3. Verify active orders today

**Expected Results:**
- ✅ orders.activeToday = count of orders with status IN_PROGRESS or ACCEPTED created today
- ✅ Only counts today's orders (not yesterday)

---

### 2.2 Michelle Profile Management

#### Test Case 2.2.1: Create Michelle Profile
**Priority:** 🟡 HIGH  
**Endpoint:** `POST /api/v1/admin/michelle-profiles`

**Test Steps:**
1. Authenticate as admin
2. Create Michelle profile:
   - businessName: "Michelle's Cleaning Services"
   - description: "Platform-owned service"
   - isMichelle: true
3. Verify profile created

**Expected Results:**
- ✅ Profile created with isMichelle = true
- ✅ Profile appears in Michelle profiles list
- ✅ Can assign regions to profile
- ✅ Can create listings for profile

---

#### Test Case 2.2.2: Get Michelle Profile Listings
**Priority:** 🟡 HIGH  
**Endpoint:** `GET /api/v1/admin/michelle-profiles/:id/listings`

**Test Steps:**
1. Create Michelle profile
2. Create 5 listings for profile (different types)
3. Get profile listings
4. Verify all listings returned

**Expected Results:**
- ✅ Returns all listings for profile
- ✅ Includes all 9 listing types
- ✅ Can filter by listing type
- ✅ Can filter by status

---

#### Test Case 2.2.3: Create Listing for Michelle Profile
**Priority:** 🟡 HIGH  
**Endpoint:** `POST /api/v1/admin/michelle-profiles/:id/listings`

**Test Steps:**
1. Create Michelle profile
2. Create cleaning listing for profile
3. Verify listing created with profile's vendorId

**Expected Results:**
- ✅ Listing created successfully
- ✅ Listing.vendorId = Michelle profile's vendorId
- ✅ Listing appears in profile's listings
- ✅ Listing shows "Powered by DoHuub" badge (frontend)

---

### 2.3 Profile Analytics

#### Test Case 2.3.1: Get Profile Analytics - Views
**Priority:** 🟡 HIGH  
**Endpoint:** `GET /api/v1/admin/michelle-profiles/:id/analytics?dateRange=30days`

**Test Steps:**
1. Create Michelle profile with listings
2. Simulate view events (or create view tracking records)
3. Get analytics for 30 days
4. Verify views metrics

**Expected Results:**
- ✅ metrics.views.total = total views in date range
- ✅ metrics.views.trend = percentage change
- ✅ metrics.views.data = array of daily view counts
- ✅ Data points for each day in range

---

#### Test Case 2.3.2: Get Profile Analytics - Bookings
**Priority:** 🟡 HIGH  
**Endpoint:** `GET /api/v1/admin/michelle-profiles/:id/analytics?dateRange=30days`

**Test Steps:**
1. Create bookings for profile's listings
2. Get analytics
3. Verify bookings metrics

**Expected Results:**
- ✅ metrics.bookings.total = total bookings in range
- ✅ metrics.bookings.trend = percentage change
- ✅ metrics.bookings.data = daily booking counts
- ✅ Only counts confirmed/completed bookings

---

#### Test Case 2.3.3: Get Profile Analytics - Revenue
**Priority:** 🟡 HIGH  
**Endpoint:** `GET /api/v1/admin/michelle-profiles/:id/analytics?dateRange=30days`

**Test Steps:**
1. Create completed bookings with revenue
2. Get analytics
3. Verify revenue metrics

**Expected Results:**
- ✅ metrics.revenue.total = sum of completed bookings
- ✅ metrics.revenue.trend = percentage change
- ✅ metrics.revenue.data = daily revenue amounts
- ✅ Charts data formatted correctly

---

#### Test Case 2.3.4: Get Profile Analytics - Top Performers
**Priority:** 🟡 HIGH  
**Endpoint:** `GET /api/v1/admin/michelle-profiles/:id/analytics`

**Test Steps:**
1. Create multiple listings with different booking counts
2. Get analytics
3. Verify top performers

**Expected Results:**
- ✅ topPerformers.topService = listing with most bookings
- ✅ topPerformers.topRegion = region with most bookings
- ✅ Includes name and count/metric

---

### 2.4 Vendor Management

#### Test Case 2.4.1: Get All Vendors
**Priority:** 🟡 HIGH  
**Endpoint:** `GET /api/v1/admin/vendors`

**Test Steps:**
1. Create multiple vendors (different statuses, categories)
2. Get all vendors as admin
3. Verify response

**Expected Results:**
- ✅ Returns all vendors
- ✅ Includes vendor stats (listings count, revenue)
- ✅ Can filter by status
- ✅ Can filter by category
- ✅ Pagination works (if implemented)

---

#### Test Case 2.4.2: Suspend/Activate Vendor
**Priority:** 🟡 HIGH  
**Endpoint:** `PUT /api/v1/admin/vendors/:id/status`

**Test Steps:**
1. Create active vendor
2. Suspend vendor (status: SUSPENDED)
3. Verify vendor suspended
4. Activate vendor (status: ACTIVE)
5. Verify vendor active

**Expected Results:**
- ✅ Vendor status updated
- ✅ Suspended vendor's listings hidden (or marked SUSPENDED)
- ✅ Activated vendor's listings visible again
- ✅ Status change logged (if audit trail exists)

---

### 2.5 Listing Management

#### Test Case 2.5.1: Get All Listings (Admin)
**Priority:** 🟡 HIGH  
**Endpoint:** `GET /api/v1/admin/listings`

**Test Steps:**
1. Create listings of all 9 types
2. Get all listings as admin
3. Verify response

**Expected Results:**
- ✅ Returns listings from all vendors
- ✅ Includes all 9 listing types
- ✅ Can filter by type
- ✅ Can filter by status
- ✅ Can filter by vendor
- ✅ Pagination works

---

#### Test Case 2.5.2: Suspend Listing (Admin)
**Priority:** 🟡 HIGH  
**Endpoint:** `PUT /api/v1/admin/listings/:id/status`

**Test Steps:**
1. Create active listing
2. Suspend listing as admin
3. Verify listing status changed

**Expected Results:**
- ✅ Listing status = SUSPENDED
- ✅ Listing no longer visible to customers
- ✅ Vendor notified (if notification system exists)
- ✅ Can be unsuspended later

---

### 2.6 Moderation

#### Test Case 2.6.1: Get Reported Listings
**Priority:** 🟡 HIGH  
**Endpoint:** `GET /api/v1/admin/reports`

**Test Steps:**
1. Create reports for listings (different statuses)
2. Get reports as admin
3. Verify response

**Expected Results:**
- ✅ Returns all reports
- ✅ Includes report details (reason, reporter, listing)
- ✅ Can filter by status (pending, reviewed, approved, removed)
- ✅ Shows report count per listing

---

#### Test Case 2.6.2: Review Report
**Priority:** 🟡 HIGH  
**Endpoint:** `PUT /api/v1/admin/reports/:id/status`

**Test Steps:**
1. Create pending report
2. Review report (status: reviewed)
3. Verify report status updated

**Expected Results:**
- ✅ Report status = reviewed
- ✅ Admin can add notes/comments
- ✅ Report no longer in "pending" list
- ✅ Reporter notified (if applicable)

---

#### Test Case 2.6.3: Suspend Listing from Report
**Priority:** 🟡 HIGH  
**Endpoint:** `PUT /api/v1/admin/reports/:id/status`

**Test Steps:**
1. Create report for listing
2. Approve report and suspend listing
3. Verify listing suspended

**Expected Results:**
- ✅ Report status = approved
- ✅ Listing status = SUSPENDED
- ✅ Listing removed from public view
- ✅ Vendor notified

---

### 2.7 Platform Reports

#### Test Case 2.7.1: Get Platform Reports - KPIs
**Priority:** 🟡 HIGH  
**Endpoint:** `GET /api/v1/admin/reports/platform?dateRange=30days`

**Test Steps:**
1. Create test data (revenue, bookings, users, vendors)
2. Get platform reports for 30 days
3. Verify KPI metrics

**Expected Results:**
- ✅ kpis.revenue.value = total revenue
- ✅ kpis.revenue.change = percentage change
- ✅ kpis.revenue.trend = "up" or "down"
- ✅ All 4 KPIs returned (revenue, bookings, newUsers, activeVendors)

---

#### Test Case 2.7.2: Get Platform Reports - Top Performers
**Priority:** 🟡 HIGH  
**Endpoint:** `GET /api/v1/admin/reports/platform`

**Test Steps:**
1. Create vendors, listings, bookings with varying performance
2. Get platform reports
3. Verify top performers

**Expected Results:**
- ✅ topPerformers.topVendor = vendor with highest metric
- ✅ topPerformers.topService = listing/service with most bookings
- ✅ topPerformers.topRegion = region with most activity
- ✅ topPerformers.topCustomer = customer with most orders
- ✅ Each includes name, metric type, value

---

#### Test Case 2.7.3: Export Platform Reports - CSV
**Priority:** 🟡 MEDIUM  
**Endpoint:** `GET /api/v1/admin/reports/platform/export?format=csv&dateRange=30days`

**Test Steps:**
1. Get platform reports data
2. Export as CSV
3. Verify CSV file

**Expected Results:**
- ✅ Returns CSV file download
- ✅ CSV includes all KPI data
- ✅ CSV includes top performers
- ✅ CSV formatted correctly (headers, rows)
- ✅ File name includes date range

---

#### Test Case 2.7.4: Export Platform Reports - PDF
**Priority:** 🟡 MEDIUM  
**Endpoint:** `GET /api/v1/admin/reports/platform/export?format=pdf&dateRange=30days`

**Test Steps:**
1. Get platform reports data
2. Export as PDF
3. Verify PDF file

**Expected Results:**
- ✅ Returns PDF file download
- ✅ PDF includes charts/visualizations
- ✅ PDF includes all metrics
- ✅ PDF formatted professionally
- ✅ File name includes date range

---

## Phase 3: Mobile App Integration Testing

### 3.1 Search & Discovery

#### Test Case 3.1.1: Search Listings by Region - US
**Priority:** 🔴 CRITICAL  
**Endpoint:** `GET /api/v1/{type}?region=New York, NY`

**Test Steps:**
1. Create listings in "New York, NY" region
2. Create listings in "Brooklyn, NY" region
3. Search for "New York, NY"
4. Verify results

**Expected Results:**
- ✅ Returns only listings in "New York, NY" region
- ✅ Does not return "Brooklyn, NY" listings
- ✅ Results include store contact info (phone/email)
- ✅ Results sorted by relevance/rating

**Test for All 9 Types:**
- Repeat for: cleaning, handyman, beauty, beauty-products, groceries, food, rentals, ride-assistance, companionship

---

#### Test Case 3.1.2: Search Listings by Region - Canada
**Priority:** 🔴 CRITICAL  
**Endpoint:** `GET /api/v1/{type}?region=Toronto, ON`

**Test Steps:**
1. Create listings in "Toronto, ON" region
2. Create listings in "Vancouver, BC" region
3. Search for "Toronto, ON"
4. Verify results

**Expected Results:**
- ✅ Returns only listings in "Toronto, ON" region
- ✅ Region includes province field ("ON")
- ✅ Country is "Canada"
- ✅ Results include store contact info

---

#### Test Case 3.1.3: Search Across Multiple Regions
**Priority:** 🟡 MEDIUM  
**Endpoint:** `GET /api/v1/{type}?regions=New York, NY|Brooklyn, NY`

**Test Steps:**
1. Create listings in multiple regions
2. Search with multiple regions
3. Verify results

**Expected Results:**
- ✅ Returns listings from all specified regions
- ✅ No duplicates
- ✅ Results sorted appropriately

---

### 3.2 Order Placement

#### Test Case 3.2.1: Place Order for Food
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/orders`

**Test Steps:**
1. Create food listing
2. Authenticate as customer
3. Create order with food items:
   - orderItems: [{ listingId, listingType: "FOOD", quantity: 2, price: 15.99 }]
4. Verify order created

**Expected Results:**
- ✅ Order created successfully
- ✅ OrderItem references FoodListing (not GroceryListing)
- ✅ OrderItem.listingType = "FOOD"
- ✅ Order total calculated correctly
- ✅ Vendor notified (if notification exists)

---

#### Test Case 3.2.2: Place Order for Groceries
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/orders`

**Test Steps:**
1. Create grocery listing
2. Create order with grocery items
3. Verify order created

**Expected Results:**
- ✅ OrderItem references GroceryListing
- ✅ OrderItem.listingType = "GROCERY"
- ✅ Stock count decreases (if applicable)
- ✅ Order status = PENDING

---

#### Test Case 3.2.3: Place Order for Beauty Products
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/orders`

**Test Steps:**
1. Create beauty product listing (inStock: true, stockCount: 10)
2. Create order with quantity: 3
3. Verify order and stock

**Expected Results:**
- ✅ Order created successfully
- ✅ OrderItem references BeautyProductListing
- ✅ Stock count decreases: 10 → 7
- ✅ If stockCount < quantity, order rejected (or backorder)

---

#### Test Case 3.2.4: Place Mixed Order (Food + Groceries + Products)
**Priority:** 🟡 HIGH  
**Endpoint:** `POST /api/v1/orders`

**Test Steps:**
1. Create food, grocery, and beauty product listings
2. Create order with all 3 types
3. Verify order created

**Expected Results:**
- ✅ Order contains all 3 item types
- ✅ Each OrderItem has correct listingType
- ✅ Each OrderItem references correct model
- ✅ Order total = sum of all items

---

### 3.3 Service Booking

#### Test Case 3.3.1: Book Cleaning Service
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/bookings`

**Test Steps:**
1. Create cleaning listing
2. Authenticate as customer
3. Create booking:
   - cleaningListingId: <id>
   - scheduledDate: "2026-02-01"
   - scheduledTime: "10:00"
4. Verify booking created

**Expected Results:**
- ✅ Booking created successfully
- ✅ Booking references CleaningListing
- ✅ Booking status = PENDING
- ✅ Vendor notified
- ✅ Booking appears in vendor's bookings list

---

#### Test Case 3.3.2: Book Ride Assistance
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/bookings`

**Test Steps:**
1. Create ride assistance listing
2. Create booking:
   - rideAssistanceListingId: <id>
   - pickupLocation: "123 Main St"
   - dropoffLocation: "456 Oak Ave"
   - scheduledDate: "2026-02-01"
3. Verify booking created

**Expected Results:**
- ✅ Booking created successfully
- ✅ Booking references RideAssistanceListing (not CaregivingListing)
- ✅ Location fields saved
- ✅ Booking can be accepted/declined by vendor

---

#### Test Case 3.3.3: Book Companionship Service
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/bookings`

**Test Steps:**
1. Create companionship listing
2. Create booking:
   - companionshipListingId: <id>
   - scheduledDate: "2026-02-01"
   - duration: 4 (hours)
   - specialRequirements: "Needs Spanish speaker"
3. Verify booking created

**Expected Results:**
- ✅ Booking created successfully
- ✅ Booking references CompanionshipListing (not CaregivingListing)
- ✅ Duration and requirements saved
- ✅ Total cost = hourlyRate × duration

---

#### Test Case 3.3.4: Book All Service Types
**Priority:** 🟡 HIGH  
**Endpoint:** `POST /api/v1/bookings`

**Test Steps:**
1. Create listings: Cleaning, Handyman, Beauty Service, Ride Assistance, Companionship
2. Create bookings for each
3. Verify all bookings created

**Expected Results:**
- ✅ All 5 service types can be booked
- ✅ Each booking references correct listing model
- ✅ No conflicts or errors
- ✅ All appear in vendor's bookings

---

### 3.4 Store Contact Information

#### Test Case 3.4.1: Get Store with Contact Info
**Priority:** 🟡 HIGH  
**Endpoint:** `GET /api/v1/vendor/stores/:storeId`

**Test Steps:**
1. Create store with phone and email
2. Get store details (public endpoint or authenticated)
3. Verify contact info returned

**Expected Results:**
- ✅ Store response includes phone field
- ✅ Store response includes email field
- ✅ Contact info visible to customers (if business logic allows)
- ✅ Contact info formatted correctly

---

#### Test Case 3.4.2: Get Listing with Store Contact Info
**Priority:** 🟡 HIGH  
**Endpoint:** `GET /api/v1/{type}/:id`

**Test Steps:**
1. Create store with phone/email
2. Create listing for store
3. Get listing details
4. Verify store contact info included

**Expected Results:**
- ✅ Listing response includes store information
- ✅ Store info includes phone and email
- ✅ Contact info accessible to customers
- ✅ Format: { store: { name, phone, email, ... } }

---

## Phase 4: API Endpoint Testing

### 4.1 Authentication

#### Test Case 4.1.1: Vendor OTP Flow
**Priority:** 🔴 CRITICAL  
**Endpoints:** 
- `POST /api/v1/auth/vendor/send-otp`
- `POST /api/v1/auth/vendor/verify-otp`

**Test Steps:**
1. Send OTP: email = "test@vendor.com"
2. Verify OTP received (check email/mock service)
3. Verify OTP: email + otp code
4. Verify access token returned

**Expected Results:**
- ✅ OTP sent successfully
- ✅ OTP expires in 5 minutes
- ✅ OTP is 6 digits
- ✅ Verification returns accessToken + refreshToken
- ✅ Rate limiting: Max 3 requests per 15 minutes

**Negative Tests:**
- ❌ Invalid email → 400 Bad Request
- ❌ Wrong OTP → 401 Unauthorized
- ❌ Expired OTP → 401 Unauthorized
- ❌ Too many OTP requests → 429 Too Many Requests

---

#### Test Case 4.1.2: Vendor Google OAuth
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/auth/vendor/google`

**Test Steps:**
1. Get Google OAuth token (test token)
2. Authenticate with Google token
3. Verify response

**Expected Results:**
- ✅ Returns accessToken + refreshToken
- ✅ Creates vendor if new user (isNewUser: true)
- ✅ Returns existing vendor if user exists (isNewUser: false)
- ✅ Vendor profile created/updated with Google info

---

#### Test Case 4.1.3: Refresh Token
**Priority:** 🟡 MEDIUM  
**Endpoint:** `POST /api/v1/auth/vendor/refresh`

**Test Steps:**
1. Authenticate and get refreshToken
2. Use refreshToken to get new accessToken
3. Verify new token works

**Expected Results:**
- ✅ New accessToken returned
- ✅ New token works for authenticated requests
- ✅ Old accessToken still valid (or invalidated based on config)
- ✅ RefreshToken can be reused (or one-time use based on config)

---

### 4.2 File Upload

#### Test Case 4.2.1: Upload Single Image
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/upload/image`

**Test Steps:**
1. Authenticate as vendor
2. Upload image file (JPG, 2MB)
3. Verify upload

**Expected Results:**
- ✅ Image uploaded successfully
- ✅ Returns: { id, url, filename, size }
- ✅ URL is accessible (CDN or storage URL)
- ✅ File size validated (max 5MB)
- ✅ File type validated (JPG, PNG only)

**Negative Tests:**
- ❌ File > 5MB → 400 Bad Request
- ❌ Invalid file type → 400 Bad Request
- ❌ Unauthenticated → 401 Unauthorized

---

#### Test Case 4.2.2: Upload Multiple Images
**Priority:** 🔴 CRITICAL  
**Endpoint:** `POST /api/v1/upload/images`

**Test Steps:**
1. Upload 5 images (max allowed)
2. Verify all uploaded

**Expected Results:**
- ✅ All 5 images uploaded
- ✅ Returns array of image objects
- ✅ Each image has unique ID and URL
- ✅ All URLs accessible

**Negative Tests:**
- ❌ Upload 6 images → 400 Bad Request (max 5)
- ❌ One invalid file → All rejected or partial success (define behavior)

---

#### Test Case 4.2.3: Delete Uploaded Image
**Priority:** 🟡 MEDIUM  
**Endpoint:** `DELETE /api/v1/upload/:fileId`

**Test Steps:**
1. Upload image
2. Delete image by fileId
3. Verify deletion

**Expected Results:**
- ✅ Image deleted from storage
- ✅ URL no longer accessible
- ✅ Returns success status
- ✅ Cannot delete twice (404 or 400)

---

### 4.3 Status Management

#### Test Case 4.3.1: Update Listing Status - All Statuses
**Priority:** 🔴 CRITICAL  
**Endpoint:** `PUT /api/v1/vendors/:vendorId/listings/:listingId/status`

**Test Steps:**
1. Create listing (status: ACTIVE)
2. Update to PAUSED
3. Update to TRIAL_PERIOD
4. Update to SUSPENDED
5. Update back to ACTIVE

**Expected Results:**
- ✅ All status transitions work
- ✅ TRIAL_PERIOD status accepted (not rejected)
- ✅ Status changes logged (if audit exists)
- ✅ Status reflected in GET requests

---

#### Test Case 4.3.2: Bulk Status Update
**Priority:** 🟡 MEDIUM  
**Endpoint:** `PUT /api/v1/vendors/:vendorId/listings/status` (if implemented)

**Test Steps:**
1. Create 5 listings
2. Bulk update all to PAUSED
3. Verify all updated

**Expected Results:**
- ✅ All listings status updated
- ✅ Returns count of updated listings
- ✅ Only vendor's own listings updated

---

## Phase 5: Database & Migration Testing

### 5.1 Schema Migration

#### Test Case 5.1.1: Run Full Migration
**Priority:** 🔴 CRITICAL  
**Action:** Database migration

**Test Steps:**
1. Start with current schema
2. Run migration: `npm run db:migrate dev --name add_nine_separate_listing_models`
3. Verify migration success
4. Check all new models created

**Expected Results:**
- ✅ Migration runs without errors
- ✅ All new models created: FoodListing, BeautyProductListing, RideAssistanceListing, CompanionshipListing, VendorStore, VendorStoreRegion, Region
- ✅ Enums updated: ListingStatus (TRIAL_PERIOD), ServiceCategory (9 categories)
- ✅ Relations created correctly
- ✅ Indexes created

---

#### Test Case 5.1.2: Migrate Existing CaregivingListing Data
**Priority:** 🔴 CRITICAL  
**Action:** Data migration script

**Test Steps:**
1. Create test CaregivingListing records:
   - 3 with caregivingType = RIDE_ASSISTANCE
   - 2 with caregivingType = COMPANIONSHIP_SUPPORT
2. Run data migration script
3. Verify data migrated

**Expected Results:**
- ✅ RIDE_ASSISTANCE records → RideAssistanceListing
- ✅ COMPANIONSHIP_SUPPORT records → CompanionshipListing
- ✅ All fields mapped correctly
- ✅ Old CaregivingListing records removed (or marked deprecated)
- ✅ No data loss

---

#### Test Case 5.1.3: Seed Region Data
**Priority:** 🟡 HIGH  
**Action:** Seed script

**Test Steps:**
1. Run region seed script
2. Verify regions created

**Expected Results:**
- ✅ All US cities seeded (New York, Los Angeles, Chicago, etc.)
- ✅ All Canadian cities seeded (Toronto, Vancouver, Montreal, etc.)
- ✅ Each region has correct state/province
- ✅ Each region has correct country/countryCode
- ✅ No duplicates

---

### 5.2 Data Integrity

#### Test Case 5.2.1: Foreign Key Constraints
**Priority:** 🔴 CRITICAL  
**Action:** Database operations

**Test Steps:**
1. Create vendor
2. Create store (vendorId = vendor.id)
3. Try to delete vendor
4. Verify cascade delete (or constraint error)

**Expected Results:**
- ✅ Store deleted when vendor deleted (CASCADE)
- ✅ Or: Cannot delete vendor if store exists (RESTRICT)
- ✅ All related records handled correctly

---

#### Test Case 5.2.2: Unique Constraints
**Priority:** 🟡 MEDIUM  
**Action:** Database operations

**Test Steps:**
1. Create region: "New York, NY", country: "USA"
2. Try to create duplicate region
3. Verify constraint

**Expected Results:**
- ✅ Duplicate region rejected (unique constraint)
- ✅ Error message clear
- ✅ @@unique([name, country]) works

---

## Phase 6: Error Handling & Edge Cases

### 6.1 Error Responses

#### Test Case 6.1.1: Standard Error Format
**Priority:** 🟡 MEDIUM  
**Action:** All endpoints

**Test Steps:**
1. Trigger various errors (400, 401, 404, 500)
2. Verify error response format

**Expected Results:**
- ✅ Consistent error format: { error: string, code?: string, details?: any }
- ✅ 400: Bad Request with details
- ✅ 401: Unauthorized with message
- ✅ 404: Not Found with resource type
- ✅ 500: Internal Server Error (no sensitive info)

---

#### Test Case 6.1.2: Validation Errors
**Priority:** 🟡 MEDIUM  
**Action:** POST/PUT endpoints

**Test Steps:**
1. Submit invalid data (missing required fields, wrong types)
2. Verify validation errors

**Expected Results:**
- ✅ Returns 400 Bad Request
- ✅ Error message lists all validation failures
- ✅ Field-level errors (if applicable)
- ✅ Clear, actionable error messages

---

### 6.2 Edge Cases

#### Test Case 6.2.1: Empty Results
**Priority:** 🟡 LOW  
**Action:** GET endpoints

**Test Steps:**
1. Query with no matching results
2. Verify response

**Expected Results:**
- ✅ Returns empty array []
- ✅ Not null or error
- ✅ Pagination metadata still present (if applicable)

---

#### Test Case 6.2.2: Large Datasets
**Priority:** 🟡 MEDIUM  
**Action:** GET endpoints with pagination

**Test Steps:**
1. Create 1000 listings
2. Get all listings
3. Verify pagination

**Expected Results:**
- ✅ Pagination works (limit/offset or cursor)
- ✅ Response time acceptable (< 2 seconds)
- ✅ No memory issues
- ✅ Can navigate through pages

---

#### Test Case 6.2.3: Concurrent Updates
**Priority:** 🟡 MEDIUM  
**Action:** PUT endpoints

**Test Steps:**
1. Two users update same listing simultaneously
2. Verify conflict handling

**Expected Results:**
- ✅ Last write wins (or optimistic locking)
- ✅ No data corruption
- ✅ Error message if conflict (if applicable)

---

## Phase 7: Performance Testing

### 7.1 Response Times

#### Test Case 7.1.1: Dashboard Stats Performance
**Priority:** 🟡 MEDIUM  
**Endpoints:** Dashboard stats endpoints

**Test Steps:**
1. Create large dataset (1000 vendors, 10000 listings, 50000 orders)
2. Call dashboard stats endpoint
3. Measure response time

**Expected Results:**
- ✅ Response time < 2 seconds
- ✅ Database queries optimized (indexes used)
- ✅ Aggregations efficient
- ✅ No N+1 queries

---

#### Test Case 7.1.2: Listing Search Performance
**Priority:** 🟡 MEDIUM  
**Endpoint:** `GET /api/v1/{type}?region=...`

**Test Steps:**
1. Create 1000 listings in region
2. Search by region
3. Measure response time

**Expected Results:**
- ✅ Response time < 1 second
- ✅ Indexes on region fields
- ✅ Results limited (pagination)

---

## Phase 8: Browser MCP Testing (Frontend + Backend Integration)

### Overview

**Objective:** Test frontend UI navigation, user flows, and backend API integration using browser automation (MCP).

**Scope:**
- ✅ All screen navigations (vendor, admin portals)
- ✅ Signup/login flows (all roles: vendor, admin, customer)
- ✅ Role-based access control
- ✅ UI interactions triggering backend APIs
- ✅ Data display and loading states
- ✅ Form submissions and validations
- ✅ Button clicks and actions
- ✅ End-to-end workflows

**Browser MCP Tools:**
- Use MCP browser extension to navigate, interact, and verify UI
- Test API calls triggered by UI actions
- Verify data displayed matches backend responses
- Test navigation between screens

---

### 8.1 Vendor Portal - Navigation & Flows

#### Test Case 8.1.1: Vendor Signup Flow (OTP)
**Priority:** 🔴 CRITICAL  
**Browser Action:** Navigate and interact with signup form

**Test Steps:**
1. Navigate to `/vendor/signup` (or `/auth/register`)
2. Verify signup form displays correctly
3. Enter email: "newvendor@test.com"
4. Click "Send OTP" button
5. Verify OTP sent message appears
6. Enter 6-digit OTP received
7. Click "Verify OTP"
8. Verify redirect to vendor profile setup or dashboard

**Expected UI Results:**
- ✅ Signup form visible with all fields
- ✅ "Send OTP" button clickable
- ✅ Loading state shows after clicking
- ✅ OTP input field appears after OTP sent
- ✅ Success message on verification
- ✅ Redirect to next screen (dashboard or profile setup)

**Backend API Verification:**
- ✅ `POST /api/v1/auth/vendor/send-otp` called with correct email
- ✅ `POST /api/v1/auth/vendor/verify-otp` called with email + OTP
- ✅ Response includes accessToken and refreshToken
- ✅ Token stored in localStorage/sessionStorage

---

#### Test Case 8.1.2: Vendor Signup Flow (Google OAuth)
**Priority:** 🔴 CRITICAL  
**Browser Action:** Navigate and click Google OAuth button

**Test Steps:**
1. Navigate to `/vendor/signup`
2. Click "Sign up with Google" button
3. Complete Google OAuth flow (mock or real)
4. Verify redirect after authentication
5. Verify vendor profile created/logged in

**Expected UI Results:**
- ✅ Google OAuth button visible
- ✅ OAuth popup/modal opens
- ✅ After OAuth, redirects to vendor dashboard
- ✅ Vendor name/email displayed in header

**Backend API Verification:**
- ✅ `POST /api/v1/auth/vendor/google` called with Google token
- ✅ Vendor created if new user (isNewUser: true)
- ✅ Vendor logged in if existing user
- ✅ Access token returned and stored

---

#### Test Case 8.1.3: Vendor Login Flow (OTP)
**Priority:** 🔴 CRITICAL  
**Browser Action:** Navigate and interact with login form

**Test Steps:**
1. Navigate to `/vendor/login` (or `/auth/login`)
2. Enter existing vendor email
3. Click "Send OTP"
4. Enter OTP received
5. Click "Verify OTP"
6. Verify redirect to vendor dashboard

**Expected UI Results:**
- ✅ Login form displays correctly
- ✅ OTP flow works smoothly
- ✅ Redirects to `/vendor/dashboard` after login
- ✅ Dashboard loads with vendor data

**Backend API Verification:**
- ✅ OTP endpoints called correctly
- ✅ Token returned and stored
- ✅ Dashboard API called on page load

---

#### Test Case 8.1.4: Vendor Dashboard Navigation
**Priority:** 🔴 CRITICAL  
**Browser Action:** Navigate through vendor dashboard screens

**Test Steps:**
1. Login as vendor
2. Verify dashboard loads (`/vendor/dashboard`)
3. Click sidebar navigation items:
   - "Dashboard" → Should be on dashboard
   - "Services/Stores" → Navigate to `/vendor/services`
   - "Orders" → Navigate to `/vendor/orders`
   - "Profile" → Navigate to `/vendor/profile`
   - "Settings" → Navigate to `/vendor/settings`
4. Verify each screen loads correctly

**Expected UI Results:**
- ✅ Sidebar visible with all menu items
- ✅ Current page highlighted in sidebar
- ✅ Each navigation click changes route
- ✅ URL updates correctly
- ✅ Page content loads without errors
- ✅ No broken links or 404 errors

**Backend API Verification:**
- ✅ Dashboard API called: `GET /api/v1/vendor/dashboard/stats`
- ✅ Services API called: `GET /api/v1/vendor/stores`
- ✅ Orders API called: `GET /api/v1/vendor/orders`
- ✅ Each screen triggers appropriate API calls

---

#### Test Case 8.1.5: Create Store Flow (UI)
**Priority:** 🔴 CRITICAL  
**Browser Action:** Fill form and submit store creation

**Test Steps:**
1. Navigate to `/vendor/services`
2. Click "Create Store" or "Add New Store" button
3. Fill store form:
   - Business Name: "Test Cleaning Co."
   - Category: Select "Cleaning" from dropdown
   - Description: "Professional cleaning services"
   - Phone: "+1234567890"
   - Email: "test@cleaningco.com"
   - Logo: Upload image file
   - Regions: Select "New York, NY", "Brooklyn, NY"
   - Status: Select "Active"
4. Click "Create Store" or "Save" button
5. Verify success message
6. Verify redirect to store list or store details

**Expected UI Results:**
- ✅ Form displays with all fields
- ✅ Category dropdown shows all 9 categories
- ✅ Region selector works (multiple selection)
- ✅ File upload works (logo)
- ✅ Form validation works (required fields)
- ✅ Loading state during submission
- ✅ Success message after creation
- ✅ New store appears in store list

**Backend API Verification:**
- ✅ `POST /api/v1/vendor/stores` called with form data
- ✅ Request includes phone, email, regions
- ✅ File upload API called for logo
- ✅ Store created successfully
- ✅ Response includes storeId

---

#### Test Case 8.1.6: Create Listing Flow (UI) - All 9 Types
**Priority:** 🔴 CRITICAL  
**Browser Action:** Navigate and fill listing forms

**Test Steps:**
1. Navigate to `/vendor/services/:storeId/listings`
2. Click "Create Listing" or "Add Listing" button
3. Select listing type from dropdown (9 options)
4. Fill listing form (type-specific fields)
5. Upload images (thumbnail + gallery)
6. Click "Save" or "Create Listing"
7. Verify success and redirect

**Expected UI Results:**
- ✅ Listing type selector shows all 9 options
- ✅ Form fields change based on listing type
- ✅ File upload works (single + multiple)
- ✅ Form validation works
- ✅ Success message displays
- ✅ Listing appears in store's listings

**Test Each Type:**
- Cleaning Service
- Handyman Service
- Beauty Service
- Beauty Product
- Grocery
- Food
- Rental Property
- Ride Assistance
- Companionship Support

**Backend API Verification:**
- ✅ Correct API endpoint called for each type:
  - `POST /api/v1/cleaning`
  - `POST /api/v1/food`
  - `POST /api/v1/beauty-products`
  - etc.
- ✅ File upload API called for images
- ✅ Listing created with correct storeId

---

#### Test Case 8.1.7: Dashboard Stats Display
**Priority:** 🔴 CRITICAL  
**Browser Action:** View dashboard and verify stats display

**Test Steps:**
1. Navigate to `/vendor/dashboard`
2. Verify dashboard loads
3. Check stats display:
   - Total Earnings (with trend indicator)
   - Total Orders (with breakdown)
   - Active Listings count
   - Recent Orders list
4. Verify data matches backend response

**Expected UI Results:**
- ✅ Dashboard page loads without errors
- ✅ Stats cards display correctly
- ✅ Numbers match backend API response
- ✅ Trend indicators show (up/down arrows, percentages)
- ✅ Recent orders list shows last 10 orders
- ✅ Loading skeleton appears initially
- ✅ Data populates after API response

**Backend API Verification:**
- ✅ `GET /api/v1/vendor/dashboard/stats` called on page load
- ✅ Response structure matches UI expectations
- ✅ Data displayed matches API response exactly

---

#### Test Case 8.1.8: Edit Listing Flow (UI)
**Priority:** 🟡 HIGH  
**Browser Action:** Navigate to edit page and update listing

**Test Steps:**
1. Navigate to `/vendor/services/:storeId/listings`
2. Click "Edit" button on a listing
3. Verify form pre-populated with existing data
4. Modify fields (e.g., price, description)
5. Upload new images (if needed)
6. Click "Save" or "Update"
7. Verify success and redirect

**Expected UI Results:**
- ✅ Edit form loads with existing data
- ✅ Pre-populated fields correct
- ✅ Changes can be made
- ✅ Image preview works
- ✅ Update button works
- ✅ Changes reflected in listing list

**Backend API Verification:**
- ✅ `GET /api/v1/{type}/:id` called to fetch listing data
- ✅ `PUT /api/v1/{type}/:id` called with updated data
- ✅ Update successful

---

#### Test Case 8.1.9: Listing Status Change (UI)
**Priority:** 🟡 HIGH  
**Browser Action:** Change listing status via UI

**Test Steps:**
1. Navigate to listing list page
2. Find listing with status dropdown
3. Change status: ACTIVE → PAUSED
4. Verify status updates in UI
5. Change status: PAUSED → TRIAL_PERIOD
6. Verify status updates
7. Change status: TRIAL_PERIOD → ACTIVE
8. Verify all statuses work

**Expected UI Results:**
- ✅ Status dropdown shows all statuses (including TRIAL_PERIOD)
- ✅ Status change reflected immediately in UI
- ✅ Loading indicator during update
- ✅ Success feedback (toast/notification)
- ✅ Status badge/icon updates

**Backend API Verification:**
- ✅ `PUT /api/v1/vendors/:vendorId/listings/:listingId/status` called
- ✅ Status updated in database
- ✅ Response confirms status change

---

### 8.2 Admin Portal - Navigation & Flows

#### Test Case 8.2.1: Admin Login Flow
**Priority:** 🔴 CRITICAL  
**Browser Action:** Navigate and login as admin

**Test Steps:**
1. Navigate to `/admin/login`
2. Enter admin credentials (email + password or OTP)
3. Click "Login"
4. Verify redirect to admin dashboard

**Expected UI Results:**
- ✅ Admin login form displays
- ✅ Login button works
- ✅ Redirects to `/admin/dashboard`
- ✅ Admin sidebar visible

**Backend API Verification:**
- ✅ `POST /api/v1/auth/admin/login` called
- ✅ Admin authenticated successfully
- ✅ Admin token stored

---

#### Test Case 8.2.2: Admin Dashboard Navigation
**Priority:** 🔴 CRITICAL  
**Browser Action:** Navigate through admin sidebar

**Test Steps:**
1. Login as admin
2. Click each sidebar menu item:
   - "Dashboard" → `/admin/dashboard`
   - "Michelle Profiles" → `/admin/michelle-profiles`
   - "Vendors" → `/admin/vendors`
   - "Listings" → `/admin/listings`
   - "Customers" → `/admin/customers`
   - "Moderation" → `/admin/moderation`
   - "Reviews" → `/admin/reviews`
   - "Reports" → `/admin/reports`
   - "Settings" → `/admin/settings`
3. Verify each screen loads

**Expected UI Results:**
- ✅ All 8-10 sidebar items visible (based on implementation)
- ✅ Each click navigates correctly
- ✅ URL updates
- ✅ Page content loads
- ✅ No 404 errors

**Backend API Verification:**
- ✅ Each screen calls appropriate admin API
- ✅ `GET /api/v1/admin/dashboard/stats` for dashboard
- ✅ `GET /api/v1/admin/vendors` for vendors
- ✅ `GET /api/v1/admin/listings` for listings
- ✅ etc.

---

#### Test Case 8.2.3: Admin Dashboard Stats Display
**Priority:** 🔴 CRITICAL  
**Browser Action:** View admin dashboard stats

**Test Steps:**
1. Navigate to `/admin/dashboard`
2. Verify stats display:
   - Total Users (with trend)
   - Active Vendors (with trend)
   - Revenue This Month (with trend)
   - Active Orders Today
   - New Vendors This Week
3. Verify numbers match backend

**Expected UI Results:**
- ✅ All stat cards display
- ✅ Numbers formatted correctly
- ✅ Trend indicators show (up/down, percentages)
- ✅ Data matches API response

**Backend API Verification:**
- ✅ `GET /api/v1/admin/dashboard/stats` called
- ✅ Response includes all metrics
- ✅ UI displays data correctly

---

#### Test Case 8.2.4: Create Michelle Profile Flow (UI)
**Priority:** 🟡 HIGH  
**Browser Action:** Fill and submit Michelle profile form

**Test Steps:**
1. Navigate to `/admin/michelle-profiles`
2. Click "Create Profile" or "Add New Profile"
3. Fill profile form:
   - Business Name: "Michelle's Cleaning Services"
   - Description: "Platform-owned service"
   - Regions: Select multiple regions
4. Click "Create" or "Save"
5. Verify success and redirect

**Expected UI Results:**
- ✅ Form displays correctly
- ✅ All fields fillable
- ✅ Success message appears
- ✅ Profile appears in list
- ✅ "isMichelle" badge visible

**Backend API Verification:**
- ✅ `POST /api/v1/admin/michelle-profiles` called
- ✅ Profile created with isMichelle = true
- ✅ Profile appears in list API response

---

#### Test Case 8.2.5: Profile Analytics Display
**Priority:** 🟡 HIGH  
**Browser Action:** View analytics page for Michelle profile

**Test Steps:**
1. Navigate to `/admin/michelle-profiles/:id/analytics`
2. Verify analytics display:
   - Views, Bookings, Revenue (with trends)
   - Charts (line charts, pie charts)
   - Top performers
3. Change date range filter (7 days, 30 days, month, year)
4. Verify data updates

**Expected UI Results:**
- ✅ Analytics page loads
- ✅ Charts render correctly
- ✅ Data displays
- ✅ Date range filter works
- ✅ Charts update when filter changes

**Backend API Verification:**
- ✅ `GET /api/v1/admin/michelle-profiles/:id/analytics?dateRange=30days` called
- ✅ API called again when date range changes
- ✅ Charts data matches API response

---

#### Test Case 8.2.6: Suspend Vendor Flow (UI)
**Priority:** 🟡 HIGH  
**Browser Action:** Suspend vendor from admin panel

**Test Steps:**
1. Navigate to `/admin/vendors`
2. Find vendor in list
3. Click "Suspend" or "Actions" → "Suspend"
4. Confirm suspension in modal/dialog
5. Verify vendor status updates in UI

**Expected UI Results:**
- ✅ Suspend button/action visible
- ✅ Confirmation modal appears
- ✅ Status updates to "Suspended"
- ✅ Status badge changes color/icon
- ✅ Vendor removed from active list (if filtered)

**Backend API Verification:**
- ✅ `PUT /api/v1/admin/vendors/:id/status` called
- ✅ Status = SUSPENDED in database
- ✅ Vendor's listings also suspended (or hidden)

---

#### Test Case 8.2.7: Review Report Flow (UI)
**Priority:** 🟡 HIGH  
**Browser Action:** Review and act on reported listing

**Test Steps:**
1. Navigate to `/admin/moderation/listings`
2. Find reported listing
3. Click "Review" or "View Report"
4. Read report details
5. Click "Approve & Suspend" or "Reject"
6. Verify action applied

**Expected UI Results:**
- ✅ Reports list displays
- ✅ Report details visible
- ✅ Action buttons work
- ✅ Status updates after action
- ✅ Report removed from pending list

**Backend API Verification:**
- ✅ `GET /api/v1/admin/reports` called
- ✅ `PUT /api/v1/admin/reports/:id/status` called
- ✅ Listing status updated if suspended

---

#### Test Case 8.2.8: Export Platform Reports (UI)
**Priority:** 🟡 MEDIUM  
**Browser Action:** Export reports as CSV/PDF

**Test Steps:**
1. Navigate to `/admin/reports`
2. Select date range (30 days)
3. Click "Export CSV" or "Download Report" button
4. Verify file downloads
5. Repeat for PDF export

**Expected UI Results:**
- ✅ Export button visible
- ✅ Date range selector works
- ✅ File downloads after click
- ✅ Download starts immediately (or shows progress)

**Backend API Verification:**
- ✅ `GET /api/v1/admin/reports/platform/export?format=csv&dateRange=30days` called
- ✅ File returned with correct content-type
- ✅ File content matches report data

---

### 8.3 Role-Based Access Control Testing

#### Test Case 8.3.1: Vendor Access - Authorized Routes
**Priority:** 🔴 CRITICAL  
**Browser Action:** Login as vendor and access vendor routes

**Test Steps:**
1. Login as vendor
2. Navigate to vendor routes:
   - `/vendor/dashboard` ✅ Should load
   - `/vendor/services` ✅ Should load
   - `/vendor/orders` ✅ Should load
   - `/vendor/profile` ✅ Should load
3. Verify all routes accessible

**Expected UI Results:**
- ✅ All vendor routes accessible when logged in as vendor
- ✅ No 403 Forbidden errors
- ✅ Data loads correctly

**Backend API Verification:**
- ✅ All vendor API calls succeed (200 OK)
- ✅ Vendor ID matches authenticated vendor
- ✅ No unauthorized access errors

---

#### Test Case 8.3.2: Vendor Access - Unauthorized Routes
**Priority:** 🔴 CRITICAL  
**Browser Action:** Try to access admin routes as vendor

**Test Steps:**
1. Login as vendor
2. Try to navigate to admin routes:
   - `/admin/dashboard` ❌ Should redirect or show 403
   - `/admin/vendors` ❌ Should redirect or show 403
   - `/admin/listings` ❌ Should redirect or show 403
3. Verify access denied

**Expected UI Results:**
- ✅ Redirected to vendor dashboard or login
- ✅ 403 Forbidden page shown (if implemented)
- ✅ Error message: "Access denied" or similar

**Backend API Verification:**
- ✅ Admin API calls return 403 Forbidden
- ✅ Error message clear: "Not authorized" or "Admin access required"

---

#### Test Case 8.3.3: Admin Access - Authorized Routes
**Priority:** 🔴 CRITICAL  
**Browser Action:** Login as admin and access admin routes

**Test Steps:**
1. Login as admin
2. Navigate to all admin routes
3. Verify all accessible

**Expected UI Results:**
- ✅ All admin routes accessible
- ✅ No access denied errors

**Backend API Verification:**
- ✅ All admin API calls succeed
- ✅ Admin role verified in middleware

---

#### Test Case 8.3.4: Admin Access - Vendor Routes (Optional)
**Priority:** 🟡 MEDIUM  
**Browser Action:** Admin accessing vendor portal (if allowed)

**Test Steps:**
1. Login as admin
2. Try to access vendor routes (if admin can impersonate)
3. Verify behavior (allow or deny)

**Expected UI Results:**
- ✅ Behavior matches business logic (may allow or deny)

**Backend API Verification:**
- ✅ API behavior matches access control rules

---

#### Test Case 8.3.5: Unauthenticated Access
**Priority:** 🔴 CRITICAL  
**Browser Action:** Access protected routes without login

**Test Steps:**
1. Logout (or clear cookies/localStorage)
2. Try to access protected routes:
   - `/vendor/dashboard` → Should redirect to `/vendor/login`
   - `/admin/dashboard` → Should redirect to `/admin/login`
3. Verify redirects

**Expected UI Results:**
- ✅ Redirected to login page
- ✅ Original URL stored (for redirect after login)
- ✅ No data displayed without auth

**Backend API Verification:**
- ✅ API calls return 401 Unauthorized
- ✅ Token validation fails
- ✅ Error message: "Authentication required"

---

### 8.4 End-to-End Workflows

#### Test Case 8.4.1: Complete Vendor Onboarding Flow
**Priority:** 🔴 CRITICAL  
**Browser Action:** Full signup → profile setup → store creation → listing creation

**Test Steps:**
1. **Signup:** Navigate to `/vendor/signup`, enter email, verify OTP
2. **Profile Setup:** Fill vendor profile form (if required)
3. **Subscription:** Select subscription plan (if required)
4. **Create Store:** Navigate to services, create first store
5. **Assign Regions:** Add regions to store
6. **Create Listing:** Create first listing for store
7. **Verify:** Dashboard shows new store and listing

**Expected UI Results:**
- ✅ Smooth flow from signup to listing creation
- ✅ Each step completes successfully
- ✅ No errors or unexpected redirects
- ✅ Final state: Vendor has store and listing

**Backend API Verification:**
- ✅ Each step triggers correct API calls
- ✅ Data persisted correctly
- ✅ Dashboard stats update after each action

---

#### Test Case 8.4.2: Complete Order Flow (Vendor + Customer)
**Priority:** 🟡 HIGH  
**Browser Action:** Customer places order → Vendor accepts → Order completed

**Test Steps:**
1. **As Customer:** Search for food listing, place order
2. **As Vendor:** Login, navigate to orders, see pending order
3. **As Vendor:** Accept order
4. **As Vendor:** Mark order as "In Progress"
5. **As Vendor:** Mark order as "Completed"
6. **As Customer:** Verify order status updated
7. **As Vendor:** Verify earnings updated in dashboard

**Expected UI Results:**
- ✅ Order appears in vendor's orders list
- ✅ Status updates reflected in UI
- ✅ Dashboard earnings update after completion
- ✅ Both sides see correct order status

**Backend API Verification:**
- ✅ Order created: `POST /api/v1/orders`
- ✅ Order status updates: `PUT /api/v1/orders/:id/status`
- ✅ Dashboard stats recalculated

---

#### Test Case 8.4.3: Complete Moderation Flow
**Priority:** 🟡 HIGH  
**Browser Action:** Customer reports listing → Admin reviews → Admin suspends

**Test Steps:**
1. **As Customer:** Report a listing (if report feature exists)
2. **As Admin:** Login, navigate to moderation
3. **As Admin:** View reported listing
4. **As Admin:** Review report, suspend listing
5. **As Vendor:** Verify listing status changed to SUSPENDED
6. **As Customer:** Verify listing no longer visible in search

**Expected UI Results:**
- ✅ Report submitted successfully
- ✅ Admin sees report in moderation queue
- ✅ Listing suspended after admin action
- ✅ Listing disappears from public view

**Backend API Verification:**
- ✅ Report created (if report API exists)
- ✅ `PUT /api/v1/admin/reports/:id/status` called
- ✅ `PUT /api/v1/admin/listings/:id/status` called
- ✅ Listing status = SUSPENDED

---

### 8.5 UI Interactions & API Calls

#### Test Case 8.5.1: Form Validation - Frontend + Backend
**Priority:** 🟡 HIGH  
**Browser Action:** Submit forms with invalid data

**Test Steps:**
1. Try to create store without required fields
2. Try to create listing with invalid price (negative, string)
3. Try to upload invalid file type (not image)
4. Verify both frontend and backend validation

**Expected UI Results:**
- ✅ Frontend validation shows errors immediately
- ✅ Form cannot be submitted until valid
- ✅ Error messages clear and actionable
- ✅ Backend validation also catches issues (if frontend bypassed)

**Backend API Verification:**
- ✅ Backend returns 400 Bad Request for invalid data
- ✅ Validation errors in response
- ✅ No invalid data saved to database

---

#### Test Case 8.5.2: Loading States & Error Handling
**Priority:** 🟡 MEDIUM  
**Browser Action:** Observe UI during API calls

**Test Steps:**
1. Navigate to dashboard (slow network or slow API)
2. Observe loading indicators
3. Simulate API error (network failure or 500 error)
4. Verify error message displays

**Expected UI Results:**
- ✅ Loading skeleton/spinner shows during API calls
- ✅ Error message displays on API failure
- ✅ Retry button available (if applicable)
- ✅ No blank screens or crashes

**Backend API Verification:**
- ✅ API errors return correct status codes
- ✅ Error messages in response
- ✅ No sensitive error details exposed

---

#### Test Case 8.5.3: Real-time Data Updates
**Priority:** 🟡 MEDIUM  
**Browser Action:** Verify data updates after actions

**Test Steps:**
1. Create new listing
2. Navigate back to listings list
3. Verify new listing appears (without page refresh)
4. Update listing status
5. Verify status updates in UI immediately

**Expected UI Results:**
- ✅ Data updates without full page reload
- ✅ Optimistic updates work (UI updates before API confirms)
- ✅ Or: Data refreshes after API success

**Backend API Verification:**
- ✅ API calls succeed
- ✅ Data persisted correctly
- ✅ Subsequent GET requests return updated data

---

### 8.6 Screen Navigation & Routing

#### Test Case 8.6.1: Deep Linking
**Priority:** 🟡 MEDIUM  
**Browser Action:** Access direct URLs

**Test Steps:**
1. Navigate directly to `/vendor/services/abc123/listings/def456/edit`
2. Verify page loads correctly (if authenticated)
3. Navigate directly to `/admin/vendors/xyz789`
4. Verify vendor detail page loads

**Expected UI Results:**
- ✅ Direct URLs work (if authenticated)
- ✅ Correct data loads for the ID
- ✅ 404 error if ID doesn't exist

**Backend API Verification:**
- ✅ API called with correct ID from URL
- ✅ 404 returned if resource doesn't exist
- ✅ 403 returned if not authorized

---

#### Test Case 8.6.2: Browser Back/Forward Navigation
**Priority:** 🟡 LOW  
**Browser Action:** Use browser back/forward buttons

**Test Steps:**
1. Navigate through multiple screens
2. Click browser "Back" button
3. Verify previous page loads correctly
4. Click browser "Forward" button
5. Verify navigation works

**Expected UI Results:**
- ✅ Browser history works correctly
- ✅ Pages load correctly when navigating back
- ✅ URL updates correctly
- ✅ No duplicate API calls

---

## Test Execution Summary

### Test Phases

| Phase | Test Cases | Priority | Estimated Time |
|-------|-----------|----------|----------------|
| **1. Vendor Portal** | 25 cases | 🔴 CRITICAL | 8 hours |
| **2. Admin Portal** | 20 cases | 🔴 CRITICAL | 6 hours |
| **3. Mobile Integration** | 15 cases | 🔴 CRITICAL | 4 hours |
| **4. API Endpoints** | 10 cases | 🔴 CRITICAL | 3 hours |
| **5. Database & Migration** | 5 cases | 🔴 CRITICAL | 2 hours |
| **6. Error Handling** | 5 cases | 🟡 MEDIUM | 2 hours |
| **7. Performance** | 2 cases | 🟡 MEDIUM | 1 hour |
| **8. Browser MCP Testing** | 35 cases | 🔴 CRITICAL | 12 hours |

**Total Test Cases:** 117  
**Total Estimated Time:** ~38 hours (~5 days)

---

## Test Environment Setup

### Prerequisites

1. **Database:**
   - PostgreSQL test database
   - Migration scripts ready
   - Seed data scripts ready

2. **File Storage:**
   - S3 bucket (test) or local storage
   - CDN configured (or mock)

3. **External Services:**
   - OTP service (mock or test account)
   - Google OAuth (test credentials)
   - Payment provider (Stripe test mode)

4. **Test Data:**
   - Test vendors (10+)
   - Test customers (10+)
   - Test listings (50+)
   - Test orders/bookings (100+)

---

## Test Reporting

### Test Results Template

**Test Case:** [ID] - [Name]  
**Status:** ✅ PASS / ❌ FAIL / ⚠️ SKIP  
**Execution Time:** [duration]  
**Notes:** [any issues or observations]

### Defect Tracking

**Defect ID:** [unique ID]  
**Severity:** 🔴 CRITICAL / 🟡 HIGH / 🟢 MEDIUM / 🔵 LOW  
**Priority:** P0 / P1 / P2 / P3  
**Status:** Open / In Progress / Fixed / Verified  
**Description:** [detailed description]  
**Steps to Reproduce:** [step-by-step]  
**Expected vs Actual:** [comparison]

---

## Sign-Off Criteria

### Must Pass (Blocking Release)

- ✅ All CRITICAL test cases pass
- ✅ All database migrations successful
- ✅ All 9 listing types functional
- ✅ Authentication (OTP + OAuth) works
- ✅ File upload works
- ✅ Dashboard stats calculate correctly
- ✅ No data loss during migration

### Should Pass (Recommended)

- ✅ All HIGH priority test cases pass
- ✅ Performance acceptable (< 2s for dashboard, < 1s for search)
- ✅ Error handling consistent
- ✅ Mobile app integration works

### Nice to Have (Can Defer)

- ⏸️ All MEDIUM/LOW priority test cases pass
- ⏸️ Performance optimized (< 1s for all endpoints)
- ⏸️ Comprehensive edge case coverage

---

**Status:** 📋 Test Plan Ready (Includes Browser MCP Testing)  
**Last Updated:** January 17, 2026  
**Next Steps:** Set up test environment, configure Browser MCP tools, and begin Phase 1 testing


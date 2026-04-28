# DoHuub Wireframe Verification Checklist

> **Purpose:** Verify wireframes against proposal requirements  
> **Source:** DoHuub Development Proposal (Michelle Williams)  
> **Note:** All items below are directly referenced in or derived from the proposal document.

---

## 📱 PART A: Customer Mobile App (iOS & Android)

---

### A1. Onboarding & Authentication

#### A1.1 Location Permission Screen
*Source: Section 4 - Step 1*
- [ ] Request to allow location access
- [ ] Option to allow location
- [ ] Option to enter location manually / deny

#### A1.2 Onboarding Tutorial Carousel
*Source: Section 4 - Step 2, Section 5 - App Access*
- [ ] Slide: DoHuub intro as lifestyle super-app
- [ ] Slide: Six service categories overview
- [ ] Slide: Booking, tracking, payment steps
- [ ] "Next" button
- [ ] "Previous" button
- [ ] "Skip" button
- [ ] "Get Started" button (final slide)

#### A1.3 Registration Screen
*Source: Section 4 - Step 3, Section 5 - User Registration*
- [ ] Email input field
- [ ] "Register with Email" option (triggers OTP)
- [ ] "Register with Gmail" / Google Sign-In option
- [ ] Link to Login screen

#### A1.4 Login Screen
*Source: Section 5 - User Registration & Login*
- [ ] Email input field
- [ ] "Login with Email + OTP" option
- [ ] "Login with Gmail" option
- [ ] Link to Registration screen

#### A1.5 OTP Verification Screen
*Source: Section 5 - User Registration & Login*
- [ ] OTP input field(s)
- [ ] "Resend OTP" option
- [ ] "Verify" / Confirm button

#### A1.6 Profile Setup Screen
*Source: Section 4 - Step 3*
- [ ] Name input
- [ ] Phone number input
- [ ] Add saved addresses section:
  - [ ] Home address
  - [ ] Work address
  - [ ] Doctor address
  - [ ] Pharmacy address
- [ ] Complete/Continue button

---

### A2. Home & Navigation

#### A2.1 Home Dashboard
*Source: Section 4 - Step 4, Section 5 - Home Dashboard*
- [ ] Current location display
- [ ] Option to change/edit location
- [ ] Six service category cards/tiles:
  - [ ] Cleaning Services
  - [ ] Handyman Services
  - [ ] Groceries & Food
  - [ ] Beauty on DE Run
  - [ ] Rental Properties
  - [ ] Caregiving Services
- [ ] Inactive categories greyed out (based on location)
- [ ] Michelle's listings appear first with "Powered by DoHuub" badge
- [ ] Access to AI Chat Assistant (from home screen or menu)

#### A2.2 Location Change Screen/Modal
*Source: Section 3 - Location-Based Experience, Section 5 - Location Detection*
- [ ] Current location display
- [ ] GPS/automatic location detection option
- [ ] Manual location selection (city/region)
- [ ] Option to order for friends/family in another area (international)

---

### A3. Service Listing Screens

#### A3.1 Category Listing Screen (Generic)
*Source: Section 4 - Step 5, Section 5 - Viewing Service Listings*
- [ ] List of providers in user's location
- [ ] Provider card showing:
  - [ ] Provider/Business name
  - [ ] Rating (stars)
  - [ ] Review count (number of reviews)
  - [ ] Distance from user
  - [ ] Starting price
- [ ] Michelle's listing first (if active) with "Powered by DoHuub" badge
- [ ] Vendors ranked by: rating → reviews → recent activity

#### A3.2 Provider/Listing Detail Screen (Generic)
*Source: Section 5 - Viewing Service Listings*
- [ ] Business name
- [ ] Service description
- [ ] Pricing
- [ ] Availability
- [ ] Ratings display
- [ ] Photos (if applicable)
- [ ] "Powered by DoHuub" badge (Michelle's listings)
- [ ] "Report Listing" option
- [ ] "Book Now" / "Order" button

---

### A4. Service-Specific Screens

#### A4.1 Cleaning Services

**A4.1a Sub-Category Selection**
*Source: Section 1, Section 5 - Cleaning Services*
- [ ] Deep Cleaning option
- [ ] Laundry option
- [ ] Office Cleaning option

**A4.1b Cleaning Booking Form**
*Source: Section 5 - Cleaning Services*
- [ ] View service details and pricing
- [ ] Add special notes (e.g., "We have pets")
- [ ] Select date
- [ ] Select time
- [ ] Submit booking request
- [ ] Pay via Stripe

---

#### A4.2 Handyman Services

**A4.2a Repair Type Selection**
*Source: Section 5 - Handyman Services*
- [ ] Select repair type (electrical, plumbing, installation)

**A4.2b Handyman Booking Form**
*Source: Section 5 - Handyman Services*
- [ ] Enter problem description
- [ ] Upload reference photo (optional)
- [ ] Choose preferred schedule
- [ ] Confirm booking
- [ ] Payment via Stripe

---

#### A4.3 Groceries & Food

**A4.3a Browse Screen**
*Source: Section 5 - Groceries & Food*
- [ ] Browse grocery and meal categories
- [ ] Product/dish listing with prices

**A4.3b Cart & Ordering**
*Source: Section 5 - Groceries & Food*
- [ ] Add products or dishes to cart
- [ ] Adjust quantities (add/remove)
- [ ] Checkout with secure Stripe payment
- [ ] Option to order for friends/family in another region/country

---

#### A4.4 Beauty on DE Run

**A4.4a Service Selection**
*Source: Section 1, Section 5 - Beauty on DE Run*
- [ ] Makeup option
- [ ] Hair option
- [ ] Nails option
- [ ] Wellness option

**A4.4b Beauty Booking Form**
*Source: Section 5 - Beauty on DE Run*
- [ ] Choose desired service (type, style, or package)
- [ ] View portfolio photos (if available)
- [ ] Select date
- [ ] Select time
- [ ] Add special requests
- [ ] Confirm booking
- [ ] Complete payment

---

#### A4.5 Rental Properties

**A4.5a Property Listing Screen**
*Source: Section 5 - Rental Properties*
- [ ] Listings with photos
- [ ] Property descriptions
- [ ] Bedrooms count
- [ ] Bathrooms count
- [ ] Amenities list
- [ ] Filter options:
  - [ ] Bedrooms
  - [ ] Amenities
  - [ ] Dates
  - [ ] Pricing

**A4.5b Property Detail Screen**
*Source: Section 5 - Rental Properties*
- [ ] Photos
- [ ] Full description
- [ ] Availability calendar
- [ ] Pricing display

**A4.5c Rental Booking Form**
*Source: Section 5 - Rental Properties*
- [ ] Select stay duration (min 1 day – max 6+ months)
- [ ] Confirm rental
- [ ] Submit payment securely

---

#### A4.6 Caregiving Services

**A4.6a Service Type Selection**
*Source: Section 1, Section 5 - Caregiving Services*
- [ ] Ride Assistance option
- [ ] Companionship Support option

**A4.6b Ride Assistance Booking**
*Source: Section 5 - Caregiving Services*
- [ ] Add pickup location
- [ ] Add multiple stops (e.g., pharmacy, grocery)
- [ ] Round-trip option
- [ ] Confirm booking
- [ ] Payment via Stripe

**A4.6c Companionship Support Booking**
*Source: Section 5 - Caregiving Services*
- [ ] Select duration
- [ ] Select availability
- [ ] Confirm booking
- [ ] Payment via Stripe

---

### A5. Booking & Checkout

#### A5.1 Customize Booking Screen (Generic)
*Source: Section 4 - Step 6*
- [ ] Preferred date & time selection
- [ ] Selected address display/selection
- [ ] Notes/special instructions field

#### A5.2 Stripe Payment
*Source: Section 4 - Step 7, Section 5 - Security*
- [ ] Stripe payment integration
- [ ] International transaction support
- [ ] PCI-compliant payment processing

#### A5.3 Booking Confirmation
*Source: Section 4 - Step 7*
- [ ] Booking confirmation summary displayed

---

### A6. Order & Booking Tracking

#### A6.1 My Bookings Screen
*Source: Section 4 - Step 8, Section 5 - Order/Booking Tracking*
- [ ] Access "My Bookings" section
- [ ] View all active and past orders
- [ ] Status display per booking:
  - [ ] Accepted (confirmed by provider)
  - [ ] In Progress (currently being handled)
  - [ ] Completed (finished service)

#### A6.2 Booking Detail Screen
*Source: Section 5 - Order/Booking Tracking*
- [ ] Booking status with progress
- [ ] Automatic status notifications (push)
- [ ] Re-order/re-book past service option

---

### A7. AI Chat Assistant

#### A7.1 Chat Interface
*Source: Section 1 - AI Chat Assistant, Section 4 - Step 9, Section 5 - AI Chat Assistant*
- [ ] Engage AI assistant from home screen or menu
- [ ] Natural language input (text)
- [ ] AI response with service/product recommendations
- [ ] Example queries supported:
  - [ ] "Find me a nearby handyman for tomorrow morning"
  - [ ] "Show healthy food options in my area"
  - [ ] "How can I book a ride for my grandmother to her doctor's appointment"
- [ ] 24/7 availability

---

### A8. Rating & Review

#### A8.1 Leave Review Screen
*Source: Section 4 - Step 10, Section 5 - Rating & Review*
- [ ] Star rating (1 to 5)
- [ ] Written review input
- [ ] Photo upload option (optional)
- [ ] Submit review button
- [ ] Reviews affect listing rankings

---

### A9. Report Listing

#### A9.1 Report Listing Screen/Modal
*Source: Section 5 - Reporting Listings*
- [ ] "Report Listing" tap option
- [ ] Choose a reason
- [ ] Write a short comment
- [ ] Submit report
- [ ] Listing hidden until admin review

---

### A10. Account & Profile Settings

#### A10.1 Profile/Account Screen
*Source: Section 5 - Account & Profile Settings*
- [ ] View and edit profile:
  - [ ] Name
  - [ ] Email
  - [ ] Photo
- [ ] Manage saved addresses (Home, Work, etc.)
- [ ] Access order history
- [ ] View Terms of Service
- [ ] View Privacy Policy
- [ ] Manage notifications (enable/disable)
- [ ] Change region option
- [ ] Logout option
- [ ] Delete Account option

---

## 💼 PART B: Business Owner Web App

---

### B1. Authentication

#### B1.1 Registration Page
*Source: Section 6 - Registration & Login*
- [ ] Email input
- [ ] Sign up with Email + OTP option
- [ ] Sign up with Gmail option
- [ ] Accept Terms & Conditions (before activation)

#### B1.2 Login Page
*Source: Section 6 - Registration & Login*
- [ ] Email input
- [ ] Login with Email + OTP option
- [ ] Login with Gmail option
- [ ] Safe logout option

#### B1.3 OTP Verification Page
*Source: Section 6 - Registration & Login*
- [ ] OTP input
- [ ] Reset access via OTP (if credentials lost)
- [ ] Verify button

---

### B2. Business Onboarding (Setup Wizard)

*Source: Section 4 - Business Owner Flow, Section 6 - Business Onboarding*

#### B2.1 Step 1: Business Name
- [ ] Enter Business Name input

#### B2.2 Step 2: Logo & Cover Image
- [ ] Upload Logo
- [ ] Upload Cover Image (optional)

#### B2.3 Step 3: Business Description
- [ ] Write Business Description / About Section

#### B2.4 Step 4: Contact Details
- [ ] Add Contact Details (for internal records)

#### B2.5 Step 5: Service Categories Selection
- [ ] Select service categories offered:
  - [ ] Cleaning Services
  - [ ] Handyman Services
  - [ ] Groceries & Food
  - [ ] Beauty on DE Run
  - [ ] Rental Properties
  - [ ] Caregiving Services

#### B2.6 Step 6: Service Areas
- [ ] Define service areas covered (cities/regions)
- [ ] Add multiple regions (ZIP codes)
- [ ] Toggle areas ON/OFF without deleting
- [ ] Multi-region operation under one account

---

### B3. Availability Settings

#### B3.1 Availability Setup Page
*Source: Section 4 - Business Owner Flow Step 4, Section 6 - Availability Settings*
- [ ] Configure working days and hours
- [ ] Set availability per category or region
- [ ] Pause services temporarily (Toggle ON/OFF without deleting)

---

### B4. Subscription & Free Trial

#### B4.1 Subscription Page
*Source: Section 6 - Subscription & Free Trial*
- [ ] 1-month free trial indicator
- [ ] View subscription status:
  - [ ] Trial Active
  - [ ] Trial Ending Soon
  - [ ] Active
  - [ ] Expired
- [ ] Countdown timer for trial days remaining
- [ ] Subscribe monthly via Stripe (after trial)
- [ ] Pause subscription option
- [ ] Cancel subscription option
- [ ] Reactivate subscription option
- [ ] Access billing history

---

### B5. Service Listing Creation (Category-Specific Forms)

*Source: Section 6 - Service Listing Creation*

#### B5.1 Cleaning Services Listing Form
- [ ] Service type (deep clean, laundry, office clean)
- [ ] Description
- [ ] Rate
- [ ] Images
- [ ] Availability schedule

#### B5.2 Handyman Services Listing Form
- [ ] Repair type (plumbing, electrical, installation)
- [ ] Description
- [ ] Base rate (hourly/fixed)
- [ ] Photos
- [ ] Schedule

#### B5.3 Groceries & Food Listing Form
- [ ] Product or dish name
- [ ] Description
- [ ] Category
- [ ] Price
- [ ] Stock availability
- [ ] Image

#### B5.4 Beauty on DE Run Listing Form
- [ ] Service type (makeup, hair, nails, wellness)
- [ ] Duration
- [ ] Pricing
- [ ] Photos
- [ ] Availability slots

#### B5.5 Rental Properties Listing Form
- [ ] Property photos
- [ ] Address
- [ ] Bedrooms
- [ ] Bathrooms
- [ ] Amenities
- [ ] Nightly/weekly/monthly rates
- [ ] Availability calendar (1 day – 6+ months)

#### B5.6 Caregiving Services Listing Form
- [ ] Service type (Ride Assistance / Companionship Support)
- [ ] Description
- [ ] Pricing
- [ ] Availability window
- [ ] Service area

---

### B6. Listing Management

#### B6.1 My Listings Page
*Source: Section 6 - Listing Management*
- [ ] View all active listings
- [ ] Edit titles, descriptions, images, pricing
- [ ] Toggle listings ON/OFF
- [ ] Delete listings
- [ ] Real-time updates (customers see latest info)

---

### B7. Order / Request Management

#### B7.1 Orders/Bookings Page
*Source: Section 4 - Business Owner Flow Step 7, Section 6 - Order/Request Management*
- [ ] View all incoming customer orders and booking requests
- [ ] View order details
- [ ] Manage status:
  - [ ] Accept
  - [ ] Decline
  - [ ] In Progress
  - [ ] Completed
  - [ ] Cancel
- [ ] System invites user to leave review after completion

---

### B8. Performance & Feedback

#### B8.1 Reviews Page
*Source: Section 4 - Business Owner Flow Step 8, Section 6 - Performance & Feedback*
- [ ] View total completed orders and bookings
- [ ] Track average rating
- [ ] Read reviews
- [ ] Ratings/reviews improve visibility ranking

---

### B9. Account Management

#### B9.1 Account Settings Page
*Source: Section 6 - Account Management*
- [ ] Update profile and branding images
- [ ] Modify service areas or availability
- [ ] Manage subscriptions and billing through Stripe
- [ ] Download receipts or invoices
- [ ] Delete account (if no longer active)

---

### B10. Compliance & Moderation

#### B10.1 Notifications/Alerts
*Source: Section 6 - Compliance & Moderation*
- [ ] Receive notifications if listing is reported or suspended
- [ ] Edit and resubmit listing for review
- [ ] Restore approved listings after admin validation
- [ ] Maintain active subscription to stay visible

---

## 🛡️ PART C: Admin Panel (Michelle's Control Panel)

---

### C1. Authentication

#### C1.1 Admin Login Page
*Source: Section 7 - Admin Login & Security*
- [ ] Secure login for Michelle and authorized team
- [ ] Password or OTP-based access
- [ ] Automatic session timeout
- [ ] Manual logout option

---

### C2. Dashboard

#### C2.1 Admin Dashboard Home
*Source: Section 7 - Dashboard Overview*
- [ ] Total registered customers
- [ ] Total registered business owners
- [ ] Active vendor subscriptions count
- [ ] Expired vendor subscriptions count
- [ ] Number of listings currently live
- [ ] Number of reported listings awaiting review

---

### C3. Manage Michelle's Own Services

#### C3.1 Michelle's Listings Page
*Source: Section 7 - Manage Michelle's Own Services*
- [ ] Add platform-owned services
- [ ] Edit platform-owned services
- [ ] Assign geographic regions where services active
- [ ] Listings appear first in those regions
- [ ] "Powered by DoHuub" badge on listings
- [ ] Update descriptions, pricing, availability
- [ ] Enable listings
- [ ] Disable listings (temporarily)

---

### C4. Vendor (Business Owner) Management

#### C4.1 Vendors List Page
*Source: Section 7 - Vendor Management*
- [ ] View all registered vendors
- [ ] Complete profile information per vendor
- [ ] Check subscription status:
  - [ ] Trial Active
  - [ ] Active
  - [ ] Expired
- [ ] Filter vendors by service category
- [ ] Filter vendors by subscription tier

#### C4.2 Vendor Detail/Actions Page
*Source: Section 7 - Vendor Management*
- [ ] Access vendor's listings
- [ ] View areas served
- [ ] View activity logs
- [ ] Suspend/deactivate vendor accounts (violations)
- [ ] Reactivate vendor accounts (after resolution)

---

### C5. Listing Oversight & Moderation

#### C5.1 All Listings Page
*Source: Section 7 - Listing Oversight & Moderation*
- [ ] View all vendor listings across every service category
- [ ] Search listings
- [ ] Filter by category
- [ ] Filter by vendor
- [ ] Filter by geographic area
- [ ] Disable/hide listings (violate content/quality standards)
- [ ] Restore listings (after vendor corrections or admin approval)
- [ ] Michelle's listings auto-prioritized in visibility

---

### C6. Reported Listing Management

#### C6.1 Reported Listings Page
*Source: Section 7 - Reported Listing Management*
- [ ] View all reported listings
- [ ] Review reason provided by user
- [ ] Review comments provided by user
- [ ] Mark decision:
  - [ ] Approved and Restored (no violation found)
  - [ ] Removed Permanently (policy violation confirmed)
- [ ] Optional: automated notification to vendor
- [ ] Maintain moderation log for auditing

---

### C7. Subscription Monitoring

#### C7.1 Subscriptions Page
*Source: Section 7 - Subscription Monitoring*
- [ ] Monitor all vendor subscription statuses
- [ ] Track statuses:
  - [ ] Trial
  - [ ] Active
  - [ ] Expired
  - [ ] Paused
- [ ] Generate analytics on subscriptions and revenue

---

### C8. Customer Account Oversight

#### C8.1 Customers Page
*Source: Section 7 - Customer Account Oversight*
- [ ] View all registered customer accounts
- [ ] Deactivate/block users (spam or abuse)
- [ ] Restore accounts after review
- [ ] Review customer order histories and bookings

---

### C9. Admin Account Settings

#### C9.1 Admin Settings Page
*Source: Section 7 - Admin Account Settings*
- [ ] Update password
- [ ] Single admin account setup

---

## ✅ Summary Counts (Grounded in Proposal)

| Platform | Estimated Screen Count |
|----------|------------------------|
| **Customer Mobile App** | ~28-32 screens |
| **Business Owner Web App** | ~18-22 screens |
| **Admin Panel** | ~12-15 screens |
| **Total** | **~58-69 screens** |

---

## 📋 Verification Instructions

1. **Check each box** when screen/element is present in wireframes
2. **Cross-reference** with proposal section cited
3. **Add notes** for any deviations or interpretations
4. **Sign off** per section when complete

| Section | Reviewer | Date | Status |
|---------|----------|------|--------|
| Part A: Customer App | | | ☐ Pending |
| Part B: Business Web App | | | ☐ Pending |
| Part C: Admin Panel | | | ☐ Pending |

---

## 🔗 Source References

All items traced to:
- **Section 1:** Overview
- **Section 2:** Platform Interfaces Overview
- **Section 3:** Marketplace Structure & Core Mechanics
- **Section 4:** How the Application Works (Step-by-Step Flows)
- **Section 5:** Feature List – Customer App
- **Section 6:** Feature List – Business Owner Web App
- **Section 7:** Feature List – Admin Panel

---

*Last Updated: January 2026*

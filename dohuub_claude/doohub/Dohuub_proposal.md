# DoHuub Development Proposal

> **Client:** Michelle Williams  
> **Company:** DeepLearnHQ Corp.  
> **Website:** [www.deeplearnhq.tech](https://www.deeplearnhq.tech)  
> **Document Status:** Confidential

---

## 1. Overview

**DoHuub** is a multi-service lifestyle marketplace that connects customers to a wide range of everyday services in one simple app. Users can browse, book, and pay for services through secure in-app payments powered by **Stripe Merchant**, allowing them to order food or book services for themselves — or even for family members living in other countries.

### Core Service Categories

| # | Category | Description |
|---|----------|-------------|
| 1 | **Cleaning Services** | Deep cleaning, laundry, office cleaning |
| 2 | **Handyman Services** | Repairs, installations, home fixes |
| 3 | **Groceries & Food** | Browse local menus or grocery stock and order to doorstep |
| 4 | **Beauty on DE Run** | Makeup, hair, nails, wellness, and personal-care bookings |
| 5 | **Rental Properties** | Short-term and long-term stays with images, pricing, and amenities |
| 6 | **Caregiving Services** | Ride Assistance (doctor visits, pharmacy pickups, senior transport) & Companionship Support (wellness visits, basic help, personal assistance) |

### AI Chat Assistant

DoHuub includes an **AI Chat Assistant** that acts as a digital concierge — users can chat naturally, ask questions, and get instant product or service recommendations inside the app.

### Michelle's Priority Placement

Michelle's own services, when active, are always prioritized in search results and tagged **"Powered by DoHuub."** This ensures her brands appear first while still allowing other vendors to grow within the marketplace.

---

## 2. Platform Interfaces Overview

DoHuub operates through **three core interfaces** that work together to create a seamless experience for customers, businesses, and administrators.

### 📱 Customer-Facing Mobile App
- Available for both **iOS and Android**
- Browse services, make bookings, complete payments securely through Stripe
- Track orders in real time
- Interact with built-in AI Chat Assistant for service discovery

### 💼 Business Web Portal
- Service providers and business owners can:
  - Register their businesses
  - Manage profiles
  - Subscribe to monthly plans
  - Handle listings/inventory
  - Update availability
  - View bookings
  - Receive payments directly

### 🛡️ Admin Panel
- Secure web dashboard for Michelle's operations team
- Manage users, vendors, and services
- Oversee bookings
- Monitor payments
- Maintain marketplace integrity

---

## 3. Marketplace Structure & Core Mechanics

DoHuub operates as a **smart, location-aware marketplace** that connects people who need everyday services with trusted local businesses.

### How the Marketplace Works

| Who Uses It | What They Do |
|-------------|--------------|
| **Customers** (Mobile App) | Open app → allow location → browse six service categories → select provider → customize and pay securely via Stripe |
| **Business Owners** (Web App) | Register → build business profile → list category-specific services → set operating areas → manage bookings and subscription payments |
| **Admin** (Michelle/Team) | Oversees platform → manages Michelle's own listings → monitors vendor subscriptions → reviews reports → keeps marketplace compliant |

### Michelle's Special Role

Michelle serves as both the **platform owner (Admin)** and a **verified service provider** in selected categories:

- ✅ In every region where Michelle's company offers a service, her listings always appear **first**
- ✅ Listings carry a **"Powered by DoHuub"** badge
- ✅ All other vendor listings follow in order of quality (rating → review count → recency)

### How Third-Party Vendors Fit In

Through the Business Owner Web Portal, vendors can:
- Create an account and business profile
- Use category-specific listing forms
- Define service areas
- Set schedules and toggle availability ON/OFF
- Begin with **1-month free trial**, then subscribe monthly

### Service Ranking & Display Logic

1. **Michelle's listings** (if available) — always first, labeled "Powered by DoHuub"
2. **Top-rated vendors** — ranked by highest rating → number of reviews → recent activity
3. **Other vendors** — shown in descending order of ratings and reviews

### Location-Based Experience

- Users allow location access to see only nearby services
- Vendors can operate in multiple areas
- Users can manually change location to browse services for friends/family in another region

---

## 4. How the Application Works (Step-by-Step Flows)

### 📱 Customer Mobile App Flow

#### Step 1: App Launch & Location Access
- Allow location access for automatic nearby service detection
- Option to manually change address for ordering in other areas (including internationally)

#### Step 2: Onboarding Tutorial (Carousel)
- Introduction to DoHuub as a lifestyle super-app
- Overview of six service categories
- Simple steps for booking, tracking, and paying

#### Step 3: Account Registration / Login
- Register with email + OTP verification, or
- Log in with Google
- Complete profile (name, phone, saved addresses)

#### Step 4: Home Dashboard
- Six categories in scrollable grid
- Only available categories for current location are active
- Michelle's listings appear first with "Powered by DoHuub" badge

#### Step 5: Browse & Select a Service
- View providers with name, rating, distance, starting price
- Example flows:
  - **Cleaning** → Deep Cleaning, Laundry, Office Cleaning
  - **Beauty** → Makeup, Nails, Hair, Wellness
  - **Caregiving** → Ride Assistance, Companionship Support
  - **Rentals** → Filter by bedrooms, amenities, dates, pricing
  - **Groceries & Food** → Browse menus/products, add to cart

#### Step 6: Customize and Confirm Booking
- Preferred date & time
- Selected address
- Notes/special instructions

#### Step 7: Secure Payment via Stripe
- International transaction support
- Booking confirmation summary displayed

#### Step 8: Track Order or Service Status
- **My Bookings** section shows:
  - Accepted → confirmed by provider
  - In Progress → currently being handled
  - Completed → finished service
- Push notifications for status changes

#### Step 9: AI Chat Assistant Interaction
- Natural language questions:
  - *"Find me a nearby handyman for tomorrow morning."*
  - *"Show healthy food options in my area."*
  - *"How can I book a ride for my grandmother to her doctor's appointment?"*
- 24/7 availability with continuous improvement

#### Step 10: Completion & Review
- Order marked Completed
- Rate and review provider (1-5 stars)
- Upload optional photos
- Reviews affect listing rankings

---

### 💼 Business Owner Web App Flow

| Step | Action |
|------|--------|
| 1 | **Sign Up & Verification** — Email + OTP or Google login |
| 2 | **Profile Setup** — Business name, description, logo, contact info |
| 3 | **Service Area Selection** — Choose cities/regions, toggle active/inactive |
| 4 | **Availability Setup** — Define working hours per category |
| 5 | **Category-Specific Listing Forms** — Tailored forms for each service type |
| 6 | **Publish Listing & Trial Period** — Live immediately, 1-month free trial |
| 7 | **Manage Bookings** — View requests, change status, manage subscription |
| 8 | **Grow Reputation** — Ratings/reviews improve visibility |

---

### 🛡️ Admin Panel Flow

| Step | Action |
|------|--------|
| 1 | **Login & Access Dashboard** — Full marketplace visibility |
| 2 | **Manage Michelle's Listings** — Define categories and regions, auto-display first |
| 3 | **Vendor Management** — View active/trial/expired vendors, suspend/restore |
| 4 | **Subscription Monitoring** — Track payments, auto-deactivate lapsed subscriptions |
| 5 | **Marketplace Health & Reports** — Key counts and metrics |
| 6 | **Review Reported Listings** — Hide pending review, approve or remove |

---

## 5. Feature List – Customer App

### App Access & Getting Started
- Open app for first time
- Allow/deny location access
- View onboarding carousel (Next, Previous, Skip)
- Proceed to login/registration

### User Registration & Login

**Registration Options:**
- Email + OTP verification
- Gmail (Google Sign-In)

**Login Options:**
- Email + OTP
- Gmail

**Other Features:**
- Resend OTP
- Logout

### Location Detection & Selection
- Automatic GPS detection
- Manual location selection
- Change location for ordering elsewhere

### Home Dashboard
- View categories based on current location
- Inactive categories greyed out
- Categories:
  1. Cleaning Services
  2. Handyman Services
  3. Groceries & Food
  4. Beauty on DE Run
  5. Rental Properties
  6. Caregiving Services

### Viewing Service Listings
- All providers in location
- Michelle's listing first (if active) with badge
- Ranked by: rating → reviews → recent activity
- Listing details: name, description, pricing, availability, ratings, photos

### Service-Specific Actions

#### A) Cleaning Services
- Choose sub-category (Deep Cleaning, Laundry, Office Cleaning)
- View details and pricing
- Add special notes
- Select date/time
- Submit booking + pay via Stripe

#### B) Handyman Services
- Select repair type
- Enter problem description / upload photo
- Choose schedule
- Confirm booking + payment

#### C) Groceries & Food
- Browse categories
- Add to cart
- Adjust quantities
- Checkout via Stripe
- Order for friends/family in other regions

#### D) Beauty on DE Run
- Choose service (makeup, hair, nails, wellness)
- View portfolio photos
- Select date/time
- Confirm + pay

#### E) Rental Properties
- View listings with photos and descriptions
- Check availability calendar
- Select stay duration (1 day – 6+ months)
- Confirm rental + pay

#### F) Caregiving Services
- Choose Ride Assistance or Companionship Support
- **Rides:** pickup + multiple stops, round-trip option
- **Companionship:** duration and availability
- Confirm + pay via Stripe

### Order / Booking Tracking
- Access "My Bookings"
- View status: Accepted → In Progress → Completed
- Automatic notifications
- Re-order/re-book option

### AI Chat Assistant
- Engage from home screen or menu
- Natural language queries
- Instant suggestions
- 24/7 availability

### Rating & Review
- Star rating (1-5)
- Written review
- Photo upload (optional)
- Improves vendor ranking

### Reporting Listings
- Tap "Report Listing"
- Choose reason / write comment
- Hidden until admin review

### Account & Profile Settings
- Edit profile (name, email, photo)
- Manage saved addresses
- Access order history
- View Terms & Privacy Policy
- Manage notifications
- Change region / logout
- Delete Account option

### Security & Compliance
- Stripe PCI-compliant payments
- OTP verification
- No direct customer-vendor messaging
- AI handles non-critical inquiries

---

## 6. Feature List – Business Owner Web App

### Registration & Login
- Email + OTP or Gmail signup
- Accept Terms & Conditions
- Secure login
- Safe logout
- Reset via OTP

### Business Onboarding (Setup Wizard)
1. Enter Business Name
2. Upload Logo and Cover Image
3. Write Business Description
4. Add Contact Details
5. Select service categories
6. Define service areas

### Service Areas (Multi-Location Support)
- Add multiple regions (ZIP codes)
- Edit/remove areas
- Toggle ON/OFF
- Multi-region operation under one account

### Availability Settings
- Configure working days/hours
- Set per category or region
- Pause services temporarily

### Subscription & Free Trial
- 1-month free trial
- View status (Trial Active, Trial Ending Soon, Active, Expired)
- Countdown timer for trial days
- Pause/cancel/reactivate subscription
- Access billing history

### Service Listing Creation (Category-Specific Forms)

| Category | Form Includes |
|----------|---------------|
| **Cleaning Services** | Service type, description, rate, images, schedule |
| **Handyman Services** | Repair type, description, base rate, photos, schedule |
| **Groceries & Food** | Product/dish name, description, category, price, stock, image |
| **Beauty on DE Run** | Service type, duration, pricing, photos, availability slots |
| **Rental Properties** | Photos, address, bedrooms, bathrooms, amenities, rates, availability calendar |
| **Caregiving Services** | Ride/Companionship type, description, pricing, availability, service area |

### Listing Management
- View all active listings
- Edit titles, descriptions, images, pricing
- Toggle listings ON/OFF
- Delete listings
- Real-time updates

### Order / Request Management
- View all incoming orders/requests
- View order details
- Manage status: Accept, Decline, In Progress, Completed, Cancel
- System invites review after completion

### Performance & Feedback
- View completed orders count
- Track average rating
- Read reviews

### Account Management
- Update profile/branding images
- Modify service areas/availability
- Manage subscriptions via Stripe
- Download receipts/invoices
- Delete account option

### Compliance & Moderation
- Notifications for reported/suspended listings
- Edit and resubmit for review
- Restore after admin validation
- Maintain active subscription for visibility

### AI Chat Assistant Integration
- Automatic recommendations to users
- No manual setup required
- Uses vendor data and availability

---

## 7. Feature List – Admin Panel (Michelle's Control Panel)

### Admin Login & Security
- Secure login for Michelle and authorized team
- Password or OTP-based access
- Automatic session timeout
- Manual logout option

### Dashboard Overview (Admin Home Screen)
- Total registered customers
- Total registered business owners
- Active and expired vendor subscriptions
- Live listings count
- Reported listings awaiting review

### Manage Michelle's Own Services
- Add/edit platform-owned services
- Assign geographic regions
- Listings appear **first** with "Powered by DoHuub" badge
- Update descriptions, pricing, availability
- Enable/disable listings

### Vendor (Business Owner) Management
- View all vendors with complete profiles
- Check subscription status (Trial Active, Active, Expired)
- Suspend/deactivate accounts for violations
- Reactivate after resolution
- Access listings, areas served, activity logs
- Filter by category or subscription tier

### Listing Oversight & Moderation
- View all vendor listings across categories
- Search/filter by category, vendor, geographic area
- Disable/hide violating listings
- Restore after corrections
- Auto-prioritize Michelle's listings

### Reported Listing Management
- View all reported listings
- Review reason and comments
- Mark as:
  - **Approved and Restored** — no violation found
  - **Removed Permanently** — policy violation confirmed
- Optional automated notification to vendor
- Maintain moderation log for auditing

### Subscription Monitoring
- Monitor all vendor subscription statuses
- Track Trial, Active, Expired, Paused states
- Generate analytics on subscriptions and revenue

### Customer Account Oversight
- View all customer accounts
- Deactivate/block spam users
- Restore accounts after review
- Review order histories and bookings

### Admin Account Settings
- Update password
- Single admin account setup

---

## 8. Development Plan & Timelines

| Milestone | Title | Description | Duration |
|-----------|-------|-------------|----------|
| **1** | Wireframes | Low-fidelity wireframes for all panels. Define navigation flow and user journey. | **20 Days** |
| **2** | UI Design | High-fidelity mockups for mobile and web. Finalized branding, layout, visual hierarchy. Clickable prototype. | **20 Days** |
| **3** | Front-End Development | Responsive interfaces for customer mobile app (iOS & Android), business web app, and admin panel. Navigation, forms, layout logic. | **45 Days** |
| **4** | Back-End Development & Integration | APIs and database structure. Stripe integration, vendor subscriptions, booking system, AI Chat Assistant, real-time updates. Full testing. | **45 Days** |
| **5** | Launch & Post-Deployment Support | Live deployment, App Store/Play Store submission, QA testing, bug fixes, initial monitoring support. | **15–20 Days** |

### 📅 Total Estimated Duration: **135 – 155 Working Days**

---

<div align="center">

**© 2025 DeepLearnHQ Corp.**  
[www.deeplearnhq.tech](https://www.deeplearnhq.tech)  
*All rights reserved.*

---

*Confidential – This document contains proprietary information intended solely for the use of the authorized recipient. Unauthorized distribution or copying is strictly prohibited.*

</div>


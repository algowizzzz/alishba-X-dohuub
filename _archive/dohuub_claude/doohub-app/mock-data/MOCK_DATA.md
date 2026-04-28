# DoHuub Mock Data for Testing & Demos

This document contains all mock data to be seeded into the database for testing and demo purposes.

---

## 1. Demo Accounts

### Admin Accounts
| Email | Phone | First Name | Last Name | Role | Password Hint |
|-------|-------|------------|-----------|------|---------------|
| `demo-admin@doohub.com` | +1111111111 | Demo | Admin | ADMIN | demo123 |
| `michelle@doohub.com` | +1234567890 | Michelle | Williams | ADMIN | (existing) |

### Vendor Accounts
| Email | Phone | Business Name | Description | Rating | Categories |
|-------|-------|---------------|-------------|--------|------------|
| `demo-vendor@doohub.com` | +1222222222 | Demo Vendor Services | Full-service demo vendor | 4.5 | CLEANING, HANDYMAN |
| `sparkle@example.com` | +1333333333 | Sparkle Clean Co. | Professional cleaning services | 4.8 | CLEANING |
| `fixitpro@example.com` | +1444444444 | Fix-It Pro Services | Expert handyman services | 4.7 | HANDYMAN |
| `glamourstudio@example.com` | +1555555555 | Glamour Studio | Beauty services | 4.9 | BEAUTY |
| `freshmarket@example.com` | +1666666666 | Fresh Market Grocers | Farm-fresh groceries | 4.6 | GROCERIES |
| `comfortcare@example.com` | +1777777777 | Comfort Care Services | Caregiving services | 4.8 | CAREGIVING |
| `nyrentals@example.com` | +1888888888 | NY Rentals | Premium property rentals | 4.7 | RENTALS |

### Customer Accounts
| Email | Phone | First Name | Last Name | Notes |
|-------|-------|------------|-----------|-------|
| `demo-customer@doohub.com` | +1999999991 | Demo | Customer | Primary demo account |
| `demo-customer2@doohub.com` | +1999999992 | Jane | Smith | Secondary demo account |
| `customer@example.com` | +1987654321 | John | Doe | (existing) |
| `sarah.jones@example.com` | +1999999993 | Sarah | Jones | With order history |
| `mike.wilson@example.com` | +1999999994 | Mike | Wilson | With booking history |
| `emily.brown@example.com` | +1999999995 | Emily | Brown | New customer |

---

## 2. Addresses (for Customers)

### Demo Customer Addresses
| Customer | Type | Label | Street | Apartment | City | State | Zip | Default |
|----------|------|-------|--------|-----------|------|-------|-----|---------|
| demo-customer | HOME | Home | 100 Demo Street | Apt 1A | New York | NY | 10001 | ✓ |
| demo-customer | WORK | Office | 200 Business Ave | Floor 5 | New York | NY | 10002 | |
| demo-customer | DOCTOR | Dr. Smith | 300 Medical Plaza | Suite 201 | New York | NY | 10003 | |
| demo-customer2 | HOME | My Place | 150 Park Lane | Unit 3B | Brooklyn | NY | 11201 | ✓ |
| demo-customer2 | PHARMACY | CVS Pharmacy | 400 Main St | | Brooklyn | NY | 11202 | |
| sarah.jones | HOME | Home | 500 Riverside Dr | Apt 12C | Manhattan | NY | 10004 | ✓ |
| mike.wilson | HOME | Home | 600 Ocean Ave | | Queens | NY | 11375 | ✓ |
| mike.wilson | WORK | Work | 700 Corporate Blvd | Floor 10 | Manhattan | NY | 10005 | |

---

## 3. Payment Methods (Mock Cards)

| Customer | Type | Brand | Last4 | Expiry | Default |
|----------|------|-------|-------|--------|---------|
| demo-customer | card | visa | 4242 | 12/28 | ✓ |
| demo-customer | card | mastercard | 5555 | 06/27 | |
| demo-customer2 | card | visa | 1234 | 09/29 | ✓ |
| sarah.jones | card | amex | 0005 | 03/28 | ✓ |
| mike.wilson | card | discover | 9424 | 11/27 | ✓ |

---

## 4. Service Listings

### 4.1 Cleaning Listings
| Vendor | Title | Type | Base Price | Unit | Duration |
|--------|-------|------|------------|------|----------|
| DoHuub Official | Premium Deep House Cleaning | DEEP_CLEANING | $150 | per_session | 180 min |
| DoHuub Official | Professional Laundry Service | LAUNDRY | $45 | per_load | - |
| DoHuub Official | Office Deep Clean | OFFICE_CLEANING | $200 | per_session | 240 min |
| Sparkle Clean | Apartment Deep Cleaning | DEEP_CLEANING | $120 | per_session | 150 min |
| Sparkle Clean | Express Laundry | LAUNDRY | $35 | per_load | - |
| Sparkle Clean | Move-Out Cleaning | DEEP_CLEANING | $250 | per_session | 300 min |
| Demo Vendor | Basic Home Cleaning | DEEP_CLEANING | $80 | per_session | 120 min |

### 4.2 Handyman Listings
| Vendor | Title | Type | Base Price | Unit |
|--------|-------|------|------------|------|
| DoHuub Official | Plumbing Repair & Installation | PLUMBING | $85 | per_hour |
| DoHuub Official | Electrical Services | ELECTRICAL | $95 | per_hour |
| Fix-It Pro | Furniture Assembly | INSTALLATION | $65 | per_item |
| Fix-It Pro | General Home Repairs | GENERAL_REPAIR | $75 | per_hour |
| Fix-It Pro | Drywall Patching | GENERAL_REPAIR | $60 | per_hour |
| Demo Vendor | Basic Plumbing | PLUMBING | $70 | per_hour |

### 4.3 Beauty Listings
| Vendor | Title | Type | Base Price | Duration |
|--------|-------|------|------------|----------|
| DoHuub Official | Professional Makeup Application | MAKEUP | $120 | 90 min |
| DoHuub Official | Hair Styling & Cut | HAIR | $80 | 60 min |
| Glamour Studio | Manicure & Pedicure | NAILS | $55 | 75 min |
| Glamour Studio | Wellness Massage | WELLNESS | $90 | 60 min |
| Glamour Studio | Bridal Makeup Package | MAKEUP | $250 | 150 min |
| Glamour Studio | Hair Coloring | HAIR | $120 | 120 min |

### 4.4 Grocery Listings
| Vendor | Name | Category | Price | Unit | Stock |
|--------|------|----------|-------|------|-------|
| DoHuub Official | Organic Produce Box | Fresh Produce | $45 | box | 100 |
| DoHuub Official | Farm Fresh Eggs | Dairy & Eggs | $8 | dozen | 50 |
| Fresh Market | Artisan Sourdough Bread | Bakery | $7 | loaf | 30 |
| Fresh Market | Premium Ground Coffee | Beverages | $18 | bag | 40 |
| Fresh Market | Greek Yogurt | Dairy & Eggs | $6 | container | 60 |
| Fresh Market | Organic Bananas | Fresh Produce | $3 | bunch | 80 |
| Fresh Market | Whole Milk | Dairy & Eggs | $5 | gallon | 45 |
| Fresh Market | Orange Juice | Beverages | $6 | bottle | 35 |
| Fresh Market | Chicken Breast | Meat & Seafood | $12 | lb | 25 |
| Fresh Market | Salmon Fillet | Meat & Seafood | $18 | lb | 20 |
| Fresh Market | Mixed Greens | Fresh Produce | $5 | bag | 50 |
| Fresh Market | Pasta | Pantry | $3 | box | 100 |
| Fresh Market | Olive Oil | Pantry | $12 | bottle | 30 |

### 4.5 Rental Listings
| Vendor | Title | Property Type | Location | Beds | Baths | Price/Night | Price/Month |
|--------|-------|---------------|----------|------|-------|-------------|-------------|
| DoHuub Official | Luxury Manhattan Apartment | Apartment | 123 Park Ave, NY | 2 | 2 | $350 | $7,500 |
| DoHuub Official | Cozy Studio in Brooklyn | Studio | 456 Bedford Ave, Brooklyn | 0 | 1 | $150 | $3,200 |
| NY Rentals | Modern Loft in SoHo | Loft | 789 Broadway, NY | 1 | 1 | $275 | $5,500 |
| NY Rentals | Family Home in Queens | House | 321 Forest Hills, Queens | 3 | 2.5 | $400 | $8,000 |
| NY Rentals | Penthouse Suite | Apartment | 555 5th Ave, NY | 3 | 3 | $800 | $18,000 |

### 4.6 Caregiving Listings
| Vendor | Title | Type | Base Price | Unit |
|--------|-------|------|------------|------|
| DoHuub Official | Medical Appointment Transport | RIDE_ASSISTANCE | $45 | per_trip |
| DoHuub Official | Companion Care Services | COMPANIONSHIP_SUPPORT | $35 | per_hour |
| Comfort Care | Senior Transportation | RIDE_ASSISTANCE | $40 | per_trip |
| Comfort Care | Daily Companion Visits | COMPANIONSHIP_SUPPORT | $30 | per_hour |
| Comfort Care | Grocery Shopping Assistance | COMPANIONSHIP_SUPPORT | $25 | per_hour |
| Comfort Care | Prescription Pickup | RIDE_ASSISTANCE | $30 | per_trip |

---

## 5. Bookings

### Completed Bookings (Past)
| ID | Customer | Vendor | Category | Listing | Date | Time | Status | Total |
|----|----------|--------|----------|---------|------|------|--------|-------|
| BK001 | demo-customer | DoHuub Official | CLEANING | Premium Deep House Cleaning | 2025-12-15 | 10:00 | COMPLETED | $165 |
| BK002 | demo-customer | Glamour Studio | BEAUTY | Manicure & Pedicure | 2025-12-20 | 14:00 | COMPLETED | $60 |
| BK003 | sarah.jones | Sparkle Clean | CLEANING | Apartment Deep Cleaning | 2025-12-22 | 09:00 | COMPLETED | $132 |
| BK004 | mike.wilson | Fix-It Pro | HANDYMAN | Furniture Assembly | 2025-12-28 | 11:00 | COMPLETED | $71.50 |
| BK005 | demo-customer2 | DoHuub Official | CAREGIVING | Medical Appointment Transport | 2026-01-02 | 08:30 | COMPLETED | $49.50 |
| BK006 | demo-customer | Comfort Care | CAREGIVING | Daily Companion Visits | 2026-01-05 | 13:00 | COMPLETED | $66 |

### Active/Upcoming Bookings
| ID | Customer | Vendor | Category | Listing | Date | Time | Status | Total |
|----|----------|--------|----------|---------|------|------|--------|-------|
| BK007 | demo-customer | DoHuub Official | CLEANING | Office Deep Clean | 2026-01-13 | 09:00 | ACCEPTED | $220 |
| BK008 | demo-customer | Glamour Studio | BEAUTY | Hair Coloring | 2026-01-15 | 15:00 | PENDING | $132 |
| BK009 | sarah.jones | Fix-It Pro | HANDYMAN | General Home Repairs | 2026-01-14 | 10:00 | ACCEPTED | $82.50 |
| BK010 | mike.wilson | DoHuub Official | BEAUTY | Professional Makeup | 2026-01-16 | 11:00 | PENDING | $132 |
| BK011 | demo-customer2 | NY Rentals | RENTALS | Modern Loft in SoHo | 2026-01-20 | 14:00 | ACCEPTED | $825 |
| BK012 | demo-customer | Comfort Care | CAREGIVING | Senior Transportation | 2026-01-18 | 09:30 | PENDING | $44 |

### In-Progress Booking
| ID | Customer | Vendor | Category | Listing | Date | Time | Status | Total |
|----|----------|--------|----------|---------|------|------|--------|-------|
| BK013 | demo-customer | Sparkle Clean | CLEANING | Express Laundry | 2026-01-11 | 10:00 | IN_PROGRESS | $38.50 |

### Cancelled/Declined Bookings
| ID | Customer | Vendor | Category | Listing | Date | Status | Reason |
|----|----------|--------|----------|---------|------|--------|--------|
| BK014 | demo-customer | Fix-It Pro | HANDYMAN | Drywall Patching | 2026-01-08 | CANCELLED | Customer schedule conflict |
| BK015 | emily.brown | Glamour Studio | BEAUTY | Bridal Makeup | 2026-01-10 | DECLINED | Vendor unavailable |

---

## 6. Orders (Groceries)

### Completed Orders
| ID | Customer | Vendor | Items | Subtotal | Delivery | Total | Status | Delivered |
|----|----------|--------|-------|----------|----------|-------|--------|-----------|
| ORD001 | demo-customer | Fresh Market | Bread, Coffee, Milk, Eggs | $38 | $5 | $45.85 | DELIVERED | 2025-12-18 |
| ORD002 | sarah.jones | DoHuub Official | Organic Produce Box | $45 | $5 | $52.75 | DELIVERED | 2025-12-25 |
| ORD003 | demo-customer2 | Fresh Market | Yogurt, OJ, Chicken, Pasta | $27 | $5 | $34.70 | DELIVERED | 2026-01-03 |
| ORD004 | mike.wilson | Fresh Market | Salmon, Greens, Olive Oil | $35 | $5 | $43.50 | DELIVERED | 2026-01-08 |

### Active Orders
| ID | Customer | Vendor | Items | Subtotal | Delivery | Total | Status | ETA |
|----|----------|--------|-------|----------|----------|-------|--------|-----|
| ORD005 | demo-customer | Fresh Market | Bread, Eggs, Milk, Bananas | $23 | $5 | $30.30 | OUT_FOR_DELIVERY | Today 2pm |
| ORD006 | demo-customer2 | DoHuub Official | Organic Produce Box, Eggs | $53 | $5 | $62.70 | PREPARING | Today 4pm |
| ORD007 | sarah.jones | Fresh Market | Coffee, Yogurt, OJ | $30 | $5 | $38.25 | CONFIRMED | Tomorrow 11am |
| ORD008 | demo-customer | Fresh Market | Chicken, Salmon, Greens | $35 | $5 | $43.50 | PENDING | Tomorrow 3pm |

### Cancelled Order
| ID | Customer | Vendor | Items | Status | Reason |
|----|----------|--------|-------|--------|--------|
| ORD009 | emily.brown | Fresh Market | Bread, Milk | CANCELLED | Customer request |

---

## 7. Order Items Detail

### ORD001 Items
| Product | Quantity | Unit Price | Total |
|---------|----------|------------|-------|
| Artisan Sourdough Bread | 1 | $7 | $7 |
| Premium Ground Coffee | 1 | $18 | $18 |
| Whole Milk | 1 | $5 | $5 |
| Farm Fresh Eggs | 1 | $8 | $8 |

### ORD005 Items (Active)
| Product | Quantity | Unit Price | Total |
|---------|----------|------------|-------|
| Artisan Sourdough Bread | 1 | $7 | $7 |
| Farm Fresh Eggs | 1 | $8 | $8 |
| Whole Milk | 1 | $5 | $5 |
| Organic Bananas | 1 | $3 | $3 |

---

## 8. Reviews

| Customer | Vendor | Booking | Rating | Comment | Date |
|----------|--------|---------|--------|---------|------|
| demo-customer | DoHuub Official | BK001 | 5 | "Absolutely spotless! The team was professional and thorough. Will definitely book again." | 2025-12-16 |
| demo-customer | Glamour Studio | BK002 | 4 | "Great manicure, loved the nail art. Slight wait time but worth it." | 2025-12-21 |
| sarah.jones | Sparkle Clean | BK003 | 5 | "My apartment has never looked better! Highly recommend." | 2025-12-23 |
| mike.wilson | Fix-It Pro | BK004 | 5 | "Fast and efficient. Assembled 3 pieces of furniture in under 2 hours." | 2025-12-29 |
| demo-customer2 | DoHuub Official | BK005 | 5 | "So helpful with my mom's doctor appointment. Driver was patient and kind." | 2026-01-03 |
| demo-customer | Comfort Care | BK006 | 4 | "Wonderful companion for my grandmother. She really enjoyed the visit." | 2026-01-06 |

---

## 9. Transactions

| ID | Booking/Order | Amount | Platform Fee | Vendor Payout | Status | Date |
|----|---------------|--------|--------------|---------------|--------|------|
| TXN001 | BK001 | $165 | $16.50 | $148.50 | COMPLETED | 2025-12-15 |
| TXN002 | BK002 | $60 | $6.00 | $54.00 | COMPLETED | 2025-12-20 |
| TXN003 | BK003 | $132 | $13.20 | $118.80 | COMPLETED | 2025-12-22 |
| TXN004 | ORD001 | $45.85 | $4.59 | $41.26 | COMPLETED | 2025-12-18 |
| TXN005 | ORD002 | $52.75 | $5.28 | $47.47 | COMPLETED | 2025-12-25 |
| TXN006 | BK004 | $71.50 | $7.15 | $64.35 | COMPLETED | 2025-12-28 |
| TXN007 | BK005 | $49.50 | $4.95 | $44.55 | COMPLETED | 2026-01-02 |
| TXN008 | ORD003 | $34.70 | $3.47 | $31.23 | COMPLETED | 2026-01-03 |
| TXN009 | BK006 | $66 | $6.60 | $59.40 | COMPLETED | 2026-01-05 |
| TXN010 | ORD005 | $30.30 | $3.03 | $27.27 | PROCESSING | 2026-01-11 |
| TXN011 | BK007 | $220 | $22.00 | $198.00 | PENDING | 2026-01-13 |
| TXN012 | BK011 | $825 | $82.50 | $742.50 | PENDING | 2026-01-20 |

---

## 10. Notifications

### Demo Customer Notifications
| Title | Body | Type | Read | Date |
|-------|------|------|------|------|
| Booking Confirmed | Your cleaning service has been confirmed for Jan 13 at 9:00 AM | booking_update | ✓ | 2026-01-10 |
| Order Out for Delivery | Your grocery order is on its way! ETA: 2:00 PM | order_update | | 2026-01-11 |
| New Year Special | Get 20% off your next beauty service! Code: NEWYEAR20 | promo | | 2026-01-01 |
| Review Reminder | How was your cleaning service? Leave a review! | booking_update | ✓ | 2025-12-16 |
| Payment Received | Payment of $165 confirmed for booking BK001 | payment | ✓ | 2025-12-15 |

### Demo Customer 2 Notifications
| Title | Body | Type | Read | Date |
|-------|------|------|------|------|
| Rental Confirmed | Your stay at Modern Loft in SoHo is confirmed for Jan 20 | booking_update | ✓ | 2026-01-09 |
| Order Preparing | Your grocery order is being prepared | order_update | | 2026-01-11 |
| Welcome to DoHuub! | Thanks for joining. Explore our services! | promo | ✓ | 2025-12-01 |

### Vendor Notifications (Demo Vendor)
| Title | Body | Type | Read | Date |
|-------|------|------|------|------|
| New Booking Request | You have a new cleaning booking request | booking_update | ✓ | 2026-01-10 |
| Payout Processed | $148.50 has been transferred to your account | payment | ✓ | 2025-12-17 |
| New Review | John D. left a 5-star review! | review | | 2025-12-16 |

---

## 11. Chat Conversations (AI Assistant)

### Demo Customer Conversation 1
```
USER: Hi, I need help finding a cleaning service for my apartment
ASSISTANT: I'd be happy to help you find a cleaning service! We have several great options available. Could you tell me:
1. What type of cleaning do you need? (Deep cleaning, regular cleaning, laundry)
2. What's the size of your apartment?
3. When would you like the service?

USER: Deep cleaning, 2 bedroom, this weekend if possible
ASSISTANT: Perfect! Here are some excellent options for a 2-bedroom deep cleaning:

**DoHuub Official** - Premium Deep House Cleaning
- Price: $150/session (180 min)
- Rating: 4.9 ⭐ (523 reviews)
- Available this Saturday at 10 AM

**Sparkle Clean Co.** - Apartment Deep Cleaning  
- Price: $120/session (150 min)
- Rating: 4.8 ⭐ (189 reviews)
- Available Sunday at 9 AM

Would you like me to book one of these for you?

USER: The DoHuub one sounds good, book Saturday please
ASSISTANT: Great choice! I've initiated a booking for:

📋 **Premium Deep House Cleaning**
📅 This Saturday at 10:00 AM
📍 100 Demo Street, Apt 1A
💰 $150 + $15 service fee = $165

Please confirm the booking in your cart to complete the reservation!
```

### Demo Customer Conversation 2
```
USER: What caregiving services do you offer?
ASSISTANT: We offer comprehensive caregiving services designed to support seniors and those who need assistance:

**Ride Assistance:**
- Medical appointment transport
- Pharmacy pickups
- Grocery shopping trips
- General transportation needs

**Companionship Support:**
- Daily companion visits
- Conversation and social interaction
- Light housekeeping
- Medication reminders
- Meal preparation assistance

Our caregivers are vetted, compassionate, and experienced. Would you like details on any specific service?
```

---

## 12. Vendor Service Areas

| Vendor | Area Name | City | State | Zip Codes |
|--------|-----------|------|-------|-----------|
| DoHuub Official | Manhattan | New York | NY | 10001-10010 |
| DoHuub Official | Brooklyn | Brooklyn | NY | 11201-11210 |
| Sparkle Clean | Manhattan | New York | NY | 10001-10005 |
| Fix-It Pro | Manhattan | New York | NY | 10001-10005 |
| Fix-It Pro | Brooklyn | Brooklyn | NY | 11201-11205 |
| Glamour Studio | Manhattan | New York | NY | 10001-10010 |
| Fresh Market | Manhattan | New York | NY | 10001-10008 |
| Fresh Market | Brooklyn | Brooklyn | NY | 11201-11206 |
| NY Rentals | All NYC | New York | NY | All |
| Comfort Care | Manhattan | New York | NY | 10001-10005 |

---

## 13. Vendor Availability

| Vendor | Days | Hours |
|--------|------|-------|
| DoHuub Official | Mon-Fri | 8:00 AM - 8:00 PM |
| DoHuub Official | Sat-Sun | 9:00 AM - 6:00 PM |
| Sparkle Clean | Mon-Fri | 9:00 AM - 5:00 PM |
| Fix-It Pro | Mon-Sat | 8:00 AM - 6:00 PM |
| Glamour Studio | Tue-Sun | 10:00 AM - 8:00 PM |
| Fresh Market | Daily | 7:00 AM - 9:00 PM |
| NY Rentals | Daily | 24/7 |
| Comfort Care | Daily | 7:00 AM - 7:00 PM |
| Demo Vendor | Mon-Fri | 9:00 AM - 5:00 PM |

---

## 14. Booking Status History Examples

### BK001 (Completed Cleaning)
| Status | Note | Timestamp |
|--------|------|-----------|
| PENDING | Booking created | 2025-12-14 18:30 |
| ACCEPTED | Vendor confirmed | 2025-12-14 19:15 |
| IN_PROGRESS | Service started | 2025-12-15 10:05 |
| COMPLETED | Service completed | 2025-12-15 13:10 |

### BK013 (In Progress)
| Status | Note | Timestamp |
|--------|------|-----------|
| PENDING | Booking created | 2026-01-10 20:00 |
| ACCEPTED | Vendor confirmed | 2026-01-10 20:30 |
| IN_PROGRESS | Pickup completed | 2026-01-11 10:15 |

---

## 15. Summary Stats (for Dashboards)

### Platform Overview
| Metric | Value |
|--------|-------|
| Total Users | 12 |
| Total Vendors | 8 |
| Total Customers | 6 |
| Total Bookings | 15 |
| Total Orders | 9 |
| Completed Bookings | 6 |
| Active Bookings | 7 |
| Total Revenue | $1,800+ |
| Avg Rating | 4.7 |

### Demo Customer Stats
| Metric | Value |
|--------|-------|
| Total Bookings | 5 |
| Total Orders | 3 |
| Total Spent | $450+ |
| Reviews Given | 2 |
| Saved Addresses | 3 |

### Demo Vendor Stats
| Metric | Value |
|--------|-------|
| Total Bookings | 2 |
| Total Earnings | $200+ |
| Rating | 4.5 |
| Reviews | 5 |

---

## Quick Reference: Demo Login Credentials

| Role | Email | Use Case |
|------|-------|----------|
| **Customer** | `demo-customer@doohub.com` | Mobile app testing |
| **Customer 2** | `demo-customer2@doohub.com` | Multi-user scenarios |
| **Vendor** | `demo-vendor@doohub.com` | Vendor portal testing |
| **Admin** | `demo-admin@doohub.com` | Admin panel testing |
| **Platform Owner** | `michelle@doohub.com` | Full platform access |

---

*Last Updated: January 2026*


# 🧪 DoHuub Platform - Comprehensive Test Cases

> **Total Screens:** 120+  
> **Total Test Cases:** 540+  
> **Platforms:** Mobile App, Vendor Portal, Admin Panel  
> **Last Updated:** January 2026

---

## 📑 Table of Contents

### Mobile App (Customer)
1. [Splash & Onboarding](#1-splash--onboarding)
2. [Authentication](#2-authentication)
3. [Home & Navigation](#3-home--navigation)
4. [Profile & Settings](#4-profile--settings)
5. [Bookings](#5-bookings)
6. [Cleaning Service](#6-cleaning-service)
7. [Handyman Service](#7-handyman-service)
8. [Beauty Service](#8-beauty-service)
9. [Groceries Service](#9-groceries-service)
10. [Rentals Service](#10-rentals-service)
11. [Caregiving Service](#11-caregiving-service)
12. [Notifications](#12-notifications)
13. [Location](#13-location)
14. [Checkout & Payment](#14-checkout--payment)
15. [Modals](#15-modals)

### Vendor Portal (Web)
16. [Vendor Portal](#16-vendor-portal-web)

### Admin Panel (Web)
17. [Admin Panel](#17-admin-panel-web)

---

## 1. Splash & Onboarding

### 1.1 Splash Screen (`/`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| SPL-001 | Splash screen loads | Launch app | Splash screen displays | - Cube icon<br>- "DoHuub" logo<br>- "Infinite Services" tagline |
| SPL-002 | Auto-redirect (not authenticated) | Wait 2 seconds | Redirects to `/onboarding` | - |
| SPL-003 | Auto-redirect (authenticated) | Login, relaunch app | Redirects to `/(tabs)` | - |
| SPL-004 | Auto-redirect (onboarding seen) | Complete onboarding, relaunch | Redirects to `/(auth)/welcome` | - |

### 1.2 Onboarding Screen (`/onboarding`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| ONB-001 | Slide 1 displays | Navigate to onboarding | Shows intro slide | - Icon<br>- "Welcome to DoHuub"<br>- Description text |
| ONB-002 | Slide 2 displays | Tap "Next" | Shows categories slide | - Icon<br>- "Six Service Categories"<br>- Description |
| ONB-003 | Slide 3 displays | Tap "Next" again | Shows booking flow slide | - Icon<br>- "Book, Track & Pay"<br>- Description |
| ONB-004 | Progress dots | View any slide | Dots show current position | - 3 dots<br>- Active dot highlighted |
| ONB-005 | Previous button | On slide 2/3, tap "Previous" | Goes to previous slide | - Previous button |
| ONB-006 | Previous disabled on slide 1 | On slide 1 | Previous button disabled/hidden | - |
| ONB-007 | Skip button | Tap "Skip" | Navigates to `/(auth)/welcome` | - Skip button |
| ONB-008 | Skip hidden on last slide | On slide 3 | Skip button not visible | - |
| ONB-009 | Get Started button | On slide 3, tap "Get Started" | Navigates to `/(auth)/welcome` | - Get Started button |
| ONB-010 | Swipe navigation | Swipe left/right | Changes slides | - FlatList horizontal |
| ONB-011 | Onboarding flag stored | Complete onboarding | `hasSeenOnboarding` saved | - AsyncStorage |

---

## 2. Authentication

### 2.1 Welcome Screen (`/(auth)/welcome`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| WEL-001 | Screen loads | Navigate to welcome | Welcome screen displays | - Logo<br>- Tagline<br>- Sign In button<br>- Register button |
| WEL-002 | Sign In navigation | Tap "Sign In" | Navigates to `/(auth)/signin` | - Sign In button |
| WEL-003 | Register navigation | Tap "Register" | Navigates to `/(auth)/register` | - Register button |

### 2.2 Sign In Screen (`/(auth)/signin`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| SIN-001 | Screen loads | Navigate to signin | Sign in form displays | - Phone input<br>- Continue button<br>- Back button |
| SIN-002 | Phone input validation (empty) | Leave empty, tap Continue | Shows error message | - Error text |
| SIN-003 | Phone input validation (invalid) | Enter "123", tap Continue | Shows error message | - Error text |
| SIN-004 | Phone input validation (valid) | Enter valid phone | No error, enables Continue | - |
| SIN-005 | Country code selector | Tap country code | Shows country picker | - Country code dropdown |
| SIN-006 | Continue button | Enter valid phone, tap Continue | Navigates to `/(auth)/verify-otp` | - Continue button |
| SIN-007 | Back navigation | Tap back arrow | Returns to welcome | - Back button |

### 2.3 Register Screen (`/(auth)/register`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| REG-001 | Screen loads | Navigate to register | Registration form displays | - First name<br>- Last name<br>- Email<br>- Phone<br>- Continue button |
| REG-002 | First name required | Leave empty, submit | Shows error | - First name input |
| REG-003 | Last name required | Leave empty, submit | Shows error | - Last name input |
| REG-004 | Email validation | Enter invalid email | Shows error | - Email input |
| REG-005 | Phone validation | Enter invalid phone | Shows error | - Phone input |
| REG-006 | All fields valid | Fill all correctly | Navigates to OTP | - Continue button |
| REG-007 | Back navigation | Tap back | Returns to welcome | - Back button |

### 2.4 OTP Verification (`/(auth)/verify-otp`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| OTP-001 | Screen loads | Navigate from signin/register | OTP input displays | - 6 digit input<br>- Verify button<br>- Resend link |
| OTP-002 | OTP input accepts digits | Type 6 digits | All boxes filled | - OTP input boxes |
| OTP-003 | OTP input rejects letters | Type letters | Input ignored | - |
| OTP-004 | Auto-submit on 6 digits | Enter 6 digits | Auto-verifies or enables button | - |
| OTP-005 | Invalid OTP | Enter wrong code | Shows error message | - Error text |
| OTP-006 | Valid OTP | Enter correct code | Navigates to profile setup or home | - |
| OTP-007 | Resend OTP | Tap "Resend" | New OTP sent, timer resets | - Resend link<br>- Timer |
| OTP-008 | Resend cooldown | Immediately tap Resend again | Button disabled during cooldown | - Timer countdown |

### 2.5 Profile Setup (`/(auth)/profile-setup`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| PST-001 | Screen loads | After OTP verification | Profile setup form displays | - Step indicator<br>- Avatar upload<br>- Name fields |
| PST-002 | Step indicator shows 1/2 | View screen | Shows "Step 1 of 2" | - Stepper component |
| PST-003 | Avatar upload | Tap avatar | Opens image picker | - Avatar placeholder |
| PST-004 | Name pre-filled | From registration | Name fields populated | - First/Last name |
| PST-005 | Continue to step 2 | Fill form, tap Continue | Navigates to address setup | - Continue button |
| PST-006 | Skip option | Tap "Skip for Now" | Navigates to home | - Skip link |

### 2.6 Address Setup (`/(auth)/address-setup`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| AST-001 | Screen loads | From profile setup | Address setup displays | - Step indicator<br>- Address type buttons |
| AST-002 | Step indicator shows 2/2 | View screen | Shows "Step 2 of 2" | - Stepper component |
| AST-003 | Home address button | Tap "Home" | Navigates to add address with type=Home | - Home button |
| AST-004 | Work address button | Tap "Work" | Navigates to add address with type=Work | - Work button |
| AST-005 | Doctor address button | Tap "Doctor" | Navigates to add address | - Doctor button |
| AST-006 | Pharmacy address button | Tap "Pharmacy" | Navigates to add address | - Pharmacy button |
| AST-007 | Done button | Tap "Done" | Navigates to `/(tabs)` | - Done button |
| AST-008 | Skip option | Tap "Skip for Now" | Navigates to `/(tabs)` | - Skip link |
| AST-009 | Added indicator | After adding address | Shows checkmark on that type | - Checkmark icon |

---

## 3. Home & Navigation

### 3.1 Home Screen (`/(tabs)/index`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| HOM-001 | Screen loads | Navigate to home tab | Home screen displays | - Header<br>- Services grid<br>- Location |
| HOM-002 | Location display | View header | Shows current location | - Location text<br>- Location icon |
| HOM-003 | Location tap | Tap location | Opens location options | - Location selector |
| HOM-004 | Notification bell | View header | Bell icon visible | - Bell icon |
| HOM-005 | Notification badge | Have unread notifications | Badge shows count | - Badge number |
| HOM-006 | Notification tap | Tap bell | Navigates to `/notifications` | - |
| HOM-007 | Services grid | View screen | 6 service categories displayed | - Cleaning<br>- Handyman<br>- Groceries<br>- Beauty<br>- Rentals<br>- Caregiving |
| HOM-008 | Service tap - Cleaning | Tap Cleaning | Navigates to `/services/cleaning` | - Cleaning card |
| HOM-009 | Service tap - Handyman | Tap Handyman | Navigates to `/services/handyman` | - Handyman card |
| HOM-010 | Service tap - Groceries | Tap Groceries | Navigates to `/services/groceries` | - Groceries card |
| HOM-011 | Service tap - Beauty | Tap Beauty | Navigates to `/services/beauty` | - Beauty card |
| HOM-012 | Service tap - Rentals | Tap Rentals | Navigates to `/services/rentals` | - Rentals card |
| HOM-013 | Service tap - Caregiving | Tap Caregiving | Navigates to `/services/caregiving` | - Caregiving card |

### 3.2 Tab Navigation (`/(tabs)/_layout`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| TAB-001 | Tab bar visible | On any tab screen | Tab bar at bottom | - 4 tabs |
| TAB-002 | Home tab | Tap Home | Navigates to home | - Home icon/label |
| TAB-003 | Bookings tab | Tap Bookings | Navigates to bookings | - Bookings icon/label |
| TAB-004 | Chat tab | Tap AI Assistant | Navigates to chat | - Chat icon/label |
| TAB-005 | Profile tab | Tap Profile | Navigates to profile | - Profile icon/label |
| TAB-006 | Active tab indicator | On any tab | Active tab highlighted | - Active state styling |

---

## 4. Profile & Settings

### 4.1 Profile Screen (`/(tabs)/profile`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| PRF-001 | Screen loads | Navigate to profile tab | Profile screen displays | - Avatar<br>- Name<br>- Menu items |
| PRF-002 | User info display | View header | Shows name and email | - Name text<br>- Email text |
| PRF-003 | Edit Profile menu | Tap "Edit Profile" | Navigates to `/profile/edit` | - Menu item |
| PRF-004 | Addresses menu | Tap "My Addresses" | Navigates to `/profile/addresses` | - Menu item |
| PRF-005 | Payment Methods menu | Tap "Payment Methods" | Navigates to `/profile/payment-methods` | - Menu item |
| PRF-006 | Notification Settings menu | Tap "Notifications" | Navigates to `/profile/notifications` | - Menu item |
| PRF-007 | Order History menu | Tap "Order History" | Navigates to `/profile/history` | - Menu item |
| PRF-008 | Help & Support menu | Tap "Help & Support" | Navigates to `/profile/help` | - Menu item |
| PRF-009 | Terms menu | Tap "Terms of Service" | Navigates to `/profile/terms` | - Menu item |
| PRF-010 | Privacy menu | Tap "Privacy Policy" | Navigates to `/profile/privacy` | - Menu item |
| PRF-011 | About menu | Tap "About" | Navigates to `/profile/about` | - Menu item |
| PRF-012 | Logout button | Tap "Log Out" | Opens LogoutModal | - Logout button |
| PRF-013 | Delete Account | Tap "Delete Account" | Opens DeleteAccountModal | - Delete button |

### 4.2 Edit Profile (`/profile/edit`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| EPF-001 | Screen loads | Navigate to edit profile | Edit form displays | - Header<br>- Avatar<br>- Form fields |
| EPF-002 | Back navigation | Tap back | Returns to profile | - Back button |
| EPF-003 | Avatar change | Tap avatar | Opens image picker | - Avatar image |
| EPF-004 | First name field | Edit first name | Accepts input | - First name input |
| EPF-005 | Last name field | Edit last name | Accepts input | - Last name input |
| EPF-006 | Email field | Edit email | Validates email format | - Email input |
| EPF-007 | Phone field | View phone | May be read-only | - Phone input |
| EPF-008 | Save changes | Modify and tap Save | Saves and shows confirmation | - Save button |
| EPF-009 | Validation errors | Submit invalid data | Shows field errors | - Error messages |

### 4.3 Addresses (`/profile/addresses`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| ADR-001 | Screen loads | Navigate to addresses | Address list displays | - Header<br>- Address cards<br>- Add button |
| ADR-002 | Empty state | No addresses saved | Shows empty state message | - Empty illustration<br>- Add CTA |
| ADR-003 | Address card display | Have saved addresses | Shows address details | - Type icon<br>- Address text<br>- Default badge |
| ADR-004 | Add address button | Tap "Add Address" | Navigates to `/profile/add-address` | - Add button |
| ADR-005 | Edit address | Tap address card | Navigates to `/profile/edit-address/[id]` | - Address card |
| ADR-006 | Default badge | Have default address | Shows "Default" badge | - Badge |

### 4.4 Add Address (`/profile/add-address`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| AAD-001 | Screen loads | Navigate to add address | Add address form displays | - Header<br>- Form fields |
| AAD-002 | Address type selector | View form | Type options available | - Home/Work/Other buttons |
| AAD-003 | Street address field | Enter street | Accepts input | - Street input |
| AAD-004 | Apt/Suite field | Enter apt number | Accepts input | - Apt input |
| AAD-005 | City field | Enter city | Accepts input | - City input |
| AAD-006 | State field | Enter/select state | Accepts input | - State input/dropdown |
| AAD-007 | ZIP code field | Enter ZIP | Validates format | - ZIP input |
| AAD-008 | Set as default toggle | Toggle on/off | Updates default setting | - Toggle switch |
| AAD-009 | Save address | Fill form, tap Save | Saves and returns to list | - Save button |
| AAD-010 | Validation - required fields | Leave fields empty | Shows errors | - Error messages |

### 4.5 Edit Address (`/profile/edit-address/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| EAD-001 | Screen loads | Navigate to edit address | Form pre-filled with address | - All fields populated |
| EAD-002 | Modify fields | Edit any field | Accepts changes | - Form fields |
| EAD-003 | Save changes | Modify and save | Updates address | - Save button |
| EAD-004 | Delete address | Tap "Delete Address" | Removes address, returns to list | - Delete button |
| EAD-005 | Delete confirmation | Tap delete | Shows confirmation dialog | - Confirm dialog |

### 4.6 Payment Methods (`/profile/payment-methods`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| PAY-001 | Screen loads | Navigate to payment methods | Payment list displays | - Header<br>- Card list<br>- Add button |
| PAY-002 | Empty state | No cards saved | Shows empty state | - Empty message<br>- Add CTA |
| PAY-003 | Card display | Have saved cards | Shows card details | - Brand icon<br>- Last 4 digits<br>- Expiry |
| PAY-004 | Default badge | Have default card | Shows "Default" badge | - Badge |
| PAY-005 | Add card button | Tap "Add New Card" | Navigates to `/profile/add-payment` | - Add button |
| PAY-006 | Edit card | Tap card | Navigates to `/profile/edit-payment/[id]` | - Card item |

### 4.7 Add Payment (`/profile/add-payment`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| APA-001 | Screen loads | Navigate to add payment | Card form displays | - Header<br>- Card input<br>- Save button |
| APA-002 | Card number input | Enter card number | Formats and validates | - Card number field |
| APA-003 | Expiry input | Enter MM/YY | Validates format | - Expiry field |
| APA-004 | CVV input | Enter CVV | Accepts 3-4 digits | - CVV field |
| APA-005 | Cardholder name | Enter name | Accepts input | - Name field |
| APA-006 | Set as default toggle | Toggle on/off | Updates setting | - Toggle |
| APA-007 | Save card | Fill form, save | Saves card, returns to list | - Save button |
| APA-008 | Invalid card | Enter invalid number | Shows error | - Error message |
| APA-009 | Security notice | View screen | Security info displayed | - Security text |

### 4.8 Edit Payment (`/profile/edit-payment/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| EPA-001 | Screen loads | Navigate to edit payment | Card info displayed (masked) | - Masked card number |
| EPA-002 | Set as default | Toggle default | Updates default card | - Toggle |
| EPA-003 | Delete card | Tap "Delete Card" | Removes card | - Delete button |
| EPA-004 | Save changes | Modify and save | Updates card settings | - Save button |

---

## 5. Bookings

### 5.1 My Bookings (`/(tabs)/bookings`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| BOK-001 | Screen loads | Navigate to bookings tab | Bookings list displays | - Header<br>- Tabs<br>- Booking cards |
| BOK-002 | Tab - All | Tap "All" tab | Shows all bookings | - All tab |
| BOK-003 | Tab - Upcoming | Tap "Upcoming" | Shows accepted bookings | - Upcoming tab |
| BOK-004 | Tab - In Progress | Tap "In Progress" | Shows in-progress bookings | - In Progress tab |
| BOK-005 | Tab - Completed | Tap "Completed" | Shows completed bookings | - Completed tab |
| BOK-006 | Empty state | No bookings | Shows empty message with CTA | - Empty state |
| BOK-007 | Booking card display | Have bookings | Shows booking details | - Service name<br>- Provider<br>- Date/time<br>- Status badge |
| BOK-008 | Status badge colors | View different statuses | Correct colors per status | - Pending: gray<br>- Accepted: green<br>- In Progress: blue<br>- Completed: green<br>- Cancelled: red |
| BOK-009 | Tracking indicator | In-progress booking | Green dot visible | - Tracking dot |
| BOK-010 | Track button | In-progress booking | "Track" button visible | - Track button |
| BOK-011 | Track button tap | Tap Track | Navigates to `/bookings/[id]/tracking` | - |
| BOK-012 | Booking card tap | Tap booking card | Navigates to `/bookings/[id]` | - |
| BOK-013 | Pull to refresh | Pull down | Refreshes booking list | - RefreshControl |

### 5.2 Booking Detail (`/bookings/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| BKD-001 | Screen loads | Navigate to booking detail | Booking details display | - Header<br>- Status<br>- Details<br>- Actions |
| BKD-002 | Back navigation | Tap back | Returns to bookings list | - Back button |
| BKD-003 | Status timeline | View screen | Shows booking progress | - Timeline steps |
| BKD-004 | Service info | View screen | Shows service details | - Service name<br>- Category |
| BKD-005 | Provider info | View screen | Shows provider details | - Provider name<br>- Rating |
| BKD-006 | Date/time info | View screen | Shows scheduled time | - Date<br>- Time |
| BKD-007 | Address info | View screen | Shows service address | - Address text |
| BKD-008 | Price info | View screen | Shows booking total | - Total amount |
| BKD-009 | Track Order button | Active booking | Track button visible | - Track Order button |
| BKD-010 | Track Order tap | Tap Track Order | Navigates to tracking | - |
| BKD-011 | Re-book button | Any booking | Re-book button visible | - Re-book button |
| BKD-012 | Re-book tap | Tap Re-book | Shows confirmation or starts new booking | - |
| BKD-013 | Cancel button | Active booking | Cancel button visible | - Cancel button |
| BKD-014 | Cancel tap | Tap Cancel | Shows confirmation dialog | - Confirm dialog |
| BKD-015 | Leave Review button | Completed booking | Review button visible | - Leave Review button |
| BKD-016 | Leave Review tap | Tap Leave Review | Navigates to review screen | - |

### 5.3 Booking Tracking (`/bookings/[id]/tracking`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| BTR-001 | Screen loads | Navigate to tracking | Tracking screen displays | - Header<br>- Timeline<br>- Provider info |
| BTR-002 | Back navigation | Tap back | Returns to booking detail | - Back button |
| BTR-003 | Status timeline | View screen | Shows progress steps | - Booked<br>- Confirmed<br>- En Route<br>- In Progress<br>- Completed |
| BTR-004 | Current status highlight | View timeline | Active step highlighted | - Active step styling |
| BTR-005 | Provider contact | View screen | Contact info visible | - Phone/message buttons |
| BTR-006 | Contact provider tap | Tap contact | Opens contact options | - |
| BTR-007 | Service details | View screen | Shows booking details | - Service info |
| BTR-008 | Estimated time | View screen | Shows ETA if applicable | - ETA text |

---

## 6. Cleaning Service

### 6.1 Cleaning Index (`/services/cleaning/index`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| CLN-001 | Screen loads | Navigate to cleaning | Provider list displays | - Header<br>- Filter<br>- Provider cards |
| CLN-002 | Back navigation | Tap back | Returns to home | - Back button |
| CLN-003 | Filter options | Tap filter | Shows filter sheet | - Filter button |
| CLN-004 | Provider card display | View list | Shows provider info | - Photo<br>- Name<br>- Rating<br>- Price |
| CLN-005 | Provider card tap | Tap provider | Navigates to `/services/cleaning/[id]` | - |
| CLN-006 | Empty state | No providers | Shows empty message | - Empty state |
| CLN-007 | Loading state | Initial load | Shows loading indicator | - Skeleton/spinner |

### 6.2 Cleaning Provider Detail (`/services/cleaning/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| CLD-001 | Screen loads | Navigate to provider | Provider detail displays | - Header<br>- Info<br>- Services<br>- Reviews |
| CLD-002 | Back navigation | Tap back | Returns to list | - Back button |
| CLD-003 | Provider photo | View screen | Photo displayed | - Provider image |
| CLD-004 | Provider name | View screen | Name displayed | - Name text |
| CLD-005 | Rating display | View screen | Rating and count shown | - Star rating<br>- Review count |
| CLD-006 | Services list | View screen | Available services shown | - Service items |
| CLD-007 | Pricing info | View screen | Prices displayed | - Price text |
| CLD-008 | Reviews section | View screen | Recent reviews shown | - Review cards |
| CLD-009 | View All Reviews | Tap "View All" | Navigates to `/services/cleaning/[id]/reviews` | - View All link |
| CLD-010 | Report button | Tap report icon | Opens ReportModal | - Report button |
| CLD-011 | Book Now button | Tap "Book Now" | Navigates to `/services/cleaning/[id]/book` | - Book Now button |

### 6.3 Cleaning Reviews (`/services/cleaning/[id]/reviews`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| CLR-001 | Screen loads | Navigate to reviews | Reviews list displays | - Header<br>- Summary<br>- Filter tabs<br>- Reviews |
| CLR-002 | Back navigation | Tap back | Returns to provider detail | - Back button |
| CLR-003 | Provider summary | View header | Shows avg rating, total | - Avg rating<br>- Total reviews |
| CLR-004 | Filter - All | Tap "All" | Shows all reviews | - All tab |
| CLR-005 | Filter - 5 star | Tap "5★" | Shows 5-star reviews only | - 5★ tab |
| CLR-006 | Filter - 4 star | Tap "4★" | Shows 4-star reviews only | - 4★ tab |
| CLR-007 | Filter - 3 star | Tap "3★" | Shows 3-star reviews only | - 3★ tab |
| CLR-008 | Filter - 2 star | Tap "2★" | Shows 2-star reviews only | - 2★ tab |
| CLR-009 | Filter - 1 star | Tap "1★" | Shows 1-star reviews only | - 1★ tab |
| CLR-010 | Review card display | View list | Shows review details | - User name<br>- Rating<br>- Date<br>- Comment |
| CLR-011 | Load more | Scroll to bottom | Loads more reviews | - Pagination |
| CLR-012 | Empty filter | Filter with no results | Shows empty message | - Empty state |

### 6.4 Cleaning Booking (`/services/cleaning/[id]/book`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| CLB-001 | Screen loads | Navigate to booking | Booking form displays | - Header<br>- Form fields<br>- Summary |
| CLB-002 | Back navigation | Tap back | Returns to provider detail | - Back button |
| CLB-003 | Service selection | View form | Service options available | - Service checkboxes/radio |
| CLB-004 | Date picker | Tap date field | Opens date picker | - Date input |
| CLB-005 | Time picker | Tap time field | Opens time picker | - Time input |
| CLB-006 | Address selection | Tap address | Shows saved addresses | - Address dropdown |
| CLB-007 | Add new address | Tap "Add Address" | Navigates to add address | - Add link |
| CLB-008 | Special instructions | Enter notes | Accepts text | - Notes textarea |
| CLB-009 | Price summary | View screen | Shows breakdown | - Service price<br>- Fees<br>- Total |
| CLB-010 | Confirm booking | Tap "Confirm Booking" | Proceeds to checkout | - Confirm button |
| CLB-011 | Validation errors | Submit incomplete | Shows errors | - Error messages |

---

## 7. Handyman Service

### 7.1 Handyman Index (`/services/handyman/index`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| HND-001 | Screen loads | Navigate to handyman | Provider list displays | - Header<br>- Filter<br>- Provider cards |
| HND-002 | Provider card tap | Tap provider | Navigates to `/services/handyman/[id]` | - |

### 7.2 Handyman Provider Detail (`/services/handyman/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| HDD-001 | Screen loads | Navigate to provider | Detail screen displays | - All provider info |
| HDD-002 | Report button | Tap report | Opens ReportModal | - Report button |
| HDD-003 | View Reviews | Tap "View All" | Navigates to reviews | - View All link |
| HDD-004 | Book Now | Tap "Book Now" | Navigates to booking | - Book Now button |

### 7.3 Handyman Reviews (`/services/handyman/[id]/reviews`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| HNR-001 | Screen loads | Navigate to reviews | Reviews display | - Same as cleaning reviews |

### 7.4 Handyman Booking (`/services/handyman/[id]/book`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| HNB-001 | Screen loads | Navigate to booking | Booking form displays | - Same as cleaning booking |

---

## 8. Beauty Service

### 8.1 Beauty Choice (`/services/beauty/choice`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| BEA-001 | Screen loads | Navigate to beauty | Choice screen displays | - Header<br>- Two option cards |
| BEA-002 | Beauty Services card | View screen | Services option visible | - Services card<br>- Description |
| BEA-003 | Beauty Products card | View screen | Products option visible | - Products card<br>- Description |
| BEA-004 | Services tap | Tap "Beauty Services" | Navigates to `/services/beauty/index` | - |
| BEA-005 | Products tap | Tap "Beauty Products" | Navigates to `/services/beauty/products` | - |

### 8.2 Beauty Services Index (`/services/beauty/index`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| BSI-001 | Screen loads | Navigate to beauty services | Provider list displays | - Header<br>- Filter<br>- Provider cards |
| BSI-002 | Provider tap | Tap provider | Navigates to `/services/beauty/[id]` | - |

### 8.3 Beauty Provider Detail (`/services/beauty/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| BPD-001 | Screen loads | Navigate to provider | Detail displays | - Provider info<br>- Services<br>- Reviews |
| BPD-002 | Report button | Tap report | Opens ReportModal | - |
| BPD-003 | View Reviews | Tap "View All" | Navigates to reviews | - |
| BPD-004 | Book Now | Tap "Book Now" | Navigates to booking | - |

### 8.4 Beauty Reviews (`/services/beauty/[id]/reviews`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| BRV-001 | Screen loads | Navigate to reviews | Reviews display | - Filter tabs<br>- Review cards |

### 8.5 Beauty Booking (`/services/beauty/[id]/book`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| BBK-001 | Screen loads | Navigate to booking | Booking form displays | - Service selection<br>- Date/time<br>- Address |

### 8.6 Beauty Products Index (`/services/beauty/products/index`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| BPI-001 | Screen loads | Navigate to products | Products catalog displays | - Header<br>- Categories<br>- Product grid |
| BPI-002 | Category filter | Tap category | Filters products | - Category tabs |
| BPI-003 | Product card display | View grid | Shows product info | - Image<br>- Name<br>- Price |
| BPI-004 | Add to cart | Tap "Add to Cart" | Adds product to cart | - Add button |
| BPI-005 | Sort options | Tap sort | Shows sort options | - Sort dropdown |

### 8.7 Beauty Products Vendors (`/services/beauty/products/vendors`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| BPV-001 | Screen loads | Navigate to vendors | Vendor list displays | - Header<br>- Vendor cards |
| BPV-002 | Vendor card display | View list | Shows vendor info | - Logo<br>- Name<br>- Rating<br>- Product count |
| BPV-003 | Vendor tap | Tap vendor | Navigates to vendor detail | - |

### 8.8 Beauty Vendor Detail (`/services/beauty/products/vendors/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| BVD-001 | Screen loads | Navigate to vendor | Vendor detail displays | - Header<br>- Categories<br>- Products |
| BVD-002 | Product categories | View screen | Category tabs visible | - Category tabs |
| BVD-003 | Products grid | View screen | Products displayed | - Product cards |
| BVD-004 | Add to cart | Tap add button | Adds to cart | - Add button |
| BVD-005 | Reviews section | View screen | Reviews visible | - Review cards |

---

## 9. Groceries Service

### 9.1 Groceries Index (`/services/groceries/index`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| GRC-001 | Screen loads | Navigate to groceries | Store/vendor list displays | - Header<br>- Store cards |
| GRC-002 | Store card display | View list | Shows store info | - Logo<br>- Name<br>- Rating<br>- Delivery time |
| GRC-003 | Store tap | Tap store | Navigates to store detail | - |

### 9.2 Grocery Store Detail (`/services/groceries/stores/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| GSD-001 | Screen loads | Navigate to store | Store detail displays | - Header<br>- Categories<br>- Products |
| GSD-002 | Store header | View screen | Store info visible | - Logo<br>- Name<br>- Rating |
| GSD-003 | Category navigation | View screen | Categories visible | - Category tabs |
| GSD-004 | Category tap | Tap category | Filters products | - |
| GSD-005 | Product listing | View screen | Products displayed | - Product cards with prices |
| GSD-006 | Search within store | Tap search | Opens search | - Search input |
| GSD-007 | Search results | Enter query | Shows matching products | - Filtered list |
| GSD-008 | Add to cart | Tap add button | Adds product | - Add button |
| GSD-009 | Quantity stepper | After adding | Shows +/- controls | - Quantity stepper |
| GSD-010 | Floating cart button | Add items | Cart button visible | - Cart FAB with count |
| GSD-011 | Cart button tap | Tap cart | Navigates to `/services/groceries/cart` | - |

### 9.3 Food Vendor Detail (`/services/groceries/vendors/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| GVD-001 | Screen loads | Navigate to vendor | Vendor detail displays | - Header<br>- Menu categories<br>- Dishes |
| GVD-002 | Vendor header | View screen | Vendor info visible | - Logo<br>- Name<br>- Rating |
| GVD-003 | Menu categories | View screen | Categories visible | - Appetizers, Mains, etc. |
| GVD-004 | Dish grid | View screen | Dishes displayed | - Dish cards |
| GVD-005 | Add to cart | Tap add | Adds dish to cart | - Add button |
| GVD-006 | Floating cart | Add items | Cart button visible | - Cart FAB |

### 9.4 Groceries Cart (`/services/groceries/cart`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| GCT-001 | Screen loads | Navigate to cart | Cart screen displays | - Header<br>- Items<br>- Summary |
| GCT-002 | Empty cart | No items | Shows empty state | - Empty message<br>- Browse CTA |
| GCT-003 | Vendor info | Have items | Shows vendor name | - Vendor header |
| GCT-004 | Cart item display | Have items | Shows item details | - Image<br>- Name<br>- Price<br>- Quantity |
| GCT-005 | Quantity increase | Tap + | Increases quantity | - + button |
| GCT-006 | Quantity decrease | Tap - | Decreases quantity | - - button |
| GCT-007 | Remove item | Quantity to 0 or tap remove | Removes from cart | - Remove button |
| GCT-008 | Delivery address | View screen | Address selector visible | - Address dropdown |
| GCT-009 | Change address | Tap address | Shows address options | - |
| GCT-010 | Order summary | View screen | Shows breakdown | - Subtotal<br>- Delivery fee<br>- Service fee<br>- Total |
| GCT-011 | Proceed to checkout | Tap button | Navigates to `/services/groceries/checkout` | - Proceed button |

### 9.5 Groceries Checkout (`/services/groceries/checkout`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| GCO-001 | Screen loads | Navigate to checkout | Checkout screen displays | - Address<br>- Time<br>- Payment<br>- Summary |
| GCO-002 | Delivery address | View screen | Address confirmed | - Address card |
| GCO-003 | Change address | Tap change | Opens address selector | - Change link |
| GCO-004 | Delivery time | View screen | Time selector visible | - Time slots |
| GCO-005 | Select time | Tap time slot | Selects delivery time | - Time options |
| GCO-006 | Order summary | View screen | Shows order details | - Items<br>- Prices<br>- Total |
| GCO-007 | Payment method | View screen | Payment selector visible | - Payment cards |
| GCO-008 | Select payment | Tap payment | Selects payment method | - |
| GCO-009 | Add payment | Tap "Add Card" | Navigates to add payment | - Add link |
| GCO-010 | Place order | Tap "Place Order" | Creates order, navigates to tracking | - Place Order button |
| GCO-011 | Validation | Missing required | Shows errors | - Error messages |

### 9.6 Groceries Tracking (`/services/groceries/tracking/[orderId]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| GTR-001 | Screen loads | After placing order | Tracking screen displays | - Header<br>- Timeline<br>- Details |
| GTR-002 | Status timeline | View screen | Shows order progress | - Order placed<br>- Preparing<br>- Out for delivery<br>- Delivered |
| GTR-003 | Current status | View timeline | Active step highlighted | - Active styling |
| GTR-004 | Estimated time | View screen | ETA displayed | - ETA text |
| GTR-005 | Driver info | When assigned | Driver details visible | - Driver name<br>- Photo |
| GTR-006 | Contact driver | Tap contact | Opens contact options | - Contact button |
| GTR-007 | Order details | View screen | Order items shown | - Expandable section |
| GTR-008 | Expand details | Tap expand | Shows full order | - Item list |

---

## 10. Rentals Service

### 10.1 Rentals Index (`/services/rentals/index`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| RNT-001 | Screen loads | Navigate to rentals | Listings display | - Header<br>- Filter<br>- Listing cards |
| RNT-002 | Listing card display | View list | Shows property info | - Photo<br>- Title<br>- Price<br>- Location |
| RNT-003 | Listing tap | Tap listing | Navigates to `/services/rentals/[id]` | - |

### 10.2 Rental Detail (`/services/rentals/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| RND-001 | Screen loads | Navigate to listing | Detail displays | - Photos<br>- Info<br>- Amenities<br>- Reviews |
| RND-002 | Photo gallery | View screen | Photos visible | - Image carousel |
| RND-003 | Property info | View screen | Details visible | - Title<br>- Price<br>- Location<br>- Beds/baths |
| RND-004 | Amenities | View screen | Amenities listed | - Amenity icons |
| RND-005 | Report button | Tap report | Opens ReportModal | - Report button |
| RND-006 | View Reviews | Tap "View All" | Navigates to reviews | - |
| RND-007 | Book Now | Tap "Book Now" | Navigates to booking | - Book Now button |

### 10.3 Rental Reviews (`/services/rentals/[id]/reviews`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| RNR-001 | Screen loads | Navigate to reviews | Reviews display | - Filter tabs<br>- Review cards |

### 10.4 Rental Booking (`/services/rentals/[id]/book`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| RNB-001 | Screen loads | Navigate to booking | Booking form displays | - Date range<br>- Guests<br>- Summary |
| RNB-002 | Check-in date | Tap check-in | Opens date picker | - Check-in input |
| RNB-003 | Check-out date | Tap check-out | Opens date picker | - Check-out input |
| RNB-004 | Guest count | Adjust guests | Updates count | - Guest stepper |
| RNB-005 | Price calculation | Select dates | Shows price breakdown | - Nightly rate<br>- Fees<br>- Total |
| RNB-006 | Confirm booking | Tap confirm | Proceeds to checkout | - Confirm button |

---

## 11. Caregiving Service

### 11.1 Caregiving Choice (`/services/caregiving/choice`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| CGC-001 | Screen loads | Navigate to caregiving | Choice screen displays | - Header<br>- Two option cards |
| CGC-002 | Ride Assistance card | View screen | Rides option visible | - Rides card<br>- Description |
| CGC-003 | Companionship card | View screen | Companions option visible | - Companions card<br>- Description |
| CGC-004 | Rides tap | Tap "Ride Assistance" | Navigates to `/services/caregiving/rides` | - |
| CGC-005 | Companions tap | Tap "Companionship" | Navigates to `/services/caregiving/companions` | - |

### 11.2 Ride Providers (`/services/caregiving/rides/index`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| CGR-001 | Screen loads | Navigate to rides | Provider list displays | - Header<br>- Filter<br>- Provider cards |
| CGR-002 | Provider card display | View list | Shows provider info | - Name<br>- Rating<br>- Vehicle type<br>- Price |
| CGR-003 | Filter by vehicle | Tap filter | Shows vehicle options | - Vehicle filter |
| CGR-004 | Provider tap | Tap provider | Navigates to `/services/caregiving/rides/[id]` | - |

### 11.3 Ride Provider Detail (`/services/caregiving/rides/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| CRD-001 | Screen loads | Navigate to provider | Detail displays | - Provider info<br>- Vehicle<br>- Reviews |
| CRD-002 | Provider info | View screen | Details visible | - Name<br>- Photo<br>- Rating |
| CRD-003 | Vehicle details | View screen | Vehicle info visible | - Type<br>- Accessibility features |
| CRD-004 | Service areas | View screen | Areas listed | - Area list |
| CRD-005 | Pricing | View screen | Rates displayed | - Price per mile/hour |
| CRD-006 | Reviews | View screen | Reviews visible | - Review cards |
| CRD-007 | Book Ride | Tap "Book Ride" | Navigates to booking | - Book Ride button |

### 11.4 Ride Booking (`/services/caregiving/rides/[id]/book`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| CRB-001 | Screen loads | Navigate to booking | Booking form displays | - Pickup<br>- Stops<br>- Destination<br>- Date/time |
| CRB-002 | Pickup location | Enter pickup | Accepts address | - Pickup input |
| CRB-003 | Add stop | Tap "Add Stop" | Adds stop field | - Add Stop button |
| CRB-004 | Multiple stops | Add multiple | Shows all stops | - Stop inputs |
| CRB-005 | Remove stop | Tap remove on stop | Removes stop | - Remove button |
| CRB-006 | Final destination | Enter destination | Accepts address | - Destination input |
| CRB-007 | Round trip toggle | Toggle on | Enables return | - Round trip toggle |
| CRB-008 | Date selection | Tap date | Opens date picker | - Date input |
| CRB-009 | Time selection | Tap time | Opens time picker | - Time input |
| CRB-010 | Special needs notes | Enter notes | Accepts text | - Notes textarea |
| CRB-011 | Price estimate | Fill form | Shows estimated price | - Price display |
| CRB-012 | Confirm booking | Tap confirm | Creates booking | - Confirm button |

### 11.5 Companions List (`/services/caregiving/companions/index`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| CGP-001 | Screen loads | Navigate to companions | Companion list displays | - Header<br>- Filter<br>- Companion cards |
| CGP-002 | Companion card display | View list | Shows companion info | - Photo<br>- Name<br>- Rating<br>- Specialties |
| CGP-003 | Filter by specialty | Tap filter | Shows specialty options | - Specialty filter |
| CGP-004 | Companion tap | Tap companion | Navigates to `/services/caregiving/companions/[id]` | - |

### 11.6 Companion Detail (`/services/caregiving/companions/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| CPD-001 | Screen loads | Navigate to companion | Detail displays | - Profile<br>- Bio<br>- Specialties<br>- Reviews |
| CPD-002 | Profile photo | View screen | Photo visible | - Large photo |
| CPD-003 | Bio/About | View screen | Bio text visible | - Bio section |
| CPD-004 | Specialties | View screen | Specialties listed | - Specialty tags |
| CPD-005 | Hourly rate | View screen | Rate displayed | - Price text |
| CPD-006 | Availability | View screen | Calendar visible | - Availability calendar |
| CPD-007 | Reviews | View screen | Reviews visible | - Review cards |
| CPD-008 | Book Companion | Tap "Book Companion" | Navigates to booking | - Book button |

### 11.7 Companion Booking (`/services/caregiving/companions/[id]/book`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| CPB-001 | Screen loads | Navigate to booking | Booking form displays | - Location<br>- Duration<br>- Date/time |
| CPB-002 | Service location | Enter/select address | Accepts address | - Address input |
| CPB-003 | Duration selector | View options | Duration options visible | - 2hr, 4hr, 8hr, custom |
| CPB-004 | Select duration | Tap duration | Selects duration | - Duration buttons |
| CPB-005 | Custom duration | Tap "Custom" | Opens custom input | - Custom input |
| CPB-006 | Date picker | Tap date | Opens date picker | - Date input |
| CPB-007 | Time slot selection | View slots | Available times shown | - Time slots |
| CPB-008 | Select time | Tap time | Selects time slot | - |
| CPB-009 | Special requirements | Enter notes | Accepts text | - Notes textarea |
| CPB-010 | Price calculation | Fill form | Shows calculated price | - Price display |
| CPB-011 | Confirm booking | Tap confirm | Creates booking | - Confirm button |

### 11.8 Caregiving Tracking (`/services/caregiving/tracking/[bookingId]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| CGT-001 | Screen loads | Navigate to tracking | Tracking displays | - Status<br>- Provider info<br>- Details |
| CGT-002 | Service status | View screen | Current status shown | - Status text/icon |
| CGT-003 | Provider status | View screen | En route/arrived/in progress | - Status indicator |
| CGT-004 | Contact provider | Tap contact | Opens contact options | - Contact button |
| CGT-005 | Service details | View screen | Booking details shown | - Service info |

---

## 12. Notifications

### 12.1 Notifications Screen (`/notifications`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| NOT-001 | Screen loads | Navigate to notifications | Notifications list displays | - Header<br>- Notification cards |
| NOT-002 | Back navigation | Tap back | Returns to previous screen | - Back button |
| NOT-003 | Empty state | No notifications | Shows empty message | - Empty illustration |
| NOT-004 | Notification card display | Have notifications | Shows notification details | - Icon<br>- Title<br>- Message<br>- Timestamp |
| NOT-005 | Unread indicator | Unread notification | Shows unread styling | - Dot or highlight |
| NOT-006 | Read indicator | Read notification | Normal styling | - No highlight |
| NOT-007 | Mark all as read | Tap "Mark all as read" | All notifications marked read | - Mark all button |
| NOT-008 | Notification tap | Tap notification | Navigates to relevant screen | - |
| NOT-009 | Notification types | View different types | Correct icons per type | - Booking, promo, system icons |

---

## 13. Location

### 13.1 Location Permission (`/location-permission`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| LOP-001 | Screen loads | First launch | Permission screen displays | - Icon<br>- Title<br>- Description |
| LOP-002 | Allow location | Tap "Allow" | Requests permission | - Allow button |
| LOP-003 | Permission granted | Grant permission | Navigates to home | - |
| LOP-004 | Permission denied | Deny permission | Shows manual option | - Manual entry link |
| LOP-005 | Enter manually | Tap "Enter Manually" | Navigates to `/location/manual` | - Manual link |

### 13.2 Manual Location (`/location/manual`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| LOM-001 | Screen loads | Navigate to manual location | Location screen displays | - Search<br>- Recent<br>- Current location |
| LOM-002 | Search input | View screen | Search field visible | - Search input |
| LOM-003 | Type address | Enter address | Shows autocomplete | - Autocomplete results |
| LOM-004 | Select suggestion | Tap suggestion | Selects address | - |
| LOM-005 | Recent addresses | Have recent | Shows recent list | - Recent addresses |
| LOM-006 | Tap recent | Tap recent address | Selects address | - |
| LOM-007 | Use current location | Tap button | Gets GPS location | - Current location button |
| LOM-008 | Confirm location | Tap "Confirm" | Saves location, returns | - Confirm button |

---

## 14. Checkout & Payment

### 14.1 Payment Screen (`/checkout/payment`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| CKP-001 | Screen loads | Navigate to payment | Payment screen displays | - Order summary<br>- Payment methods |
| CKP-002 | Order summary | View screen | Shows order details | - Items<br>- Total |
| CKP-003 | Saved cards | Have cards | Shows saved cards | - Card list |
| CKP-004 | Select card | Tap card | Selects for payment | - Radio/check |
| CKP-005 | Add new card | Tap "Add Card" | Opens add card form | - Add link |
| CKP-006 | Pay button | Tap "Pay" | Processes payment | - Pay button |
| CKP-007 | Payment processing | After pay | Shows loading | - Loading indicator |
| CKP-008 | Payment success | Successful | Navigates to confirmation | - |
| CKP-009 | Payment failure | Failed | Shows error message | - Error text |

### 14.2 Confirmation Screen (`/checkout/confirmation`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| CKC-001 | Screen loads | After payment | Confirmation displays | - Success icon<br>- Order details |
| CKC-002 | Success message | View screen | Confirmation message shown | - Success text |
| CKC-003 | Order number | View screen | Order ID displayed | - Order number |
| CKC-004 | Order details | View screen | Summary shown | - Service<br>- Date<br>- Total |
| CKC-005 | View booking | Tap "View Booking" | Navigates to booking detail | - View button |
| CKC-006 | Back to home | Tap "Back to Home" | Navigates to home | - Home button |

---

## 15. Modals

### 15.1 Logout Modal

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| MLO-001 | Modal opens | Tap logout on profile | Modal displays | - Title<br>- Message<br>- Buttons |
| MLO-002 | Title | View modal | "Log Out" title shown | - Title text |
| MLO-003 | Message | View modal | Confirmation message shown | - Message text |
| MLO-004 | Cancel button | Tap "Cancel" | Modal closes | - Cancel button |
| MLO-005 | Logout button | Tap "Log Out" | Logs out, navigates to welcome | - Log Out button |

### 15.2 Delete Account Modal

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| MDA-001 | Modal opens | Tap delete account | Modal displays | - Warning icon<br>- Title<br>- Message |
| MDA-002 | Warning icon | View modal | Warning icon visible | - Icon |
| MDA-003 | Title | View modal | "Delete Account" title | - Title text |
| MDA-004 | Consequences | View modal | Deletion consequences listed | - Warning text |
| MDA-005 | Cancel button | Tap "Cancel" | Modal closes | - Cancel button |
| MDA-006 | Delete button | Tap "Delete" | Deletes account | - Delete button (destructive) |

### 15.3 Report Modal

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| MRP-001 | Modal opens | Tap report on detail | Modal displays | - Title<br>- Reasons<br>- Comment |
| MRP-002 | Title | View modal | "Report Listing" title | - Title text |
| MRP-003 | Reason options | View modal | Radio options visible | - Inappropriate<br>- Misleading<br>- Spam<br>- Other |
| MRP-004 | Select reason | Tap reason | Radio selects | - Radio buttons |
| MRP-005 | Comment field | View modal | Text input visible | - Comment textarea |
| MRP-006 | Enter comment | Type comment | Accepts text | - |
| MRP-007 | Cancel button | Tap "Cancel" | Modal closes | - Cancel button |
| MRP-008 | Submit button | Tap "Submit Report" | Submits report, closes modal | - Submit button |
| MRP-009 | Validation | Submit without reason | Shows error | - Error message |

### 15.4 Cart Warning Modal

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| MCW-001 | Modal opens | Add from different vendor | Modal displays | - Warning message<br>- Options |
| MCW-002 | Warning message | View modal | Different vendor warning | - Message text |
| MCW-003 | Clear cart option | Tap "Clear cart and add" | Clears cart, adds new item | - Clear button |
| MCW-004 | Keep cart option | Tap "Keep current cart" | Modal closes, cart unchanged | - Keep button |

### 15.5 Filter Sheet

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| MFS-001 | Sheet opens | Tap filter on list | Filter sheet displays | - Filter options |
| MFS-002 | Filter options | View sheet | Relevant filters shown | - Varies by service |
| MFS-003 | Select filter | Tap option | Option selected | - Checkbox/radio |
| MFS-004 | Apply filters | Tap "Apply" | Filters list, closes sheet | - Apply button |
| MFS-005 | Reset filters | Tap "Reset" | Clears all filters | - Reset button |
| MFS-006 | Close sheet | Tap outside or X | Sheet closes | - Close action |

---

## 📊 Test Case Summary

| Section | Test Cases |
|---------|------------|
| Splash & Onboarding | 15 |
| Authentication | 35 |
| Home & Navigation | 19 |
| Profile & Settings | 45 |
| Bookings | 30 |
| Cleaning Service | 25 |
| Handyman Service | 5 |
| Beauty Service | 25 |
| Groceries Service | 45 |
| Rentals Service | 15 |
| Caregiving Service | 40 |
| Notifications | 9 |
| Location | 13 |
| Checkout & Payment | 15 |
| Modals | 25 |
| Vendor Portal | 85 |
| Admin Panel | 95 |
| **TOTAL** | **~540** |

---

## 16. Vendor Portal (Web)

### 16.1 Vendor Authentication (`/auth/login`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| VLG-001 | Login page loads | Navigate to /auth/login | Login form displays | - Email input<br>- Sign In button |
| VLG-002 | Empty email validation | Submit empty form | Shows error message | - Error toast |
| VLG-003 | Invalid email format | Enter "test", submit | Shows validation error | - Error message |
| VLG-004 | User not found | Enter non-existent email | Shows "User not found" error | - Error toast |
| VLG-005 | Successful vendor login | Enter valid vendor email | Redirects to /vendor | - Dashboard page |
| VLG-006 | Google Sign-In button | View page | Google button visible | - Google button |
| VLG-007 | Register link | View page | Register link visible | - Register as Vendor link |

### 16.2 Vendor Registration (`/auth/register`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| VRG-001 | Register page loads | Navigate to /auth/register | Registration form displays | - Email input<br>- Terms checkbox<br>- Create Account button |
| VRG-002 | Empty email validation | Submit empty form | Shows error | - Error toast |
| VRG-003 | Terms required | Submit without checking terms | Shows "accept terms" error | - Error toast |
| VRG-004 | Email already exists | Enter existing email | Shows "already exists" error | - Error toast |
| VRG-005 | Successful registration | Fill form correctly | Redirects to /vendor/onboarding | - Onboarding page |
| VRG-006 | Login link | View page | Sign in link visible | - Sign in link |

### 16.3 Vendor Dashboard (`/vendor`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| VDB-001 | Dashboard loads | Login as vendor | Dashboard displays | - Header<br>- Stats cards<br>- Recent orders |
| VDB-002 | Welcome message | View header | Shows business name | - "Welcome, [name]" |
| VDB-003 | Active listings count | View stats | Shows listing count | - Active Listings card |
| VDB-004 | Total orders count | View stats | Shows order count | - Total Orders card |
| VDB-005 | Average rating display | View stats | Shows avg rating | - Average Rating card |
| VDB-006 | Revenue display | View stats | Shows total revenue | - Revenue card |
| VDB-007 | Recent orders list | View dashboard | Shows recent orders | - Order cards |
| VDB-008 | Order card info | View order card | Shows order details | - Service<br>- Customer<br>- Status<br>- Date |
| VDB-009 | View all orders link | Tap "View All" | Navigates to /vendor/orders | - View All link |
| VDB-010 | Sidebar navigation | View sidebar | Menu items visible | - Dashboard<br>- Listings<br>- Orders<br>- Reviews<br>- Settings |

### 16.4 Vendor Listings (`/vendor/listings`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| VLS-001 | Listings page loads | Navigate to listings | Listings grid displays | - Header<br>- Add button<br>- Listing cards |
| VLS-002 | Add listing button | Tap "Add Listing" | Navigates to /vendor/listings/new | - Add New Listing button |
| VLS-003 | Listing card display | Have listings | Shows listing info | - Image<br>- Title<br>- Price<br>- Status badge |
| VLS-004 | Active status badge | Active listing | Green "Active" badge | - Badge |
| VLS-005 | Inactive status badge | Inactive listing | Gray "Inactive" badge | - Badge |
| VLS-006 | Edit listing | Tap Edit icon | Navigates to edit page | - Edit button |
| VLS-007 | Empty state | No listings | Shows empty message | - Empty illustration<br>- CTA |
| VLS-008 | Search listings | Enter search query | Filters listings | - Search input |
| VLS-009 | Filter by category | Select category | Filters by category | - Category dropdown |
| VLS-010 | Filter by status | Select status | Filters by status | - Status filter |

### 16.5 Add/Edit Listing (`/vendor/listings/new`, `/vendor/listings/[id]/edit`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| VLE-001 | Add form loads | Navigate to add | Empty form displays | - All form fields |
| VLE-002 | Edit form loads | Navigate to edit | Pre-filled form displays | - Populated fields |
| VLE-003 | Title field | Enter title | Accepts input | - Title input |
| VLE-004 | Description field | Enter description | Accepts input | - Description textarea |
| VLE-005 | Category selection | Select category | Category selected | - Category dropdown |
| VLE-006 | Price field | Enter price | Accepts numeric | - Price input |
| VLE-007 | Duration field | Enter duration | Accepts input | - Duration input |
| VLE-008 | Image upload | Upload image | Image previews | - Image uploader |
| VLE-009 | Active toggle | Toggle status | Updates status | - Active switch |
| VLE-010 | Save listing | Fill form, save | Saves and redirects | - Save button |
| VLE-011 | Validation errors | Submit incomplete | Shows field errors | - Error messages |
| VLE-012 | Cancel button | Tap cancel | Returns to listings | - Cancel button |
| VLE-013 | Delete listing | Tap delete (edit only) | Opens confirmation | - Delete button |
| VLE-014 | Confirm delete | Confirm deletion | Deletes and redirects | - Confirm dialog |

### 16.6 Vendor Orders (`/vendor/orders`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| VOR-001 | Orders page loads | Navigate to orders | Orders list displays | - Header<br>- Filter tabs<br>- Order cards |
| VOR-002 | Tab - All | Select "All" | Shows all orders | - All tab |
| VOR-003 | Tab - Pending | Select "Pending" | Shows pending orders | - Pending tab |
| VOR-004 | Tab - Accepted | Select "Accepted" | Shows accepted orders | - Accepted tab |
| VOR-005 | Tab - In Progress | Select "In Progress" | Shows in-progress | - In Progress tab |
| VOR-006 | Tab - Completed | Select "Completed" | Shows completed | - Completed tab |
| VOR-007 | Order card display | View list | Shows order info | - Customer name<br>- Service<br>- Date<br>- Status<br>- Amount |
| VOR-008 | Accept order | Tap Accept (pending) | Status changes to Accepted | - Accept button |
| VOR-009 | Decline order | Tap Decline (pending) | Status changes to Declined | - Decline button |
| VOR-010 | Start order | Tap Start (accepted) | Status changes to In Progress | - Start button |
| VOR-011 | Complete order | Tap Complete (in progress) | Status changes to Completed | - Complete button |
| VOR-012 | Order detail modal | Tap order | Opens detail view | - Modal/panel |
| VOR-013 | Customer contact | View detail | Contact info visible | - Phone/email |
| VOR-014 | Service address | View detail | Address displayed | - Address text |
| VOR-015 | Empty state | No orders | Shows empty message | - Empty state |

### 16.7 Vendor Reviews (`/vendor/reviews`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| VRV-001 | Reviews page loads | Navigate to reviews | Reviews list displays | - Header<br>- Stats<br>- Review cards |
| VRV-002 | Average rating display | View stats | Shows avg rating | - Star rating<br>- Number |
| VRV-003 | Total reviews count | View stats | Shows total count | - Review count |
| VRV-004 | Rating breakdown | View stats | Shows distribution | - 5/4/3/2/1 star bars |
| VRV-005 | Review card display | View list | Shows review info | - Customer name<br>- Rating<br>- Comment<br>- Date |
| VRV-006 | Reply to review | Tap "Reply" | Opens reply input | - Reply button |
| VRV-007 | Submit reply | Enter and submit | Reply saved | - Submit button |
| VRV-008 | Reply displayed | After submitting | Shows vendor response | - Response text |
| VRV-009 | Filter by rating | Select rating filter | Filters reviews | - Rating filter |
| VRV-010 | Empty state | No reviews | Shows empty message | - Empty state |

### 16.8 Vendor Settings (`/vendor/settings`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| VST-001 | Settings page loads | Navigate to settings | Settings form displays | - Business info<br>- Account |
| VST-002 | Business name field | View form | Business name editable | - Business name input |
| VST-003 | Description field | View form | Description editable | - Description textarea |
| VST-004 | Contact email field | View form | Email editable | - Email input |
| VST-005 | Contact phone field | View form | Phone editable | - Phone input |
| VST-006 | Logo upload | Tap logo | Opens file picker | - Logo uploader |
| VST-007 | Save changes | Modify and save | Saves settings | - Save button |
| VST-008 | Logout button | Tap logout | Logs out, redirects | - Logout button |

---

## 17. Admin Panel (Web)

### 17.1 Admin Authentication (`/auth/login`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| ALG-001 | Admin login | Enter admin email | Redirects to /admin | - Admin dashboard |
| ALG-002 | Non-admin rejected | Login as customer/vendor | Shows access denied or redirects | - Error or redirect |

### 17.2 Admin Dashboard (`/admin`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| ADB-001 | Dashboard loads | Login as admin | Dashboard displays | - Header<br>- Stats<br>- Charts |
| ADB-002 | Total users stat | View stats | Shows user count | - Total Users card |
| ADB-003 | Total vendors stat | View stats | Shows vendor count | - Total Vendors card |
| ADB-004 | Active bookings stat | View stats | Shows booking count | - Active Bookings card |
| ADB-005 | Revenue stat | View stats | Shows revenue | - Revenue card |
| ADB-006 | Recent vendors list | View dashboard | Shows recent vendors | - Vendor list |
| ADB-007 | Recent bookings list | View dashboard | Shows recent bookings | - Booking list |
| ADB-008 | Sidebar navigation | View sidebar | Menu items visible | - All admin menu items |

### 17.3 Admin Customers (`/admin/customers`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| ACU-001 | Customers page loads | Navigate to customers | Customer list displays | - Header<br>- Search<br>- Table |
| ACU-002 | Customer table columns | View table | All columns visible | - Name<br>- Email<br>- Phone<br>- Bookings<br>- Status |
| ACU-003 | Search customers | Enter search query | Filters results | - Search input |
| ACU-004 | Filter by status | Select status filter | Filters by status | - Status dropdown |
| ACU-005 | View customer detail | Tap customer | Navigates to detail | - Row click |
| ACU-006 | Suspend customer | Tap Suspend | Customer suspended | - Suspend action |
| ACU-007 | Restore customer | Tap Restore | Customer restored | - Restore action |
| ACU-008 | Pagination | Navigate pages | Shows paginated data | - Pagination controls |

### 17.4 Admin Customer Detail (`/admin/customers/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| ACD-001 | Detail page loads | Navigate to detail | Customer info displays | - Header<br>- Profile<br>- Activity |
| ACD-002 | Profile info | View page | Shows customer info | - Name<br>- Email<br>- Phone<br>- Join date |
| ACD-003 | Addresses list | View page | Shows addresses | - Address cards |
| ACD-004 | Booking history | View page | Shows bookings | - Booking list |
| ACD-005 | Reviews given | View page | Shows reviews | - Review list |
| ACD-006 | Suspend button | View actions | Suspend visible | - Suspend button |
| ACD-007 | Back navigation | Tap back | Returns to list | - Back button |

### 17.5 Admin Vendors (`/admin/vendors`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| AVN-001 | Vendors page loads | Navigate to vendors | Vendor list displays | - Header<br>- Filters<br>- Table |
| AVN-002 | Vendor table columns | View table | All columns visible | - Business<br>- Owner<br>- Category<br>- Status<br>- Rating |
| AVN-003 | Search vendors | Enter search query | Filters results | - Search input |
| AVN-004 | Filter by category | Select category | Filters by category | - Category dropdown |
| AVN-005 | Filter by status | Select status | Filters by status | - Status dropdown |
| AVN-006 | Filter by subscription | Select subscription | Filters by subscription | - Subscription dropdown |
| AVN-007 | View vendor detail | Tap vendor | Navigates to detail | - Row click |
| AVN-008 | Approve vendor | Tap Approve (pending) | Vendor approved | - Approve action |
| AVN-009 | Suspend vendor | Tap Suspend | Vendor suspended | - Suspend action |

### 17.6 Admin Vendor Detail (`/admin/vendors/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| AVD-001 | Detail page loads | Navigate to detail | Vendor info displays | - Header<br>- Profile<br>- Listings |
| AVD-002 | Business info | View page | Shows business details | - Name<br>- Description<br>- Contact |
| AVD-003 | Owner info | View page | Shows owner details | - Owner email/phone |
| AVD-004 | Subscription status | View page | Shows subscription | - Status<br>- Dates |
| AVD-005 | Listings list | View page | Shows vendor listings | - Listing cards |
| AVD-006 | Bookings list | View page | Shows vendor bookings | - Booking list |
| AVD-007 | Reviews received | View page | Shows reviews | - Review list |
| AVD-008 | Suspend/Restore action | Tap action | Status changes | - Action button |
| AVD-009 | Back navigation | Tap back | Returns to list | - Back button |

### 17.7 Admin Bookings (`/admin/bookings`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| ABK-001 | Bookings page loads | Navigate to bookings | Booking list displays | - Header<br>- Filters<br>- Table |
| ABK-002 | Booking table columns | View table | All columns visible | - ID<br>- Customer<br>- Vendor<br>- Service<br>- Status<br>- Date |
| ABK-003 | Search bookings | Enter search | Filters results | - Search input |
| ABK-004 | Filter by status | Select status | Filters by status | - Status dropdown |
| ABK-005 | Filter by service | Select service | Filters by service | - Service dropdown |
| ABK-006 | Filter by date | Select date range | Filters by date | - Date picker |
| ABK-007 | View booking detail | Tap booking | Shows detail panel | - Detail modal |
| ABK-008 | Cancel booking | Tap Cancel | Booking cancelled | - Cancel action |
| ABK-009 | Refund booking | Tap Refund | Opens refund flow | - Refund action |

### 17.8 Admin Reports (`/admin/reports`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| ARP-001 | Reports page loads | Navigate to reports | Report list displays | - Header<br>- Filters<br>- Table |
| ARP-002 | Report table columns | View table | All columns visible | - ID<br>- Reporter<br>- Reported<br>- Type<br>- Status |
| ARP-003 | Filter by type | Select type | Filters by type | - Type dropdown |
| ARP-004 | Filter by status | Select status | Filters by status | - Status dropdown |
| ARP-005 | View report detail | Tap report | Navigates to detail | - Row click |
| ARP-006 | Pending badge | Pending report | Yellow badge | - Badge styling |
| ARP-007 | Resolved badge | Resolved report | Green badge | - Badge styling |

### 17.9 Admin Report Detail (`/admin/reports/[id]`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| ARD-001 | Detail page loads | Navigate to detail | Report info displays | - Header<br>- Content<br>- Actions |
| ARD-002 | Reporter info | View page | Shows reporter | - Name<br>- Email |
| ARD-003 | Reported content | View page | Shows reported item | - User/vendor/listing info |
| ARD-004 | Report reason | View page | Shows reason | - Reason text |
| ARD-005 | Additional comments | View page | Shows comments | - Comment text |
| ARD-006 | Resolve action | Tap Resolve | Opens resolve dialog | - Resolve button |
| ARD-007 | Take action options | View resolve dialog | Action options visible | - Warn<br>- Suspend<br>- Remove |
| ARD-008 | Submit resolution | Select action, submit | Report resolved | - Submit button |
| ARD-009 | Dismiss report | Tap Dismiss | Report dismissed | - Dismiss button |

### 17.10 Admin Subscriptions (`/admin/subscriptions`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| ASB-001 | Subscriptions page loads | Navigate to subscriptions | Subscription list displays | - Header<br>- Stats<br>- Table |
| ASB-002 | Trial vendors count | View stats | Shows trial count | - Trial stat card |
| ASB-003 | Active vendors count | View stats | Shows active count | - Active stat card |
| ASB-004 | Expired vendors count | View stats | Shows expired count | - Expired stat card |
| ASB-005 | Subscription table | View table | Shows vendor subscriptions | - Vendor<br>- Status<br>- Start<br>- End |
| ASB-006 | Filter by status | Select status | Filters by status | - Status filter |
| ASB-007 | Extend trial | Tap Extend | Opens extend dialog | - Extend action |
| ASB-008 | View vendor | Tap vendor | Navigates to vendor detail | - Vendor link |

### 17.11 Admin Michelle Listings (`/admin/michelle`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| AML-001 | Michelle page loads | Navigate to michelle | Michelle listings display | - Header<br>- Add button<br>- Listing grid |
| AML-002 | Add official listing | Tap "Add Listing" | Navigates to add form | - Add button |
| AML-003 | Listing card display | Have listings | Shows listing info | - Image<br>- Title<br>- Category<br>- Price |
| AML-004 | Edit listing | Tap Edit | Navigates to edit form | - Edit button |
| AML-005 | Toggle active status | Tap toggle | Status changes | - Active toggle |
| AML-006 | Delete listing | Tap Delete | Opens confirmation | - Delete button |

### 17.12 Add/Edit Michelle Listing (`/admin/michelle/new`, `/admin/michelle/[id]/edit`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| AME-001 | Add form loads | Navigate to add | Empty form displays | - Form fields |
| AME-002 | Edit form loads | Navigate to edit | Pre-filled form displays | - Populated fields |
| AME-003 | Title field | Enter title | Accepts input | - Title input |
| AME-004 | Description field | Enter description | Accepts input | - Description textarea |
| AME-005 | Category selection | Select category | Category selected | - Category dropdown |
| AME-006 | Price field | Enter price | Accepts numeric | - Price input |
| AME-007 | Image upload | Upload image | Image previews | - Image uploader |
| AME-008 | Save listing | Fill form, save | Saves and redirects | - Save button |
| AME-009 | Validation errors | Submit incomplete | Shows errors | - Error messages |

### 17.13 Admin Settings (`/admin/settings`)

| TC ID | Test Case | Steps | Expected Result | Fields/Elements |
|-------|-----------|-------|-----------------|-----------------|
| AST-001 | Settings page loads | Navigate to settings | Settings display | - Platform settings |
| AST-002 | Platform name | View settings | Name editable | - Name input |
| AST-003 | Contact email | View settings | Email editable | - Email input |
| AST-004 | Service fee percentage | View settings | Fee editable | - Fee input |
| AST-005 | Trial duration | View settings | Duration editable | - Duration input |
| AST-006 | Save settings | Modify and save | Settings saved | - Save button |
| AST-007 | Logout button | Tap logout | Logs out | - Logout button |

---

## ✅ Test Execution Tracking

### Legend
- ✅ Pass
- ❌ Fail
- ⏭️ Skipped
- 🔄 In Progress
- ⚠️ Blocked

### Execution Log Template

| Date | Tester | Section | Passed | Failed | Notes |
|------|--------|---------|--------|--------|-------|
| | | | | | |

---

*Document Version: 2.0*  
*Last Updated: January 13, 2026*  
*Added: Vendor Portal (85 test cases), Admin Panel (95 test cases)*


# Web Portal Frontend Deletion Plan

**Target Directory:** `doohub-app/apps/web-portal/`  
**Action:** Delete the entire frontend application  
**Reason:** Complete rebuild from scratch using wireframe specifications (`DEV_IMPLEMENTATION_GUIDE.md`)

---

## Quick Deletion Instructions

### Method 1: Delete Entire Directory (RECOMMENDED)
```bash
# From workspace root: /Users/saadahmed/Desktop/ui_proposals
rm -rf doohub-app/apps/web-portal
```

### Method 2: Delete Contents Only (Preserve Directory Structure)
If you want to keep the `web-portal` directory but remove all contents:
```bash
cd doohub-app/apps/web-portal
rm -rf * .* 2>/dev/null  # Delete all files including hidden ones (if any)
```

---

## Complete File Inventory to Delete

### 1. Root Configuration Files (7 files)
```
doohub-app/apps/web-portal/package.json
doohub-app/apps/web-portal/tsconfig.json
doohub-app/apps/web-portal/next.config.js
doohub-app/apps/web-portal/postcss.config.js
doohub-app/apps/web-portal/tailwind.config.js
doohub-app/apps/web-portal/middleware.ts
doohub-app/apps/web-portal/next-env.d.ts
```

### 2. Root App Files (3 files)
```
doohub-app/apps/web-portal/app/page.tsx
doohub-app/apps/web-portal/app/layout.tsx
doohub-app/apps/web-portal/app/globals.css
```

### 3. Admin Panel Routes (24 files + directories)
```
doohub-app/apps/web-portal/app/admin/page.tsx
doohub-app/apps/web-portal/app/admin/dashboard/page.tsx
doohub-app/apps/web-portal/app/admin/vendors/page.tsx
doohub-app/apps/web-portal/app/admin/vendors/[id]/page.tsx
doohub-app/apps/web-portal/app/admin/listings/page.tsx
doohub-app/apps/web-portal/app/admin/moderation/page.tsx
doohub-app/apps/web-portal/app/admin/reports/page.tsx
doohub-app/apps/web-portal/app/admin/reports/[id]/page.tsx
doohub-app/apps/web-portal/app/admin/customers/page.tsx
doohub-app/apps/web-portal/app/admin/customers/[id]/page.tsx
doohub-app/apps/web-portal/app/admin/orders/page.tsx
doohub-app/apps/web-portal/app/admin/subscriptions/page.tsx
doohub-app/apps/web-portal/app/admin/push-notifications/page.tsx
doohub-app/apps/web-portal/app/admin/settings/page.tsx
doohub-app/apps/web-portal/app/admin/reset-password/page.tsx
doohub-app/apps/web-portal/app/admin/michelle/page.tsx (if exists)
doohub-app/apps/web-portal/app/admin/michelle/new/page.tsx
doohub-app/apps/web-portal/app/admin/michelle/[id]/edit/page.tsx
doohub-app/apps/web-portal/app/admin/michelle-profiles/page.tsx
doohub-app/apps/web-portal/app/admin/michelle-profiles/new/page.tsx
doohub-app/apps/web-portal/app/admin/michelle-profiles/[id]/edit/page.tsx
```

### 4. Vendor Portal Routes (26 files + directories)
```
doohub-app/apps/web-portal/app/vendor/page.tsx
doohub-app/apps/web-portal/app/vendor/dashboard/page.tsx
doohub-app/apps/web-portal/app/vendor/services/page.tsx
doohub-app/apps/web-portal/app/vendor/services/new/page.tsx
doohub-app/apps/web-portal/app/vendor/services/[id]/edit/page.tsx
doohub-app/apps/web-portal/app/vendor/listings/page.tsx
doohub-app/apps/web-portal/app/vendor/listings/new/page.tsx
doohub-app/apps/web-portal/app/vendor/listings/[id]/edit/page.tsx
doohub-app/apps/web-portal/app/vendor/orders/page.tsx
doohub-app/apps/web-portal/app/vendor/reviews/page.tsx
doohub-app/apps/web-portal/app/vendor/performance/page.tsx
doohub-app/apps/web-portal/app/vendor/profile/page.tsx
doohub-app/apps/web-portal/app/vendor/settings/page.tsx
doohub-app/apps/web-portal/app/vendor/subscription/page.tsx
doohub-app/apps/web-portal/app/vendor/subscription-management/page.tsx
doohub-app/apps/web-portal/app/vendor/change-plan/page.tsx
doohub-app/apps/web-portal/app/vendor/update-payment/page.tsx
doohub-app/apps/web-portal/app/vendor/availability/page.tsx
doohub-app/apps/web-portal/app/vendor/onboarding/page.tsx
```

### 5. Authentication Routes (5 files)
```
doohub-app/apps/web-portal/app/auth/layout.tsx
doohub-app/apps/web-portal/app/auth/login/page.tsx
doohub-app/apps/web-portal/app/auth/register/page.tsx
doohub-app/apps/web-portal/app/auth/verify-otp/page.tsx
doohub-app/apps/web-portal/app/auth/dev/page.tsx
```

### 6. Components Directory (23 files)
```
doohub-app/apps/web-portal/components/layouts/Header.tsx
doohub-app/apps/web-portal/components/layouts/PortalLayout.tsx
doohub-app/apps/web-portal/components/layouts/Sidebar.tsx
doohub-app/apps/web-portal/components/ui/badge.tsx
doohub-app/apps/web-portal/components/ui/button.tsx
doohub-app/apps/web-portal/components/ui/card.tsx
doohub-app/apps/web-portal/components/ui/dialog.tsx
doohub-app/apps/web-portal/components/ui/input.tsx
doohub-app/apps/web-portal/components/ui/label.tsx
doohub-app/apps/web-portal/components/ui/select.tsx
doohub-app/apps/web-portal/components/ui/tabs.tsx
doohub-app/apps/web-portal/components/ui/textarea.tsx
doohub-app/apps/web-portal/components/ui/toaster.tsx
doohub-app/apps/web-portal/components/vendor/VendorCard.tsx
doohub-app/apps/web-portal/components/vendor/forms/VendorCleaningServiceForm.tsx
doohub-app/apps/web-portal/components/vendor/forms/VendorHandymanServiceForm.tsx
doohub-app/apps/web-portal/components/vendor/forms/VendorBeautyServiceForm.tsx
doohub-app/apps/web-portal/components/vendor/forms/VendorFoodServiceForm.tsx
doohub-app/apps/web-portal/components/vendor/forms/VendorGroceryForm.tsx
doohub-app/apps/web-portal/components/vendor/forms/VendorRentalPropertyForm.tsx
doohub-app/apps/web-portal/components/vendor/forms/VendorBeautyProductForm.tsx
doohub-app/apps/web-portal/components/vendor/forms/VendorRideAssistanceForm.tsx
doohub-app/apps/web-portal/components/vendor/forms/VendorCompanionshipSupportForm.tsx
```

### 7. Libraries & Utilities (2 files)
```
doohub-app/apps/web-portal/lib/api.ts
doohub-app/apps/web-portal/lib/utils.ts
```

### 8. State Management (1 file)
```
doohub-app/apps/web-portal/stores/authStore.ts
```

### 9. Generated/Build Artifacts (entire directories)
```
doohub-app/apps/web-portal/node_modules/
doohub-app/apps/web-portal/.next/ (if exists - build output)
doohub-app/apps/web-portal/.next-env.d/ (if exists)
```

### 10. Hidden Configuration Files (if present)
```
doohub-app/apps/web-portal/.eslintrc.json (if exists)
doohub-app/apps/web-portal/.gitignore (if exists)
doohub-app/apps/web-portal/.env (if exists)
doohub-app/apps/web-portal/.env.local (if exists)
```

---

## What NOT to Delete

**DO NOT DELETE** anything outside `doohub-app/apps/web-portal/`. Specifically preserve:

### Backend API (Untouched)
```
doohub-app/apps/api/                    ← KEEP ENTIRELY
```

### Database Package (Untouched)
```
doohub-app/packages/database/           ← KEEP ENTIRELY
```

### Shared Package (Untouched)
```
doohub-app/packages/shared/             ← KEEP ENTIRELY
```

### Root Config (Untouched)
```
doohub-app/package.json                 ← KEEP (monorepo root)
doohub-app/turbo.json                   ← KEEP
doohub-app/docker-compose.yml           ← KEEP
doohub-app/README.md                    ← KEEP
```

---

## Verification Steps (After Deletion)

1. **Confirm directory is gone:**
   ```bash
   ls -la doohub-app/apps/web-portal
   # Should show: "No such file or directory"
   ```

2. **Confirm backend API is intact:**
   ```bash
   ls doohub-app/apps/api/src/routes/
   # Should show all route files (vendors.ts, auth.ts, etc.)
   ```

3. **Confirm database package is intact:**
   ```bash
   ls doohub-app/packages/database/prisma/
   # Should show schema.prisma, seed.ts
   ```

---

## Post-Deletion Next Steps

1. **Create fresh Next.js app:**
   ```bash
   cd doohub-app/apps
   npx create-next-app@latest web-portal --typescript --tailwind --app --no-src-dir
   ```

2. **Follow `DEV_IMPLEMENTATION_GUIDE.md` exactly:**
   - Copy exact color tokens from the guide
   - Implement exact layout dimensions (sidebar width: 280px, etc.)
   - Build screens per wireframe specifications

3. **Reconnect to API:**
   - Point new portal to `http://localhost:3001/api/v1`
   - Re-implement auth flow (Email + OTP + Google as per spec)

---

## Summary Statistics

| Category | Files to Delete |
|----------|----------------|
| Configuration Files | 7 |
| Root App Files | 3 |
| Admin Routes | ~24 |
| Vendor Routes | ~26 |
| Auth Routes | 5 |
| Components | ~23 |
| Libraries | 2 |
| Stores | 1 |
| **Total Files** | **~91 TypeScript/TSX files** |
| **Directories** | **Entire `web-portal/` folder** |

---

**Status:** Ready for deletion  
**Risk Level:** Low (only frontend affected, backend untouched)  
**Recommended Action:** Use Method 1 (delete entire directory) for cleanest rebuild

---

*Generated: January 17, 2026*

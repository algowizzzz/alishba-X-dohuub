-- Add columns required for portal demo polish
ALTER TABLE "PlatformSettings" ADD COLUMN IF NOT EXISTS "termsContent" TEXT;
ALTER TABLE "PlatformSettings" ADD COLUMN IF NOT EXISTS "privacyContent" TEXT;
ALTER TABLE "PlatformSettings" ADD COLUMN IF NOT EXISTS "stripePublishableKey" TEXT;
ALTER TABLE "PlatformSettings" ADD COLUMN IF NOT EXISTS "stripeSecretKey" TEXT;
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "stripePublishableKey" TEXT;
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "stripeSecretKey" TEXT;

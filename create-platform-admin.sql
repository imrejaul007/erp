-- Create Platform Admin Account
-- This will be automatically created when Render deploys

INSERT INTO platform_admins (
  id,
  email,
  password,
  name,
  phone,
  role,
  "isActive",
  "canManageTenants",
  "canManageBilling",
  "canViewAnalytics",
  "canAccessAllData",
  "createdAt",
  "updatedAt"
) VALUES (
  'platform-admin-main',
  'platform@oudperfume.ae',
  '$2b$10$u81WflmVx9be1YfQS.9VEeLvN4pPgcsB2zaaoC0Y.UaE2LcIZO6Su',
  'Platform Administrator',
  '+971-50-0000000',
  'PLATFORM_OWNER',
  true,
  true,
  true,
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  "isActive" = true,
  "updatedAt" = NOW();

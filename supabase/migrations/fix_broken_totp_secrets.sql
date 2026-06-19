-- ============================================================
-- IRAYA: 2FA Secret Migration
-- ============================================================
-- Run this in Supabase SQL Editor BEFORE deploying the TOTP fix.
--
-- PROBLEM: All existing totp_secret values were generated with
--   generateRandomToken(10).toUpperCase() → hex chars only (0-9, A-F).
--   RFC 4648 Base32 requires only A-Z and 2-7. Characters like
--   0, 1, 8, 9 are invalid Base32 and will silently break TOTP.
--
-- RESULT: Every user who enabled 2FA with the old code has a
--   broken authenticator app. They can only sign in via backup codes.
--
-- REMEDIATION: Disable 2FA for all affected users, clear their
--   backup codes, and email them to re-enroll. On their next login
--   the new generateBase32Secret() will produce a valid secret.
-- ============================================================

BEGIN;

-- Step 1: Identify all users with potentially broken hex secrets.
-- A valid Base32 secret (uppercase RFC 4648) contains ONLY A-Z and 2-7.
-- A hex secret will contain digits 0, 1, 8, 9 which are invalid Base32.
-- We flag any secret that matches hex-only characters [0-9A-F] with length <= 20.

CREATE TEMP TABLE broken_2fa AS
SELECT
  u.user_id,
  u.totp_secret,
  p.email
FROM user_2fa u
LEFT JOIN profiles p ON p.id = u.user_id
WHERE
  u.totp_enabled = true
  AND u.totp_secret IS NOT NULL
  -- Detect hex-only secrets: only 0-9 and A-F (case-insensitive)
  -- Valid Base32 secrets include G-Z and 2-7, so this catches the broken ones.
  AND u.totp_secret ~ '^[0-9A-Fa-f]+$';

-- Step 2: Preview what will be affected before committing
SELECT
  user_id,
  LEFT(totp_secret, 6) || '...' AS secret_preview,
  email
FROM broken_2fa;

-- Step 3: Disable 2FA and clear secrets/backup codes for affected users.
-- Users will be prompted to re-enroll on next login.
UPDATE user_2fa
SET
  totp_enabled    = false,
  totp_secret     = null,
  backup_codes    = null,
  failed_attempts = 0,
  locked_until    = null
WHERE user_id IN (SELECT user_id FROM broken_2fa);

-- Step 4: Log a security event for each affected user.
INSERT INTO security_events (user_id, email, event_type, severity, details)
SELECT
  user_id,
  email,
  'totp_secret_migration_reset',
  'warning',
  jsonb_build_object(
    'reason', 'TOTP secret was hex-encoded (invalid Base32). 2FA disabled. User must re-enroll.',
    'migration_date', now()
  )
FROM broken_2fa;

-- Step 5: Verify — should return 0 rows if migration was clean.
SELECT COUNT(*) AS remaining_broken
FROM user_2fa
WHERE
  totp_enabled = true
  AND totp_secret ~ '^[0-9A-Fa-f]+$';

COMMIT;

-- ============================================================
-- AFTER running this migration:
-- 1. Deploy the app with the new generateBase32Secret() fix
-- 2. Email affected users:
--    "We've updated our two-factor authentication system for improved
--     compatibility. Your 2FA has been temporarily disabled. Please
--     re-enable it in Account → Security → Two-Factor Authentication."
-- 3. Add BACKUP_CODE_PEPPER to environment variables
-- ============================================================

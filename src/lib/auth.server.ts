import { createHmac, randomBytes } from "node:crypto";

// Generate a proper Base32-encoded TOTP secret (RFC 4648).
// Authenticator apps (Google Authenticator, Authy, etc.) require Base32.
// DO NOT use hex or arbitrary strings — they will silently break TOTP.
export function generateBase32Secret(byteLength: number = 20): string {
  const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const buf = randomBytes(byteLength);
  let result = "";
  let bitsLeft = 0;
  let currentByte = 0;
  for (let i = 0; i < byteLength; i++) {
    currentByte = (currentByte << 8) | buf[i];
    bitsLeft += 8;
    while (bitsLeft >= 5) {
      bitsLeft -= 5;
      result += BASE32_ALPHABET[(currentByte >> bitsLeft) & 0x1f];
    }
  }
  // Pad remaining bits if necessary
  if (bitsLeft > 0) {
    result += BASE32_ALPHABET[(currentByte << (5 - bitsLeft)) & 0x1f];
  }
  return result;
}

// Decode JWT payload without signature verification
export function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, "base64")
        .toString("ascii")
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Helper: Decode base32 secret to Buffer
function base32Decode(base32: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = base32.toUpperCase().replace(/=+$/, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleaned.length; i++) {
    const idx = alphabet.indexOf(cleaned[i]);
    if (idx === -1) throw new Error("Invalid base32 character");
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

// Helper: Generate TOTP
function generateTotp(secret: string, counter: number): string {
  const key = base32Decode(secret);
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32BE(0, 0); // High bits
  buffer.writeUInt32BE(counter, 4); // Low bits

  const hmac = createHmac("sha1", key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = code % 1_000_000;
  return otp.toString().padStart(6, "0");
}

// Verify TOTP with window tolerance (current, previous, next)
export function verifyTotp(secret: string, token: string): boolean {
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (let i = -1; i <= 1; i++) {
    if (generateTotp(secret, counter + i) === token) {
      return true;
    }
  }
  return false;
}

// Generate random secure token
export function generateRandomToken(bytes: number = 32): string {
  return randomBytes(bytes).toString("hex");
}

// Hash backup code with a per-user pepper so pre-computation is per-user.
// pepper = BACKUP_CODE_PEPPER env var (a strong random secret, never in source).
// Falls back to a weaker constant if the env var is not set — always configure it.
export function hashBackupCode(code: string, userId: string): string {
  const pepper = process.env.BACKUP_CODE_PEPPER ?? "iraya_backup_fallback_v1";
  const salt = `${pepper}:${userId}`;
  return createHmac("sha256", salt).update(code).digest("hex");
}

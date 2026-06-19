import { randomBytes, createHmac } from "node:crypto";
function generateBase32Secret(byteLength = 20) {
  const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const buf = randomBytes(byteLength);
  let result = "";
  let bitsLeft = 0;
  let currentByte = 0;
  for (let i = 0; i < byteLength; i++) {
    currentByte = currentByte << 8 | buf[i];
    bitsLeft += 8;
    while (bitsLeft >= 5) {
      bitsLeft -= 5;
      result += BASE32_ALPHABET[currentByte >> bitsLeft & 31];
    }
  }
  if (bitsLeft > 0) {
    result += BASE32_ALPHABET[currentByte << 5 - bitsLeft & 31];
  }
  return result;
}
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, "base64").toString("ascii").split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
function base32Decode(base32) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = base32.toUpperCase().replace(/=+$/, "");
  let bits = 0;
  let value = 0;
  const bytes = [];
  for (let i = 0; i < cleaned.length; i++) {
    const idx = alphabet.indexOf(cleaned[i]);
    if (idx === -1) throw new Error("Invalid base32 character");
    value = value << 5 | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push(value >>> bits - 8 & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}
function generateTotp(secret, counter) {
  const key = base32Decode(secret);
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32BE(0, 0);
  buffer.writeUInt32BE(counter, 4);
  const hmac = createHmac("sha1", key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 15;
  const code = (hmac[offset] & 127) << 24 | (hmac[offset + 1] & 255) << 16 | (hmac[offset + 2] & 255) << 8 | hmac[offset + 3] & 255;
  const otp = code % 1e6;
  return otp.toString().padStart(6, "0");
}
function verifyTotp(secret, token) {
  const counter = Math.floor(Date.now() / 1e3 / 30);
  for (let i = -1; i <= 1; i++) {
    if (generateTotp(secret, counter + i) === token) {
      return true;
    }
  }
  return false;
}
function generateRandomToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}
function hashBackupCode(code, userId) {
  const pepper = process.env.BACKUP_CODE_PEPPER ?? "iraya_backup_fallback_v1";
  const salt = `${pepper}:${userId}`;
  return createHmac("sha256", salt).update(code).digest("hex");
}
export {
  decodeJwtPayload,
  generateBase32Secret,
  generateRandomToken,
  hashBackupCode,
  verifyTotp
};

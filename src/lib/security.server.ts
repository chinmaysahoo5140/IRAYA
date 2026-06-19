// Server-only security helpers. Never import from client code.
// Rate limiting, account lockout, audit log, login event tracking,
// geolocation, security events, PII redaction.

import { createHmac, timingSafeEqual } from "node:crypto";

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_WINDOW_MIN = 30;

// Block obvious scanner/bot user agents at the edge. Real browsers are spared.
const BAD_UA_PATTERNS = [
  /sqlmap/i, /nikto/i, /acunetix/i, /nessus/i, /openvas/i,
  /masscan/i, /nmap scripting engine/i, /wpscan/i, /dirbuster/i,
  /gobuster/i, /fuzzer/i, /havij/i, /metasploit/i,
];

export function isBlockedUserAgent(ua: string | null | undefined): boolean {
  if (!ua) return false;
  return BAD_UA_PATTERNS.some((re) => re.test(ua));
}

export function getClientIp(request: Request | undefined): string | null {
  if (!request) return null;
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null
  );
}

export function detectDeviceType(ua: string | null | undefined): string {
  if (!ua) return "unknown";
  const s = ua.toLowerCase();
  if (/ipad|tablet/.test(s)) return "tablet";
  if (/mobi|iphone|android/.test(s)) return "mobile";
  return "desktop";
}

// Simple regex parser for browser OS details
export function parseUserAgent(ua: string | null | undefined) {
  if (!ua) return { browserName: "unknown", browserVersion: "unknown", os: "unknown" };
  const s = ua.toLowerCase();
  let browserName = "unknown";
  let browserVersion = "unknown";
  let os = "unknown";

  // Detect OS
  if (s.includes("windows")) os = "Windows";
  else if (s.includes("macintosh") || s.includes("mac os")) os = "macOS";
  else if (s.includes("linux")) os = "Linux";
  else if (s.includes("android")) os = "Android";
  else if (s.includes("iphone") || s.includes("ipad")) os = "iOS";

  // Detect Browser
  if (s.includes("firefox")) {
    browserName = "Firefox";
    const m = ua.match(/Firefox\/([0-9.]+)/);
    if (m) browserVersion = m[1];
  } else if (s.includes("chrome") && !s.includes("chromium")) {
    browserName = "Chrome";
    const m = ua.match(/Chrome\/([0-9.]+)/);
    if (m) browserVersion = m[1];
  } else if (s.includes("safari") && !s.includes("chrome")) {
    browserName = "Safari";
    const m = ua.match(/Version\/([0-9.]+)/);
    if (m) browserVersion = m[1];
  } else if (s.includes("edge") || s.includes("edg/")) {
    browserName = "Edge";
    const m = ua.match(/(?:Edge|Edg)\/([0-9.]+)/);
    if (m) browserVersion = m[1];
  }

  return { browserName, browserVersion, os };
}

// Redact emails, phone numbers, tokens from a string for safe logging.
export function redactPII(input: unknown): string {
  let s = typeof input === "string" ? input : JSON.stringify(input);
  s = s.replace(/([A-Za-z0-9._%+-])[A-Za-z0-9._%+-]*(@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, "$1***$2");
  s = s.replace(/\+?\d[\d\s().-]{7,}\d/g, "[REDACTED_PHONE]");
  s = s.replace(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[REDACTED_JWT]");
  s = s.replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]");
  return s;
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; remaining: number }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();

  const { count, error } = await supabaseAdmin
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("key", key)
    .gte("created_at", since);

  if (error) return { allowed: true, remaining: limit };
  const used = count ?? 0;
  if (used >= limit) return { allowed: false, remaining: 0 };

  await supabaseAdmin.from("rate_limits").insert({ key });
  return { allowed: true, remaining: Math.max(0, limit - used - 1) };
}

export async function isAccountLocked(email: string): Promise<boolean> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const since = new Date(Date.now() - LOCKOUT_WINDOW_MIN * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from("login_attempts")
    .select("*", { count: "exact", head: true })
    .eq("email", email.toLowerCase())
    .eq("success", false)
    .gte("created_at", since);
  return (count ?? 0) >= LOCKOUT_THRESHOLD;
}

export async function recordLoginAttempt(
  email: string,
  success: boolean,
  ip: string | null,
  userAgent: string | null,
): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("login_attempts").insert({
    email: email.toLowerCase(),
    success,
    ip,
    user_agent: userAgent?.slice(0, 400) ?? null,
  });
  if (success) {
    await supabaseAdmin
      .from("login_attempts")
      .delete()
      .eq("email", email.toLowerCase())
      .eq("success", false);
  }
}

// Best-effort IP geolocation. Free, no key required. Returns null on any error
// so login flows never break because of a third-party outage.
export async function geoLookup(
  ip: string | null,
): Promise<{ country: string | null; city: string | null }> {
  if (!ip || ip === "unknown" || ip.startsWith("127.") || ip.startsWith("10.") || ip.startsWith("192.168.")) {
    return { country: "Localhost", city: "Localhost" };
  }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2000);
    const res = await fetch(`https://ip-api.com/json/${encodeURIComponent(ip)}`, {
      signal: ctrl.signal,
      headers: { "User-Agent": "iraya-security/1.0" },
    });
    clearTimeout(t);
    if (!res.ok) return { country: null, city: null };
    const j = (await res.json()) as { country?: string; city?: string };
    return { country: j.country ?? null, city: j.city ?? null };
  } catch {
    return { country: null, city: null };
  }
}

export async function recordLoginEvent(params: {
  userId: string | null;
  email: string;
  ip: string | null;
  userAgent: string | null;
}): Promise<{ isNewDevice: boolean }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const deviceType = detectDeviceType(params.userAgent);
  const { country, city } = await geoLookup(params.ip);

  let isNewDevice = false;
  if (params.userId) {
    // Same IP OR same UA seen in last 90 days = known device.
    const since = new Date(Date.now() - 90 * 86400_000).toISOString();
    const { count } = await supabaseAdmin
      .from("login_events")
      .select("*", { count: "exact", head: true })
      .eq("user_id", params.userId)
      .gte("created_at", since)
      .or(`ip.eq.${params.ip ?? ""},user_agent.eq.${params.userAgent ?? ""}`);
    isNewDevice = (count ?? 0) === 0;
  }

  await supabaseAdmin.from("login_events").insert({
    user_id: params.userId,
    email: params.email.toLowerCase(),
    ip: params.ip,
    country,
    city,
    user_agent: params.userAgent?.slice(0, 400) ?? null,
    device_type: deviceType,
    is_new_device: isNewDevice,
  });

  if (isNewDevice && params.userId) {
    await writeSecurityEvent({
      userId: params.userId,
      email: params.email,
      eventType: "new_device_login",
      severity: "info",
      ip: params.ip,
      country,
      userAgent: params.userAgent,
      details: { city, deviceType },
    });
  }

  return { isNewDevice };
}

export async function checkLoginAnomaly(
  userId: string,
  email: string,
  ip: string | null,
  userAgent: string | null
): Promise<{ anomalous: boolean; reasons: string[] }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const reasons: string[] = [];
  const { country, city } = await geoLookup(ip);

  if (!country) return { anomalous: false, reasons: [] };

  // 1. Check if IP from different country than usual
  const { data: recentEvents } = await supabaseAdmin
    .from("login_events")
    .select("country, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (recentEvents && recentEvents.length > 0) {
    const countries = new Set(recentEvents.map(e => e.country).filter(Boolean));
    if (countries.size > 0 && !countries.has(country)) {
      reasons.push(`New login country: ${country} (usual: ${Array.from(countries).join(", ")})`);
    }
  }

  // NOTE: Unusual-hour detection intentionally omitted.
  // The server runs in UTC; checking getHours() would flag legitimate IST users
  // at 8–10 AM as "suspicious" (3:30–5:30 AM UTC). A proper implementation
  // requires knowing the user's local timezone from their location history.

  // 3. Impossible travel detection (within 1 hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data: recentTravels } = await supabaseAdmin
    .from("login_events")
    .select("country, created_at")
    .eq("user_id", userId)
    .gte("created_at", oneHourAgo);

  if (recentTravels && recentTravels.length > 0) {
    const travelCountries = new Set(recentTravels.map(e => e.country).filter(Boolean));
    travelCountries.delete(country);
    if (travelCountries.size > 0) {
      reasons.push(`Impossible travel detected: logged in from ${country} and ${Array.from(travelCountries).join(", ")} within 1 hour`);
    }
  }

  return {
    anomalous: reasons.length > 0,
    reasons,
  };
}

export function validateRequestTimestamp(request: Request) {
  const tsHeader = request.headers.get("X-Request-Timestamp");
  if (!tsHeader) {
    throw new Error("Missing request timestamp header (X-Request-Timestamp)");
  }
  const ts = parseInt(tsHeader, 10);
  if (isNaN(ts)) {
    throw new Error("Invalid request timestamp");
  }
  const age = Math.abs(Date.now() - ts);
  if (age > 5 * 60 * 1000) {
    throw new Error("Request signature expired (replay protection)");
  }
}

export function stripExifJpeg(buffer: Buffer): Buffer {
  let i = 2;
  const result: number[] = [0xFF, 0xD8];
  while (i < buffer.length) {
    if (buffer[i] === 0xFF) {
      const marker = buffer[i + 1];
      if (marker === 0xD9) {
        result.push(0xFF, 0xD9);
        break;
      }
      const length = (buffer[i + 2] << 8) + buffer[i + 3];
      if (marker === 0xE1) {
        i += 2 + length;
      } else {
        const segment = buffer.slice(i, i + 2 + length);
        result.push(...segment);
        i += 2 + length;
      }
    } else {
      result.push(buffer[i]);
      i++;
    }
  }
  return Buffer.from(result);
}

export function stripExifPng(buffer: Buffer): Buffer {
  if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
    return buffer;
  }
  const result: number[] = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
  let pos = 8;
  while (pos < buffer.length) {
    const length = buffer.readUInt32BE(pos);
    const type = buffer.toString("ascii", pos + 4, pos + 8);
    if (type === "IEND") {
      const chunk = buffer.slice(pos, pos + 12);
      result.push(...chunk);
      break;
    }
    if (["eXIf", "tEXt", "zTXt", "iTXt", "iCCP"].includes(type)) {
      pos += 12 + length;
    } else {
      const chunk = buffer.slice(pos, pos + 12 + length);
      result.push(...chunk);
      pos += 12 + length;
    }
  }
  return Buffer.from(result);
}

export async function secureImageUpload(fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> {
  if (fileBuffer.length > 5 * 1024 * 1024) {
    throw new Error("File size exceeds 5MB limit");
  }

  let ext = "";
  let cleanBuffer = fileBuffer;
  const magic = fileBuffer.slice(0, 4);

  if (magic[0] === 0xFF && magic[1] === 0xD8 && magic[2] === 0xFF) {
    ext = "jpg";
    cleanBuffer = stripExifJpeg(fileBuffer);
  } else if (magic[0] === 0x89 && magic[1] === 0x50 && magic[2] === 0x4E && magic[3] === 0x47) {
    ext = "png";
    cleanBuffer = stripExifPng(fileBuffer);
  } else if (magic[0] === 0x47 && magic[1] === 0x49 && magic[2] === 0x46) {
    ext = "gif";
  } else if (magic[0] === 0x52 && magic[1] === 0x49 && magic[2] === 0x46 && magic[3] === 0x46) {
    ext = "webp";
  } else {
    throw new Error("Unsupported file type or invalid magic bytes");
  }

  // Derive the safe content-type from validated magic bytes.
  // NEVER trust the client-supplied contentType — a malicious uploader could
  // declare "text/html" while uploading a valid JPEG to trick downstream consumers.
  const safeContentTypeMap: Record<string, string> = {
    jpg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };
  const safeContentType = safeContentTypeMap[ext] ?? "application/octet-stream";

  const randomName = `${Date.now()}_${Math.random().toString(36).slice(2, 12)}.${ext}`;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.storage
    .from("product-images")
    .upload(randomName, cleanBuffer, {
      contentType: safeContentType,
      cacheControl: "31536000",
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from("product-images")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

export async function writeSecurityEvent(params: {
  userId?: string | null;
  email?: string | null;
  eventType: string;
  severity?: "info" | "warning" | "critical";
  ip?: string | null;
  country?: string | null;
  userAgent?: string | null;
  details?: Record<string, unknown> | null;
}): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("security_events").insert({
      user_id: params.userId ?? null,
      email: params.email?.toLowerCase() ?? null,
      event_type: params.eventType,
      severity: params.severity ?? "info",
      ip: params.ip ?? null,
      country: params.country ?? null,
      user_agent: params.userAgent?.slice(0, 400) ?? null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      details: (params.details ?? null) as any,
    });
  } catch (err) {
    console.error("[security_event] write failed:", redactPII(err instanceof Error ? err.message : String(err)));
  }
}

export async function writeAuditLog(params: {
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  ip?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("admin_audit_log").insert({
      actor_id: params.actorId,
      actor_email: params.actorEmail,
      action: params.action,
      target_type: params.targetType ?? null,
      target_id: params.targetId ?? null,
      ip: params.ip ?? null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata: (params.metadata ?? null) as any,
    });
  } catch (err) {
    console.error("[audit] write failed:", redactPII(err instanceof Error ? err.message : String(err)));
  }
}

export async function recordPaymentEvent(params: {
  provider: string;
  eventType: string;
  paymentId?: string | null;
  orderId?: string | null;
  amount?: number | null;
  currency?: string | null;
  status?: string | null;
  signatureValid?: boolean | null;
  ip?: string | null;
  payload?: unknown;
}): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("payment_events").insert({
      provider: params.provider,
      event_type: params.eventType,
      payment_id: params.paymentId ?? null,
      order_id: params.orderId ?? null,
      amount: params.amount ?? null,
      currency: params.currency ?? null,
      status: params.status ?? null,
      signature_valid: params.signatureValid ?? null,
      ip: params.ip ?? null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: (params.payload ?? null) as any,
    });
  } catch (err) {
    console.error("[payment_event] write failed:", redactPII(err instanceof Error ? err.message : String(err)));
  }
}


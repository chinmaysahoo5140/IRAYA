const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_WINDOW_MIN = 30;
const BAD_UA_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /acunetix/i,
  /nessus/i,
  /openvas/i,
  /masscan/i,
  /nmap scripting engine/i,
  /wpscan/i,
  /dirbuster/i,
  /gobuster/i,
  /fuzzer/i,
  /havij/i,
  /metasploit/i
];
function isBlockedUserAgent(ua) {
  if (!ua) return false;
  return BAD_UA_PATTERNS.some((re) => re.test(ua));
}
function getClientIp(request) {
  if (!request) return null;
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null;
}
function detectDeviceType(ua) {
  if (!ua) return "unknown";
  const s = ua.toLowerCase();
  if (/ipad|tablet/.test(s)) return "tablet";
  if (/mobi|iphone|android/.test(s)) return "mobile";
  return "desktop";
}
function parseUserAgent(ua) {
  if (!ua) return { browserName: "unknown", browserVersion: "unknown", os: "unknown" };
  const s = ua.toLowerCase();
  let browserName = "unknown";
  let browserVersion = "unknown";
  let os = "unknown";
  if (s.includes("windows")) os = "Windows";
  else if (s.includes("macintosh") || s.includes("mac os")) os = "macOS";
  else if (s.includes("linux")) os = "Linux";
  else if (s.includes("android")) os = "Android";
  else if (s.includes("iphone") || s.includes("ipad")) os = "iOS";
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
function redactPII(input) {
  let s = typeof input === "string" ? input : JSON.stringify(input);
  s = s.replace(/([A-Za-z0-9._%+-])[A-Za-z0-9._%+-]*(@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, "$1***$2");
  s = s.replace(/\+?\d[\d\s().-]{7,}\d/g, "[REDACTED_PHONE]");
  s = s.replace(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[REDACTED_JWT]");
  s = s.replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]");
  return s;
}
async function checkRateLimit(key, limit, windowSeconds) {
  const { supabaseAdmin } = await import("./client.server-ijnlFj_c.js");
  const since = new Date(Date.now() - windowSeconds * 1e3).toISOString();
  const { count, error } = await supabaseAdmin.from("rate_limits").select("*", { count: "exact", head: true }).eq("key", key).gte("created_at", since);
  if (error) return { allowed: true, remaining: limit };
  const used = count ?? 0;
  if (used >= limit) return { allowed: false, remaining: 0 };
  await supabaseAdmin.from("rate_limits").insert({ key });
  return { allowed: true, remaining: Math.max(0, limit - used - 1) };
}
async function isAccountLocked(email) {
  const { supabaseAdmin } = await import("./client.server-ijnlFj_c.js");
  const since = new Date(Date.now() - LOCKOUT_WINDOW_MIN * 60 * 1e3).toISOString();
  const { count } = await supabaseAdmin.from("login_attempts").select("*", { count: "exact", head: true }).eq("email", email.toLowerCase()).eq("success", false).gte("created_at", since);
  return (count ?? 0) >= LOCKOUT_THRESHOLD;
}
async function recordLoginAttempt(email, success, ip, userAgent) {
  const { supabaseAdmin } = await import("./client.server-ijnlFj_c.js");
  await supabaseAdmin.from("login_attempts").insert({
    email: email.toLowerCase(),
    success,
    ip,
    user_agent: userAgent?.slice(0, 400) ?? null
  });
  if (success) {
    await supabaseAdmin.from("login_attempts").delete().eq("email", email.toLowerCase()).eq("success", false);
  }
}
async function geoLookup(ip) {
  if (!ip || ip === "unknown" || ip.startsWith("127.") || ip.startsWith("10.") || ip.startsWith("192.168.")) {
    return { country: "Localhost", city: "Localhost" };
  }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2e3);
    const res = await fetch(`https://ip-api.com/json/${encodeURIComponent(ip)}`, {
      signal: ctrl.signal,
      headers: { "User-Agent": "iraya-security/1.0" }
    });
    clearTimeout(t);
    if (!res.ok) return { country: null, city: null };
    const j = await res.json();
    return { country: j.country ?? null, city: j.city ?? null };
  } catch {
    return { country: null, city: null };
  }
}
async function recordLoginEvent(params) {
  const { supabaseAdmin } = await import("./client.server-ijnlFj_c.js");
  const deviceType = detectDeviceType(params.userAgent);
  const { country, city } = await geoLookup(params.ip);
  let isNewDevice = false;
  if (params.userId) {
    const since = new Date(Date.now() - 90 * 864e5).toISOString();
    const { count } = await supabaseAdmin.from("login_events").select("*", { count: "exact", head: true }).eq("user_id", params.userId).gte("created_at", since).or(`ip.eq.${params.ip ?? ""},user_agent.eq.${params.userAgent ?? ""}`);
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
    is_new_device: isNewDevice
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
      details: { city, deviceType }
    });
  }
  return { isNewDevice };
}
async function checkLoginAnomaly(userId, email, ip, userAgent) {
  const { supabaseAdmin } = await import("./client.server-ijnlFj_c.js");
  const reasons = [];
  const { country, city } = await geoLookup(ip);
  if (!country) return { anomalous: false, reasons: [] };
  const { data: recentEvents } = await supabaseAdmin.from("login_events").select("country, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(10);
  if (recentEvents && recentEvents.length > 0) {
    const countries = new Set(recentEvents.map((e) => e.country).filter(Boolean));
    if (countries.size > 0 && !countries.has(country)) {
      reasons.push(`New login country: ${country} (usual: ${Array.from(countries).join(", ")})`);
    }
  }
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1e3).toISOString();
  const { data: recentTravels } = await supabaseAdmin.from("login_events").select("country, created_at").eq("user_id", userId).gte("created_at", oneHourAgo);
  if (recentTravels && recentTravels.length > 0) {
    const travelCountries = new Set(recentTravels.map((e) => e.country).filter(Boolean));
    travelCountries.delete(country);
    if (travelCountries.size > 0) {
      reasons.push(`Impossible travel detected: logged in from ${country} and ${Array.from(travelCountries).join(", ")} within 1 hour`);
    }
  }
  return {
    anomalous: reasons.length > 0,
    reasons
  };
}
function validateRequestTimestamp(request) {
  const tsHeader = request.headers.get("X-Request-Timestamp");
  if (!tsHeader) {
    throw new Error("Missing request timestamp header (X-Request-Timestamp)");
  }
  const ts = parseInt(tsHeader, 10);
  if (isNaN(ts)) {
    throw new Error("Invalid request timestamp");
  }
  const age = Math.abs(Date.now() - ts);
  if (age > 5 * 60 * 1e3) {
    throw new Error("Request signature expired (replay protection)");
  }
}
function stripExifJpeg(buffer) {
  let i = 2;
  const result = [255, 216];
  while (i < buffer.length) {
    if (buffer[i] === 255) {
      const marker = buffer[i + 1];
      if (marker === 217) {
        result.push(255, 217);
        break;
      }
      const length = (buffer[i + 2] << 8) + buffer[i + 3];
      if (marker === 225) {
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
function stripExifPng(buffer) {
  if (buffer.readUInt32BE(0) !== 2303741511 || buffer.readUInt32BE(4) !== 218765834) {
    return buffer;
  }
  const result = [137, 80, 78, 71, 13, 10, 26, 10];
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
async function secureImageUpload(fileBuffer, fileName, contentType) {
  if (fileBuffer.length > 5 * 1024 * 1024) {
    throw new Error("File size exceeds 5MB limit");
  }
  let ext = "";
  let cleanBuffer = fileBuffer;
  const magic = fileBuffer.slice(0, 4);
  if (magic[0] === 255 && magic[1] === 216 && magic[2] === 255) {
    ext = "jpg";
    cleanBuffer = stripExifJpeg(fileBuffer);
  } else if (magic[0] === 137 && magic[1] === 80 && magic[2] === 78 && magic[3] === 71) {
    ext = "png";
    cleanBuffer = stripExifPng(fileBuffer);
  } else if (magic[0] === 71 && magic[1] === 73 && magic[2] === 70) {
    ext = "gif";
  } else if (magic[0] === 82 && magic[1] === 73 && magic[2] === 70 && magic[3] === 70) {
    ext = "webp";
  } else {
    throw new Error("Unsupported file type or invalid magic bytes");
  }
  const safeContentTypeMap = {
    jpg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp"
  };
  const safeContentType = safeContentTypeMap[ext] ?? "application/octet-stream";
  const randomName = `${Date.now()}_${Math.random().toString(36).slice(2, 12)}.${ext}`;
  const { supabaseAdmin } = await import("./client.server-ijnlFj_c.js");
  const { data, error } = await supabaseAdmin.storage.from("product-images").upload(randomName, cleanBuffer, {
    contentType: safeContentType,
    cacheControl: "31536000",
    upsert: true
  });
  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }
  const { data: publicUrlData } = supabaseAdmin.storage.from("product-images").getPublicUrl(data.path);
  return publicUrlData.publicUrl;
}
async function writeSecurityEvent(params) {
  try {
    const { supabaseAdmin } = await import("./client.server-ijnlFj_c.js");
    await supabaseAdmin.from("security_events").insert({
      user_id: params.userId ?? null,
      email: params.email?.toLowerCase() ?? null,
      event_type: params.eventType,
      severity: params.severity ?? "info",
      ip: params.ip ?? null,
      country: params.country ?? null,
      user_agent: params.userAgent?.slice(0, 400) ?? null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      details: params.details ?? null
    });
  } catch (err) {
    console.error("[security_event] write failed:", redactPII(err instanceof Error ? err.message : String(err)));
  }
}
async function writeAuditLog(params) {
  try {
    const { supabaseAdmin } = await import("./client.server-ijnlFj_c.js");
    await supabaseAdmin.from("admin_audit_log").insert({
      actor_id: params.actorId,
      actor_email: params.actorEmail,
      action: params.action,
      target_type: params.targetType ?? null,
      target_id: params.targetId ?? null,
      ip: params.ip ?? null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata: params.metadata ?? null
    });
  } catch (err) {
    console.error("[audit] write failed:", redactPII(err instanceof Error ? err.message : String(err)));
  }
}
async function recordPaymentEvent(params) {
  try {
    const { supabaseAdmin } = await import("./client.server-ijnlFj_c.js");
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
      payload: params.payload ?? null
    });
  } catch (err) {
    console.error("[payment_event] write failed:", redactPII(err instanceof Error ? err.message : String(err)));
  }
}
export {
  checkLoginAnomaly,
  checkRateLimit,
  detectDeviceType,
  geoLookup,
  getClientIp,
  isAccountLocked,
  isBlockedUserAgent,
  parseUserAgent,
  recordLoginAttempt,
  recordLoginEvent,
  recordPaymentEvent,
  redactPII,
  secureImageUpload,
  stripExifJpeg,
  stripExifPng,
  validateRequestTimestamp,
  writeAuditLog,
  writeSecurityEvent
};

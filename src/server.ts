import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// Enterprise security headers. CSP is permissive enough to allow Razorpay,
// Supabase, and Google fonts.
const CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob: https: res.cloudinary.com *.cloudinary.com",
  "font-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline' https:",
  "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com",
  "connect-src 'self' https: wss: http://localhost:* ws://localhost:*",
  "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com",
  // Block other framers (clickjacking defence).
  "frame-ancestors 'self'",
  "form-action 'self' https://checkout.razorpay.com",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

function applySecurityHeaders(response: Response): Response {
  // Don't add CSP to non-HTML responses (avoids breaking JSON/asset replies).
  const contentType = response.headers.get("content-type") ?? "";
  const headers = new Headers(response.headers);

  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self)");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");

  if (contentType.includes("text/html")) {
    headers.set("Content-Security-Policy", CSP);
  }


  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Cheap edge-level blocker for known scanners/attack tools. Doesn't import
// our server helpers (server.ts must stay lean) — duplicates the regex list.
const BAD_UA = /sqlmap|nikto|acunetix|nessus|openvas|masscan|nmap scripting|wpscan|dirbuster|gobuster|metasploit|havij/i;

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const ua = request.headers.get("user-agent") ?? "";
      if (BAD_UA.test(ua)) {
        return new Response("Forbidden", { status: 403 });
      }
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return applySecurityHeaders(normalized);
    } catch (error) {
      console.error(error);
      return applySecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};

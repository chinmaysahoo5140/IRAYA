import "./lib/error-capture";

import crypto from "crypto";
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

async function applySecurityHeaders(
  response: Response,
  nonce: string
): Promise<Response> {
  const contentType = response.headers.get("content-type") ?? "";
  const status = response.status;
  const isBodylessStatus = [204, 205, 304].includes(status);

  // Try modifying headers in-place first to preserve stream/body references.
  try {
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

    if (contentType.includes("text/html") && !isBodylessStatus) {
      // If it's HTML, we need to rewrite the body, so we break out to the constructor fallback.
    } else {
      return response;
    }
  } catch (e) {
    // Fallback if headers are immutable
  }

  const headers = new Headers(response.headers);
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");

  if (isBodylessStatus) {
    return new Response(null, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  if (contentType.includes("text/html")) {
    const CSP = [
      "default-src 'self'",
      "img-src 'self' data: blob: https: res.cloudinary.com *.cloudinary.com",
      "font-src 'self' data: https:",
      `style-src 'self' 'nonce-${nonce}' https:`,
      `script-src 'self' 'nonce-${nonce}' https://checkout.razorpay.com`,
      "connect-src 'self' https: wss: http://localhost:* ws://localhost:*",
      "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com",
      "frame-ancestors 'self'",
      "form-action 'self' https://checkout.razorpay.com",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; ");
    headers.set("Content-Security-Policy", CSP);

    let bodyText = await response.text();
    bodyText = bodyText
      .replace(/<script(?=\s|>)/g, `<script nonce="${nonce}"`)
      .replace(/<style(?=\s|>)/g, `<style nonce="${nonce}"`);

    return new Response(bodyText, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
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
    let nonce = "";
    try {
      nonce = crypto.randomUUID().replace(/-/g, "");
    } catch (e) {
      nonce = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    }

    // Parameter Pollution Protection (HPP): Rebuild URL keeping only the last duplicate value
    const parsedUrl = new URL(request.url);
    let hasPollution = false;
    const seenKeys = new Set<string>();
    for (const key of parsedUrl.searchParams.keys()) {
      if (seenKeys.has(key)) {
        hasPollution = true;
        break;
      }
      seenKeys.add(key);
    }

    let nextRequest = request;
    if (hasPollution) {
      const uniqueParams = new URLSearchParams();
      const paramMap = new Map<string, string>();
      for (const [key, value] of parsedUrl.searchParams.entries()) {
        paramMap.set(key, value);
      }
      for (const [key, value] of paramMap.entries()) {
        uniqueParams.set(key, value);
      }
      parsedUrl.search = uniqueParams.toString();
      nextRequest = new Request(parsedUrl.toString(), request);
    }

    try {
      const ua = nextRequest.headers.get("user-agent") ?? "";
      if (BAD_UA.test(ua)) {
        return new Response("Forbidden", { status: 403 });
      }
      const handler = await getServerEntry();
      const response = await handler.fetch(nextRequest, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return applySecurityHeaders(normalized, nonce);
    } catch (error) {
      console.error(error);
      return applySecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
        nonce
      );
    }
  },
};

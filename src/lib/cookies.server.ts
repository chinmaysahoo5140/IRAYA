import { getRequest } from "@tanstack/react-start/server";

export function getCookieFromRequest(name: string): string | null {
  const req = getRequest();
  if (!req) return null;
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function getAccessToken(): string | null {
  return getCookieFromRequest("sb-access-token");
}

export function getRefreshToken(): string | null {
  return getCookieFromRequest("sb-refresh-token");
}

export function getSessionIdCookie(): string | null {
  return getCookieFromRequest("sb-session-id");
}

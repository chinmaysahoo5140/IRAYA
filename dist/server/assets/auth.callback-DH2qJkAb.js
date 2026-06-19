import { c as createServerRpc } from "./createServerRpc-BZ-1rN-j.js";
import { h as createServerFn } from "./server-C1RKXgFD.js";
import { z } from "zod";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
const exchangeCodeServerFn_createServerFn_handler = createServerRpc({
  id: "54530985819b491fd79f30ff32967dc944627d853bffa9017064b60497be17f7",
  name: "exchangeCodeServerFn",
  filename: "src/routes/auth.callback.tsx"
}, (opts) => exchangeCodeServerFn.__executeServer(opts));
const exchangeCodeServerFn = createServerFn({
  method: "GET"
}).validator((input) => z.object({
  code: z.string()
}).parse(input)).handler(exchangeCodeServerFn_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    getClientIp,
    detectDeviceType,
    parseUserAgent,
    geoLookup
  } = await import("./security.server-BRG0sDb-.js");
  const {
    setCookie,
    getRequest
  } = await import("./server-C8PAU-Ko.js");
  const {
    data: sessionData,
    error
  } = await supabaseAdmin.auth.exchangeCodeForSession(data.code);
  if (error || !sessionData.session) {
    throw new Error(error?.message ?? "Failed to exchange code for session");
  }
  const session = sessionData.session;
  const req = getRequest();
  const ip = getClientIp(req);
  const ua = req?.headers.get("user-agent") ?? null;
  const deviceType = detectDeviceType(ua);
  const {
    browserName,
    browserVersion,
    os
  } = parseUserAgent(ua);
  const {
    country,
    city
  } = await geoLookup(ip);
  const {
    data: sessionRow
  } = await supabaseAdmin.from("user_sessions").insert({
    user_id: session.user.id,
    device_type: deviceType,
    browser_name: browserName,
    browser_version: browserVersion,
    os,
    ip_address: ip,
    country,
    city
  }).select("id").single();
  const secure = true;
  setCookie("sb-access-token", session.access_token, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60
    // 15 minutes
  });
  setCookie("sb-refresh-token", session.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60
    // 7 days
  });
  if (sessionRow) {
    setCookie("sb-session-id", sessionRow.id, {
      httpOnly: true,
      secure,
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 24 * 60 * 60
      // 30 days
    });
  }
  return {
    ok: true
  };
});
export {
  exchangeCodeServerFn_createServerFn_handler
};

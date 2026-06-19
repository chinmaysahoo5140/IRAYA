import { c as createServerRpc } from "./createServerRpc-BxNuaMNd.mjs";
import { c as createServerFn } from "./server-CP7xr6_V.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const exchangeCodeServerFn_createServerFn_handler = createServerRpc({
  id: "54530985819b491fd79f30ff32967dc944627d853bffa9017064b60497be17f7",
  name: "exchangeCodeServerFn",
  filename: "src/routes/auth.callback.tsx"
}, (opts) => exchangeCodeServerFn.__executeServer(opts));
const exchangeCodeServerFn = createServerFn({
  method: "GET"
}).validator((input) => objectType({
  code: stringType()
}).parse(input)).handler(exchangeCodeServerFn_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    getClientIp,
    detectDeviceType,
    parseUserAgent,
    geoLookup
  } = await import("./security.server-BRG0sDb-.mjs");
  const {
    setCookie,
    getRequest
  } = await import("./server-CP7xr6_V.mjs").then(function(n) {
    return n.e;
  });
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

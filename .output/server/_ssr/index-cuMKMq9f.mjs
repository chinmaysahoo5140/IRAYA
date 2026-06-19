import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { h as statsQO } from "./router-B46y8PhA.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { f as formatINR } from "./format-Sk5HC8SH.mjs";
import "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/vercel__analytics.mjs";
import "./server-CUdO2dQu.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "./auth-middleware-DBKcBFEt.mjs";
import "node:crypto";
import "../_libs/zod.mjs";
import "../_libs/goober.mjs";
function AdminDashboard() {
  const {
    data
  } = useSuspenseQuery(statsQO);
  const cards = [{
    label: "Revenue",
    value: formatINR(data.revenue)
  }, {
    label: "Orders",
    value: String(data.orders)
  }, {
    label: "Products",
    value: String(data.products)
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl tracking-luxury mb-10", children: "Dashboard" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-3 gap-6", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 hairline-b hairline-t bg-secondary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: c.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-serif text-3xl", children: c.value })
    ] }, c.label)) })
  ] });
}
export {
  AdminDashboard as component
};

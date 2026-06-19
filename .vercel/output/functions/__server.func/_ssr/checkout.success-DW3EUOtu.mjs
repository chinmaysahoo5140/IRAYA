import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { N as Navbar, F as Footer } from "./Footer-Demn3Ovo.mjs";
import { g as Route$j } from "./router-BoWhvYts.mjs";
import "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import { C as Check } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
import "./server-CP7xr6_V.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-Bh4u3KvU.mjs";
import "node:crypto";
import "../_libs/zod.mjs";
import "../_libs/goober.mjs";
function SuccessPage() {
  const {
    o
  } = Route$j.useSearch();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex items-center justify-center px-6 pt-32 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-16 w-16 rounded-full border border-gold flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-6 w-6 text-gold", strokeWidth: 1.5 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-[11px] tracking-luxury uppercase text-mute", children: "Thank you" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-4xl md:text-5xl tracking-luxury", children: "Your order is confirmed" }),
      o && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-sm tracking-wide-2 text-mute", children: [
        "Order number: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-charcoal", children: o })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-[15px] text-foreground/70", children: "A note from the atelier will arrive in your inbox shortly. We will contact you when your piece begins its journey." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex gap-3 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", className: "border border-charcoal px-6 py-3 text-[11px] tracking-luxury uppercase hover:bg-charcoal hover:text-ivory transition-colors", children: "View Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", className: "bg-charcoal text-ivory px-6 py-3 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors", children: "Continue browsing" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  SuccessPage as component
};

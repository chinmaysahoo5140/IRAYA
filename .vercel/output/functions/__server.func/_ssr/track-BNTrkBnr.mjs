import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { N as Navbar, F as Footer } from "./Footer-Demn3Ovo.mjs";
import { t as trackOrder } from "./router-BoWhvYts.mjs";
import "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import { P as Package } from "../_libs/lucide-react.mjs";
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
function TrackPage() {
  const [result, setResult] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const trackOrderFn = useServerFn(trackOrder);
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    const orderNumber = String(fd.get("order") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim().toLowerCase();
    try {
      const data = await trackOrderFn({
        data: {
          orderNumber,
          email
        }
      });
      if (!data) {
        setError("No order matches those details.");
      } else {
        setResult(data);
      }
    } catch {
      setError("No order matches those details.");
    }
    setLoading(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background text-foreground min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-32 pb-12 hairline-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[800px] px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 mx-auto text-gold", strokeWidth: 1.25 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-serif text-4xl md:text-5xl tracking-luxury", children: "Track Your Order" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-mute text-sm", children: "Enter your order number and the email you used at checkout." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute mb-2", children: "Order number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "order", required: true, className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute mb-2", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "email", type: "email", required: true, className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full bg-charcoal text-ivory py-3 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50", children: loading ? "Searching…" : "Track Order" })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-center text-sm text-red-700", children: error }),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 p-8 bg-secondary text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-xl", children: result.order_number }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-[11px] tracking-luxury uppercase text-gold", children: result.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-mute text-[12px]", children: [
          "Placed on ",
          new Date(result.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })
        ] }),
        result.awb_code ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-6 hairline-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "Shipment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
            result.courier_name ?? "Courier",
            " — AWB ",
            result.awb_code
          ] }),
          result.tracking_url && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: result.tracking_url, target: "_blank", rel: "noreferrer", className: "mt-3 inline-block text-gold", children: "Track on courier site →" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-mute text-[12px]", children: "Shipment will be created shortly. We'll email you the tracking link." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", className: "text-[11px] tracking-luxury uppercase hover:text-gold", children: "View in account →" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  TrackPage as component
};

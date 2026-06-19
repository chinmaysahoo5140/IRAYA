import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as ProtectedRoute, S as SkeletonLine, a as SkeletonBox, b as api } from "./SkeletonBox-BFijygWe.mjs";
import { N as Navbar, F as Footer } from "./Footer-4N6S3dWq.mjs";
import "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import { d as ShoppingBag, o as CircleQuestionMark } from "../_libs/lucide-react.mjs";
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
import "../_libs/axios.mjs";
import "../_libs/form-data.mjs";
import "fs";
import "../_libs/combined-stream.mjs";
import "../_libs/delayed-stream.mjs";
import "path";
import "http";
import "https";
import "url";
import "../_libs/mime-types.mjs";
import "../_libs/mime-db.mjs";
import "../_libs/asynckit.mjs";
import "../_libs/es-set-tostringtag.mjs";
import "../_libs/get-intrinsic.mjs";
import "../_libs/es-object-atoms.mjs";
import "../_libs/es-errors.mjs";
import "../_libs/math-intrinsics.mjs";
import "../_libs/gopd.mjs";
import "../_libs/es-define-property.mjs";
import "../_libs/has-symbols.mjs";
import "../_libs/get-proto.mjs";
import "../_libs/dunder-proto.mjs";
import "../_libs/call-bind-apply-helpers.mjs";
import "../_libs/function-bind.mjs";
import "../_libs/hasown.mjs";
import "../_libs/has-tostringtag.mjs";
import "../_libs/https-proxy-agent.mjs";
import "net";
import "tls";
import "assert";
import "../_libs/debug.mjs";
import "../_libs/ms.mjs";
import "tty";
import "../_libs/supports-color.mjs";
import "os";
import "../_libs/has-flag.mjs";
import "../_libs/agent-base.mjs";
import "events";
import "http2";
import "../_libs/follow-redirects.mjs";
import "zlib";
import "../_libs/proxy-from-env.mjs";
import "../_libs/zustand.mjs";
import "./router-B46y8PhA.mjs";
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
function SkeletonBadge({ className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `animate-shimmer rounded-full bg-secondary dark:bg-charcoal/30 h-5 w-16 ${className}`
    }
  );
}
function OrdersPageWrapper() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersSkeleton, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersPage, {}) });
}
function OrdersPage() {
  const [orders, setOrders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await api.get("/orders");
        setOrders(response.data?.orders || response.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersSkeleton, {});
  }
  function getStatusStyle(status) {
    const s = status.toLowerCase();
    if (s.includes("pending")) {
      return "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900";
    }
    if (s.includes("confirm")) {
      return "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900";
    }
    if (s.includes("ship")) {
      return "text-violet-700 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/30 border-violet-200 dark:border-violet-900";
    }
    if (s.includes("deliver")) {
      return "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900";
    }
    return "text-mute bg-secondary border-hairline";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen flex flex-col justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-grow pt-32 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] px-6 fade-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "The Maison" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-4xl tracking-luxury text-charcoal", children: "Your Orders" })
      ] }),
      orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center text-center py-20 bg-secondary/10 border border-hairline rounded max-w-xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-12 w-12 text-mute mb-4", strokeWidth: 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl text-charcoal", children: "No orders yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-mute text-sm mt-2 max-w-sm", children: "You haven't placed any orders yet. Discover our handcrafted collection." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", className: "mt-6 text-[11px] tracking-luxury uppercase border border-charcoal px-8 py-3 bg-charcoal text-ivory hover:bg-gold hover:border-gold hover:text-ivory transition-all", children: "Start shopping" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6 max-w-3xl mx-auto", children: orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border border-hairline bg-card flex flex-col md:flex-row justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-grow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif text-lg text-charcoal font-medium", children: [
              "Order #",
              o.orderNumber || o.id.slice(0, 8)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[9px] tracking-wide-2 uppercase font-medium border px-2.5 py-0.5 rounded-full ${getStatusStyle(o.status)}`, children: o.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-mute flex gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Placed on",
              " ",
              new Date(o.created_at || Date.now()).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-charcoal", children: [
              "₹",
              Number(o.total || 0).toLocaleString("en-IN")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center self-start md:self-center group relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: true, className: "text-[11px] tracking-luxury uppercase border border-hairline text-mute cursor-not-allowed px-5 py-2.5 bg-secondary/20 flex items-center gap-1.5", children: [
            "Track Order",
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "h-3.5 w-3.5 text-mute" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-charcoal text-ivory text-[10px] tracking-wide uppercase text-center rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md z-10", children: "Tracking coming soon" })
        ] })
      ] }, o.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function OrdersSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen flex flex-col justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-grow pt-32 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] px-6 space-y-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonLine, { width: "w-24 mx-auto", height: "h-3.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonLine, { width: "w-48 mx-auto", height: "h-8", className: "mt-4" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6 max-w-3xl mx-auto", children: Array(4).fill(null).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border border-hairline bg-card/50 flex justify-between items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 flex-grow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonLine, { width: "w-32", height: "h-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBadge, {})
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonLine, { width: "w-56", height: "h-4" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBox, { width: "w-28", height: "h-9" })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  OrdersPageWrapper as component
};

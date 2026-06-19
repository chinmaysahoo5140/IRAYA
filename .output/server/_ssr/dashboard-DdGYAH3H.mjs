import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as ProtectedRoute, S as SkeletonLine, a as SkeletonBox, b as api } from "./SkeletonBox-BFijygWe.mjs";
import { N as Navbar, F as Footer } from "./Footer-4N6S3dWq.mjs";
import "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import { p as Calendar, d as ShoppingBag, b as MapPin, U as User } from "../_libs/lucide-react.mjs";
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
function SkeletonAvatar({ size = "h-12 w-12", className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `animate-shimmer rounded-full bg-secondary dark:bg-charcoal/30 ${size} ${className}`
    }
  );
}
function DashboardPageWrapper() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardSkeleton, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPage, {}) });
}
function DashboardPage() {
  const [profile, setProfile] = reactExports.useState(null);
  const [orders, setOrders] = reactExports.useState([]);
  const [pageLoading, setPageLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, ordersRes] = await Promise.all([api.get("/users/me"), api.get("/orders")]);
        setProfile(profileRes.data?.user || profileRes.data);
        setOrders(ordersRes.data?.orders || ordersRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setPageLoading(false);
      }
    }
    fetchData();
  }, []);
  if (pageLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardSkeleton, {});
  }
  const name = profile?.name || "Guest";
  const email = profile?.email || "";
  const joinedDate = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  }) : "Recently";
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const recentOrders = orders.slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen flex flex-col justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-grow pt-32 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] px-6 fade-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 pb-12 hairline-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-charcoal text-ivory flex items-center justify-center font-serif text-2xl font-medium", children: initials }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl tracking-luxury text-charcoal", children: name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-mute", children: email }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-mute mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Joined ",
              joinedDate
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-6 py-12 hairline-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/account/orders", className: "group p-6 border border-hairline hover:border-charcoal transition-all flex flex-col justify-between h-40 bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-6 w-6 text-gold", strokeWidth: 1.25 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg text-charcoal group-hover:text-gold transition-colors", children: "My Orders" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-mute mt-1", children: "View purchase history and status" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/account/addresses", className: "group p-6 border border-hairline hover:border-charcoal transition-all flex flex-col justify-between h-40 bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-6 w-6 text-gold", strokeWidth: 1.25 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg text-charcoal group-hover:text-gold transition-colors", children: "Saved Addresses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-mute mt-1", children: "Manage delivery locations" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/account/profile", className: "group p-6 border border-hairline hover:border-charcoal transition-all flex flex-col justify-between h-40 bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-6 w-6 text-gold", strokeWidth: 1.25 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg text-charcoal group-hover:text-gold transition-colors", children: "Edit Profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-mute mt-1", children: "Update name, email, and phone" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl mb-8 tracking-luxury text-charcoal", children: "Recent Orders" }),
        recentOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center text-center py-16 bg-secondary/20 border border-hairline rounded", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-10 w-10 text-mute mb-4", strokeWidth: 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-mute text-sm font-medium", children: "No orders yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", className: "mt-4 text-[11px] tracking-luxury uppercase border border-charcoal px-6 py-2.5 hover:bg-charcoal hover:text-ivory transition-all", children: "Start shopping" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: recentOrders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-6 border border-hairline bg-card hover:border-charcoal transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-serif text-lg text-charcoal font-medium", children: [
              "Order #",
              o.orderNumber || o.id.slice(0, 8)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-mute mt-1", children: new Date(o.created_at || Date.now()).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric"
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-serif text-lg text-charcoal", children: [
              "₹",
              Number(o.total || 0).toLocaleString("en-IN")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-1 text-[10px] tracking-luxury uppercase font-medium text-gold bg-gold/5 px-2.5 py-1 rounded-full", children: o.status })
          ] })
        ] }, o.id)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function DashboardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen flex flex-col justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-grow pt-32 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] px-6 space-y-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 pb-12 hairline-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonAvatar, { size: "h-20 w-20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 flex-grow max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonLine, { width: "w-48", height: "h-6" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonLine, { width: "w-36", height: "h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonLine, { width: "w-24", height: "h-3" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-6 py-12 hairline-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBox, { height: "h-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBox, { height: "h-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBox, { height: "h-40" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonLine, { width: "w-40", height: "h-6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBox, { height: "h-20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBox, { height: "h-20" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  DashboardPageWrapper as component
};

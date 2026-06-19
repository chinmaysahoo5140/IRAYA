import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { P as ProtectedRoute, S as SkeletonLine, a as SkeletonBox, b as api } from "./SkeletonBox-DqO60yEO.js";
import { N as Navbar, F as Footer } from "./Footer-CUv8LSGA.js";
import { ShoppingBag, HelpCircle } from "lucide-react";
import "axios";
import "zustand";
import "./router-pa2HfNNz.js";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "sonner";
import "react-hot-toast";
import "@vercel/analytics/react";
import "./server-C1RKXgFD.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "zod";
import "./auth-middleware-HVhdhqZn.js";
import "node:crypto";
function SkeletonBadge({ className = "" }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `animate-shimmer rounded-full bg-secondary dark:bg-charcoal/30 h-5 w-16 ${className}`
    }
  );
}
function OrdersPageWrapper() {
  return /* @__PURE__ */ jsx(ProtectedRoute, { fallback: /* @__PURE__ */ jsx(OrdersSkeleton, {}), children: /* @__PURE__ */ jsx(OrdersPage, {}) });
}
function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
    return /* @__PURE__ */ jsx(OrdersSkeleton, {});
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-background min-h-screen flex flex-col justify-between", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow pt-32 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1200px] px-6 fade-up", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "The Maison" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-4 font-serif text-4xl tracking-luxury text-charcoal", children: "Your Orders" })
      ] }),
      orders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center text-center py-20 bg-secondary/10 border border-hairline rounded max-w-xl mx-auto", children: [
        /* @__PURE__ */ jsx(ShoppingBag, { className: "h-12 w-12 text-mute mb-4", strokeWidth: 1 }),
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl text-charcoal", children: "No orders yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-mute text-sm mt-2 max-w-sm", children: "You haven't placed any orders yet. Discover our handcrafted collection." }),
        /* @__PURE__ */ jsx(Link, { to: "/collection", className: "mt-6 text-[11px] tracking-luxury uppercase border border-charcoal px-8 py-3 bg-charcoal text-ivory hover:bg-gold hover:border-gold hover:text-ivory transition-all", children: "Start shopping" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-6 max-w-3xl mx-auto", children: orders.map((o) => /* @__PURE__ */ jsxs("div", { className: "p-6 border border-hairline bg-card flex flex-col md:flex-row justify-between gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 flex-grow", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxs("span", { className: "font-serif text-lg text-charcoal font-medium", children: [
              "Order #",
              o.orderNumber || o.id.slice(0, 8)
            ] }),
            /* @__PURE__ */ jsx("span", { className: `text-[9px] tracking-wide-2 uppercase font-medium border px-2.5 py-0.5 rounded-full ${getStatusStyle(o.status)}`, children: o.status })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-mute flex gap-4", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Placed on",
              " ",
              new Date(o.created_at || Date.now()).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })
            ] }),
            /* @__PURE__ */ jsx("span", { children: "•" }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium text-charcoal", children: [
              "₹",
              Number(o.total || 0).toLocaleString("en-IN")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center self-start md:self-center group relative", children: [
          /* @__PURE__ */ jsxs("button", { disabled: true, className: "text-[11px] tracking-luxury uppercase border border-hairline text-mute cursor-not-allowed px-5 py-2.5 bg-secondary/20 flex items-center gap-1.5", children: [
            "Track Order",
            /* @__PURE__ */ jsx(HelpCircle, { className: "h-3.5 w-3.5 text-mute" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-charcoal text-ivory text-[10px] tracking-wide uppercase text-center rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md z-10", children: "Tracking coming soon" })
        ] })
      ] }, o.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function OrdersSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "bg-background min-h-screen flex flex-col justify-between", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow pt-32 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1200px] px-6 space-y-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx(SkeletonLine, { width: "w-24 mx-auto", height: "h-3.5" }),
        /* @__PURE__ */ jsx(SkeletonLine, { width: "w-48 mx-auto", height: "h-8", className: "mt-4" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6 max-w-3xl mx-auto", children: Array(4).fill(null).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "p-6 border border-hairline bg-card/50 flex justify-between items-center gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 flex-grow", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(SkeletonLine, { width: "w-32", height: "h-5" }),
            /* @__PURE__ */ jsx(SkeletonBadge, {})
          ] }),
          /* @__PURE__ */ jsx(SkeletonLine, { width: "w-56", height: "h-4" })
        ] }),
        /* @__PURE__ */ jsx(SkeletonBox, { width: "w-28", height: "h-9" })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  OrdersPageWrapper as component
};

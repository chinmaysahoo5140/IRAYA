import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { i as profileQO, o as ordersQO, r as rolesQO, l as logoutServerFn } from "./router-B46y8PhA.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { N as Navbar, F as Footer } from "./Footer-4N6S3dWq.mjs";
import { f as formatINR } from "./format-Sk5HC8SH.mjs";
import "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/goober.mjs";
import "../_libs/lucide-react.mjs";
function AccountPage() {
  const {
    data: profile
  } = useSuspenseQuery(profileQO);
  const {
    data: orders
  } = useSuspenseQuery(ordersQO);
  const {
    data: roles
  } = useSuspenseQuery(rolesQO);
  const router = useRouter();
  const isAdmin = roles.includes("admin");
  async function signOut() {
    await logoutServerFn();
    router.navigate({
      to: "/"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-32 pb-12 hairline-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "The Maison" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-4 font-serif text-4xl md:text-5xl tracking-luxury", children: [
        "Bonjour, ",
        profile?.full_name ?? profile?.email ?? "friend"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] px-6 grid lg:grid-cols-4 gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "space-y-3 text-[11px] tracking-luxury uppercase", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", className: "block text-mute hover:text-charcoal", activeOptions: {
          exact: true
        }, children: "Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account/addresses", className: "block text-mute hover:text-charcoal", children: "Addresses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account/wishlist", className: "block text-mute hover:text-charcoal", children: "Wishlist" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account/security", className: "block text-mute hover:text-charcoal", children: "Security & 2FA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account/sessions", className: "block text-mute hover:text-charcoal", children: "Active Sessions" }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", className: "block text-gold hover:text-charcoal", children: "Admin →" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: signOut, className: "block text-mute hover:text-charcoal pt-6 cursor-pointer", children: "Sign out" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl mb-6", children: "Your orders" }),
        orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-mute py-12 text-center hairline-b", children: [
          "No orders yet.",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", className: "text-charcoal underline-offset-4 hover:underline", children: "Browse the collection" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hairline-t", children: orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/account/orders/$id", params: {
          id: o.id
        }, className: "flex justify-between items-center py-5 hairline-b group hover:bg-secondary/50 px-2 -mx-2 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg", children: o.order_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-wide-2 text-mute uppercase", children: new Date(o.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric"
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg", children: formatINR(o.total) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-gold", children: o.status })
          ] })
        ] }, o.id)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  AccountPage as component
};

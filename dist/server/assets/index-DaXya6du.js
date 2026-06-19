import { jsxs, jsx } from "react/jsx-runtime";
import { i as profileQO, o as ordersQO, r as rolesQO, l as logoutServerFn } from "./router-pa2HfNNz.js";
import { useRouter, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { N as Navbar, F as Footer } from "./Footer-CUv8LSGA.js";
import { f as formatINR } from "./format-Sk5HC8SH.js";
import "react";
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
import "lucide-react";
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-background min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-12 hairline-b", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1200px] px-6", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "The Maison" }),
      /* @__PURE__ */ jsxs("h1", { className: "mt-4 font-serif text-4xl md:text-5xl tracking-luxury", children: [
        "Bonjour, ",
        profile?.full_name ?? profile?.email ?? "friend"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1200px] px-6 grid lg:grid-cols-4 gap-12", children: [
      /* @__PURE__ */ jsx("aside", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxs("nav", { className: "space-y-3 text-[11px] tracking-luxury uppercase", children: [
        /* @__PURE__ */ jsx(Link, { to: "/account", className: "block text-mute hover:text-charcoal", activeOptions: {
          exact: true
        }, children: "Orders" }),
        /* @__PURE__ */ jsx(Link, { to: "/account/addresses", className: "block text-mute hover:text-charcoal", children: "Addresses" }),
        /* @__PURE__ */ jsx(Link, { to: "/account/wishlist", className: "block text-mute hover:text-charcoal", children: "Wishlist" }),
        /* @__PURE__ */ jsx(Link, { to: "/account/security", className: "block text-mute hover:text-charcoal", children: "Security & 2FA" }),
        /* @__PURE__ */ jsx(Link, { to: "/account/sessions", className: "block text-mute hover:text-charcoal", children: "Active Sessions" }),
        isAdmin && /* @__PURE__ */ jsx(Link, { to: "/admin", className: "block text-gold hover:text-charcoal", children: "Admin →" }),
        /* @__PURE__ */ jsx("button", { onClick: signOut, className: "block text-mute hover:text-charcoal pt-6 cursor-pointer", children: "Sign out" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl mb-6", children: "Your orders" }),
        orders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-mute py-12 text-center hairline-b", children: [
          "No orders yet.",
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/collection", className: "text-charcoal underline-offset-4 hover:underline", children: "Browse the collection" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "hairline-t", children: orders.map((o) => /* @__PURE__ */ jsxs(Link, { to: "/account/orders/$id", params: {
          id: o.id
        }, className: "flex justify-between items-center py-5 hairline-b group hover:bg-secondary/50 px-2 -mx-2 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-serif text-lg", children: o.order_number }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] tracking-wide-2 text-mute uppercase", children: new Date(o.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric"
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "font-serif text-lg", children: formatINR(o.total) }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] tracking-luxury uppercase text-gold", children: o.status })
          ] })
        ] }, o.id)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  AccountPage as component
};

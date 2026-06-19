import { jsxs, jsx } from "react/jsx-runtime";
import { x as wishlistQO } from "./router-pa2HfNNz.js";
import { Link } from "@tanstack/react-router";
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
function WishlistPage() {
  const {
    data: items
  } = useSuspenseQuery(wishlistQO);
  return /* @__PURE__ */ jsxs("div", { className: "bg-background min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-16", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1200px] px-6", children: [
      /* @__PURE__ */ jsx(Link, { to: "/account", className: "text-[11px] tracking-luxury uppercase text-mute hover:text-charcoal", children: "← Back" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 font-serif text-3xl md:text-4xl tracking-luxury", children: "Wishlist" }),
      /* @__PURE__ */ jsx("div", { className: "mt-10", children: items.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-mute text-center py-12", children: "Your wishlist is empty." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: items.map((w) => {
        const p = w.products;
        if (!p) return null;
        const img = (p.product_images ?? []).sort((a, b) => a.sort_order - b.sort_order)[0]?.url;
        return /* @__PURE__ */ jsxs(Link, { to: "/collection/$slug", params: {
          slug: p.slug
        }, className: "group block", children: [
          /* @__PURE__ */ jsx("div", { className: "aspect-[4/5] bg-secondary overflow-hidden", children: img && /* @__PURE__ */ jsx("img", { src: img, alt: p.name, className: "img-hover h-full w-full object-cover" }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "font-serif", children: p.name }),
            /* @__PURE__ */ jsx("div", { className: "text-[12px] text-mute tracking-wide-2", children: formatINR(p.price) })
          ] })
        ] }, p.id);
      }) }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  WishlistPage as component
};

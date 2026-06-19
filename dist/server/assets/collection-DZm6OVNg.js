import { jsxs, jsx } from "react/jsx-runtime";
import { R as Route, p as productsQO, c as categoriesQO } from "./router-pa2HfNNz.js";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { N as Navbar, F as Footer } from "./Footer-CUv8LSGA.js";
import { P as ProductCard } from "./ProductCard-X9NkOxdb.js";
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
import "./format-Sk5HC8SH.js";
function CollectionPage() {
  const {
    category
  } = Route.useSearch();
  const {
    data: products
  } = useSuspenseQuery(productsQO(category));
  const {
    data: categories
  } = useSuspenseQuery(categoriesQO);
  const heading = category ? categories.find((c) => c.slug === category)?.name ?? "Collection" : "All Pieces";
  return /* @__PURE__ */ jsxs("div", { className: "bg-background text-foreground", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 lg:pt-40 pb-16 hairline-b", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-10 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "The Collection" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-4 font-serif text-5xl md:text-6xl tracking-luxury", children: heading }),
      /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-xl mx-auto text-[15px] text-foreground/70", children: "Handcrafted in India. Made to be worn, carried, and remembered." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-8", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-10", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-2 md:gap-8 text-[11px] tracking-luxury uppercase", children: [
      /* @__PURE__ */ jsx(Link, { to: "/collection", search: {}, className: !category ? "text-charcoal border-b border-charcoal pb-1" : "text-mute hover:text-charcoal", children: "All" }),
      categories.map((c) => /* @__PURE__ */ jsx(Link, { to: "/collection", search: {
        category: c.slug
      }, className: category === c.slug ? "text-charcoal border-b border-charcoal pb-1" : "text-mute hover:text-charcoal", children: c.name }, c.id))
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "pb-32", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-10", children: products.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-24 bg-secondary/40 hairline-t hairline-b", children: [
      /* @__PURE__ */ jsx("div", { className: "font-serif text-3xl text-foreground/70", children: "Arriving Soon" }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 text-mute text-sm max-w-md mx-auto", children: [
        "Our atelier is finishing the first ",
        category ?? "collection",
        " pieces by hand. Check back shortly, or subscribe below to be the first to know."
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-8 inline-block text-[11px] tracking-luxury uppercase border border-charcoal px-6 py-3 hover:bg-charcoal hover:text-ivory transition-colors", children: "Back to Home" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6", children: products.map((p) => /* @__PURE__ */ jsx(ProductCard, { slug: p.slug, name: p.name, price: p.price, image: p.image }, p.id)) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  CollectionPage as component
};

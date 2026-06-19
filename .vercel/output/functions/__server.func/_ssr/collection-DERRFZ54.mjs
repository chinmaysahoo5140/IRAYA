import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { R as Route$s, p as productsQO, c as categoriesQO } from "./router-BoWhvYts.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { N as Navbar, F as Footer } from "./Footer-Demn3Ovo.mjs";
import { P as ProductCard } from "./ProductCard-X9NkOxdb.mjs";
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
import "./server-CP7xr6_V.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-Bh4u3KvU.mjs";
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
import "./format-Sk5HC8SH.mjs";
function CollectionPage() {
  const {
    category
  } = Route$s.useSearch();
  const {
    data: products
  } = useSuspenseQuery(productsQO(category));
  const {
    data: categories
  } = useSuspenseQuery(categoriesQO);
  const heading = category ? categories.find((c) => c.slug === category)?.name ?? "Collection" : "All Pieces";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-32 lg:pt-40 pb-16 hairline-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "The Collection" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-5xl md:text-6xl tracking-luxury", children: heading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-xl mx-auto text-[15px] text-foreground/70", children: "Handcrafted in India. Made to be worn, carried, and remembered." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-2 md:gap-8 text-[11px] tracking-luxury uppercase", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", search: {}, className: !category ? "text-charcoal border-b border-charcoal pb-1" : "text-mute hover:text-charcoal", children: "All" }),
      categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", search: {
        category: c.slug
      }, className: category === c.slug ? "text-charcoal border-b border-charcoal pb-1" : "text-mute hover:text-charcoal", children: c.name }, c.id))
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pb-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-10", children: products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-24 bg-secondary/40 hairline-t hairline-b", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-3xl text-foreground/70", children: "Arriving Soon" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-mute text-sm max-w-md mx-auto", children: [
        "Our atelier is finishing the first ",
        category ?? "collection",
        " pieces by hand. Check back shortly, or subscribe below to be the first to know."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-8 inline-block text-[11px] tracking-luxury uppercase border border-charcoal px-6 py-3 hover:bg-charcoal hover:text-ivory transition-colors", children: "Back to Home" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6", children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { slug: p.slug, name: p.name, price: p.price, image: p.image }, p.id)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  CollectionPage as component
};

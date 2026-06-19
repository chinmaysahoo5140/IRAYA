import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { x as wishlistQO } from "./router-B46y8PhA.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
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
function WishlistPage() {
  const {
    data: items
  } = useSuspenseQuery(wishlistQO);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-32 pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", className: "text-[11px] tracking-luxury uppercase text-mute hover:text-charcoal", children: "← Back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-serif text-3xl md:text-4xl tracking-luxury", children: "Wishlist" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10", children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-mute text-center py-12", children: "Your wishlist is empty." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: items.map((w) => {
        const p = w.products;
        if (!p) return null;
        const img = (p.product_images ?? []).sort((a, b) => a.sort_order - b.sort_order)[0]?.url;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/collection/$slug", params: {
          slug: p.slug
        }, className: "group block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[4/5] bg-secondary overflow-hidden", children: img && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img, alt: p.name, className: "img-hover h-full w-full object-cover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] text-mute tracking-wide-2", children: formatINR(p.price) })
          ] })
        ] }, p.id);
      }) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  WishlistPage as component
};

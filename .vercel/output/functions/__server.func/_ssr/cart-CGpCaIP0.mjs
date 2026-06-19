import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { N as Navbar, F as Footer } from "./Footer-Demn3Ovo.mjs";
import { u as useCart } from "./router-BoWhvYts.mjs";
import { f as formatINR } from "./format-Sk5HC8SH.mjs";
import "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import { f as Minus, g as Plus, X, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
function CartPage() {
  const cart = useCart();
  const shipping = cart.subtotal >= 25e3 || cart.subtotal === 0 ? 0 : 250;
  const tax = Math.round(cart.subtotal * 0.05);
  const total = cart.subtotal + shipping + tax;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background text-foreground min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-32 pb-16 hairline-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "Your Selection" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-5xl tracking-luxury", children: "The Bag" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-[1200px] px-6", children: !cart.hydrated ? null : cart.items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-mute mb-8", children: "Your bag is empty." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", className: "inline-flex items-center gap-3 border border-charcoal px-8 py-3.5 text-[11px] tracking-luxury uppercase hover:bg-charcoal hover:text-ivory transition-colors", children: "Explore the Collection" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: cart.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 py-6 hairline-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection/$slug", params: {
          slug: it.slug
        }, className: "w-28 h-36 shrink-0 bg-secondary overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: it.imageUrl, alt: it.name, className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection/$slug", params: {
              slug: it.slug
            }, className: "font-serif text-lg hover:text-gold", children: it.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-[12px] tracking-wide-2 text-mute", children: formatINR(it.price) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border border-charcoal/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => cart.setQty(it.productId, it.quantity - 1), className: "p-2 hover:bg-charcoal hover:text-ivory transition-colors", "aria-label": "Decrease", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 text-sm tracking-wide-2", children: it.quantity }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => cart.setQty(it.productId, it.quantity + 1), className: "p-2 hover:bg-charcoal hover:text-ivory transition-colors", "aria-label": "Increase", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => cart.remove(it.productId), className: "text-mute hover:text-charcoal text-[11px] tracking-luxury uppercase flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }),
              " Remove"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right font-serif text-lg w-28", children: formatINR(it.price * it.quantity) })
      ] }, it.productId)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "bg-secondary p-8 h-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl mb-6", children: "Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-mute", children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatINR(cart.subtotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-mute", children: "Shipping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: shipping === 0 ? "Complimentary" : formatINR(shipping) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-mute", children: "GST (5%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatINR(tax) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-6 hairline-t flex justify-between font-serif text-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatINR(total) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/checkout", className: "mt-8 w-full inline-flex items-center justify-center gap-3 bg-charcoal text-ivory px-8 py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors", children: [
          "Proceed to Checkout ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  CartPage as component
};

import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as Route$k, f as productQO, u as useCart } from "./router-B46y8PhA.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { N as Navbar, F as Footer } from "./Footer-4N6S3dWq.mjs";
import { f as formatINR } from "./format-Sk5HC8SH.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import { C as Check, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
function PDP() {
  const {
    slug
  } = Route$k.useParams();
  const {
    data: p
  } = useSuspenseQuery(productQO(slug));
  const cart = useCart();
  const router = useRouter();
  const [activeImg, setActiveImg] = reactExports.useState(0);
  const [adding, setAdding] = reactExports.useState(false);
  const img = p.images?.[activeImg]?.url ?? null;
  const handleAdd = () => {
    if (!img) return;
    setAdding(true);
    cart.add({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      price: Number(p.price),
      imageUrl: img
    });
    toast.success(`${p.name} added to bag`);
    setTimeout(() => setAdding(false), 1200);
  };
  const handleBuyNow = () => {
    handleAdd();
    router.navigate({
      to: "/checkout"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-28 lg:pt-32 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1500px] px-6 lg:px-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "text-[10px] tracking-luxury uppercase text-mute mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-charcoal", children: "Maison" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-2", children: "/" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", className: "hover:text-charcoal", children: "Collection" }),
        p.categories && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-2", children: "/" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", search: {
            category: p.categories.slug
          }, className: "hover:text-charcoal", children: p.categories.name })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-10 lg:gap-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[4/5] bg-secondary overflow-hidden hairline-b", children: img && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img, alt: p.name, className: "h-full w-full object-cover" }) }),
          p.images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-4 gap-3", children: p.images.map((im, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveImg(i), className: `aspect-square overflow-hidden border ${i === activeImg ? "border-charcoal" : "border-transparent"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: im.url, alt: im.alt ?? "", className: "h-full w-full object-cover" }) }, im.url)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:pt-12", children: [
          p.categories && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: p.categories.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-4xl md:text-5xl tracking-luxury leading-tight", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-xl tracking-wide-2", children: formatINR(p.price) }),
          p.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 text-[15px] leading-relaxed text-foreground/80", children: p.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-[11px] tracking-wide-2 uppercase text-mute", children: p.stock > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-charcoal", children: p.stock < 5 ? `Only ${p.stock} remaining` : "In atelier" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Currently unavailable" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleAdd, disabled: p.stock === 0 || adding, className: "inline-flex items-center justify-center gap-3 bg-charcoal text-ivory px-8 py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-40", children: adding ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
              " Added"
            ] }) : "Add to Bag" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleBuyNow, disabled: p.stock === 0, className: "inline-flex items-center justify-center gap-3 border border-charcoal text-charcoal px-8 py-4 text-[11px] tracking-luxury uppercase hover:bg-charcoal hover:text-ivory transition-colors disabled:opacity-40", children: [
              "Acquire Now ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5", strokeWidth: 1.25 })
            ] })
          ] }),
          p.story && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-14 pt-10 hairline-t", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-gold", children: "The Story" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 font-serif text-xl leading-relaxed text-foreground/85", children: p.story })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[11px] tracking-wide-2 uppercase text-mute", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Complimentary shipping over ₹25,000" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Signed by maker" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Lifetime restoration" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  PDP as component
};

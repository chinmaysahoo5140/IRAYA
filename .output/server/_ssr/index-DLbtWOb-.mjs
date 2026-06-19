import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as newArrivalsQO } from "./router-B46y8PhA.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { N as Navbar, F as Footer } from "./Footer-4N6S3dWq.mjs";
import { P as ProductCard } from "./ProductCard-X9NkOxdb.mjs";
import "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowRight, h as Truck, e as ShieldCheck, R as RotateCcw } from "../_libs/lucide-react.mjs";
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
import "./format-Sk5HC8SH.mjs";
function Reveal({ children, delay = 0, className = "" }) {
  const ref = reactExports.useRef(null);
  const [shown, setShown] = reactExports.useState(true);
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewport) {
      setShown(false);
      setMounted(true);
      const timer = setTimeout(() => setShown(true), delay + 50);
      return () => clearTimeout(timer);
    }
    setShown(false);
    setMounted(true);
    const safetyTimeout = setTimeout(() => setShown(true), 800 + delay);
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          clearTimeout(safetyTimeout);
          obs.disconnect();
        }
      },
      { threshold: 0.01 }
    );
    obs.observe(el);
    return () => {
      clearTimeout(safetyTimeout);
      obs.disconnect();
    };
  }, [delay]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      style: mounted ? {
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.9s ease, transform 0.9s ease"
      } : void 0,
      className,
      children
    }
  );
}
function HomePage() {
  const {
    data: products
  } = useSuspenseQuery(newArrivalsQO);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative h-screen w-screen overflow-hidden bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-30", style: {
        backgroundImage: "radial-gradient(circle at 20% 30%, rgba(180,140,90,0.3), transparent 50%), radial-gradient(circle at 80% 70%, rgba(60,40,30,0.2), transparent 50%)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 h-full flex flex-col items-center justify-center text-charcoal text-center px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "Bags & Footwear · MMXXVI" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: 150, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-8 font-serif text-6xl md:text-8xl tracking-luxury leading-[0.95]", children: "IRAYA" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-md text-base md:text-lg font-light text-foreground/75", children: "Handcrafted bags and footwear, made in India. Designed for the way you walk through the world." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: 450, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-col sm:flex-row gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/collection", search: {
            category: "bags"
          }, className: "inline-flex items-center justify-center gap-3 bg-charcoal text-ivory px-8 py-3.5 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors duration-500", children: [
            "Shop Bags",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5", strokeWidth: 1.25 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/collection", search: {
            category: "footwear"
          }, className: "inline-flex items-center justify-center gap-3 border border-charcoal text-charcoal px-8 py-3.5 text-[11px] tracking-luxury uppercase hover:bg-charcoal hover:text-ivory transition-colors duration-500", children: [
            "Shop Footwear",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5", strokeWidth: 1.25 })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-24 lg:py-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-14", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "Two Houses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-serif text-4xl md:text-5xl", children: "Choose Your World" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [{
        slug: "bags",
        label: "Bags",
        grad: "from-amber-100 via-stone-100 to-amber-200"
      }, {
        slug: "footwear",
        label: "Footwear",
        grad: "from-stone-200 via-stone-100 to-amber-100"
      }].map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: i * 80, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", search: {
        category: c.slug
      }, className: "group block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `relative overflow-hidden aspect-[5/4] bg-gradient-to-br ${c.grad} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "Shop" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-serif text-5xl md:text-6xl text-charcoal group-hover:text-gold transition-colors duration-500", children: c.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 inline-flex items-center gap-2 text-[11px] tracking-luxury uppercase text-charcoal/70 group-hover:text-gold", children: [
          "Explore ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3", strokeWidth: 1.25 })
        ] })
      ] }) }) }) }, c.slug)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pb-24 lg:pb-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-14", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "New Arrivals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-serif text-4xl md:text-5xl", children: "Latest from the Atelier" })
      ] }) }),
      products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 bg-secondary/40 hairline-t hairline-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-2xl text-foreground/70", children: "Arriving Soon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-mute text-sm max-w-md mx-auto", children: "Our first collection is being finished by hand. New pieces arrive shortly." })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6", children: products.slice(0, 8).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { slug: p.slug, name: p.name, price: p.price, image: p.image }, p.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "craft", className: "py-24 lg:py-28 hairline-t hairline-b bg-secondary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-[1400px] px-6 lg:px-10 grid md:grid-cols-3 gap-12 md:gap-20", children: [{
      I: Truck,
      t: "Free Shipping",
      d: "Complimentary delivery across India on every order. International shipping via Shiprocket."
    }, {
      I: ShieldCheck,
      t: "Secured Payments",
      d: "256-bit SSL encryption with Razorpay. UPI, cards, net banking & wallets accepted."
    }, {
      I: RotateCcw,
      t: "Easy Returns",
      d: "7-day return window for unworn pieces. Hassle-free exchange or refund."
    }].map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: i * 100, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center md:text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(c.I, { className: "h-7 w-7 text-gold", strokeWidth: 1.25 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 font-serif text-2xl", children: c.t }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-[14px] leading-relaxed text-foreground/70", children: c.d })
    ] }) }, c.t)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  HomePage as component
};

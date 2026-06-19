import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { N as Navbar, F as Footer } from "./Footer-4N6S3dWq.mjs";
import "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./router-B46y8PhA.mjs";
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
import "../_libs/goober.mjs";
import "../_libs/lucide-react.mjs";
const faqs = [{
  q: "How long does shipping take?",
  a: "Domestic orders ship within 2-4 business days via Shiprocket. International orders take 7-14 business days."
}, {
  q: "Do you offer free shipping?",
  a: "Yes — complimentary shipping across India on every order. International rates apply at checkout."
}, {
  q: "What is your return policy?",
  a: "Unworn items can be returned within 7 days of delivery for a full refund or exchange."
}, {
  q: "Are your products handmade?",
  a: "Yes. Every bag and pair of shoes is cut, stitched and finished by hand by our artisans."
}, {
  q: "How do I track my order?",
  a: "Use the Track Order link in the footer with your order number and email — or sign in to your account."
}, {
  q: "Do you accept international cards?",
  a: "Yes, all major international cards are accepted via Razorpay secure checkout."
}];
function FaqsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background text-foreground min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-32 pb-12 hairline-b text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[800px] px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "Help" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-5xl md:text-6xl tracking-luxury", children: "FAQs" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-[700px] px-6 space-y-8", children: faqs.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-6 hairline-b", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: f.q }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[15px] text-foreground/75 leading-relaxed", children: f.a })
    ] }, f.q)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  FaqsPage as component
};

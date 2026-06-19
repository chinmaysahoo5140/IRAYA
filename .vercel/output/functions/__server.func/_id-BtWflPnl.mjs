import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { I as Route, J as orderQO } from "./_ssr/router-BoWhvYts.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "./_libs/tanstack__react-query.mjs";
import { N as Navbar, F as Footer } from "./_ssr/Footer-Demn3Ovo.mjs";
import { f as formatINR } from "./_ssr/format-Sk5HC8SH.mjs";
import "./_libs/sonner.mjs";
import "./_libs/react-hot-toast.mjs";
import "./_libs/seroval.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/vercel__analytics.mjs";
import "./_ssr/server-CP7xr6_V.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_ssr/auth-middleware-Bh4u3KvU.mjs";
import "node:crypto";
import "./_libs/zod.mjs";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/goober.mjs";
import "./_libs/lucide-react.mjs";
function OrderDetail() {
  const {
    id
  } = Route.useParams();
  const {
    data: o
  } = useSuspenseQuery(orderQO(id));
  if (!o) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center text-mute", children: "Order not found." });
  const addr = o.shipping_address;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-32 pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1000px] px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", className: "text-[11px] tracking-luxury uppercase text-mute hover:text-charcoal", children: "← Back to account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 hairline-b pb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "Order" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-serif text-3xl md:text-4xl tracking-luxury", children: o.order_number }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-6 text-[11px] tracking-luxury uppercase", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Status: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold", children: o.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-mute", children: new Date(o.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 hairline-b", children: o.order_items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 py-4", children: [
        it.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-24 bg-secondary overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: it.image_url, alt: it.name, className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg", children: it.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] tracking-wide-2 text-mute", children: [
            "× ",
            it.quantity
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif", children: formatINR(Number(it.price) * it.quantity) })
      ] }, it.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-8 py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute mb-3", children: "Shipping to" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-serif text-base leading-relaxed", children: [
            addr.full_name,
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            addr.line1,
            addr.line2 ? `, ${addr.line2}` : "",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            addr.city,
            ", ",
            addr.state,
            " ",
            addr.pincode,
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            addr.country,
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            addr.phone
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-mute", children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatINR(o.subtotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-mute", children: "Shipping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: Number(o.shipping) === 0 ? "Complimentary" : formatINR(o.shipping) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-mute", children: "GST" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatINR(o.tax) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-serif text-xl pt-3 hairline-t", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatINR(o.total) })
          ] })
        ] }) })
      ] }),
      o.awb_code && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 p-6 bg-secondary text-[13px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute mb-2", children: "Tracking" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          o.courier_name,
          " — AWB ",
          o.awb_code
        ] }),
        o.tracking_url && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: o.tracking_url, target: "_blank", rel: "noreferrer", className: "text-gold mt-2 inline-block", children: "Track shipment →" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  OrderDetail as component
};

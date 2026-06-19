import { jsx, jsxs } from "react/jsx-runtime";
import { I as Route, J as orderQO } from "./router-pa2HfNNz.js";
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
function OrderDetail() {
  const {
    id
  } = Route.useParams();
  const {
    data: o
  } = useSuspenseQuery(orderQO(id));
  if (!o) return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center text-mute", children: "Order not found." });
  const addr = o.shipping_address;
  return /* @__PURE__ */ jsxs("div", { className: "bg-background min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-16", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1000px] px-6", children: [
      /* @__PURE__ */ jsx(Link, { to: "/account", className: "text-[11px] tracking-luxury uppercase text-mute hover:text-charcoal", children: "← Back to account" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 hairline-b pb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "Order" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-2 font-serif text-3xl md:text-4xl tracking-luxury", children: o.order_number }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-6 text-[11px] tracking-luxury uppercase", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Status: ",
            /* @__PURE__ */ jsx("span", { className: "text-gold", children: o.status })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-mute", children: new Date(o.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "py-8 hairline-b", children: o.order_items.map((it) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4 py-4", children: [
        it.image_url && /* @__PURE__ */ jsx("div", { className: "w-20 h-24 bg-secondary overflow-hidden shrink-0", children: /* @__PURE__ */ jsx("img", { src: it.image_url, alt: it.name, className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "font-serif text-lg", children: it.name }),
          /* @__PURE__ */ jsxs("div", { className: "text-[11px] tracking-wide-2 text-mute", children: [
            "× ",
            it.quantity
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "font-serif", children: formatINR(Number(it.price) * it.quantity) })
      ] }, it.id)) }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-8 py-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute mb-3", children: "Shipping to" }),
          /* @__PURE__ */ jsxs("div", { className: "font-serif text-base leading-relaxed", children: [
            addr.full_name,
            /* @__PURE__ */ jsx("br", {}),
            addr.line1,
            addr.line2 ? `, ${addr.line2}` : "",
            /* @__PURE__ */ jsx("br", {}),
            addr.city,
            ", ",
            addr.state,
            " ",
            addr.pincode,
            /* @__PURE__ */ jsx("br", {}),
            addr.country,
            /* @__PURE__ */ jsx("br", {}),
            addr.phone
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-mute", children: "Subtotal" }),
            /* @__PURE__ */ jsx("span", { children: formatINR(o.subtotal) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-mute", children: "Shipping" }),
            /* @__PURE__ */ jsx("span", { children: Number(o.shipping) === 0 ? "Complimentary" : formatINR(o.shipping) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-mute", children: "GST" }),
            /* @__PURE__ */ jsx("span", { children: formatINR(o.tax) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-serif text-xl pt-3 hairline-t", children: [
            /* @__PURE__ */ jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsx("span", { children: formatINR(o.total) })
          ] })
        ] }) })
      ] }),
      o.awb_code && /* @__PURE__ */ jsxs("div", { className: "mt-6 p-6 bg-secondary text-[13px]", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute mb-2", children: "Tracking" }),
        /* @__PURE__ */ jsxs("div", { children: [
          o.courier_name,
          " — AWB ",
          o.awb_code
        ] }),
        o.tracking_url && /* @__PURE__ */ jsx("a", { href: o.tracking_url, target: "_blank", rel: "noreferrer", className: "text-gold mt-2 inline-block", children: "Track shipment →" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  OrderDetail as component
};

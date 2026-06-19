import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { M as qo, N as adminUpdateOrderStatus, j as createSsrRpc } from "./router-B46y8PhA.mjs";
import { a as useSuspenseQuery, u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { c as createServerFn } from "./server-CUdO2dQu.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DBKcBFEt.mjs";
import { f as formatINR } from "./format-Sk5HC8SH.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import { l as ChevronDown, m as ChevronRight, h as Truck } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
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
import "node:crypto";
import "../_libs/goober.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
const createShiprocketShipment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  orderId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("75138d6bbf1699872b76cc40857535b1861c176f2f123a4c54f31bbad1ef836e"));
const STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];
function OrdersAdmin() {
  const {
    data: orders
  } = useSuspenseQuery(qo);
  const qc = useQueryClient();
  const updateFn = useServerFn(adminUpdateOrderStatus);
  const shipFn = useServerFn(createShiprocketShipment);
  const [expanded, setExpanded] = reactExports.useState(null);
  async function setStatus(id, status) {
    try {
      await updateFn({
        data: {
          orderId: id,
          status
        }
      });
      qc.invalidateQueries({
        queryKey: ["admin-orders"]
      });
      toast.success(`Marked ${status}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }
  async function ship(id) {
    try {
      const r = await shipFn({
        data: {
          orderId: id
        }
      });
      qc.invalidateQueries({
        queryKey: ["admin-orders"]
      });
      toast.success(`Shipment created. AWB: ${r.awb ?? "pending"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Add Shiprocket credentials first");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl tracking-luxury mb-10", children: "Orders" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hairline-t", children: orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-mute py-12 text-center", children: "No orders yet." }) : orders.map((o) => {
      const addr = o.shipping_address;
      const isOpen = expanded === o.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hairline-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 py-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setExpanded(isOpen ? null : o.id), className: "p-1", children: isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-base truncate", children: o.order_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-mute truncate", children: [
              addr?.full_name ?? "—",
              " · ",
              o.email
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-mute", children: new Date(o.created_at).toLocaleDateString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif", children: formatINR(o.total) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: o.status, onChange: (e) => setStatus(o.id, e.target.value), className: "bg-transparent hairline-b py-1 text-[11px] tracking-luxury uppercase", children: STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => ship(o.id), title: o.awb_code ? `AWB ${o.awb_code}` : "Create Shiprocket shipment", className: "inline-flex items-center gap-1 text-[11px] tracking-luxury uppercase border border-charcoal px-3 py-1 hover:bg-charcoal hover:text-ivory transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3 w-3" }),
            " ",
            o.awb_code ? "Re-ship" : "Ship"
          ] })
        ] }),
        isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-6 pl-10 pr-4 grid sm:grid-cols-2 gap-6 text-[13px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute mb-2", children: "Customer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: addr?.full_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-mute", children: o.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-mute", children: o.phone }),
            addr && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-mute", children: [
              addr.line1,
              addr.line2 ? `, ${addr.line2}` : "",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              addr.city,
              ", ",
              addr.state,
              " ",
              addr.pincode,
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              addr.country
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute mb-2", children: "Items" }),
            o.order_items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                it.name,
                " × ",
                it.quantity
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatINR(Number(it.price) * it.quantity) })
            ] }, i)),
            o.awb_code && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-[11px] text-mute", children: [
              "AWB ",
              o.awb_code,
              o.courier_name ? ` · ${o.courier_name}` : "",
              o.tracking_url && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                " · ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: o.tracking_url, target: "_blank", rel: "noreferrer", className: "text-gold", children: "Track →" })
              ] })
            ] })
          ] })
        ] })
      ] }, o.id);
    }) })
  ] });
}
export {
  OrdersAdmin as component
};

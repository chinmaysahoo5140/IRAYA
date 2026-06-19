import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { N as Navbar, F as Footer } from "./Footer-Demn3Ovo.mjs";
import { u as useCart, K as createOrder, j as createSsrRpc, d as supabase } from "./router-BoWhvYts.mjs";
import { f as formatINR } from "./format-Sk5HC8SH.mjs";
import { c as createServerFn } from "./server-CP7xr6_V.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Bh4u3KvU.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
import "../_libs/lucide-react.mjs";
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
import "node:crypto";
import "../_libs/goober.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const createRazorpayOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  orderId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("a6f1a7df2dd032270b33ae7f01da2576971e1b7652c3d182f28f0f762ce126d4"));
const verifyRazorpayPayment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  orderId: stringType().uuid(),
  razorpay_order_id: stringType().min(1).max(100),
  razorpay_payment_id: stringType().min(1).max(100),
  razorpay_signature: stringType().min(1).max(200)
}).parse(input)).handler(createSsrRpc("5e2c6a85ce8b9f3a92cd9b0a9b4d8f015d9ec2fa0b30eb31f8605ecef9f67199"));
function useRazorpayScript() {
  const [loaded, setLoaded] = reactExports.useState(typeof window !== "undefined" && !!window.Razorpay);
  reactExports.useEffect(() => {
    if (typeof window === "undefined" || window.Razorpay) {
      setLoaded(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => setLoaded(true);
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);
  return loaded;
}
function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();
  const createOrderFn = useServerFn(createOrder);
  const createRpFn = useServerFn(createRazorpayOrder);
  const verifyRpFn = useServerFn(verifyRazorpayPayment);
  const rpReady = useRazorpayScript();
  const [submitting, setSubmitting] = reactExports.useState(false);
  const idemRef = reactExports.useRef(`chk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`);
  const shipping = cart.subtotal >= 25e3 || cart.subtotal === 0 ? 0 : 250;
  const tax = Math.round(cart.subtotal * 0.05);
  const total = cart.subtotal + shipping + tax;
  async function onSubmit(e) {
    e.preventDefault();
    if (cart.items.length === 0) return;
    setSubmitting(true);
    try {
      const {
        data: session
      } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Please sign in to complete your order.");
        router.navigate({
          to: "/auth",
          search: {
            redirect: "/checkout"
          }
        });
        return;
      }
      const fd = new FormData(e.currentTarget);
      const address = {
        full_name: String(fd.get("full_name") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        email: String(fd.get("email") ?? ""),
        line1: String(fd.get("line1") ?? ""),
        line2: String(fd.get("line2") ?? ""),
        city: String(fd.get("city") ?? ""),
        state: String(fd.get("state") ?? ""),
        pincode: String(fd.get("pincode") ?? ""),
        country: "India"
      };
      const order = await createOrderFn({
        data: {
          items: cart.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity
          })),
          shipping_address: address,
          idempotencyKey: idemRef.current
        }
      });
      let rp;
      try {
        rp = await createRpFn({
          data: {
            orderId: order.id
          }
        });
      } catch (err) {
        console.error(err);
        toast.error("Online payment unavailable. Your order is saved as pending — our team will contact you.");
        cart.clear();
        router.navigate({
          to: "/checkout/success",
          search: {
            o: order.order_number
          }
        });
        return;
      }
      if (!rpReady || typeof window === "undefined" || !window.Razorpay) {
        toast.error("Payment widget failed to load. Please refresh and try again.");
        return;
      }
      const checkout = new window.Razorpay({
        key: rp.keyId,
        amount: rp.amount,
        currency: rp.currency,
        name: "IRAYA",
        description: `Order ${rp.orderNumber}`,
        order_id: rp.razorpayOrderId,
        prefill: {
          name: address.full_name,
          email: address.email,
          contact: address.phone
        },
        theme: {
          color: "#1a1a1a"
        },
        handler: async (resp) => {
          try {
            await verifyRpFn({
              data: {
                orderId: order.id,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature
              }
            });
            cart.clear();
            router.navigate({
              to: "/checkout/success",
              search: {
                o: order.order_number
              }
            });
          } catch (err) {
            console.error(err);
            toast.error("Payment received but verification failed. We'll reconcile shortly.");
          }
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled. Your order is saved as pending.");
          }
        }
      });
      checkout.open();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background text-foreground min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-32 pb-12 hairline-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "Checkout" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-4xl md:text-5xl tracking-luxury", children: "Finalise your order" })
    ] }) }),
    cart.items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-mute mb-6", children: "Your bag is empty." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", className: "text-[11px] tracking-luxury uppercase hover:text-gold", children: "Browse the collection" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] px-6 grid lg:grid-cols-3 gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Shipping details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "full_name", label: "Full name", required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "phone", label: "Phone", required: true, type: "tel" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "email", label: "Email", required: true, type: "email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "line1", label: "Address line 1", required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "line2", label: "Address line 2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "city", label: "City", required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "state", label: "State", required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "pincode", label: "Pincode", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: submitting, className: "w-full bg-charcoal text-ivory px-8 py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50", children: submitting ? "Processing…" : `Pay ${formatINR(total)} securely` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-mute text-center", children: "Payment is processed by Razorpay. Your card details never touch our servers." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "bg-secondary p-8 h-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-xl mb-6", children: "Your bag" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 mb-6", children: cart.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-16 shrink-0 bg-ivory overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: it.imageUrl, alt: it.name, className: "h-full w-full object-cover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-sm truncate", children: it.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-mute", children: [
              "× ",
              it.quantity
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: formatINR(it.price * it.quantity) })
        ] }, it.productId)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 hairline-t space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-mute", children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatINR(cart.subtotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-mute", children: "Shipping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: shipping === 0 ? "Free" : formatINR(shipping) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-mute", children: "GST" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatINR(tax) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 hairline-t flex justify-between font-serif text-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatINR(total) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Field({
  name,
  label,
  type = "text",
  required = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute mb-2", children: [
      label,
      required && " *"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name, type, required, className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal" })
  ] });
}
export {
  CheckoutPage as component
};

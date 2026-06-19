import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { useCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/format";
import { createOrder } from "@/lib/orders.functions";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/razorpay.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — IRAYA" }] }),
  component: CheckoutPage,
});

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

function useRazorpayScript() {
  const [loaded, setLoaded] = useState(typeof window !== "undefined" && !!window.Razorpay);
  useEffect(() => {
    if (typeof window === "undefined" || window.Razorpay) { setLoaded(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => setLoaded(true);
    document.body.appendChild(s);
    return () => { s.remove(); };
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

  const [submitting, setSubmitting] = useState(false);
  // Stable idempotency key per mount — same form submitted twice = one order.
  const idemRef = useRef<string>(
    `chk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`,
  );

  const shipping = cart.subtotal >= 25000 || cart.subtotal === 0 ? 0 : 250;
  const tax = Math.round(cart.subtotal * 0.05);
  const total = cart.subtotal + shipping + tax;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (cart.items.length === 0) return;
    setSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Please sign in to complete your order.");
        router.navigate({ to: "/auth", search: { redirect: "/checkout" } });
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
        country: "India",
      };

      const order = await createOrderFn({
        data: {
          items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shipping_address: address,
          idempotencyKey: idemRef.current,
        },
      });

      // Try to open Razorpay. If keys aren't configured, fall back to pending.
      let rp;
      try {
        rp = await createRpFn({ data: { orderId: order.id } });
      } catch (err) {
        console.error(err);
        toast.error("Online payment unavailable. Your order is saved as pending — our team will contact you.");
        cart.clear();
        router.navigate({ to: "/checkout/success", search: { o: order.order_number } });
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
        prefill: { name: address.full_name, email: address.email, contact: address.phone },
        theme: { color: "#1a1a1a" },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await verifyRpFn({
              data: {
                orderId: order.id,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              },
            });
            cart.clear();
            router.navigate({ to: "/checkout/success", search: { o: order.order_number } });
          } catch (err) {
            console.error(err);
            toast.error("Payment received but verification failed. We'll reconcile shortly.");
          }
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled. Your order is saved as pending.");
          },
        },
      });
      checkout.open();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />

      <section className="pt-32 pb-12 hairline-b">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <div className="text-[11px] tracking-luxury uppercase text-mute">Checkout</div>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl tracking-luxury">Finalise your order</h1>
        </div>
      </section>

      {cart.items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-mute mb-6">Your bag is empty.</p>
          <Link to="/collection" className="text-[11px] tracking-luxury uppercase hover:text-gold">
            Browse the collection
          </Link>
        </div>
      ) : (
        <section className="py-16">
          <div className="mx-auto max-w-[1200px] px-6 grid lg:grid-cols-3 gap-12">
            <form onSubmit={onSubmit} className="lg:col-span-2 space-y-6">
              <h2 className="font-serif text-2xl">Shipping details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field name="full_name" label="Full name" required />
                <Field name="phone" label="Phone" required type="tel" />
              </div>
              <Field name="email" label="Email" required type="email" />
              <Field name="line1" label="Address line 1" required />
              <Field name="line2" label="Address line 2" />
              <div className="grid sm:grid-cols-3 gap-4">
                <Field name="city" label="City" required />
                <Field name="state" label="State" required />
                <Field name="pincode" label="Pincode" required />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-charcoal text-ivory px-8 py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50"
              >
                {submitting ? "Processing…" : `Pay ${formatINR(total)} securely`}
              </button>
              <p className="text-[11px] text-mute text-center">
                Payment is processed by Razorpay. Your card details never touch our servers.
              </p>
            </form>

            <aside className="bg-secondary p-8 h-fit">
              <h2 className="font-serif text-xl mb-6">Your bag</h2>
              <div className="space-y-3 mb-6">
                {cart.items.map((it) => (
                  <div key={it.productId} className="flex gap-3 text-sm">
                    <div className="w-14 h-16 shrink-0 bg-ivory overflow-hidden">
                      <img src={it.imageUrl} alt={it.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-sm truncate">{it.name}</div>
                      <div className="text-[11px] text-mute">× {it.quantity}</div>
                    </div>
                    <div className="text-sm">{formatINR(it.price * it.quantity)}</div>
                  </div>
                ))}
              </div>
              <div className="pt-4 hairline-t space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-mute">Subtotal</span><span>{formatINR(cart.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-mute">Shipping</span><span>{shipping === 0 ? "Free" : formatINR(shipping)}</span></div>
                <div className="flex justify-between"><span className="text-mute">GST</span><span>{formatINR(tax)}</span></div>
              </div>
              <div className="mt-4 pt-4 hairline-t flex justify-between font-serif text-xl">
                <span>Total</span><span>{formatINR(total)}</span>
              </div>
            </aside>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

function Field({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-[11px] tracking-wide-2 uppercase text-mute mb-2">{label}{required && " *"}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal"
      />
    </label>
  );
}

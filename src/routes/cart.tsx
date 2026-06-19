import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X, ArrowRight } from "lucide-react";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { useCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Bag — IRAYA" }] }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const shipping = cart.subtotal >= 25000 || cart.subtotal === 0 ? 0 : 250;
  const tax = Math.round(cart.subtotal * 0.05);
  const total = cart.subtotal + shipping + tax;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16 hairline-b">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <div className="text-[11px] tracking-luxury uppercase text-mute">Your Selection</div>
          <h1 className="mt-4 font-serif text-5xl tracking-luxury">The Bag</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          {!cart.hydrated ? null : cart.items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-mute mb-8">Your bag is empty.</p>
              <Link
                to="/collection"
                className="inline-flex items-center gap-3 border border-charcoal px-8 py-3.5 text-[11px] tracking-luxury uppercase hover:bg-charcoal hover:text-ivory transition-colors"
              >
                Explore the Collection
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                {cart.items.map((it) => (
                  <div key={it.productId} className="flex gap-6 py-6 hairline-b">
                    <Link to="/collection/$slug" params={{ slug: it.slug }} className="w-28 h-36 shrink-0 bg-secondary overflow-hidden">
                      <img src={it.imageUrl} alt={it.name} className="h-full w-full object-cover" />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link to="/collection/$slug" params={{ slug: it.slug }} className="font-serif text-lg hover:text-gold">
                          {it.name}
                        </Link>
                        <div className="mt-2 text-[12px] tracking-wide-2 text-mute">
                          {formatINR(it.price)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-charcoal/30">
                          <button
                            onClick={() => cart.setQty(it.productId, it.quantity - 1)}
                            className="p-2 hover:bg-charcoal hover:text-ivory transition-colors"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-4 text-sm tracking-wide-2">{it.quantity}</span>
                          <button
                            onClick={() => cart.setQty(it.productId, it.quantity + 1)}
                            className="p-2 hover:bg-charcoal hover:text-ivory transition-colors"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => cart.remove(it.productId)}
                          className="text-mute hover:text-charcoal text-[11px] tracking-luxury uppercase flex items-center gap-1"
                        >
                          <X className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right font-serif text-lg w-28">
                      {formatINR(it.price * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <aside className="bg-secondary p-8 h-fit">
                <h2 className="font-serif text-2xl mb-6">Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-mute">Subtotal</span>
                    <span>{formatINR(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mute">Shipping</span>
                    <span>{shipping === 0 ? "Complimentary" : formatINR(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mute">GST (5%)</span>
                    <span>{formatINR(tax)}</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 hairline-t flex justify-between font-serif text-xl">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
                <Link
                  to="/checkout"
                  className="mt-8 w-full inline-flex items-center justify-center gap-3 bg-charcoal text-ivory px-8 py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors"
                >
                  Proceed to Checkout <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { Check } from "lucide-react";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { verifyOrderPayment } from "@/lib/orders.functions";

const searchSchema = z.object({
  o: z.string().optional(),
});

export const Route = createFileRoute("/checkout/success")({
  validateSearch: searchSchema.parse,
  loader: async ({ search }) => {
    const orderNumber = search.o;
    if (!orderNumber) {
      throw redirect({ to: "/checkout" });
    }
    try {
      const res = await verifyOrderPayment({ data: { orderNumber } });
      if (!res.verified) {
        throw redirect({ to: "/checkout" });
      }
    } catch {
      throw redirect({ to: "/checkout" });
    }
  },
  head: () => ({ meta: [{ title: "Order confirmed — IRAYA" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { o } = Route.useSearch();
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
        <div className="text-center max-w-lg">
          <div className="mx-auto h-16 w-16 rounded-full border border-gold flex items-center justify-center">
            <Check className="h-6 w-6 text-gold" strokeWidth={1.5} />
          </div>
          <div className="mt-8 text-[11px] tracking-luxury uppercase text-mute">Thank you</div>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl tracking-luxury">Your order is confirmed</h1>
          {o && (
            <p className="mt-6 text-sm tracking-wide-2 text-mute">
              Order number: <span className="text-charcoal">{o}</span>
            </p>
          )}
          <p className="mt-6 text-[15px] text-foreground/70">
            A note from the atelier will arrive in your inbox shortly. We will contact you when your piece begins its journey.
          </p>
          <div className="mt-10 flex gap-3 justify-center">
            <Link to="/account" className="border border-charcoal px-6 py-3 text-[11px] tracking-luxury uppercase hover:bg-charcoal hover:text-ivory transition-colors">
              View Orders
            </Link>
            <Link to="/collection" className="bg-charcoal text-ivory px-6 py-3 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors">
              Continue browsing
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

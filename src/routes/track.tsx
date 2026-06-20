import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { trackOrder } from "@/lib/orders.functions";
import { Package } from "lucide-react";

export const Route = createFileRoute("/track")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Track Your Order — IRAYA" },
      { name: "description", content: "Track your IRAYA order shipment with your order number and email." },
    ],
    links: [
      { rel: "canonical", href: "https://www.iraya.in/track" },
    ],
  }),
  component: TrackPage,
});

type TrackResult = {
  order_number: string;
  status: string;
  created_at: string;
  awb_code: string | null;
  courier_name: string | null;
  tracking_url: string | null;
};

function TrackPage() {
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const trackOrderFn = useServerFn(trackOrder);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    const orderNumber = String(fd.get("order") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim().toLowerCase();

    try {
      const data = await trackOrderFn({ data: { orderNumber, email } });
      if (!data) {
        setError("No order matches those details.");
      } else {
        setResult(data);
      }
    } catch {
      setError("No order matches those details.");
    }
    setLoading(false);
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <section className="pt-32 pb-12 hairline-b">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <Package className="h-8 w-8 mx-auto text-gold" strokeWidth={1.25} />
          <h1 className="mt-6 font-serif text-4xl md:text-5xl tracking-luxury">Track Your Order</h1>
          <p className="mt-4 text-mute text-sm">Enter your order number and the email you used at checkout.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-md px-6">
          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block">
              <span className="block text-[11px] tracking-wide-2 uppercase text-mute mb-2">Order number</span>
              <input name="order" required className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal" />
            </label>
            <label className="block">
              <span className="block text-[11px] tracking-wide-2 uppercase text-mute mb-2">Email</span>
              <input name="email" type="email" required className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal" />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-ivory py-3 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50"
            >
              {loading ? "Searching…" : "Track Order"}
            </button>
          </form>

          {error && <p className="mt-6 text-center text-sm text-red-700">{error}</p>}

          {result && (
            <div className="mt-10 p-8 bg-secondary text-sm">
              <div className="font-serif text-xl">{result.order_number}</div>
              <div className="mt-2 text-[11px] tracking-luxury uppercase text-gold">{result.status}</div>
              <div className="mt-4 text-mute text-[12px]">
                Placed on {new Date(result.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              {result.awb_code ? (
                <div className="mt-6 pt-6 hairline-t">
                  <div className="text-[11px] tracking-luxury uppercase text-mute">Shipment</div>
                  <div className="mt-2">{result.courier_name ?? "Courier"} — AWB {result.awb_code}</div>
                  {result.tracking_url && (
                    <a href={result.tracking_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-gold">
                      Track on courier site →
                    </a>
                  )}
                </div>
              ) : (
                <p className="mt-6 text-mute text-[12px]">Shipment will be created shortly. We'll email you the tracking link.</p>
              )}
              <div className="mt-6">
                <Link to="/account" className="text-[11px] tracking-luxury uppercase hover:text-gold">View in account →</Link>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

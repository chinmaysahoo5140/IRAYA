import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";

export const Route = createFileRoute("/returns")({
  head: () => ({ meta: [{ title: "Return Policy — IRAYA" }, { name: "description", content: "IRAYA return and exchange policy." }] }),
  component: () => (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <section className="pt-32 pb-12 hairline-b text-center">
        <div className="mx-auto max-w-[800px] px-6">
          <div className="text-[11px] tracking-luxury uppercase text-mute">Policies</div>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl tracking-luxury">Return Policy</h1>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-[700px] px-6 space-y-5 text-[15px] text-foreground/85 leading-relaxed">
          <p>We accept returns of unworn items in original condition within <strong>7 days of delivery</strong>.</p>
          <p>To initiate a return, please email <a href="mailto:hello@iraya.world" className="text-gold">hello@iraya.world</a> with your order number. Our team will arrange a pickup via Shiprocket.</p>
          <p>Refunds are credited to the original payment method within 5-7 business days of us receiving the returned item.</p>
          <p>Sale items, custom orders, and personal-care goods are final sale.</p>
        </div>
      </section>
      <Footer />
    </div>
  ),
});

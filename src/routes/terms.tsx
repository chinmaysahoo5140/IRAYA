import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — IRAYA" }, { name: "description", content: "IRAYA terms and conditions." }] }),
  component: () => (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <section className="pt-32 pb-12 hairline-b text-center">
        <div className="mx-auto max-w-[800px] px-6">
          <div className="text-[11px] tracking-luxury uppercase text-mute">Policies</div>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl tracking-luxury">Terms &amp; Conditions</h1>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-[700px] px-6 space-y-5 text-[15px] text-foreground/85 leading-relaxed">
          <p>By accessing irayaglobal.com you agree to be bound by these terms. All content, designs, and trademarks on this site are property of IRAYA.</p>
          <p>Prices are listed in Indian Rupees (₹) and may change without notice. Orders are subject to acceptance and product availability.</p>
          <p>We use Razorpay for payment processing and Shiprocket for shipping. By placing an order you consent to your data being shared with these providers strictly for order fulfilment.</p>
          <p>For any disputes, the courts of India shall have exclusive jurisdiction.</p>
        </div>
      </section>
      <Footer />
    </div>
  ),
});

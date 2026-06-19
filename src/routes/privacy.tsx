import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — IRAYA" }, { name: "description", content: "IRAYA privacy policy — how we handle your data." }] }),
  component: () => (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <section className="pt-32 pb-12 hairline-b text-center">
        <div className="mx-auto max-w-[800px] px-6">
          <div className="text-[11px] tracking-luxury uppercase text-mute">Policies</div>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl tracking-luxury">Privacy Policy</h1>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-[700px] px-6 space-y-5 text-[15px] text-foreground/85 leading-relaxed">
          <p>IRAYA collects only the personal data needed to fulfil your order — name, shipping address, email, phone number, and payment details.</p>
          <p>Payment data is processed by Razorpay and never stored on our servers. Shipping data is shared with Shiprocket solely for the purpose of delivering your order.</p>
          <p>We do not sell, rent, or share your personal information with third parties for marketing purposes. You can request deletion of your account and data at any time by emailing <a href="mailto:hello@iraya.world" className="text-gold">hello@iraya.world</a>.</p>
          <p>This site uses essential cookies for authentication and cart functionality only.</p>
        </div>
      </section>
      <Footer />
    </div>
  ),
});

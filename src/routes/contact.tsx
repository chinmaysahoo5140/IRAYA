import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact IRAYA — Get in Touch" },
      { name: "description", content: "Reach the IRAYA atelier — email, phone, and address." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <section className="pt-32 pb-16 hairline-b text-center">
        <div className="mx-auto max-w-[800px] px-6">
          <div className="text-[11px] tracking-luxury uppercase text-mute">Correspondence</div>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl tracking-luxury">Contact Us</h1>
          <p className="mt-5 text-mute">We respond within one working day.</p>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-[700px] px-6 grid sm:grid-cols-3 gap-10 text-center">
          <div>
            <Mail className="h-6 w-6 mx-auto text-gold" strokeWidth={1.25} />
            <div className="mt-4 text-[11px] tracking-luxury uppercase text-mute">Email</div>
            <a href="mailto:hello@iraya.world" className="mt-2 block text-sm hover:text-gold">hello@iraya.world</a>
          </div>
          <div>
            <Phone className="h-6 w-6 mx-auto text-gold" strokeWidth={1.25} />
            <div className="mt-4 text-[11px] tracking-luxury uppercase text-mute">Phone</div>
            <div className="mt-2 text-sm">+91 00000 00000</div>
          </div>
          <div>
            <MapPin className="h-6 w-6 mx-auto text-gold" strokeWidth={1.25} />
            <div className="mt-4 text-[11px] tracking-luxury uppercase text-mute">Atelier</div>
            <div className="mt-2 text-sm">India</div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

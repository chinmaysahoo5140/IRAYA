import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";

const faqs = [
  { q: "How long does shipping take?", a: "Domestic orders ship within 2-4 business days via Shiprocket. International orders take 7-14 business days." },
  { q: "Do you offer free shipping?", a: "Yes — complimentary shipping across India on every order. International rates apply at checkout." },
  { q: "What is your return policy?", a: "Unworn items can be returned within 7 days of delivery for a full refund or exchange." },
  { q: "Are your products handmade?", a: "Yes. Every bag and pair of shoes is cut, stitched and finished by hand by our artisans." },
  { q: "How do I track my order?", a: "Use the Track Order link in the footer with your order number and email — or sign in to your account." },
  { q: "Do you accept international cards?", a: "Yes, all major international cards are accepted via Razorpay secure checkout." },
];

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — IRAYA" },
      { name: "description", content: "Answers to common questions about IRAYA bags, footwear, shipping, and returns." },
    ],
  }),
  component: FaqsPage,
});

function FaqsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <section className="pt-32 pb-12 hairline-b text-center">
        <div className="mx-auto max-w-[800px] px-6">
          <div className="text-[11px] tracking-luxury uppercase text-mute">Help</div>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl tracking-luxury">FAQs</h1>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-[700px] px-6 space-y-8">
          {faqs.map((f) => (
            <div key={f.q} className="pb-6 hairline-b">
              <h3 className="font-serif text-xl">{f.q}</h3>
              <p className="mt-3 text-[15px] text-foreground/75 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

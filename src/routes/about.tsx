import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About IRAYA — Handcrafted Bags & Footwear" },
      { name: "description", content: "IRAYA is a house of handcrafted bags and footwear, made in India." },
      { property: "og:title", content: "About IRAYA" },
      { property: "og:description", content: "A house of handcrafted bags and footwear, made in India." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <section className="pt-32 pb-16 hairline-b">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <div className="text-[11px] tracking-luxury uppercase text-mute">Our Story</div>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl tracking-luxury">About IRAYA</h1>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-[700px] px-6 space-y-6 text-[15px] leading-relaxed text-foreground/85">
          <p>
            IRAYA is a maison of handcrafted bags and footwear, made in India. We believe in
            the quiet luxury of pieces made by hand — designed not for the season, but for the
            way you walk through your life.
          </p>
          <p>
            Every IRAYA bag is cut, stitched and finished by named artisans across our
            workshops. Every pair of shoes is built on a hand-lasted form, with leather
            sourced from heritage tanneries. We do not produce in volume. We produce in
            care.
          </p>
          <p>
            We ship globally via Shiprocket, accept secure payments through Razorpay, and
            stand behind every piece with a 7-day return window and lifetime repair service.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

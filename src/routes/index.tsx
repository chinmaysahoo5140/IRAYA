import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { Reveal } from "@/component/iraya/Reveal";
import { ProductCard } from "@/component/iraya/ProductCard";
import { listProducts } from "@/lib/products.functions";

const newArrivalsQO = queryOptions({
  queryKey: ["products", { featured: true, limit: 4 }],
  queryFn: () => listProducts({ data: { limit: 8 } }),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(newArrivalsQO),
  head: () => ({
    meta: [
      { title: "IRAYA — Handcrafted Bags & Footwear" },
      {
        name: "description",
        content:
          "IRAYA — a house of handcrafted bags and footwear, made in India for those who walk with intention.",
      },
      { property: "og:title", content: "IRAYA — Handcrafted Bags & Footwear" },
      {
        property: "og:description",
        content: "Handcrafted bags and footwear, made in India.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <p className="text-mute">Couldn't load page: {error.message}</p>
    </div>
  ),
});

function HomePage() {
  const { data: products } = useSuspenseQuery(newArrivalsQO);

  return (
    <div className="bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[90vh] lg:h-screen w-screen overflow-hidden bg-gradient-to-br from-sage via-ivory to-stone-100 flex flex-col lg:flex-row items-center pt-16">
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 10% 20%, rgba(40,80,60,0.12), transparent 45%), radial-gradient(circle at 90% 80%, rgba(200,150,80,0.08), transparent 45%)"
        }} />
        
        {/* Left column: content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 lg:py-0 text-foreground">
          <Reveal>
            <div className="text-[11px] tracking-luxury uppercase text-emerald font-semibold">
              Bags &amp; Footwear · MMXXVI
            </div>
          </Reveal>
          <Reveal delay={150}>
            <h1 className="mt-6 font-serif text-5xl sm:text-7xl md:text-8xl tracking-luxury leading-[0.95] text-emerald">
              IRAYA
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-6 max-w-lg text-base md:text-lg font-light text-foreground/80 leading-relaxed">
              Handcrafted bags and footwear, made in India. Experience slow, conscious luxury with our masterfully created emerald resin and marble clutches.
            </p>
          </Reveal>
          <Reveal delay={450}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/collection"
                search={{ category: "bags" }}
                className="inline-flex items-center justify-center gap-3 bg-emerald text-ivory px-8 py-3.5 text-[11px] tracking-luxury uppercase hover:bg-emerald-soft transition-colors duration-500 shadow-sm"
              >
                Shop Bags
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.25} />
              </Link>
              <Link
                to="/collection"
                search={{ category: "footwear" }}
                className="inline-flex items-center justify-center gap-3 border border-emerald text-emerald px-8 py-3.5 text-[11px] tracking-luxury uppercase hover:bg-emerald hover:text-ivory transition-colors duration-500"
              >
                Shop Footwear
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.25} />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Right column: visual */}
        <div className="flex-1 w-full h-[50vh] lg:h-full min-h-[400px] lg:min-h-screen relative overflow-hidden self-stretch flex items-center justify-center bg-sage/20">
          <div className="absolute inset-0 bg-gradient-to-t from-sage/40 via-transparent to-transparent z-10 pointer-events-none" />
          <Reveal className="w-full h-full" delay={200}>
            <div className="w-full h-full overflow-hidden relative group">
              <img
                src="/iraya-green-clutch.png"
                alt="IRAYA Emerald Green Handcrafted Clutch"
                className="w-full h-full object-cover img-hover"
              />
              <div className="absolute bottom-8 right-8 z-20 bg-ivory/90 backdrop-blur-md px-6 py-4 shadow-sm border border-hairline/25">
                <p className="font-serif text-lg text-emerald">The Emerald Resin Clutch</p>
                <p className="text-[10px] tracking-widest uppercase text-mute mt-1">Limited Edition · Atelier Exclusive</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <Reveal>
            <div className="text-center mb-14">
              <div className="text-[11px] tracking-luxury uppercase text-mute">Two Houses</div>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl">Choose Your World</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { slug: "bags", label: "Bags", grad: "from-sage via-ivory to-emerald/10" },
              { slug: "footwear", label: "Footwear", grad: "from-emerald/5 via-sage to-ivory" },
            ].map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <Link to="/collection" search={{ category: c.slug as "bags" | "footwear" }} className="group block">
                  <div className={`relative overflow-hidden aspect-[5/4] bg-gradient-to-br ${c.grad} flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="text-[11px] tracking-luxury uppercase text-mute">Shop</div>
                      <div className="mt-3 font-serif text-5xl md:text-6xl text-emerald group-hover:text-emerald-soft transition-colors duration-500">
                        {c.label}
                      </div>
                      <div className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-luxury uppercase text-emerald/75 group-hover:text-emerald-soft">
                        Explore <ArrowRight className="h-3 w-3" strokeWidth={1.25} />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS or EMPTY STATE */}
      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <Reveal>
            <div className="text-center mb-14">
              <div className="text-[11px] tracking-luxury uppercase text-mute">New Arrivals</div>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl">Latest from the Atelier</h2>
            </div>
          </Reveal>
          {products.length === 0 ? (
            <Reveal>
              <div className="text-center py-20 bg-secondary/40 hairline-t hairline-b">
                <div className="font-serif text-2xl text-foreground/70">Arriving Soon</div>
                <p className="mt-3 text-mute text-sm max-w-md mx-auto">
                  Our first collection is being finished by hand. New pieces arrive shortly.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {products.slice(0, 8).map((p) => (
                <ProductCard
                  key={p.id}
                  slug={p.slug}
                  name={p.name}
                  price={p.price}
                  image={p.image}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-24 bg-charcoal text-ivory">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <div className="text-[11px] tracking-luxury uppercase text-gold">The Atelier Story</div>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl text-ivory">Crafted with Quiet Intention</h2>
            <p className="mt-8 text-sm md:text-base leading-relaxed text-ivory/70 font-light max-w-xl mx-auto">
              IRAYA represents a harmonious convergence of ancient Indian artisanal heritage and modern, minimalist aesthetics. Rooted in the rich cultural tapestry of India, our design house is dedicated to producing ultra-premium handcrafted bags and luxury footwear that whisper sophistication. Every creation is born in our atelier, where skilled craftsmen with generations of ancestral expertise meticulously assemble each piece using only the finest responsibly sourced materials.
            </p>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-ivory/70 font-light max-w-xl mx-auto">
              We reject the breakneck pace of fast fashion, opting instead for a philosophy of slow, conscious luxury. By marrying timeless hand-loom textiles, master-carved brass ornaments, and premium full-grain leathers with clean, structured architectural lines, we create objects of enduring beauty. To carry an IRAYA bag or step into IRAYA footwear is to walk with a distinct sense of purpose, appreciating the soul, time, and human touch embedded in every single stitch.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PROMISES */}
      <section id="craft" className="py-24 lg:py-28 hairline-t hairline-b bg-secondary/30">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid md:grid-cols-3 gap-12 md:gap-20">
          {[
            { I: Truck, t: "Free Shipping", d: "Complimentary delivery across India on every order. International shipping via Shiprocket." },
            { I: ShieldCheck, t: "Secured Payments", d: "256-bit SSL encryption with Razorpay. UPI, cards, net banking & wallets accepted." },
            { I: RotateCcw, t: "Easy Returns", d: "7-day return window for unworn pieces. Hassle-free exchange or refund." },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 100}>
              <div className="text-center md:text-left">
                <c.I className="h-7 w-7 text-gold" strokeWidth={1.25} />
                <h3 className="mt-5 font-serif text-2xl">{c.t}</h3>
                <p className="mt-4 text-[14px] leading-relaxed text-foreground/70">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

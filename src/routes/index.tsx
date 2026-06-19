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
      <section className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, rgba(180,140,90,0.3), transparent 50%), radial-gradient(circle at 80% 70%, rgba(60,40,30,0.2), transparent 50%)"
        }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-charcoal text-center px-6">
          <Reveal>
            <div className="text-[11px] tracking-luxury uppercase text-mute">
              Bags &amp; Footwear · MMXXVI
            </div>
          </Reveal>
          <Reveal delay={150}>
            <h1 className="mt-8 font-serif text-6xl md:text-8xl tracking-luxury leading-[0.95]">
              IRAYA
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-6 max-w-md text-base md:text-lg font-light text-foreground/75">
              Handcrafted bags and footwear, made in India. Designed for the way you walk through the world.
            </p>
          </Reveal>
          <Reveal delay={450}>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                to="/collection"
                search={{ category: "bags" }}
                className="inline-flex items-center justify-center gap-3 bg-charcoal text-ivory px-8 py-3.5 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors duration-500"
              >
                Shop Bags
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.25} />
              </Link>
              <Link
                to="/collection"
                search={{ category: "footwear" }}
                className="inline-flex items-center justify-center gap-3 border border-charcoal text-charcoal px-8 py-3.5 text-[11px] tracking-luxury uppercase hover:bg-charcoal hover:text-ivory transition-colors duration-500"
              >
                Shop Footwear
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.25} />
              </Link>
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
              { slug: "bags", label: "Bags", grad: "from-amber-100 via-stone-100 to-amber-200" },
              { slug: "footwear", label: "Footwear", grad: "from-stone-200 via-stone-100 to-amber-100" },
            ].map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <Link to="/collection" search={{ category: c.slug as "bags" | "footwear" }} className="group block">
                  <div className={`relative overflow-hidden aspect-[5/4] bg-gradient-to-br ${c.grad} flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="text-[11px] tracking-luxury uppercase text-mute">Shop</div>
                      <div className="mt-3 font-serif text-5xl md:text-6xl text-charcoal group-hover:text-gold transition-colors duration-500">
                        {c.label}
                      </div>
                      <div className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-luxury uppercase text-charcoal/70 group-hover:text-gold">
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

import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { getProductBySlug } from "@/lib/products.functions";
import { useCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";

const productQO = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/collection/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(productQO(params.slug)),
  head: ({ loaderData }) => {
    const p = loaderData as Awaited<ReturnType<typeof getProductBySlug>> | undefined;
    if (!p) return { meta: [{ title: "IRAYA" }] };
    return {
      meta: [
        { title: `${p.name} — IRAYA` },
        { name: "description", content: p.description ?? "Handcrafted in India by IRAYA." },
        { property: "og:title", content: `${p.name} — IRAYA` },
        { property: "og:description", content: p.description ?? "" },
        ...(p.images?.[0] ? [{ property: "og:image", content: p.images[0].url }] : []),
      ],
    };
  },
  component: PDP,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <p className="text-mute">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-mute">This piece is no longer available.</p>
    </div>
  ),
});

function PDP() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(productQO(slug));
  const cart = useCart();
  const router = useRouter();
  const [activeImg, setActiveImg] = useState(0);
  const [adding, setAdding] = useState(false);

  const img = p.images?.[activeImg]?.url ?? null;

  const handleAdd = () => {
    if (!img) return;
    setAdding(true);
    cart.add({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      price: Number(p.price),
      imageUrl: img,
    });
    toast.success(`${p.name} added to bag`);
    setTimeout(() => setAdding(false), 1200);
  };

  const handleBuyNow = () => {
    handleAdd();
    router.navigate({ to: "/checkout" });
  };

  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <section className="pt-28 lg:pt-32 pb-20">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
          {/* Breadcrumb */}
          <nav className="text-[10px] tracking-luxury uppercase text-mute mb-8">
            <Link to="/" className="hover:text-charcoal">Maison</Link>
            <span className="mx-2">/</span>
            <Link to="/collection" className="hover:text-charcoal">Collection</Link>
            {p.categories && (
              <>
                <span className="mx-2">/</span>
                <Link to="/collection" search={{ category: p.categories.slug as "bags" | "footwear" }} className="hover:text-charcoal">
                  {p.categories.name}
                </Link>
              </>
            )}
          </nav>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-20">
            {/* Gallery */}
            <div>
              <div className="aspect-[4/5] bg-secondary overflow-hidden hairline-b">
                {img && (
                  <img src={img} alt={p.name} className="h-full w-full object-cover" />
                )}
              </div>
              {p.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {p.images.map((im, i) => (
                    <button
                      key={im.url}
                      onClick={() => setActiveImg(i)}
                      className={`aspect-square overflow-hidden border ${
                        i === activeImg ? "border-charcoal" : "border-transparent"
                      }`}
                    >
                      <img src={im.url} alt={im.alt ?? ""} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:pt-12">
              {p.categories && (
                <div className="text-[11px] tracking-luxury uppercase text-mute">
                  {p.categories.name}
                </div>
              )}
              <h1 className="mt-4 font-serif text-4xl md:text-5xl tracking-luxury leading-tight">
                {p.name}
              </h1>
              <div className="mt-6 text-xl tracking-wide-2">{formatINR(p.price)}</div>
              {p.description && (
                <p className="mt-8 text-[15px] leading-relaxed text-foreground/80">
                  {p.description}
                </p>
              )}

              {/* Stock */}
              <div className="mt-8 text-[11px] tracking-wide-2 uppercase text-mute">
                {p.stock > 0 ? (
                  <span className="text-charcoal">
                    {p.stock < 5 ? `Only ${p.stock} remaining` : "In atelier"}
                  </span>
                ) : (
                  <span>Currently unavailable</span>
                )}
              </div>

              {/* CTAs */}
              <div className="mt-10 flex flex-col gap-3">
                <button
                  onClick={handleAdd}
                  disabled={p.stock === 0 || adding}
                  className="inline-flex items-center justify-center gap-3 bg-charcoal text-ivory px-8 py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-40"
                >
                  {adding ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Added
                    </>
                  ) : (
                    "Add to Bag"
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={p.stock === 0}
                  className="inline-flex items-center justify-center gap-3 border border-charcoal text-charcoal px-8 py-4 text-[11px] tracking-luxury uppercase hover:bg-charcoal hover:text-ivory transition-colors disabled:opacity-40"
                >
                  Acquire Now <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.25} />
                </button>
              </div>

              {/* Story */}
              {p.story && (
                <div className="mt-14 pt-10 hairline-t">
                  <div className="text-[11px] tracking-luxury uppercase text-gold">The Story</div>
                  <p className="mt-5 font-serif text-xl leading-relaxed text-foreground/85">
                    {p.story}
                  </p>
                </div>
              )}

              {/* Service points */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[11px] tracking-wide-2 uppercase text-mute">
                <div>Complimentary shipping over ₹25,000</div>
                <div>Signed by maker</div>
                <div>Lifetime restoration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

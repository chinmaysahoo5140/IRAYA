import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { listMyWishlist } from "@/lib/profile.functions";
import { formatINR } from "@/lib/format";

const wishlistQO = queryOptions({ queryKey: ["my-wishlist"], queryFn: () => listMyWishlist() });

export const Route = createFileRoute("/_authenticated/account/wishlist")({
  loader: ({ context }) => context.queryClient.ensureQueryData(wishlistQO),
  head: () => ({ meta: [{ title: "Wishlist — IRAYA" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { data: items } = useSuspenseQuery(wishlistQO);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <Link to="/account" className="text-[11px] tracking-luxury uppercase text-mute hover:text-charcoal">← Back</Link>
          <h1 className="mt-6 font-serif text-3xl md:text-4xl tracking-luxury">Wishlist</h1>

          <div className="mt-10">
            {items.length === 0 ? (
              <p className="text-mute text-center py-12">Your wishlist is empty.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {items.map((w) => {
                  const p = w.products as unknown as {
                    id: string;
                    slug: string;
                    name: string;
                    price: string;
                    product_images: Array<{ url: string; sort_order: number }>;
                  };
                  if (!p) return null;
                  const img = (p.product_images ?? []).sort((a, b) => a.sort_order - b.sort_order)[0]?.url;
                  return (
                    <Link key={p.id} to="/collection/$slug" params={{ slug: p.slug }} className="group block">
                      <div className="aspect-[4/5] bg-secondary overflow-hidden">
                        {img && <img src={img} alt={p.name} className="img-hover h-full w-full object-cover" />}
                      </div>
                      <div className="mt-4 text-center">
                        <div className="font-serif">{p.name}</div>
                        <div className="text-[12px] text-mute tracking-wide-2">{formatINR(p.price)}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { ProductCard } from "@/component/iraya/ProductCard";
import { listProducts, listCategories } from "@/lib/products.functions";

const searchSchema = z.object({
  category: z.string().optional(),
});

const productsQO = (category?: string) =>
  queryOptions({
    queryKey: ["products", { category }],
    queryFn: () => listProducts({ data: { category } }),
  });

const categoriesQO = queryOptions({
  queryKey: ["categories"],
  queryFn: () => listCategories(),
});

export const Route = createFileRoute("/collection")({
  validateSearch: (s) => searchSchema.parse(s),
  loaderDeps: ({ search }) => ({ category: search.category }),
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQO(deps.category)),
      context.queryClient.ensureQueryData(categoriesQO),
    ]);
  },
  head: ({ match }) => {
    const c = (match.search as { category?: string }).category;
    const title = c
      ? `${c.charAt(0).toUpperCase() + c.slice(1)} — IRAYA`
      : "Collection — IRAYA Bags & Footwear";
    const description = c === "bags"
      ? "Handcrafted bags from IRAYA — made in India."
      : c === "footwear"
        ? "Handcrafted footwear from IRAYA — made in India."
        : "Browse handcrafted bags and footwear from IRAYA.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
      links: [
        { rel: "canonical", href: `https://www.iraya.in/collection${c ? `?category=${c}` : ""}` },
      ],
    };
  },
  component: CollectionPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <p className="text-mute">Couldn't load collection: {error.message}</p>
    </div>
  ),
});

function CollectionPage() {
  const { category } = Route.useSearch();
  const { data: products } = useSuspenseQuery(productsQO(category));
  const { data: categories } = useSuspenseQuery(categoriesQO);

  const heading = category
    ? categories.find((c) => c.slug === category)?.name ?? "Collection"
    : "All Pieces";

  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <section className="pt-32 lg:pt-40 pb-16 hairline-b">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 text-center">
          <div className="text-[11px] tracking-luxury uppercase text-mute">The Collection</div>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl tracking-luxury">{heading}</h1>
          <p className="mt-5 max-w-xl mx-auto text-[15px] text-foreground/70">
            Handcrafted in India. Made to be worn, carried, and remembered.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="py-8">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="flex flex-wrap justify-center gap-2 md:gap-8 text-[11px] tracking-luxury uppercase">
            <Link
              to="/collection"
              search={{}}
              className={!category ? "text-charcoal border-b border-charcoal pb-1" : "text-mute hover:text-charcoal"}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/collection"
                search={{ category: c.slug }}
                className={
                  category === c.slug
                    ? "text-charcoal border-b border-charcoal pb-1"
                    : "text-mute hover:text-charcoal"
                }
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          {products.length === 0 ? (
            <div className="text-center py-24 bg-secondary/40 hairline-t hairline-b">
              <div className="font-serif text-3xl text-foreground/70">Arriving Soon</div>
              <p className="mt-4 text-mute text-sm max-w-md mx-auto">
                Our atelier is finishing the first {category ?? "collection"} pieces by hand.
                Check back shortly, or subscribe below to be the first to know.
              </p>
              <Link
                to="/"
                className="mt-8 inline-block text-[11px] tracking-luxury uppercase border border-charcoal px-6 py-3 hover:bg-charcoal hover:text-ivory transition-colors"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {products.map((p) => (
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

      <Footer />
    </div>
  );
}

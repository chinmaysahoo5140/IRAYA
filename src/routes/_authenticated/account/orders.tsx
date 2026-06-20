import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { listMyOrders } from "@/lib/orders.functions";
import { formatINR } from "@/lib/format";
import { SkeletonLine } from "@/component/skeletons/SkeletonLine";
import { SkeletonBadge } from "@/component/skeletons/SkeletonBadge";
import { SkeletonBox } from "@/component/skeletons/SkeletonBox";
import { ShoppingBag, HelpCircle } from "lucide-react";

const ordersQO = queryOptions({ queryKey: ["my-orders"], queryFn: () => listMyOrders() });

export const Route = createFileRoute("/_authenticated/account/orders")({
  loader: ({ context }) => context.queryClient.ensureQueryData(ordersQO),
  pendingComponent: OrdersSkeleton,
  head: () => ({ meta: [{ title: "Orders — IRAYA" }] }),
  component: OrdersPage,
});

// Get status badge colors
function getStatusStyle(status: string) {
  const s = status.toLowerCase();
  if (s.includes("pending")) {
    return "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900";
  }
  if (s.includes("confirm")) {
    return "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900";
  }
  if (s.includes("ship")) {
    return "text-violet-700 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/30 border-violet-200 dark:border-violet-900";
  }
  if (s.includes("deliver") || s.includes("paid")) {
    return "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900";
  }
  return "text-mute bg-secondary border-hairline";
}

function OrdersPage() {
  const { data: orders } = useSuspenseQuery(ordersQO);

  return (
    <div className="bg-background min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="mx-auto max-w-[1200px] px-6 fade-up">
          <div className="text-center mb-12">
            <span className="text-[11px] tracking-luxury uppercase text-mute">The Maison</span>
            <h1 className="mt-4 font-serif text-4xl tracking-luxury text-charcoal">Your Orders</h1>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-secondary/10 border border-hairline rounded max-w-xl mx-auto">
              <ShoppingBag className="h-12 w-12 text-mute mb-4" strokeWidth={1} />
              <h2 className="font-serif text-2xl text-charcoal">No orders yet</h2>
              <p className="text-mute text-sm mt-2 max-w-sm">
                You haven't placed any orders yet. Discover our handcrafted collection.
              </p>
              <Link
                to="/collection"
                className="mt-6 text-[11px] tracking-luxury uppercase border border-charcoal px-8 py-3 bg-charcoal text-ivory hover:bg-gold hover:border-gold hover:text-ivory transition-all"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="p-6 border border-hairline bg-card flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-serif text-lg text-charcoal font-medium">
                        {o.order_number}
                      </span>
                      <span
                        className={`text-[9px] tracking-wide-2 uppercase font-medium border px-2.5 py-0.5 rounded-full ${getStatusStyle(o.status)}`}
                      >
                        {o.status}
                      </span>
                    </div>
                    <div className="text-xs text-mute flex gap-4">
                      <span>
                        Placed on{" "}
                        {new Date(o.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-charcoal">{formatINR(o.total)}</span>
                    </div>
                  </div>

                  <div className="flex items-center self-start md:self-center group relative">
                    <button
                      disabled
                      className="text-[11px] tracking-luxury uppercase border border-hairline text-mute cursor-not-allowed px-5 py-2.5 bg-secondary/20 flex items-center gap-1.5"
                    >
                      Track Order
                      <HelpCircle className="h-3.5 w-3.5 text-mute" />
                    </button>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-charcoal text-ivory text-[10px] tracking-wide uppercase text-center rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md z-10">
                      Tracking coming soon
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="bg-background min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="mx-auto max-w-[1200px] px-6 space-y-12">
          <div className="text-center mb-12">
            <SkeletonLine width="w-24 mx-auto" height="h-3.5" />
            <SkeletonLine width="w-48 mx-auto" height="h-8" className="mt-4" />
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="p-6 border border-hairline bg-card/50 flex justify-between items-center gap-6">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center gap-3">
                      <SkeletonLine width="w-32" height="h-5" />
                      <SkeletonBadge />
                    </div>
                    <SkeletonLine width="w-56" height="h-4" />
                  </div>
                  <SkeletonBox width="w-28" height="h-9" />
                </div>
              ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

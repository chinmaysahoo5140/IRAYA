import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { getMyOrder } from "@/lib/orders.functions";
import { formatINR } from "@/lib/format";

const orderQO = (id: string) =>
  queryOptions({ queryKey: ["my-order", id], queryFn: () => getMyOrder({ data: { id } }) });

export const Route = createFileRoute("/_authenticated/account/orders/$id")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(orderQO(params.id)),
  head: () => ({ meta: [{ title: "Order — IRAYA" }] }),
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = Route.useParams();
  const { data: o } = useSuspenseQuery(orderQO(id));
  if (!o) return <div className="min-h-screen flex items-center justify-center text-mute">Order not found.</div>;

  const addr = o.shipping_address as Record<string, string>;

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-[1000px] px-6">
          <Link to="/account" className="text-[11px] tracking-luxury uppercase text-mute hover:text-charcoal">
            ← Back to account
          </Link>
          <div className="mt-6 hairline-b pb-6">
            <div className="text-[11px] tracking-luxury uppercase text-mute">Order</div>
            <h1 className="mt-2 font-serif text-3xl md:text-4xl tracking-luxury">{o.order_number}</h1>
            <div className="mt-4 flex flex-wrap gap-6 text-[11px] tracking-luxury uppercase">
              <span>Status: <span className="text-gold">{o.status}</span></span>
              <span className="text-mute">
                {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="py-8 hairline-b">
            {(o.order_items as Array<{ id: string; name: string; price: number | string; quantity: number; image_url: string | null }>).map((it) => (
              <div key={it.id} className="flex gap-4 py-4">
                {it.image_url && (
                  <div className="w-20 h-24 bg-secondary overflow-hidden shrink-0">
                    <img src={it.image_url} alt={it.name} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-serif text-lg">{it.name}</div>
                  <div className="text-[11px] tracking-wide-2 text-mute">× {it.quantity}</div>
                </div>
                <div className="font-serif">{formatINR(Number(it.price) * it.quantity)}</div>
              </div>
            ))}
          </div>

          {/* Totals + ship */}
          <div className="grid sm:grid-cols-2 gap-8 py-8">
            <div>
              <div className="text-[11px] tracking-luxury uppercase text-mute mb-3">Shipping to</div>
              <div className="font-serif text-base leading-relaxed">
                {addr.full_name}<br />
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                {addr.city}, {addr.state} {addr.pincode}<br />
                {addr.country}<br />
                {addr.phone}
              </div>
            </div>
            <div className="text-right">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-mute">Subtotal</span><span>{formatINR(o.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-mute">Shipping</span><span>{Number(o.shipping) === 0 ? "Complimentary" : formatINR(o.shipping)}</span></div>
                <div className="flex justify-between"><span className="text-mute">GST</span><span>{formatINR(o.tax)}</span></div>
                <div className="flex justify-between font-serif text-xl pt-3 hairline-t"><span>Total</span><span>{formatINR(o.total)}</span></div>
              </div>
            </div>
          </div>

          {o.awb_code && (
            <div className="mt-6 p-6 bg-secondary text-[13px]">
              <div className="text-[11px] tracking-luxury uppercase text-mute mb-2">Tracking</div>
              <div>{o.courier_name} — AWB {o.awb_code}</div>
              {o.tracking_url && (
                <a href={o.tracking_url} target="_blank" rel="noreferrer" className="text-gold mt-2 inline-block">Track shipment →</a>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

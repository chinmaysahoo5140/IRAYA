import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminListOrders, adminUpdateOrderStatus } from "@/lib/admin.functions";
import { createShiprocketShipment } from "@/lib/shiprocket.functions";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Truck } from "lucide-react";

const qo = queryOptions({ queryKey: ["admin-orders"], queryFn: () => adminListOrders() });

const STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;

export const Route = createFileRoute("/_authenticated/admin/orders")({
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  head: () => ({ meta: [{ title: "Admin · Orders — IRAYA" }] }),
  component: OrdersAdmin,
});

function OrdersAdmin() {
  const { data: orders } = useSuspenseQuery(qo);
  const qc = useQueryClient();
  const updateFn = useServerFn(adminUpdateOrderStatus);
  const shipFn = useServerFn(createShiprocketShipment);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function setStatus(id: string, status: (typeof STATUSES)[number]) {
    try {
      await updateFn({ data: { orderId: id, status } });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success(`Marked ${status}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  async function ship(id: string) {
    try {
      const r = await shipFn({ data: { orderId: id } });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success(`Shipment created. AWB: ${r.awb ?? "pending"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Add Shiprocket credentials first");
    }
  }

  return (
    <div>
      <h1 className="font-serif text-4xl tracking-luxury mb-10">Orders</h1>
      <div className="hairline-t">
        {orders.length === 0 ? (
          <p className="text-mute py-12 text-center">No orders yet.</p>
        ) : (
          orders.map((o) => {
            const addr = o.shipping_address as Record<string, string> | null;
            const isOpen = expanded === o.id;
            return (
              <div key={o.id} className="hairline-b">
                <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 py-4 text-sm">
                  <button onClick={() => setExpanded(isOpen ? null : o.id)} className="p-1">
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  <div className="min-w-0">
                    <div className="font-serif text-base truncate">{o.order_number}</div>
                    <div className="text-[11px] text-mute truncate">
                      {addr?.full_name ?? "—"} · {o.email}
                    </div>
                  </div>
                  <div className="text-[11px] text-mute">{new Date(o.created_at).toLocaleDateString()}</div>
                  <div className="font-serif">{formatINR(o.total)}</div>
                  <select
                    value={o.status}
                    onChange={(e) => setStatus(o.id, e.target.value as (typeof STATUSES)[number])}
                    className="bg-transparent hairline-b py-1 text-[11px] tracking-luxury uppercase"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => ship(o.id)}
                    title={o.awb_code ? `AWB ${o.awb_code}` : "Create Shiprocket shipment"}
                    className="inline-flex items-center gap-1 text-[11px] tracking-luxury uppercase border border-charcoal px-3 py-1 hover:bg-charcoal hover:text-ivory transition-colors"
                  >
                    <Truck className="h-3 w-3" /> {o.awb_code ? "Re-ship" : "Ship"}
                  </button>
                </div>

                {isOpen && (
                  <div className="pb-6 pl-10 pr-4 grid sm:grid-cols-2 gap-6 text-[13px]">
                    <div>
                      <div className="text-[11px] tracking-luxury uppercase text-mute mb-2">Customer</div>
                      <div>{addr?.full_name}</div>
                      <div className="text-mute">{o.email}</div>
                      <div className="text-mute">{o.phone}</div>
                      {addr && (
                        <div className="mt-3 text-mute">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                          {addr.city}, {addr.state} {addr.pincode}<br />
                          {addr.country}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-[11px] tracking-luxury uppercase text-mute mb-2">Items</div>
                      {(o.order_items as Array<{ name: string; quantity: number; price: number }>).map((it, i) => (
                        <div key={i} className="flex justify-between py-1">
                          <span>{it.name} × {it.quantity}</span>
                          <span>{formatINR(Number(it.price) * it.quantity)}</span>
                        </div>
                      ))}
                      {o.awb_code && (
                        <div className="mt-3 text-[11px] text-mute">
                          AWB {o.awb_code}{o.courier_name ? ` · ${o.courier_name}` : ""}
                          {o.tracking_url && (
                            <> · <a href={o.tracking_url} target="_blank" rel="noreferrer" className="text-gold">Track →</a></>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

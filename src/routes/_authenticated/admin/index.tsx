import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { adminStats } from "@/lib/admin.functions";
import { formatINR } from "@/lib/format";

const statsQO = queryOptions({ queryKey: ["admin-stats"], queryFn: () => adminStats() });

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(statsQO),
  head: () => ({ meta: [{ title: "Admin — IRAYA" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data } = useSuspenseQuery(statsQO);
  const cards = [
    { label: "Revenue", value: formatINR(data.revenue) },
    { label: "Orders", value: String(data.orders) },
    { label: "Products", value: String(data.products) },
  ];
  return (
    <div>
      <h1 className="font-serif text-4xl tracking-luxury mb-10">Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="p-8 hairline-b hairline-t bg-secondary">
            <div className="text-[11px] tracking-luxury uppercase text-mute">{c.label}</div>
            <div className="mt-3 font-serif text-3xl">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { getMyProfile, getMyRoles } from "@/lib/profile.functions";
import { listMyOrders } from "@/lib/orders.functions";
import { formatINR } from "@/lib/format";
import { logoutServerFn } from "@/lib/auth.functions";

const profileQO = queryOptions({ queryKey: ["my-profile"], queryFn: () => getMyProfile() });
const ordersQO = queryOptions({ queryKey: ["my-orders"], queryFn: () => listMyOrders() });
const rolesQO = queryOptions({ queryKey: ["my-roles"], queryFn: () => getMyRoles() });

export const Route = createFileRoute("/_authenticated/account/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(profileQO),
      context.queryClient.ensureQueryData(ordersQO),
      context.queryClient.ensureQueryData(rolesQO),
    ]),
  head: () => ({ meta: [{ title: "Account — IRAYA" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { data: profile } = useSuspenseQuery(profileQO);
  const { data: orders } = useSuspenseQuery(ordersQO);
  const { data: roles } = useSuspenseQuery(rolesQO);
  const router = useRouter();
  const isAdmin = roles.includes("admin");

  async function signOut() {
    await logoutServerFn();
    router.navigate({ to: "/" });
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <section className="pt-32 pb-12 hairline-b">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-[11px] tracking-luxury uppercase text-mute">The Maison</div>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl tracking-luxury">
            Bonjour, {profile?.full_name ?? profile?.email ?? "friend"}
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1200px] px-6 grid lg:grid-cols-4 gap-12">
          <aside className="lg:col-span-1">
            <nav className="space-y-3 text-[11px] tracking-luxury uppercase">
              <Link to="/account" className="block text-mute hover:text-charcoal" activeOptions={{ exact: true }}>Orders</Link>
              <Link to="/account/addresses" className="block text-mute hover:text-charcoal">Addresses</Link>
              <Link to="/account/wishlist" className="block text-mute hover:text-charcoal">Wishlist</Link>
              <Link to="/account/security" className="block text-mute hover:text-charcoal">Security & 2FA</Link>
              <Link to="/account/sessions" className="block text-mute hover:text-charcoal">Active Sessions</Link>
              {isAdmin && (
                <Link to="/admin" className="block text-gold hover:text-charcoal">Admin →</Link>
              )}
              <button onClick={signOut} className="block text-mute hover:text-charcoal pt-6 cursor-pointer">
                Sign out
              </button>
            </nav>
          </aside>

          <div className="lg:col-span-3">
            <h2 className="font-serif text-2xl mb-6">Your orders</h2>
            {orders.length === 0 ? (
              <div className="text-mute py-12 text-center hairline-b">
                No orders yet.{" "}
                <Link to="/collection" className="text-charcoal underline-offset-4 hover:underline">
                  Browse the collection
                </Link>
              </div>
            ) : (
              <div className="hairline-t">
                {orders.map((o) => (
                  <Link
                    key={o.id}
                    to="/account/orders/$id"
                    params={{ id: o.id }}
                    className="flex justify-between items-center py-5 hairline-b group hover:bg-secondary/50 px-2 -mx-2 transition-colors"
                  >
                    <div>
                      <div className="font-serif text-lg">{o.order_number}</div>
                      <div className="text-[11px] tracking-wide-2 text-mute uppercase">
                        {new Date(o.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-lg">{formatINR(o.total)}</div>
                      <div className="text-[11px] tracking-luxury uppercase text-gold">{o.status}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Admin layout — extra gate on top of _authenticated.
// Uses a server fn to check has_role('admin').
import { createFileRoute, Outlet, Link, redirect } from "@tanstack/react-router";
import { getMyRoles } from "@/lib/profile.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const roles = await getMyRoles();
    if (!roles.includes("admin")) {
      throw redirect({ to: "/account" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="bg-background min-h-screen">
      <header className="hairline-b bg-charcoal text-ivory">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl tracking-luxury">IRAYA · Admin</Link>
          <nav className="flex items-center gap-6 text-[11px] tracking-luxury uppercase">
            <Link to="/admin" className="hover:text-gold" activeOptions={{ exact: true }}>Dashboard</Link>
            <Link to="/admin/products" className="hover:text-gold">Products</Link>
            <Link to="/admin/orders" className="hover:text-gold">Orders</Link>
            <Link to="/admin/security" className="hover:text-gold">Security</Link>
            <Link to="/account" className="text-ivory/60 hover:text-ivory">Exit</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12">
        <Outlet />
      </main>
    </div>
  );
}

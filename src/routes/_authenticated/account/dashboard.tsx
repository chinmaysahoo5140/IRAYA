import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/component/ProtectedRoute";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { api } from "@/lib/axios";
import { SkeletonAvatar } from "@/component/skeletons/SkeletonAvatar";
import { SkeletonLine } from "@/component/skeletons/SkeletonLine";
import { SkeletonBox } from "@/component/skeletons/SkeletonBox";
import { ShoppingBag, MapPin, User as UserIcon, Calendar } from "lucide-react";

export const Route = createFileRoute("/_authenticated/account/dashboard")({
  component: DashboardPageWrapper,
});

function DashboardPageWrapper() {
  return (
    <ProtectedRoute fallback={<DashboardSkeleton />}>
      <DashboardPage />
    </ProtectedRoute>
  );
}

interface Order {
  id: string;
  orderNumber: string;
  created_at: string;
  status: string;
  total: number;
}

function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          api.get("/users/me"),
          api.get("/orders"),
        ]);
        setProfile(profileRes.data?.user || profileRes.data);
        setOrders(ordersRes.data?.orders || ordersRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setPageLoading(false);
      }
    }
    fetchData();
  }, []);

  if (pageLoading) {
    return <DashboardSkeleton />;
  }

  // Get user initials for avatar
  const name = profile?.name || "Guest";
  const email = profile?.email || "";
  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Recently";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="bg-background min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="mx-auto max-w-[1200px] px-6 fade-up">
          {/* Header Profile Section */}
          <div className="flex items-center gap-6 pb-12 hairline-b">
            <div className="h-20 w-20 rounded-full bg-charcoal text-ivory flex items-center justify-center font-serif text-2xl font-medium">
              {initials}
            </div>
            <div>
              <h1 className="font-serif text-3xl tracking-luxury text-charcoal">{name}</h1>
              <p className="text-sm text-mute">{email}</p>
              <div className="flex items-center gap-1.5 text-xs text-mute mt-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Joined {joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Link Cards */}
          <div className="grid md:grid-cols-3 gap-6 py-12 hairline-b">
            <Link
              to="/account/orders"
              className="group p-6 border border-hairline hover:border-charcoal transition-all flex flex-col justify-between h-40 bg-card"
            >
              <ShoppingBag className="h-6 w-6 text-gold" strokeWidth={1.25} />
              <div>
                <h3 className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors">
                  My Orders
                </h3>
                <p className="text-xs text-mute mt-1">View purchase history and status</p>
              </div>
            </Link>

            <Link
              to="/account/addresses"
              className="group p-6 border border-hairline hover:border-charcoal transition-all flex flex-col justify-between h-40 bg-card"
            >
              <MapPin className="h-6 w-6 text-gold" strokeWidth={1.25} />
              <div>
                <h3 className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors">
                  Saved Addresses
                </h3>
                <p className="text-xs text-mute mt-1">Manage delivery locations</p>
              </div>
            </Link>

            <Link
              to="/account/profile"
              className="group p-6 border border-hairline hover:border-charcoal transition-all flex flex-col justify-between h-40 bg-card"
            >
              <UserIcon className="h-6 w-6 text-gold" strokeWidth={1.25} />
              <div>
                <h3 className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors">
                  Edit Profile
                </h3>
                <p className="text-xs text-mute mt-1">Update name, email, and phone</p>
              </div>
            </Link>
          </div>

          {/* Recent Orders Section */}
          <div className="py-12">
            <h2 className="font-serif text-2xl mb-8 tracking-luxury text-charcoal">Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 bg-secondary/20 border border-hairline rounded">
                <ShoppingBag className="h-10 w-10 text-mute mb-4" strokeWidth={1} />
                <p className="text-mute text-sm font-medium">No orders yet</p>
                <Link
                  to="/collection"
                  className="mt-4 text-[11px] tracking-luxury uppercase border border-charcoal px-6 py-2.5 hover:bg-charcoal hover:text-ivory transition-all"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((o) => (
                  <div
                    key={o.id}
                    className="flex justify-between items-center p-6 border border-hairline bg-card hover:border-charcoal transition-all"
                  >
                    <div>
                      <div className="font-serif text-lg text-charcoal font-medium">
                        Order #{o.orderNumber || o.id.slice(0, 8)}
                      </div>
                      <div className="text-xs text-mute mt-1">
                        {new Date(o.created_at || Date.now()).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-lg text-charcoal">
                        ₹{Number(o.total || 0).toLocaleString("en-IN")}
                      </div>
                      <span className="inline-block mt-1 text-[10px] tracking-luxury uppercase font-medium text-gold bg-gold/5 px-2.5 py-1 rounded-full">
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="bg-background min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="mx-auto max-w-[1200px] px-6 space-y-12">
          {/* Header Profile Skeleton */}
          <div className="flex items-center gap-6 pb-12 hairline-b">
            <SkeletonAvatar size="h-20 w-20" />
            <div className="space-y-3 flex-grow max-w-md">
              <SkeletonLine width="w-48" height="h-6" />
              <SkeletonLine width="w-36" height="h-4" />
              <SkeletonLine width="w-24" height="h-3" />
            </div>
          </div>

          {/* Quick Link Cards Skeleton */}
          <div className="grid md:grid-cols-3 gap-6 py-12 hairline-b">
            <SkeletonBox height="h-40" />
            <SkeletonBox height="h-40" />
            <SkeletonBox height="h-40" />
          </div>

          {/* Recent Orders Skeleton */}
          <div className="py-12 space-y-6">
            <SkeletonLine width="w-40" height="h-6" />
            <SkeletonBox height="h-20" />
            <SkeletonBox height="h-20" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

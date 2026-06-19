import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { listMySessions, terminateSession, terminateAllOtherSessions } from "@/lib/auth.functions";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/_authenticated/account/sessions")({
  head: () => ({ meta: [{ title: "Active Sessions — IRAYA" }] }),
  component: SessionsPage,
});

function SessionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fetchSessions = useServerFn(listMySessions);
  const deleteSession = useServerFn(terminateSession);
  const deleteAllOthers = useServerFn(terminateAllOtherSessions);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["active-sessions"],
    queryFn: () => fetchSessions(),
  });

  const terminateMut = useMutation({
    mutationFn: (id: string) => deleteSession({ data: { id } }),
    onSuccess: (data, variables) => {
      toast.success("Session terminated.");
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
      // If the user terminated their current session, they will be logged out.
      const current = sessions?.find(s => s.id === variables);
      if (current?.isCurrent) {
        router.navigate({ to: "/auth" });
      }
    },
    onError: () => toast.error("Could not terminate session."),
  });

  const terminateOthersMut = useMutation({
    mutationFn: () => deleteAllOthers(),
    onSuccess: () => {
      toast.success("All other sessions terminated.");
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
    },
    onError: () => toast.error("Could not terminate other sessions."),
  });

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <section className="pt-32 pb-12 hairline-b">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-[11px] tracking-luxury uppercase text-mute">The Maison</div>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl tracking-luxury">Active Sessions</h1>
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
              <Link to="/account/sessions" className="block text-mute hover:text-charcoal" activeProps={{ className: "text-charcoal border-l border-charcoal pl-2" }}>Active Sessions</Link>
              <button onClick={() => router.navigate({ to: "/auth" })} className="block text-mute hover:text-charcoal pt-6 cursor-pointer">
                Sign out
              </button>
            </nav>
          </aside>

          <div className="lg:col-span-3 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl">Manage login sessions</h2>
              {sessions && sessions.length > 1 && (
                <button
                  onClick={() => terminateOthersMut.mutate()}
                  className="text-[10px] tracking-luxury uppercase border border-charcoal px-4 py-2 hover:bg-charcoal hover:text-ivory transition-colors cursor-pointer"
                >
                  Log out all other devices
                </button>
              )}
            </div>

            {isLoading ? (
              <p className="text-mute text-sm">Loading sessions...</p>
            ) : !sessions || sessions.length === 0 ? (
              <p className="text-mute text-sm">No active sessions found.</p>
            ) : (
              <div className="space-y-4">
                {sessions.map((s) => (
                  <div key={s.id} className="bg-secondary p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-lg">
                          {s.os || "Unknown OS"} · {s.browser_name || "Unknown Browser"}
                        </span>
                        {s.isCurrent && (
                          <span className="text-[9px] tracking-luxury uppercase bg-charcoal text-ivory px-2 py-0.5">
                            Current session
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-mute uppercase tracking-wide-2 mt-1 space-y-0.5">
                        <p>IP Address: <span className="font-mono text-xs text-charcoal">{s.ip_address || "unknown"}</span></p>
                        <p>Location: <span className="text-charcoal">{s.city ? `${s.city}, ` : ""}{s.country || "unknown"}</span></p>
                        <p>Last Active: <span className="text-charcoal">{new Date(s.last_active).toLocaleString()}</span></p>
                      </div>
                    </div>
                    <button
                      onClick={() => terminateMut.mutate(s.id)}
                      className="text-[10px] tracking-luxury uppercase text-red-700 hover:text-red-900 cursor-pointer"
                    >
                      {s.isCurrent ? "Revoke current (Log out)" : "Terminate session"}
                    </button>
                  </div>
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

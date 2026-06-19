import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/component/ProtectedRoute";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { api } from "@/lib/axios";
import { SkeletonLine } from "@/component/skeletons/SkeletonLine";
import { SkeletonBox } from "@/component/skeletons/SkeletonBox";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/account/profile")({
  component: ProfilePageWrapper,
});

function ProfilePageWrapper() {
  return (
    <ProtectedRoute fallback={<ProfileSkeleton />}>
      <ProfilePage />
    </ProtectedRoute>
  );
}

function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get("/users/me");
        const user = response.data?.user || response.data;
        if (user) {
          setName(user.name || "");
          setEmail(user.email || "");
          setPhone(user.phone || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setBusy(true);

    try {
      await api.patch("/users/me", { name, email, phone });
      toast.success("Profile saved successfully!");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="bg-background min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="mx-auto max-w-md px-6 fade-up">
          <div className="text-center mb-12">
            <span className="text-[11px] tracking-luxury uppercase text-mute">The Maison</span>
            <h1 className="mt-4 font-serif text-4xl tracking-luxury text-charcoal">Edit Profile</h1>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block mb-2">
                <span className="block text-[11px] tracking-wide-2 uppercase text-mute">Full Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
                  required
                />
              </label>
            </div>

            <div>
              <label className="block mb-2">
                <span className="block text-[11px] tracking-wide-2 uppercase text-mute">Email Address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
                  required
                />
              </label>
            </div>

            <div>
              <label className="block mb-2">
                <span className="block text-[11px] tracking-wide-2 uppercase text-mute">Phone Number</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-charcoal text-ivory py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="bg-background min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="mx-auto max-w-md px-6 space-y-8">
          <div className="text-center mb-12">
            <SkeletonLine width="w-24 mx-auto" height="h-3.5" />
            <SkeletonLine width="w-48 mx-auto" height="h-8" className="mt-4" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <SkeletonLine width="w-24" height="h-3" />
              <SkeletonBox height="h-10" />
            </div>
            <div className="space-y-2">
              <SkeletonLine width="w-24" height="h-3" />
              <SkeletonBox height="h-10" />
            </div>
            <div className="space-y-2">
              <SkeletonLine width="w-24" height="h-3" />
              <SkeletonBox height="h-10" />
            </div>
            <SkeletonBox height="h-12" className="mt-4" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

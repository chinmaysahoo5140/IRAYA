import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { getMyProfile, updateMyProfile } from "@/lib/profile.functions";
import { SkeletonLine } from "@/component/skeletons/SkeletonLine";
import { SkeletonBox } from "@/component/skeletons/SkeletonBox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/account/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((profile) => {
        if (profile) {
          setFullName(profile.full_name ?? "");
          setEmail(profile.email ?? "");
          setPhone(profile.phone ?? "");
        }
      })
      .catch(() => toast.error("Failed to load profile details."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await updateMyProfile({ data: { full_name: fullName, phone: phone || undefined } });
      toast.success("Profile saved successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile.");
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                  disabled
                  className="w-full bg-transparent hairline-b py-2 text-sm opacity-50 cursor-not-allowed"
                />
                <span className="text-[10px] text-mute mt-1 block">Email cannot be changed here.</span>
              </label>
            </div>

            <div>
              <label className="block mb-2">
                <span className="block text-[11px] tracking-wide-2 uppercase text-mute">Phone Number</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+919876543210"
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

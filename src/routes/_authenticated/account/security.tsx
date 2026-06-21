import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { PasswordInput } from "@/component/ui/password-input";
import { 
  get2faStatusServerFn, 
  setup2faServerFn, 
  confirm2faServerFn, 
  changePasswordServerFn 
} from "@/lib/auth.functions";
import { toast } from "sonner";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/_authenticated/account/security")({
  head: () => ({ meta: [{ title: "Account Security — IRAYA" }] }),
  component: SecurityPage,
});

function SecurityPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const get2faStatus = useServerFn(get2faStatusServerFn);
  const setup2fa = useServerFn(setup2faServerFn);
  const confirm2fa = useServerFn(confirm2faServerFn);
  const changePassword = useServerFn(changePasswordServerFn);

  const [setupStep, setSetupStep] = useState<"idle" | "verify" | "backup">("idle");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const { data: twoFaStatus, isLoading: loadingStatus } = useQuery({
    queryKey: ["2fa-status"],
    queryFn: () => get2faStatus(),
  });

  const handleStartSetup = async () => {
    setBusy(true);
    try {
      const res = await setup2fa();
      setQrCodeUrl(res.qrUrl);
      setTotpSecret(res.secret);
      setSetupStep("verify");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load 2FA setup");
    } finally {
      setBusy(false);
    }
  };

  const handleVerify2fa = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await confirm2fa({
        data: {
          code: verifyCode,
          secret: totpSecret,
        },
      });
      setBackupCodes(res.backupCodes);
      setSetupStep("backup");
      queryClient.invalidateQueries({ queryKey: ["2fa-status"] });
      toast.success("2FA successfully enabled!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid 2FA code");
    } finally {
      setBusy(false);
    }
  };

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    const confirm = String(fd.get("confirm_password") ?? "");

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setBusy(true);
    try {
      await changePassword({ data: { newPassword: password } });
      toast.success("Password updated successfully.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setBusy(false);
    }
  };

  const is2faEnabled = twoFaStatus?.enabled;

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <section className="pt-32 pb-12 hairline-b">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-[11px] tracking-luxury uppercase text-mute">The Maison</div>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl tracking-luxury">Security settings</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1200px] px-6 grid lg:grid-cols-4 gap-12">
          <aside className="lg:col-span-1">
            <nav className="space-y-3 text-[11px] tracking-luxury uppercase">
              <Link to="/account" className="block text-mute hover:text-charcoal" activeOptions={{ exact: true }}>Orders</Link>
              <Link to="/account/addresses" className="block text-mute hover:text-charcoal">Addresses</Link>
              <Link to="/account/wishlist" className="block text-mute hover:text-charcoal">Wishlist</Link>
              <Link to="/account/security" className="block text-mute hover:text-charcoal" activeProps={{ className: "text-charcoal border-l border-charcoal pl-2" }}>Security & 2FA</Link>
              <Link to="/account/sessions" className="block text-mute hover:text-charcoal">Active Sessions</Link>
              <button onClick={() => router.navigate({ to: "/auth" })} className="block text-mute hover:text-charcoal pt-6 cursor-pointer">
                Sign out
              </button>
            </nav>
          </aside>

          <div className="lg:col-span-3 space-y-12">
            {/* Security Badge */}
            <div className="bg-secondary p-6 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg">Your Security Status</h3>
                <p className="text-mute text-xs mt-1">
                  {is2faEnabled 
                    ? "Two-Factor Authentication is active. Your account has maximum security."
                    : "Add two-factor authentication to protect your account against unauthorized access."
                  }
                </p>
              </div>
              <div className="text-right">
                <span className={`text-[10px] tracking-luxury uppercase px-3 py-1 font-semibold ${is2faEnabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {is2faEnabled ? "High Security Score" : "Action Required"}
                </span>
              </div>
            </div>

            {/* 2FA Configuration Card */}
            <div className="border border-charcoal/10 p-6 space-y-6">
              <h2 className="font-serif text-2xl">Two-Factor Authentication (2FA)</h2>
              
              {loadingStatus ? (
                <p className="text-sm text-mute">Checking 2FA status...</p>
              ) : is2faEnabled ? (
                <div className="text-sm space-y-2 text-green-700">
                  <p>✓ TOTP Two-Factor Authentication is currently enabled.</p>
                  <p className="text-mute text-xs">If you lose your authenticator device, you will need your backup codes to sign in.</p>
                </div>
              ) : setupStep === "idle" ? (
                <div className="space-y-4">
                  <p className="text-sm text-mute">Configure Google Authenticator, Duo, or Authy to receive secure sign-in challenges.</p>
                  <button
                    onClick={handleStartSetup}
                    disabled={busy}
                    className="bg-charcoal text-ivory px-6 py-3 text-[10px] tracking-luxury uppercase hover:bg-gold transition-colors cursor-pointer"
                  >
                    Set up Two-Factor Authentication
                  </button>
                </div>
              ) : setupStep === "verify" ? (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <p className="text-sm text-mute">1. Scan this QR code in your Authenticator app (e.g. Google Authenticator):</p>
                    <div className="bg-white p-2 border border-charcoal/10 w-fit">
                      <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                    </div>
                    <p className="text-xs text-mute font-mono">Secret Key: {totpSecret}</p>
                  </div>
                  <form onSubmit={handleVerify2fa} className="space-y-4">
                    <p className="text-sm text-mute">2. Enter the 6-digit code shown in the app to confirm setup:</p>
                    <label className="block">
                      <span className="block text-[11px] tracking-wide-2 uppercase text-mute mb-2">Verification Code</span>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={busy}
                      className="w-full bg-charcoal text-ivory py-3 text-[10px] tracking-luxury uppercase hover:bg-gold transition-colors cursor-pointer"
                    >
                      {busy ? "Verifying..." : "Confirm & Enable 2FA"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-green-700 font-semibold">✓ 2FA is now enabled! Store these backup codes securely. They will only be shown ONCE:</p>
                  <div className="bg-secondary p-6 font-mono text-sm grid grid-cols-2 gap-2 border border-charcoal/10">
                    {backupCodes.map((code, idx) => (
                      <div key={idx}>{code}</div>
                    ))}
                  </div>
                  <button
                    onClick={() => setSetupStep("idle")}
                    className="border border-charcoal px-6 py-3 text-[10px] tracking-luxury uppercase hover:bg-charcoal hover:text-ivory transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Change Password Card */}
            <div className="border border-charcoal/10 p-6 space-y-6">
              <h2 className="font-serif text-2xl">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <label className="block">
                  <span className="block text-[11px] tracking-wide-2 uppercase text-mute mb-2">New Password</span>
                  <PasswordInput
                    name="password"
                    required
                    autoComplete="new-password"
                  />
                </label>
                <label className="block">
                  <span className="block text-[11px] tracking-wide-2 uppercase text-mute mb-2">Confirm New Password</span>
                  <PasswordInput
                    name="confirm_password"
                    required
                    autoComplete="new-password"
                  />
                </label>
                <button
                  type="submit"
                  disabled={busy}
                  className="bg-charcoal text-ivory px-6 py-3 text-[10px] tracking-luxury uppercase hover:bg-gold transition-colors cursor-pointer"
                >
                  {busy ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

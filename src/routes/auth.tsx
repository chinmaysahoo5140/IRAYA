import { createFileRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { useState, type FormEvent } from "react";
import { Navbar } from "@/component/iraya/Navbar";
import { Footer } from "@/component/iraya/Footer";
import { PasswordInput } from "@/component/ui/password-input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { precheckLogin, recordLogin, precheckSignup } from "@/lib/security.functions";

// Strong password: 8+ chars, upper, lower, digit, special.
const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const Route = createFileRoute("/auth")({
  validateSearch: z
    .object({
      redirect: z
        .string()
        .optional()
        .refine((value) => !value || (value.startsWith("/") && !value.startsWith("//")), {
          message: "redirect must be a relative path",
        }),
    })
    .parse,
  head: () => ({ meta: [{ title: "Sign in — IRAYA" }] }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "phone";

import { signInWithPasswordServerFn, signUpServerFn, verify2faServerFn } from "@/lib/auth.functions";

function AuthPage() {
  const router = useRouter();
  const { redirect } = Route.useSearch();
  const [mode, setMode] = useState<Mode>("signin");
  const [busy, setBusy] = useState(false);
  const [otpStep, setOtpStep] = useState<"phone" | "code">("phone");
  const [phoneVal, setPhoneVal] = useState("");
  const [temp2faToken, setTemp2faToken] = useState<string | null>(null);
  const [twoFaCode, setTwoFaCode] = useState("");
  
  // Normalize with URL constructor to catch CRLF-injection and percent-encoded bypasses
  // that slip past a naive startsWith("/") check.
  const safeRedirect = (() => {
    if (!redirect) return "/account";
    try {
      const url = new URL(redirect, "http://localhost");
      if (url.hostname !== "localhost") return "/account"; // reject any host-relative tricks
      return url.pathname + (url.search || "");
    } catch {
      return "/account";
    }
  })();

  const after = () => router.navigate({ to: safeRedirect });

  async function handleEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      // Honeypot — bots fill all fields. Silently succeed-no-op for humans.
      if (String(fd.get("website") ?? "").length > 0) {
        await new Promise((r) => setTimeout(r, 800));
        return;
      }
      const email = String(fd.get("email"));
      const password = String(fd.get("password"));
      const full_name = String(fd.get("full_name") ?? "");

      if (mode === "signup") {
        if (!STRONG_PASSWORD.test(password)) {
          toast.error("Password must be 8+ chars with upper, lower, number, and special character.");
          return;
        }
        await signUpServerFn({ data: { email, password, full_name } });
        toast.success("Account created successfully. Please sign in.");
        setMode("signin");
      } else {
        const res = await signInWithPasswordServerFn({ data: { email, password } });
        if (res && "mfaRequired" in res && res.mfaRequired) {
          setTemp2faToken(res.tempToken);
          toast.info("2FA Verification Required.");
        } else {
          toast.success("Logged in successfully.");
          after();
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function handle2faSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!temp2faToken) return;
    setBusy(true);
    try {
      await verify2faServerFn({
        data: {
          code: twoFaCode,
          tempToken: temp2faToken,
        },
      });
      toast.success("Authenticated successfully.");
      after();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "2FA verification failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Must match exactly what is registered in both:
          //  - Supabase dashboard → Authentication → URL Configuration → Redirect URLs
          //  - Google Cloud Console → OAuth 2.0 Client → Authorised redirect URIs
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          scopes: "openid email profile",
        },
      });
      if (error) toast.error(error.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function handlePhoneSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneVal }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }
      toast.success("OTP sent successfully to " + phoneVal);
      setOtpStep("code");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setBusy(false);
    }
  }

  async function handlePhoneVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      const code = String(fd.get("code"));
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneVal, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }
      toast.success("Authenticated successfully!");
      await router.invalidate();
      after();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to verify OTP");
    } finally {
      setBusy(false);
    }
  }

  if (temp2faToken) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <div className="text-[11px] tracking-luxury uppercase text-mute">Two Factor Verification</div>
              <h1 className="mt-4 font-serif text-4xl tracking-luxury">Enter Security Code</h1>
            </div>
            <form onSubmit={handle2faSubmit} className="space-y-5">
              <label className="block">
                <span className="block text-[11px] tracking-wide-2 uppercase text-mute mb-2">6-digit TOTP / Backup Code</span>
                <input
                  name="code"
                  type="text"
                  required
                  value={twoFaCode}
                  onChange={(e) => setTwoFaCode(e.target.value)}
                  className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal"
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-charcoal text-ivory py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50"
              >
                {busy ? "Verifying..." : "Verify Code"}
              </button>
              <button
                type="button"
                onClick={() => setTemp2faToken(null)}
                className="w-full text-center text-[10px] tracking-luxury uppercase text-mute hover:text-charcoal mt-2"
              >
                ← Back to Sign In
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="text-[11px] tracking-luxury uppercase text-mute">The Maison</div>
            <h1 className="mt-4 font-serif text-4xl tracking-luxury">
              {mode === "signup" ? "Create account" : mode === "phone" ? "Sign in with phone" : "Sign in"}
            </h1>
          </div>

          {/* Mode tabs */}
          <div className="flex hairline-b text-[11px] tracking-luxury uppercase mb-8">
            {(["signin", "signup", "phone"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setOtpStep("phone"); }}
                className={`flex-1 py-3 ${mode === m ? "text-charcoal border-b-2 border-charcoal -mb-px" : "text-mute"}`}
              >
                {m === "signin" ? "Sign in" : m === "signup" ? "Create" : "Phone"}
              </button>
            ))}
          </div>

          {mode !== "phone" ? (
            <>
              <form onSubmit={handleEmail} className="space-y-5">
                {mode === "signup" && (
                  <Input name="full_name" label="Full name" required />
                )}
                <Input name="email" label="Email" type="email" required />
                <Input
                  name="password"
                  label="Password"
                  type="password"
                  required
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
                {/* Honeypot — hidden from humans, bots fill it */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }}
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-charcoal text-ivory py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50"
                >
                  {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3 text-[10px] tracking-luxury uppercase text-mute">
                <span className="flex-1 hairline-b" /> or <span className="flex-1 hairline-b" />
              </div>

              <button
                onClick={handleGoogle}
                disabled={busy}
                className="w-full border border-charcoal py-4 text-[11px] tracking-luxury uppercase hover:bg-charcoal hover:text-ivory transition-colors disabled:opacity-50"
              >
                Continue with Google
              </button>
            </>
          ) : otpStep === "phone" ? (
            <form onSubmit={handlePhoneSend} className="space-y-5">
              <label className="block">
                <span className="block text-[11px] tracking-wide-2 uppercase text-mute mb-2">Phone (with country code, e.g. +91…)</span>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={phoneVal}
                  onChange={(e) => setPhoneVal(e.target.value)}
                  placeholder="+919876543210"
                  className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal"
                />
              </label>
              <button type="submit" disabled={busy} className="w-full bg-charcoal text-ivory py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50">
                {busy ? "Sending…" : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePhoneVerify} className="space-y-5">
              <Input name="code" label="6-digit code" required />
              <button type="submit" disabled={busy} className="w-full bg-charcoal text-ivory py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50">
                {busy ? "Verifying…" : "Verify"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Input({ 
  name, 
  label, 
  type = "text", 
  required = false, 
  autoComplete 
}: { 
  name: string; 
  label: string; 
  type?: string; 
  required?: boolean; 
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] tracking-wide-2 uppercase text-mute mb-2">{label}</span>
      {type === "password" ? (
        <PasswordInput
          name={name}
          required={required}
          autoComplete={autoComplete}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          className="w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal"
        />
      )}
    </label>
  );
}

import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { N as Navbar, F as Footer } from "./Footer-Demn3Ovo.mjs";
import { a as Route$p, v as verify2faServerFn, s as signUpServerFn, b as signInWithPasswordServerFn, d as supabase } from "./router-BoWhvYts.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/vercel__analytics.mjs";
import "./server-CP7xr6_V.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-Bh4u3KvU.mjs";
import "node:crypto";
import "../_libs/zod.mjs";
import "../_libs/goober.mjs";
const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
function AuthPage() {
  const router = useRouter();
  const {
    redirect
  } = Route$p.useSearch();
  const [mode, setMode] = reactExports.useState("signin");
  const [busy, setBusy] = reactExports.useState(false);
  const [otpStep, setOtpStep] = reactExports.useState("phone");
  const [phoneVal, setPhoneVal] = reactExports.useState("");
  const [temp2faToken, setTemp2faToken] = reactExports.useState(null);
  const [twoFaCode, setTwoFaCode] = reactExports.useState("");
  const safeRedirect = (() => {
    if (!redirect) return "/account";
    try {
      const url = new URL(redirect, "http://localhost");
      if (url.hostname !== "localhost") return "/account";
      return url.pathname + (url.search || "");
    } catch {
      return "/account";
    }
  })();
  const after = () => router.navigate({
    to: safeRedirect
  });
  async function handleEmail(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
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
        await signUpServerFn({
          data: {
            email,
            password,
            full_name
          }
        });
        toast.success("Account created successfully. Please sign in.");
        setMode("signin");
      } else {
        const res = await signInWithPasswordServerFn({
          data: {
            email,
            password
          }
        });
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
  async function handle2faSubmit(e) {
    e.preventDefault();
    if (!temp2faToken) return;
    setBusy(true);
    try {
      await verify2faServerFn({
        data: {
          code: twoFaCode,
          tempToken: temp2faToken
        }
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
      const {
        error
      } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Must match exactly what is registered in both:
          //  - Supabase dashboard → Authentication → URL Configuration → Redirect URLs
          //  - Google Cloud Console → OAuth 2.0 Client → Authorised redirect URIs
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent"
          },
          scopes: "openid email profile"
        }
      });
      if (error) toast.error(error.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }
  async function handlePhoneSend(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithOtp({
        phone: phoneVal
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("OTP sent successfully to " + phoneVal);
        setOtpStep("code");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setBusy(false);
    }
  }
  async function handlePhoneVerify(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      const code = String(fd.get("code"));
      const {
        error
      } = await supabase.auth.verifyOtp({
        phone: phoneVal,
        token: code,
        type: "sms"
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Authenticated successfully!");
        after();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to verify OTP");
    } finally {
      setBusy(false);
    }
  }
  if (temp2faToken) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex items-center justify-center px-6 pt-32 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "Two Factor Verification" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-4xl tracking-luxury", children: "Enter Security Code" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handle2faSubmit, className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute mb-2", children: "6-digit TOTP / Backup Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "code", type: "text", required: true, value: twoFaCode, onChange: (e) => setTwoFaCode(e.target.value), className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "w-full bg-charcoal text-ivory py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50", children: busy ? "Verifying..." : "Verify Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setTemp2faToken(null), className: "w-full text-center text-[10px] tracking-luxury uppercase text-mute hover:text-charcoal mt-2", children: "← Back to Sign In" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex items-center justify-center px-6 pt-32 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "The Maison" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-4xl tracking-luxury", children: mode === "signup" ? "Create account" : mode === "phone" ? "Sign in with phone" : "Sign in" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex hairline-b text-[11px] tracking-luxury uppercase mb-8", children: ["signin", "signup", "phone"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        setMode(m);
        setOtpStep("phone");
      }, className: `flex-1 py-3 ${mode === m ? "text-charcoal border-b-2 border-charcoal -mb-px" : "text-mute"}`, children: m === "signin" ? "Sign in" : m === "signup" ? "Create" : "Phone" }, m)) }),
      mode !== "phone" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEmail, className: "space-y-5", children: [
          mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "full_name", label: "Full name", required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "email", label: "Email", type: "email", required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "password", label: "Password", type: "password", required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", name: "website", tabIndex: -1, autoComplete: "off", "aria-hidden": "true", style: {
            position: "absolute",
            left: "-10000px",
            width: 1,
            height: 1,
            opacity: 0
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "w-full bg-charcoal text-ivory py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50", children: busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-6 flex items-center gap-3 text-[10px] tracking-luxury uppercase text-mute", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 hairline-b" }),
          " or ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 hairline-b" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleGoogle, disabled: busy, className: "w-full border border-charcoal py-4 text-[11px] tracking-luxury uppercase hover:bg-charcoal hover:text-ivory transition-colors disabled:opacity-50", children: "Continue with Google" })
      ] }) : otpStep === "phone" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handlePhoneSend, className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute mb-2", children: "Phone (with country code, e.g. +91…)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "phone", type: "tel", required: true, value: phoneVal, onChange: (e) => setPhoneVal(e.target.value), placeholder: "+919876543210", className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "w-full bg-charcoal text-ivory py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50", children: busy ? "Sending…" : "Send OTP" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handlePhoneVerify, className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "code", label: "6-digit code", required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "w-full bg-charcoal text-ivory py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50", children: busy ? "Verifying…" : "Verify" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Input({
  name,
  label,
  type = "text",
  required = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute mb-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name, type, required, className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal" })
  ] });
}
export {
  AuthPage as component
};

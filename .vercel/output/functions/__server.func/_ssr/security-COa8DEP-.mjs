import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, b as useQuery } from "../_libs/tanstack__react-query.mjs";
import { N as Navbar, F as Footer } from "./Footer-Demn3Ovo.mjs";
import { B as get2faStatusServerFn, C as setup2faServerFn, D as confirm2faServerFn, E as changePasswordServerFn } from "./router-BoWhvYts.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/lucide-react.mjs";
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
function SecurityPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const get2faStatus = useServerFn(get2faStatusServerFn);
  const setup2fa = useServerFn(setup2faServerFn);
  const confirm2fa = useServerFn(confirm2faServerFn);
  const changePassword = useServerFn(changePasswordServerFn);
  const [setupStep, setSetupStep] = reactExports.useState("idle");
  const [qrCodeUrl, setQrCodeUrl] = reactExports.useState("");
  const [totpSecret, setTotpSecret] = reactExports.useState("");
  const [verifyCode, setVerifyCode] = reactExports.useState("");
  const [backupCodes, setBackupCodes] = reactExports.useState([]);
  const [busy, setBusy] = reactExports.useState(false);
  const {
    data: twoFaStatus,
    isLoading: loadingStatus
  } = useQuery({
    queryKey: ["2fa-status"],
    queryFn: () => get2faStatus()
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
  const handleVerify2fa = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await confirm2fa({
        data: {
          code: verifyCode,
          secret: totpSecret
        }
      });
      setBackupCodes(res.backupCodes);
      setSetupStep("backup");
      queryClient.invalidateQueries({
        queryKey: ["2fa-status"]
      });
      toast.success("2FA successfully enabled!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid 2FA code");
    } finally {
      setBusy(false);
    }
  };
  const handleChangePassword = async (e) => {
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
      await changePassword({
        data: {
          newPassword: password
        }
      });
      toast.success("Password updated successfully.");
      e.target.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setBusy(false);
    }
  };
  const is2faEnabled = twoFaStatus?.enabled;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-32 pb-12 hairline-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "The Maison" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-4xl md:text-5xl tracking-luxury", children: "Security settings" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] px-6 grid lg:grid-cols-4 gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "space-y-3 text-[11px] tracking-luxury uppercase", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", className: "block text-mute hover:text-charcoal", activeOptions: {
          exact: true
        }, children: "Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account/addresses", className: "block text-mute hover:text-charcoal", children: "Addresses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account/wishlist", className: "block text-mute hover:text-charcoal", children: "Wishlist" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account/security", className: "block text-mute hover:text-charcoal", activeProps: {
          className: "text-charcoal border-l border-charcoal pl-2"
        }, children: "Security & 2FA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account/sessions", className: "block text-mute hover:text-charcoal", children: "Active Sessions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => router.navigate({
          to: "/auth"
        }), className: "block text-mute hover:text-charcoal pt-6 cursor-pointer", children: "Sign out" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3 space-y-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary p-6 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg", children: "Your Security Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-mute text-xs mt-1", children: is2faEnabled ? "Two-Factor Authentication is active. Your account has maximum security." : "Add two-factor authentication to protect your account against unauthorized access." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] tracking-luxury uppercase px-3 py-1 font-semibold ${is2faEnabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`, children: is2faEnabled ? "High Security Score" : "Action Required" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-charcoal/10 p-6 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Two-Factor Authentication (2FA)" }),
          loadingStatus ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-mute", children: "Checking 2FA status..." }) : is2faEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-2 text-green-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "✓ TOTP Two-Factor Authentication is currently enabled." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-mute text-xs", children: "If you lose your authenticator device, you will need your backup codes to sign in." })
          ] }) : setupStep === "idle" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-mute", children: "Configure Google Authenticator, Duo, or Authy to receive secure sign-in challenges." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleStartSetup, disabled: busy, className: "bg-charcoal text-ivory px-6 py-3 text-[10px] tracking-luxury uppercase hover:bg-gold transition-colors cursor-pointer", children: "Set up Two-Factor Authentication" })
          ] }) : setupStep === "verify" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-8 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-mute", children: "1. Scan this QR code in your Authenticator app (e.g. Google Authenticator):" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-2 border border-charcoal/10 w-fit", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: qrCodeUrl, alt: "2FA QR Code", className: "w-48 h-48" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-mute font-mono", children: [
                "Secret Key: ",
                totpSecret
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleVerify2fa, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-mute", children: "2. Enter the 6-digit code shown in the app to confirm setup:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute mb-2", children: "Verification Code" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, maxLength: 6, value: verifyCode, onChange: (e) => setVerifyCode(e.target.value), className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "w-full bg-charcoal text-ivory py-3 text-[10px] tracking-luxury uppercase hover:bg-gold transition-colors cursor-pointer", children: busy ? "Verifying..." : "Confirm & Enable 2FA" })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-green-700 font-semibold", children: "✓ 2FA is now enabled! Store these backup codes securely. They will only be shown ONCE:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-secondary p-6 font-mono text-sm grid grid-cols-2 gap-2 border border-charcoal/10", children: backupCodes.map((code, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: code }, idx)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSetupStep("idle"), className: "border border-charcoal px-6 py-3 text-[10px] tracking-luxury uppercase hover:bg-charcoal hover:text-ivory transition-colors cursor-pointer", children: "Done" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-charcoal/10 p-6 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Change Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleChangePassword, className: "space-y-4 max-w-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute mb-2", children: "New Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "password", type: "password", required: true, className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute mb-2", children: "Confirm New Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "confirm_password", type: "password", required: true, className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "bg-charcoal text-ivory px-6 py-3 text-[10px] tracking-luxury uppercase hover:bg-gold transition-colors cursor-pointer", children: busy ? "Updating..." : "Update Password" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  SecurityPage as component
};

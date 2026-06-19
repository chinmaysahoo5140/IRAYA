import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { P as ProtectedRoute, S as SkeletonLine, a as SkeletonBox, b as api } from "./SkeletonBox-ChIyPPZD.mjs";
import { N as Navbar, F as Footer } from "./Footer-Demn3Ovo.mjs";
import { z as zt } from "../_libs/react-hot-toast.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { n as LoaderCircle } from "../_libs/lucide-react.mjs";
import "../_libs/axios.mjs";
import "../_libs/form-data.mjs";
import "fs";
import "../_libs/combined-stream.mjs";
import "util";
import "stream";
import "../_libs/delayed-stream.mjs";
import "path";
import "http";
import "https";
import "url";
import "crypto";
import "../_libs/mime-types.mjs";
import "../_libs/mime-db.mjs";
import "../_libs/asynckit.mjs";
import "../_libs/es-set-tostringtag.mjs";
import "../_libs/get-intrinsic.mjs";
import "../_libs/es-object-atoms.mjs";
import "../_libs/es-errors.mjs";
import "../_libs/math-intrinsics.mjs";
import "../_libs/gopd.mjs";
import "../_libs/es-define-property.mjs";
import "../_libs/has-symbols.mjs";
import "../_libs/get-proto.mjs";
import "../_libs/dunder-proto.mjs";
import "../_libs/call-bind-apply-helpers.mjs";
import "../_libs/function-bind.mjs";
import "../_libs/hasown.mjs";
import "../_libs/has-tostringtag.mjs";
import "../_libs/https-proxy-agent.mjs";
import "net";
import "tls";
import "assert";
import "../_libs/debug.mjs";
import "../_libs/ms.mjs";
import "tty";
import "../_libs/supports-color.mjs";
import "os";
import "../_libs/has-flag.mjs";
import "../_libs/agent-base.mjs";
import "events";
import "http2";
import "../_libs/follow-redirects.mjs";
import "zlib";
import "../_libs/proxy-from-env.mjs";
import "../_libs/zustand.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "../_libs/isbot.mjs";
import "./router-BoWhvYts.mjs";
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
function ProfilePageWrapper() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileSkeleton, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfilePage, {}) });
}
function ProfilePage() {
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
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
        zt.error("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);
  async function handleSave(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.patch("/users/me", {
        name,
        email,
        phone
      });
      zt.success("Profile saved successfully!");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update profile.";
      zt.error(msg);
    } finally {
      setBusy(false);
    }
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileSkeleton, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen flex flex-col justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-grow pt-32 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-6 fade-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "The Maison" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-4xl tracking-luxury text-charcoal", children: "Edit Profile" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute", children: "Full Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal transition-colors", required: true })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute", children: "Email Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal transition-colors", required: true })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute", children: "Phone Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal transition-colors" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "w-full bg-charcoal text-ivory py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2", children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Save Changes" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function ProfileSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen flex flex-col justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-grow pt-32 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-6 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonLine, { width: "w-24 mx-auto", height: "h-3.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonLine, { width: "w-48 mx-auto", height: "h-8", className: "mt-4" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonLine, { width: "w-24", height: "h-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBox, { height: "h-10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonLine, { width: "w-24", height: "h-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBox, { height: "h-10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonLine, { width: "w-24", height: "h-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBox, { height: "h-10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonBox, { height: "h-12", className: "mt-4" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  ProfilePageWrapper as component
};

import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { P as ProtectedRoute, S as SkeletonLine, a as SkeletonBox, b as api } from "./SkeletonBox-DqO60yEO.js";
import { N as Navbar, F as Footer } from "./Footer-CUv8LSGA.js";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import "axios";
import "zustand";
import "@tanstack/react-router";
import "./router-pa2HfNNz.js";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "sonner";
import "@vercel/analytics/react";
import "./server-C1RKXgFD.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "zod";
import "./auth-middleware-HVhdhqZn.js";
import "node:crypto";
function ProfilePageWrapper() {
  return /* @__PURE__ */ jsx(ProtectedRoute, { fallback: /* @__PURE__ */ jsx(ProfileSkeleton, {}), children: /* @__PURE__ */ jsx(ProfilePage, {}) });
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
  async function handleSave(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.patch("/users/me", {
        name,
        email,
        phone
      });
      toast.success("Profile saved successfully!");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }
  if (loading) {
    return /* @__PURE__ */ jsx(ProfileSkeleton, {});
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-background min-h-screen flex flex-col justify-between", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow pt-32 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-md px-6 fade-up", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "The Maison" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-4 font-serif text-4xl tracking-luxury text-charcoal", children: "Edit Profile" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("label", { className: "block mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute", children: "Full Name" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal transition-colors", required: true })
        ] }) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("label", { className: "block mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute", children: "Email Address" }),
          /* @__PURE__ */ jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal transition-colors", required: true })
        ] }) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("label", { className: "block mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[11px] tracking-wide-2 uppercase text-mute", children: "Phone Number" }),
          /* @__PURE__ */ jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), className: "w-full bg-transparent hairline-b py-2 text-sm focus:outline-none focus:border-charcoal transition-colors" })
        ] }) }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: busy, className: "w-full bg-charcoal text-ivory py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2", children: busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Save Changes" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function ProfileSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "bg-background min-h-screen flex flex-col justify-between", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow pt-32 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-md px-6 space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx(SkeletonLine, { width: "w-24 mx-auto", height: "h-3.5" }),
        /* @__PURE__ */ jsx(SkeletonLine, { width: "w-48 mx-auto", height: "h-8", className: "mt-4" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(SkeletonLine, { width: "w-24", height: "h-3" }),
          /* @__PURE__ */ jsx(SkeletonBox, { height: "h-10" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(SkeletonLine, { width: "w-24", height: "h-3" }),
          /* @__PURE__ */ jsx(SkeletonBox, { height: "h-10" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(SkeletonLine, { width: "w-24", height: "h-3" }),
          /* @__PURE__ */ jsx(SkeletonBox, { height: "h-10" })
        ] }),
        /* @__PURE__ */ jsx(SkeletonBox, { height: "h-12", className: "mt-4" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  ProfilePageWrapper as component
};

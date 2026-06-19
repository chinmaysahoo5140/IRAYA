import { jsxs, jsx } from "react/jsx-runtime";
import { useRouter, Link } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { N as Navbar, F as Footer } from "./Footer-CUv8LSGA.js";
import { y as listMySessions, z as terminateSession, A as terminateAllOtherSessions } from "./router-pa2HfNNz.js";
import { toast } from "sonner";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import "react";
import "lucide-react";
import "@supabase/supabase-js";
import "react-hot-toast";
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
function SessionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fetchSessions = useServerFn(listMySessions);
  const deleteSession = useServerFn(terminateSession);
  const deleteAllOthers = useServerFn(terminateAllOtherSessions);
  const {
    data: sessions,
    isLoading
  } = useQuery({
    queryKey: ["active-sessions"],
    queryFn: () => fetchSessions()
  });
  const terminateMut = useMutation({
    mutationFn: (id) => deleteSession({
      data: {
        id
      }
    }),
    onSuccess: (data, variables) => {
      toast.success("Session terminated.");
      queryClient.invalidateQueries({
        queryKey: ["active-sessions"]
      });
      const current = sessions?.find((s) => s.id === variables);
      if (current?.isCurrent) {
        router.navigate({
          to: "/auth"
        });
      }
    },
    onError: () => toast.error("Could not terminate session.")
  });
  const terminateOthersMut = useMutation({
    mutationFn: () => deleteAllOthers(),
    onSuccess: () => {
      toast.success("All other sessions terminated.");
      queryClient.invalidateQueries({
        queryKey: ["active-sessions"]
      });
    },
    onError: () => toast.error("Could not terminate other sessions.")
  });
  return /* @__PURE__ */ jsxs("div", { className: "bg-background min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-12 hairline-b", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1200px] px-6", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] tracking-luxury uppercase text-mute", children: "The Maison" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-4 font-serif text-4xl md:text-5xl tracking-luxury", children: "Active Sessions" })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1200px] px-6 grid lg:grid-cols-4 gap-12", children: [
      /* @__PURE__ */ jsx("aside", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxs("nav", { className: "space-y-3 text-[11px] tracking-luxury uppercase", children: [
        /* @__PURE__ */ jsx(Link, { to: "/account", className: "block text-mute hover:text-charcoal", activeOptions: {
          exact: true
        }, children: "Orders" }),
        /* @__PURE__ */ jsx(Link, { to: "/account/addresses", className: "block text-mute hover:text-charcoal", children: "Addresses" }),
        /* @__PURE__ */ jsx(Link, { to: "/account/wishlist", className: "block text-mute hover:text-charcoal", children: "Wishlist" }),
        /* @__PURE__ */ jsx(Link, { to: "/account/security", className: "block text-mute hover:text-charcoal", children: "Security & 2FA" }),
        /* @__PURE__ */ jsx(Link, { to: "/account/sessions", className: "block text-mute hover:text-charcoal", activeProps: {
          className: "text-charcoal border-l border-charcoal pl-2"
        }, children: "Active Sessions" }),
        /* @__PURE__ */ jsx("button", { onClick: () => router.navigate({
          to: "/auth"
        }), className: "block text-mute hover:text-charcoal pt-6 cursor-pointer", children: "Sign out" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl", children: "Manage login sessions" }),
          sessions && sessions.length > 1 && /* @__PURE__ */ jsx("button", { onClick: () => terminateOthersMut.mutate(), className: "text-[10px] tracking-luxury uppercase border border-charcoal px-4 py-2 hover:bg-charcoal hover:text-ivory transition-colors cursor-pointer", children: "Log out all other devices" })
        ] }),
        isLoading ? /* @__PURE__ */ jsx("p", { className: "text-mute text-sm", children: "Loading sessions..." }) : !sessions || sessions.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-mute text-sm", children: "No active sessions found." }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: sessions.map((s) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-serif text-lg", children: [
                s.os || "Unknown OS",
                " · ",
                s.browser_name || "Unknown Browser"
              ] }),
              s.isCurrent && /* @__PURE__ */ jsx("span", { className: "text-[9px] tracking-luxury uppercase bg-charcoal text-ivory px-2 py-0.5", children: "Current session" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-mute uppercase tracking-wide-2 mt-1 space-y-0.5", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                "IP Address: ",
                /* @__PURE__ */ jsx("span", { className: "font-mono text-xs text-charcoal", children: s.ip_address || "unknown" })
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                "Location: ",
                /* @__PURE__ */ jsxs("span", { className: "text-charcoal", children: [
                  s.city ? `${s.city}, ` : "",
                  s.country || "unknown"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                "Last Active: ",
                /* @__PURE__ */ jsx("span", { className: "text-charcoal", children: new Date(s.last_active).toLocaleString() })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => terminateMut.mutate(s.id), className: "text-[10px] tracking-luxury uppercase text-red-700 hover:text-red-900 cursor-pointer", children: s.isCurrent ? "Revoke current (Log out)" : "Terminate session" })
        ] }, s.id)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  SessionsPage as component
};

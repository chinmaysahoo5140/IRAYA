import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as createSsrRpc } from "./router-BoWhvYts.mjs";
import { u as useQueryClient, b as useQuery, c as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { c as createServerFn } from "./server-CP7xr6_V.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Bh4u3KvU.mjs";
import "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import { o as objectType, b as booleanType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "node:crypto";
import "../_libs/goober.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const adminSecurityFeed = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("1a6a134719f4b7d428fa66f37db345d640a7d613f26d0d5c860228812597bbb3"));
const exportSecurityLogs = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("17ca8a4339cbb04b419005d658d94f6ad96de94bdd053e2744cf2316606153aa"));
const banIpServerFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  ip: stringType().min(1),
  reason: stringType().optional()
}).parse(input)).handler(createSsrRpc("2e4f317df8bf23d2870c4ea332074504c9569f356035cdcb9a83b33ff9adc18f"));
const unbanIpServerFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  ip: stringType().min(1)
}).parse(input)).handler(createSsrRpc("70930d746d8a8f75bd06c967d8d1fb638cee57d9c00d197d2af2221a22cccda0"));
const lockUserServerFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  email: stringType().email(),
  lock: booleanType()
}).parse(input)).handler(createSsrRpc("4258783d4619a23f44b699b15ef558125dc21b709181a0a2aff93d15a7001a82"));
const terminateSessionServerFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  sessionId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("cff4dae90332bd1231eb60786b6d8342f9fea9ea3fd8cb8e88f0dd0b49a7b83e"));
function SecurityPage() {
  const fetchFeed = useServerFn(adminSecurityFeed);
  const fetchCsv = useServerFn(exportSecurityLogs);
  const banIp = useServerFn(banIpServerFn);
  const unbanIp = useServerFn(unbanIpServerFn);
  const lockUser = useServerFn(lockUserServerFn);
  const terminateSession = useServerFn(terminateSessionServerFn);
  const queryClient = useQueryClient();
  const [banFormIp, setBanFormIp] = reactExports.useState("");
  const [banFormReason, setBanFormReason] = reactExports.useState("");
  const [lockEmail, setLockEmail] = reactExports.useState("");
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-security"],
    queryFn: () => fetchFeed(),
    refetchInterval: 15e3
  });
  const banMutation = useMutation({
    mutationFn: banIp,
    onSuccess: () => {
      setBanFormIp("");
      setBanFormReason("");
      queryClient.invalidateQueries({
        queryKey: ["admin-security"]
      });
    },
    onError: (err) => alert(err.message ?? "Failed to ban IP")
  });
  const unbanMutation = useMutation({
    mutationFn: unbanIp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-security"]
      });
    },
    onError: (err) => alert(err.message ?? "Failed to unban IP")
  });
  const lockMutation = useMutation({
    mutationFn: lockUser,
    onSuccess: () => {
      setLockEmail("");
      alert("User status updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["admin-security"]
      });
    },
    onError: (err) => alert(err.message ?? "Failed to update user lock status")
  });
  const terminateMutation = useMutation({
    mutationFn: terminateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-security"]
      });
    },
    onError: (err) => alert(err.message ?? "Failed to terminate session")
  });
  const handleExport = async () => {
    try {
      const logs = await fetchCsv();
      const headers = ["Timestamp", "Event Type", "Severity", "Email", "IP", "Country", "User Agent", "Details"];
      const csvRows = [headers.join(",")];
      logs.forEach((e) => {
        csvRows.push([e.created_at, e.event_type, e.severity, `"${e.email ?? ""}"`, e.ip ?? "", e.country ?? "", `"${(e.user_agent ?? "").replace(/"/g, '""')}"`, `"${JSON.stringify(e.details ?? {}).replace(/"/g, '""')}"`].join(","));
      });
      const blob = new Blob([csvRows.join("\n")], {
        type: "text/csv"
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", `security_logs_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
      a.click();
    } catch (err) {
      alert("Failed to export logs");
    }
  };
  if (isLoading || !data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-mute", children: "Loading security feed…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-between items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl tracking-luxury mb-2", children: "Security Hardening" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-mute text-sm", children: "Live security feed refreshes every 15 seconds." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleExport, className: "bg-black text-white hover:bg-neutral-800 text-xs uppercase tracking-luxury px-6 py-3 transition-colors", children: "Export Logs to CSV" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "User Account Lockout Controls", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        if (confirm(`Are you sure you want to change lock status for ${lockEmail}?`)) {
          lockMutation.mutate({
            data: {
              email: lockEmail,
              lock: true
            }
          });
        }
      }, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase tracking-luxury text-mute mb-1", children: "User Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: lockEmail, onChange: (e) => setLockEmail(e.target.value), placeholder: "customer@example.com", className: "w-full bg-white border border-neutral-200 px-4 py-2 text-sm focus:outline-none focus:border-black" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "bg-red-700 hover:bg-red-800 text-white text-xs uppercase tracking-luxury px-4 py-2", children: "Lock Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            if (lockEmail) {
              lockMutation.mutate({
                data: {
                  email: lockEmail,
                  lock: false
                }
              });
            }
          }, className: "bg-neutral-800 hover:bg-black text-white text-xs uppercase tracking-luxury px-4 py-2", children: "Unlock Account" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Manually Ban IP Address", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        banMutation.mutate({
          data: {
            ip: banFormIp,
            reason: banFormReason
          }
        });
      }, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase tracking-luxury text-mute mb-1", children: "IP Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: banFormIp, onChange: (e) => setBanFormIp(e.target.value), placeholder: "192.168.1.1", className: "w-full bg-white border border-neutral-200 px-4 py-2 text-sm focus:outline-none focus:border-black" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase tracking-luxury text-mute mb-1", children: "Reason" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: banFormReason, onChange: (e) => setBanFormReason(e.target.value), placeholder: "Suspicious repeated automated hits", className: "w-full bg-white border border-neutral-200 px-4 py-2 text-sm focus:outline-none focus:border-black" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "bg-black text-white hover:bg-neutral-800 text-xs uppercase tracking-luxury px-4 py-2", children: "Add IP Ban" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: `Active User Sessions (${data.activeSessions.length})`, children: data.activeSessions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { children: "No active sessions tracked." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-[10px] tracking-luxury uppercase text-mute", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-neutral-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "User Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "IP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Device / OS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Location" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2", children: "Revoke" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.activeSessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-neutral-100 hover:bg-neutral-50 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-2 font-mono text-xs", children: s.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-2 font-mono text-xs", children: s.ip_address ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-2 pr-2 text-xs", children: [
          s.device_type,
          " · ",
          s.os,
          " (",
          s.browser_name,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-2 text-xs", children: s.city ? `${s.city}, ${s.country}` : s.country ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          if (confirm(`Revoke session for ${s.email}?`)) {
            terminateMutation.mutate({
              data: {
                sessionId: s.id
              }
            });
          }
        }, className: "text-red-700 hover:text-red-900 text-xs uppercase tracking-wider", children: "Terminate" }) })
      ] }, s.id)) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: `Currently Banned IPs (${data.bannedIps.length})`, children: data.bannedIps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { children: "No IPs are currently banned." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-[10px] tracking-luxury uppercase text-mute", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-neutral-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "IP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Reason" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Banned At" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.bannedIps.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-neutral-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 font-mono text-xs", children: b.ip }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-xs", children: b.reason ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-mute text-xs", children: new Date(b.created_at).toLocaleString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          if (confirm(`Lift ban for IP ${b.ip}?`)) {
            unbanMutation.mutate({
              data: {
                ip: b.ip
              }
            });
          }
        }, className: "text-green-700 hover:text-green-900 text-xs uppercase tracking-wider", children: "Unban" }) })
      ] }, b.ip)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: `Top Offending IPs (${data.topIps.length})`, children: data.topIps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { children: "No failed attempts in the last 40 records." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-[10px] tracking-luxury uppercase text-mute", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-neutral-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "IP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Failed attempts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.topIps.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-neutral-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 font-mono", children: r.ip }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2", children: r.count }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setBanFormIp(r.ip);
          setBanFormReason("Too many failed login attempts");
        }, className: "bg-black text-white hover:bg-neutral-800 text-[10px] uppercase tracking-wider px-3 py-1 transition-colors", children: "Ban IP" }) })
      ] }, r.ip)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Recent Security Events", children: data.events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { children: "No events." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-sm", children: data.events.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "border-b border-neutral-100 pb-2 pt-2 flex gap-4 items-baseline", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] uppercase tracking-luxury px-2 py-0.5 ${e.severity === "critical" ? "bg-red-100 text-red-800" : e.severity === "warning" ? "bg-amber-100 text-amber-800" : "bg-neutral-100 text-neutral-800"}`, children: e.severity }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs", children: e.event_type }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-mute text-xs", children: e.email ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-mute text-xs", children: [
        e.ip ?? "—",
        e.country ? ` · ${e.country}` : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-mute text-xs", children: new Date(e.created_at).toLocaleString() })
    ] }, i)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Recent Login Attempts", children: data.attempts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { children: "No attempts yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-[10px] tracking-luxury uppercase text-mute", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-neutral-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Result" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "IP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2", children: "When" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.attempts.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-neutral-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2", children: a.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: a.success ? "text-green-700" : "text-red-700", children: a.success ? "success" : "failed" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 font-mono text-xs", children: a.ip ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right text-mute text-xs", children: new Date(a.created_at).toLocaleString() })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Recent Payment Events", children: data.payments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { children: "No payment events yet. Configure the Razorpay webhook to populate this." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-[10px] tracking-luxury uppercase text-mute", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-neutral-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Event" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2", children: "Payment ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 pl-4", children: "Sig" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2", children: "When" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.payments.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-neutral-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 font-mono text-xs", children: p.event_type }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 font-mono text-xs", children: p.payment_id ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right", children: p.amount ? `${p.currency} ${p.amount}` : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pl-4", children: p.signature_valid === false ? "❌" : p.signature_valid === true ? "✅" : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right text-mute text-xs", children: new Date(p.created_at).toLocaleString() })
      ] }, i)) })
    ] }) })
  ] });
}
function Panel({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-neutral-50 border border-neutral-200 p-6 transition-all hover:shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-xl mb-4 tracking-luxury border-b border-neutral-200 pb-2", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children })
  ] });
}
function Empty({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-mute text-sm", children });
}
export {
  SecurityPage as component
};

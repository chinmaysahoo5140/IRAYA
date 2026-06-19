import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { F as addressesQO, G as addAddress, H as deleteAddress } from "./router-BoWhvYts.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery, u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { N as Navbar, F as Footer } from "./Footer-Demn3Ovo.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/react-hot-toast.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/goober.mjs";
import "../_libs/lucide-react.mjs";
function AddressesPage() {
  const {
    data: addresses
  } = useSuspenseQuery(addressesQO);
  const qc = useQueryClient();
  const addFn = useServerFn(addAddress);
  const delFn = useServerFn(deleteAddress);
  const [busy, setBusy] = reactExports.useState(false);
  async function onAdd(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      await addFn({
        data: {
          full_name: String(fd.get("full_name")),
          phone: String(fd.get("phone")),
          line1: String(fd.get("line1")),
          line2: String(fd.get("line2") ?? ""),
          city: String(fd.get("city")),
          state: String(fd.get("state")),
          pincode: String(fd.get("pincode")),
          country: "India"
        }
      });
      e.currentTarget.reset();
      qc.invalidateQueries({
        queryKey: ["my-addresses"]
      });
      toast.success("Address saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }
  async function onDelete(id) {
    await delFn({
      data: {
        id
      }
    });
    qc.invalidateQueries({
      queryKey: ["my-addresses"]
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-32 pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1000px] px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", className: "text-[11px] tracking-luxury uppercase text-mute hover:text-charcoal", children: "← Back to account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-serif text-3xl md:text-4xl tracking-luxury", children: "Addresses" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid md:grid-cols-2 gap-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] tracking-luxury uppercase text-mute mb-6", children: "Saved" }),
          addresses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-mute text-sm", children: "No saved addresses." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: addresses.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 hairline-b text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-base", children: a.full_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-mute mt-1", children: [
              a.line1,
              a.line2 ? `, ${a.line2}` : "",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              a.city,
              ", ",
              a.state,
              " ",
              a.pincode,
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              a.phone
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onDelete(a.id), className: "mt-3 text-[11px] tracking-luxury uppercase text-mute hover:text-charcoal", children: "Remove" })
          ] }, a.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onAdd, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] tracking-luxury uppercase text-mute mb-6", children: "Add new" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "full_name", label: "Full name", required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "phone", label: "Phone", required: true, type: "tel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "line1", label: "Address", required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "line2", label: "Apt / Suite" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "city", label: "City", required: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "state", label: "State", required: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "pincode", label: "PIN", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "w-full bg-charcoal text-ivory py-4 text-[11px] tracking-luxury uppercase hover:bg-gold transition-colors disabled:opacity-50", children: busy ? "Saving…" : "Save address" })
        ] })
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
  AddressesPage as component
};

import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
function AdminLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "hairline-b bg-charcoal text-ivory", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1400px] px-6 lg:px-10 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-serif text-xl tracking-luxury", children: "IRAYA · Admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-6 text-[11px] tracking-luxury uppercase", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", className: "hover:text-gold", activeOptions: {
          exact: true
        }, children: "Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/products", className: "hover:text-gold", children: "Products" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/orders", className: "hover:text-gold", children: "Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/security", className: "hover:text-gold", children: "Security" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", className: "text-ivory/60 hover:text-ivory", children: "Exit" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-[1400px] px-6 lg:px-10 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
export {
  AdminLayout as component
};

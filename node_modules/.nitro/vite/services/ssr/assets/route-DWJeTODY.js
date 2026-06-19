import { jsxs, jsx } from "react/jsx-runtime";
import { Link, Outlet } from "@tanstack/react-router";
function AdminLayout() {
  return /* @__PURE__ */ jsxs("div", { className: "bg-background min-h-screen", children: [
    /* @__PURE__ */ jsx("header", { className: "hairline-b bg-charcoal text-ivory", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] px-6 lg:px-10 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "font-serif text-xl tracking-luxury", children: "IRAYA · Admin" }),
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-6 text-[11px] tracking-luxury uppercase", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin", className: "hover:text-gold", activeOptions: {
          exact: true
        }, children: "Dashboard" }),
        /* @__PURE__ */ jsx(Link, { to: "/admin/products", className: "hover:text-gold", children: "Products" }),
        /* @__PURE__ */ jsx(Link, { to: "/admin/orders", className: "hover:text-gold", children: "Orders" }),
        /* @__PURE__ */ jsx(Link, { to: "/admin/security", className: "hover:text-gold", children: "Security" }),
        /* @__PURE__ */ jsx(Link, { to: "/account", className: "text-ivory/60 hover:text-ivory", children: "Exit" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "mx-auto max-w-[1400px] px-6 lg:px-10 py-12", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
export {
  AdminLayout as component
};

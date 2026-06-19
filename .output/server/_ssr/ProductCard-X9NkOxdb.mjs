import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { f as formatINR } from "./format-Sk5HC8SH.mjs";
function ProductCard({ slug, name, price, image, className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/collection/$slug", params: { slug }, className: `group block ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden aspect-[4/5] bg-secondary hairline-b", children: image ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: image,
        alt: name,
        loading: "lazy",
        width: 1024,
        height: 1280,
        className: "img-hover h-full w-full object-cover"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full bg-secondary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg", children: name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[12px] tracking-wide-2 text-mute", children: formatINR(price) })
    ] })
  ] });
}
export {
  ProductCard as P
};

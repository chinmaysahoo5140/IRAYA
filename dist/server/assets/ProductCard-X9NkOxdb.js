import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { f as formatINR } from "./format-Sk5HC8SH.js";
function ProductCard({ slug, name, price, image, className = "" }) {
  return /* @__PURE__ */ jsxs(Link, { to: "/collection/$slug", params: { slug }, className: `group block ${className}`, children: [
    /* @__PURE__ */ jsx("div", { className: "overflow-hidden aspect-[4/5] bg-secondary hairline-b", children: image ? /* @__PURE__ */ jsx(
      "img",
      {
        src: image,
        alt: name,
        loading: "lazy",
        width: 1024,
        height: 1280,
        className: "img-hover h-full w-full object-cover"
      }
    ) : /* @__PURE__ */ jsx("div", { className: "h-full w-full bg-secondary" }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "font-serif text-lg", children: name }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-[12px] tracking-wide-2 text-mute", children: formatINR(price) })
    ] })
  ] });
}
export {
  ProductCard as P
};

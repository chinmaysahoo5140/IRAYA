import { jsx, jsxs } from "react/jsx-runtime";
const SplitComponent = () => /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background text-foreground", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
  /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl tracking-luxury mb-4", children: "Completing Sign In" }),
  /* @__PURE__ */ jsx("div", { className: "animate-pulse text-xs tracking-luxury uppercase text-mute", children: "Setting up your session..." })
] }) });
export {
  SplitComponent as component
};

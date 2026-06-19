import { j as jsxRuntimeExports } from "../_libs/react.mjs";
const SplitErrorComponent = ({
  error
}) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-mute", children: [
  "Couldn't load page: ",
  error.message
] }) });
export {
  SplitErrorComponent as errorComponent
};

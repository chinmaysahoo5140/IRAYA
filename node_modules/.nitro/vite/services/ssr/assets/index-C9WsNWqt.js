import { jsx, jsxs } from "react/jsx-runtime";
const SplitErrorComponent = ({
  error
}) => /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center p-6 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-mute", children: [
  "Couldn't load page: ",
  error.message
] }) });
export {
  SplitErrorComponent as errorComponent
};

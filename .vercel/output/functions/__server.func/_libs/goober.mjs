let e = { data: "" }, t = (t2) => {
  if ("object" == typeof window) {
    let e2 = (t2 ? t2.querySelector("#_goober") : window._goober) || Object.assign(document.createElement("style"), { innerHTML: " ", id: "_goober" });
    return e2.nonce = window.__nonce__, e2.parentNode || (t2 || document.head).appendChild(e2), e2.firstChild;
  }
  return t2 || e;
}, a = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g, l = /\/\*[^]*?\*\/|  +/g, n = /\n+/g, o = (e2, t2) => {
  let r = "", a2 = "", l2 = "";
  for (let n2 in e2) {
    let c2 = e2[n2];
    "@" == n2[0] ? "i" == n2[1] ? r = n2 + " " + c2 + ";" : a2 += "f" == n2[1] ? o(c2, n2) : n2 + "{" + o(c2, "k" == n2[1] ? "" : t2) + "}" : "object" == typeof c2 ? a2 += o(c2, t2 ? t2.replace(/([^,])+/g, (e3) => n2.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g, (t3) => /&/.test(t3) ? t3.replace(/&/g, e3) : e3 ? e3 + " " + t3 : t3)) : n2) : null != c2 && (n2 = "-" == n2[1] ? n2 : n2.replace(/[A-Z]/g, "-$&").toLowerCase(), l2 += o.p ? o.p(n2, c2) : n2 + ":" + c2 + ";");
  }
  return r + (t2 && l2 ? t2 + "{" + l2 + "}" : l2) + a2;
}, c = {}, i = (e2) => {
  if ("object" == typeof e2) {
    let t2 = "";
    for (let r in e2) t2 += r + i(e2[r]);
    return t2;
  }
  return e2;
}, s = (e2, t2, r, s2, p2) => {
  let u2 = i(e2), d2 = c[u2] || (c[u2] = ((e3) => {
    let t3 = 0, r2 = 11;
    for (; t3 < e3.length; ) r2 = 101 * r2 + e3.charCodeAt(t3++) >>> 0;
    return "go" + r2;
  })(u2));
  if (!c[d2]) {
    let t3 = u2 !== e2 ? e2 : ((e3) => {
      let t4, r2, o2 = [{}];
      for (; t4 = a.exec(e3.replace(l, "")); ) t4[4] ? o2.shift() : t4[3] ? (r2 = t4[3].replace(n, " ").trim(), o2.unshift(o2[0][r2] = o2[0][r2] || {})) : o2[0][t4[1]] = t4[2].replace(n, " ").trim();
      return o2[0];
    })(e2);
    c[d2] = o(p2 ? { ["@keyframes " + d2]: t3 } : t3, r ? "" : "." + d2);
  }
  let f2 = r && c.g;
  return r && (c.g = c[d2]), ((e3, t3, r2, a2) => {
    a2 ? t3.data = t3.data.replace(a2, e3) : -1 === t3.data.indexOf(e3) && (t3.data = r2 ? e3 + t3.data : t3.data + e3);
  })(c[d2], t2, s2, f2), d2;
}, p = (e2, t2, r) => e2.reduce((e3, a2, l2) => {
  let n2 = t2[l2];
  if (n2 && n2.call) {
    let e4 = n2(r), t3 = e4 && e4.props && e4.props.className || /^go/.test(e4) && e4;
    n2 = t3 ? "." + t3 : e4 && "object" == typeof e4 ? e4.props ? "" : o(e4, "") : false === e4 ? "" : e4;
  }
  return e3 + a2 + (null == n2 ? "" : n2);
}, "");
function u(e2) {
  let r = this || {}, a2 = e2.call ? e2(r.p) : e2;
  return s(a2.unshift ? a2.raw ? p(a2, [].slice.call(arguments, 1), r.p) : a2.reduce((e3, t2) => Object.assign(e3, t2 && t2.call ? t2(r.p) : t2), {}) : a2, t(r.target), r.g, r.o, r.k);
}
let d, f, g;
u.bind({ g: 1 });
let h = u.bind({ k: 1 });
function m(e2, t2, r, a2) {
  o.p = t2, d = e2, f = r, g = a2;
}
function w(e2, t2) {
  let r = this || {};
  return function() {
    let a2 = arguments;
    function l2(n2, o2) {
      let c2 = Object.assign({}, n2), i2 = c2.className || l2.className;
      r.p = Object.assign({ theme: f && f() }, c2), r.o = /go\d/.test(i2), c2.className = u.apply(r, a2) + (i2 ? " " + i2 : "");
      let s2 = e2;
      return e2[0] && (s2 = c2.as || e2, delete c2.as), g && s2[0] && g(c2), d(s2, c2);
    }
    return t2 ? t2(l2) : l2;
  };
}
export {
  h,
  m,
  u,
  w
};

import require$$1 from "crypto";
var scmpCompare;
var hasRequiredScmpCompare;
function requireScmpCompare() {
  if (hasRequiredScmpCompare) return scmpCompare;
  hasRequiredScmpCompare = 1;
  scmpCompare = function scmpCompare2(a, b) {
    const len = a.length;
    let result = 0;
    for (let i = 0; i < len; ++i) {
      result |= a[i] ^ b[i];
    }
    return result === 0;
  };
  return scmpCompare;
}
var scmp;
var hasRequiredScmp;
function requireScmp() {
  if (hasRequiredScmp) return scmp;
  hasRequiredScmp = 1;
  const crypto = require$$1;
  const scmpCompare2 = requireScmpCompare();
  scmp = function scmp2(a, b) {
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
      throw new Error("Both scmp args must be Buffers");
    }
    if (a.length !== b.length) {
      return false;
    }
    if (crypto.timingSafeEqual) {
      return crypto.timingSafeEqual(a, b);
    }
    return scmpCompare2(a, b);
  };
  return scmp;
}
export {
  requireScmp as r
};

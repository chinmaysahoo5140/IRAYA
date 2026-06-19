globalThis.__nitro_main__ = import.meta.url;
import { N as NodeResponse, s as serve } from "./_libs/srvx.mjs";
import { d as defineHandler, H as HTTPError, a as toEventHandler, b as defineLazyEventHandler, c as H3Core } from "./_libs/h3.mjs";
import { d as decodePath, w as withLeadingSlash, a as withoutTrailingSlash, j as joinURL } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "./_libs/rou3.mjs";
function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const headers = ((m) => function headersRouteRule(event) {
  for (const [key2, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key2, value);
  }
});
const assets = {
  "/favicon.png": {
    "type": "image/png",
    "etag": '"83dd-tjVW1BFY7/vE8ILCiNZn7vhknYw"',
    "mtime": "2026-06-18T09:04:25.399Z",
    "size": 33757,
    "path": "../public/favicon.png"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": '"42-jrRKlCUWxnyWY7Zu7S0KbwwRKXY"',
    "mtime": "2026-06-18T07:56:34.166Z",
    "size": 66,
    "path": "../public/robots.txt"
  },
  "/assets/about-oNNXmY89.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5bf-w4r3devVc5di9EzCLcx5LonQKj4"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 1471,
    "path": "../public/assets/about-oNNXmY89.js"
  },
  "/assets/addresses-BJyf0Tn-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d4c-S51ekT4Sm09dahnTZls+OMLqSYQ"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 3404,
    "path": "../public/assets/addresses-BJyf0Tn-.js"
  },
  "/assets/arrow-right-DCkISwRK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b1-xkN44qXHPUNKzUYjfAvjZcXndLw"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 177,
    "path": "../public/assets/arrow-right-DCkISwRK.js"
  },
  "/assets/cart-Hr670Rvf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1074-quegy7SJROftcwOtimtXpk3+PJk"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 4212,
    "path": "../public/assets/cart-Hr670Rvf.js"
  },
  "/assets/auth-BMH22VIi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1cff-88YRlvQ6Ado5JhIn8cfK3x/5R6c"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 7423,
    "path": "../public/assets/auth-BMH22VIi.js"
  },
  "/assets/auth.callback-BFGfbf0L.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1cb-dsc8rLqxXwEEKkz1s9nSh4Vvy1k"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 459,
    "path": "../public/assets/auth.callback-BFGfbf0L.js"
  },
  "/assets/check-DO8y9SOz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"83-QJa5tDFPJ1jygF+OYa6waaE90fk"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 131,
    "path": "../public/assets/check-DO8y9SOz.js"
  },
  "/assets/checkout-BRETPA-n.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1a55-VuN7IthQ4Zmj4CsbIqx/D4ZvtBg"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 6741,
    "path": "../public/assets/checkout-BRETPA-n.js"
  },
  "/assets/checkout.success-Cl1CA35r.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"696-gPuu1izbdgmJCFiORsGbFd+YRUE"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 1686,
    "path": "../public/assets/checkout.success-Cl1CA35r.js"
  },
  "/assets/collection-DZ3Xj9nA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a0d-599OcZZHBYUY1xTs+QBcwJ484Vc"',
    "mtime": "2026-06-19T11:51:23.000Z",
    "size": 2573,
    "path": "../public/assets/collection-DZ3Xj9nA.js"
  },
  "/assets/collection-DzpKXOAc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"112-asajjNvdCfJZ3rCIb/m5myWFl6g"',
    "mtime": "2026-06-19T11:51:23.000Z",
    "size": 274,
    "path": "../public/assets/collection-DzpKXOAc.js"
  },
  "/assets/collection._slug-CE1K9jBb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f2-PsqzrMgV8ETwoVZRZ0+lRNZNMYM"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 242,
    "path": "../public/assets/collection._slug-CE1K9jBb.js"
  },
  "/assets/collection._slug-CIDPvAnm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f7-zwVUzrC+rClv8WkfFvm5lwMF0ig"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 247,
    "path": "../public/assets/collection._slug-CIDPvAnm.js"
  },
  "/assets/contact-CaYcEZTh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"881-R36jvMYV1zrv+BBKKf5UDwyjkXo"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 2177,
    "path": "../public/assets/contact-CaYcEZTh.js"
  },
  "/assets/createLucideIcon-BhtImS5k.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4b2-m2YTHEZIaInlrpbWQwCd701YaNs"',
    "mtime": "2026-06-19T11:51:23.002Z",
    "size": 1202,
    "path": "../public/assets/createLucideIcon-BhtImS5k.js"
  },
  "/assets/collection._slug-Cu7IkOuT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1010-ZhRl4AZsHdoaW2x81zzL/UNOepc"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 4112,
    "path": "../public/assets/collection._slug-Cu7IkOuT.js"
  },
  "/assets/dashboard-BaBiJFgR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"176a-0aC3T15FTpdBx7ElxR9vRFfDmKA"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 5994,
    "path": "../public/assets/dashboard-BaBiJFgR.js"
  },
  "/assets/faqs-1jSbTVM8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6ea-F1OLyUNRet3FRMOk3bTxAyieK4A"',
    "mtime": "2026-06-19T11:51:23.000Z",
    "size": 1770,
    "path": "../public/assets/faqs-1jSbTVM8.js"
  },
  "/assets/Footer-Ctr0MF8B.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2597-9CdA6fwfucK6Z/5yfpnEkhLdOGg"',
    "mtime": "2026-06-19T11:51:23.002Z",
    "size": 9623,
    "path": "../public/assets/Footer-Ctr0MF8B.js"
  },
  "/assets/format-D-FacifJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c9-P+FKDtgWCv/wHqXOMPzUhPzGpXI"',
    "mtime": "2026-06-19T11:51:23.002Z",
    "size": 201,
    "path": "../public/assets/format-D-FacifJ.js"
  },
  "/assets/index-CJWXWhcK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"bf7-xkU3pTKwih6ZIKWcD+5eAX6YzN4"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 3063,
    "path": "../public/assets/index-CJWXWhcK.js"
  },
  "/assets/index-BbjDy_Pd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"31d-Di8fQRfun2+hJ8LupDt+j2hdXpE"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 797,
    "path": "../public/assets/index-BbjDy_Pd.js"
  },
  "/assets/index-D0iUIw8t.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a7911-rJxgMxL9mkCd0i6Nrk0X94JU/xM"',
    "mtime": "2026-06-19T11:51:23.002Z",
    "size": 686353,
    "path": "../public/assets/index-D0iUIw8t.js"
  },
  "/assets/index-l9_J1qCf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"18b4-/zQh70bMnPBSNhkjNj1dPTbtY7U"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 6324,
    "path": "../public/assets/index-l9_J1qCf.js"
  },
  "/assets/index-qd-IVkuQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10c-2+oorinqCypWdPtmxpVKZ6he/P4"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 268,
    "path": "../public/assets/index-qd-IVkuQ.js"
  },
  "/assets/map-pin-h-iS36D_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10a-tPuwlakGazYBYVkh0r0he03XA8g"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 266,
    "path": "../public/assets/map-pin-h-iS36D_.js"
  },
  "/assets/orders-Cm7iYN5B.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f81-Qbk5KUWXpsqa9xAsKm2NJn0vHRw"',
    "mtime": "2026-06-19T11:51:23.002Z",
    "size": 3969,
    "path": "../public/assets/orders-Cm7iYN5B.js"
  },
  "/assets/privacy-DwYzQ6Ge.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"612-bNsvh4r0SmKX57bFO3Kq8HMQW/o"',
    "mtime": "2026-06-19T11:51:23.000Z",
    "size": 1554,
    "path": "../public/assets/privacy-DwYzQ6Ge.js"
  },
  "/assets/orders-DeBjwbNV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"149f-xa3xuLvjj/4mW7gSFYk7LNyaxo8"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 5279,
    "path": "../public/assets/orders-DeBjwbNV.js"
  },
  "/assets/plus-tzYfEsEg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a5-CPsG7zaCirc6W1c9xR7xMHsqEoc"',
    "mtime": "2026-06-19T11:51:23.002Z",
    "size": 165,
    "path": "../public/assets/plus-tzYfEsEg.js"
  },
  "/assets/ProductCard-BF5qXL_h.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2cd-ydU26Cu/JhWhGcx6gMz2fTvp/mE"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 717,
    "path": "../public/assets/ProductCard-BF5qXL_h.js"
  },
  "/assets/products-B-IdSFz3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1f86-m6yspO9VsRARVRgRE21I8HmmIaI"',
    "mtime": "2026-06-19T11:51:23.002Z",
    "size": 8070,
    "path": "../public/assets/products-B-IdSFz3.js"
  },
  "/assets/profile-RPLahFCM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f47-Yyzmvh9zlGYFIhU/Xc2xdSrkTY0"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 3911,
    "path": "../public/assets/profile-RPLahFCM.js"
  },
  "/assets/returns-CkBzp3Wl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"57d-72kOCPV92TKWCQUmUyvuH/IwPew"',
    "mtime": "2026-06-19T11:51:23.000Z",
    "size": 1405,
    "path": "../public/assets/returns-CkBzp3Wl.js"
  },
  "/assets/route-B2x1jZF3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"41d-VcFEHVqsMbXhR0FXnkhZpyImtK0"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 1053,
    "path": "../public/assets/route-B2x1jZF3.js"
  },
  "/assets/route-BY1RdGTJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5f-mQ6lnHPiaM5pEopZMUYtDuQPrOY"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 95,
    "path": "../public/assets/route-BY1RdGTJ.js"
  },
  "/assets/security-BLKYEkFd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1d57-S6MQpnla+KxJbjcJFqCPKlFKxkg"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 7511,
    "path": "../public/assets/security-BLKYEkFd.js"
  },
  "/assets/security-CZFaCD3N.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"309e-3Y1Dgs0DQCFs+4888UPGlB5rBtI"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 12446,
    "path": "../public/assets/security-CZFaCD3N.js"
  },
  "/assets/sessions-CFsr8SbN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10de-U1TGugVACFUEv5GWrR+DaJEA2cg"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 4318,
    "path": "../public/assets/sessions-CFsr8SbN.js"
  },
  "/assets/terms-QcKLtmqB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"591-A7vEHatZ0gfKwmTlJeaw6LP18nQ"',
    "mtime": "2026-06-19T11:51:23.000Z",
    "size": 1425,
    "path": "../public/assets/terms-QcKLtmqB.js"
  },
  "/assets/SkeletonBox-DIA0i8rF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"bd70-MZAy/td/AADU4KnNFd9zZz6QHKE"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 48496,
    "path": "../public/assets/SkeletonBox-DIA0i8rF.js"
  },
  "/assets/track-DQTTK1yh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e8e-cUmfMUwd4bxKgqBD5J+R3Q6E6eM"',
    "mtime": "2026-06-19T11:51:23.000Z",
    "size": 3726,
    "path": "../public/assets/track-DQTTK1yh.js"
  },
  "/assets/truck-UFjOIBcJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"19d-UoTLGCuQhfwzWRv0Aw7q5UxbUMo"',
    "mtime": "2026-06-19T11:51:23.002Z",
    "size": 413,
    "path": "../public/assets/truck-UFjOIBcJ.js"
  },
  "/assets/useBaseQuery-B3fetabW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"228d-ofLNwVvSvb3CQOJTIv3S/16Ux6E"',
    "mtime": "2026-06-19T11:51:23.002Z",
    "size": 8845,
    "path": "../public/assets/useBaseQuery-B3fetabW.js"
  },
  "/assets/useMutation-BCW67G_z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"89b-M/ecc8TFXNA2QmMbWQhq0BbO1Bo"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 2203,
    "path": "../public/assets/useMutation-BCW67G_z.js"
  },
  "/assets/useQuery-ClSQ8gI6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"64-cTcHo8bb/NPKdhnKLHV8lR/8V8w"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 100,
    "path": "../public/assets/useQuery-ClSQ8gI6.js"
  },
  "/assets/styles-B6WB9hij.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"16e6c-e835ZLi9QuYF8U/8kot/nbqx+GI"',
    "mtime": "2026-06-19T11:51:22.990Z",
    "size": 93804,
    "path": "../public/assets/styles-B6WB9hij.css"
  },
  "/assets/useServerFn-BOjhuQ0p.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"138-LNJOzZ8ZXXsoUn/ogXQoxubsL3U"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 312,
    "path": "../public/assets/useServerFn-BOjhuQ0p.js"
  },
  "/assets/useSuspenseQuery-C0dV4Kuf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ad-asSjFpLA5JkpqRRK9Rr8B/kn6pY"',
    "mtime": "2026-06-19T11:51:23.002Z",
    "size": 173,
    "path": "../public/assets/useSuspenseQuery-C0dV4Kuf.js"
  },
  "/assets/wishlist-CFAtKe-K.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"638-t+k0tOaZb35y9b0yA2cZHlbHUBs"',
    "mtime": "2026-06-19T11:51:23.001Z",
    "size": 1592,
    "path": "../public/assets/wishlist-CFAtKe-K.js"
  },
  "/assets/_id-awrVJ3rh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e5a-6wAZf9DxpJ5/9DqOcmfw16BX59s"',
    "mtime": "2026-06-19T11:51:23.002Z",
    "size": 3674,
    "path": "../public/assets/_id-awrVJ3rh.js"
  },
  "/assets/x-DEl6Jj0w.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a6-Ne/D9zQ7v/kxtbF6dAoei6ICQl0"',
    "mtime": "2026-06-19T11:51:23.002Z",
    "size": 166,
    "path": "../public/assets/x-DEl6Jj0w.js"
  }
};
function readAsset(id) {
  const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
  return promises.readFile(resolve(serverDir, assets[id].path));
}
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
function getAsset(id) {
  return assets[id];
}
const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = {
  gzip: ".gz",
  br: ".br",
  zstd: ".zst"
};
const _obo7eN = defineHandler((event) => {
  if (event.req.method && !METHODS.has(event.req.method)) {
    return;
  }
  let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
  let asset;
  const encodingHeader = event.req.headers.get("accept-encoding") || "";
  const encodings = [...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.res.headers.delete("Cache-Control");
      throw new HTTPError({ status: 404 });
    }
    return;
  }
  if (encodings.length > 1) {
    event.res.headers.append("Vary", "Accept-Encoding");
  }
  const ifNotMatch = event.req.headers.get("if-none-match") === asset.etag;
  if (ifNotMatch) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  const ifModifiedSinceH = event.req.headers.get("if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  if (asset.type) {
    event.res.headers.set("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.headers.has("ETag")) {
    event.res.headers.set("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.headers.has("Last-Modified")) {
    event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.res.headers.has("Content-Encoding")) {
    event.res.headers.set("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.res.headers.has("Content-Length")) {
    event.res.headers.set("Content-Length", asset.size.toString());
  }
  return readAsset(id);
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_bTILHa = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_bTILHa };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const globalMiddleware = [
  toEventHandler(_obo7eN)
].filter(Boolean);
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
function createNitroApp() {
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({ error, context: errorCtx });
      }
    }
  };
  const h3App = createH3App({
    onError(error, event) {
      return errorHandler(error, event);
    }
  });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  return {
    fetch: appHandler,
    h3: h3App,
    hooks: void 0,
    captureError
  };
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~middleware"].push(...globalMiddleware);
  h3App["~getMiddleware"] = (event, route) => {
    const pathname = event.url.pathname;
    const method = event.req.method;
    const middleware = [];
    const routeRules = getRouteRules(method, pathname);
    event.context.routeRules = routeRules?.routeRules;
    if (routeRules?.routeRuleMiddleware.length) {
      middleware.push(...routeRules.routeRuleMiddleware);
    }
    middleware.push(...h3App["~middleware"]);
    if (route?.data?.middleware?.length) {
      middleware.push(...route.data.middleware);
    }
    return middleware;
  };
  return h3App;
}
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
  process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
  process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
const tracingSrvxPlugins = [];
const _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
const port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
const host = process.env.NITRO_HOST || process.env.HOST;
const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
serve({
  port,
  hostname: host,
  tls: cert && key ? {
    cert,
    key
  } : void 0,
  fetch: nitroApp.fetch,
  plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
const nodeServer = {};
export {
  nodeServer as default
};

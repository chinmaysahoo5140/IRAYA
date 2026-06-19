import { QueryClientProvider, useQueryClient, queryOptions, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";
import { Toaster as Toaster$1 } from "sonner";
import { Toaster as Toaster$2 } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { T as TSS_SERVER_FUNCTION, k as getServerFnById, h as createServerFn } from "./server-C1RKXgFD.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-HVhdhqZn.js";
import crypto, { createHmac, timingSafeEqual } from "node:crypto";
const appCss = "/assets/styles-B6WB9hij.css";
const KEY = "iraya.cart.v1";
const Ctx = createContext(null);
function read() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setItems(read());
    setHydrated(true);
    const onStorage = (e) => {
      if (e.key === KEY) setItems(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const persist = useCallback((next) => {
    setItems(next);
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(next));
  }, []);
  const add = useCallback(
    (item, qty = 1) => {
      const next = [...read()];
      const i = next.findIndex((x) => x.productId === item.productId);
      if (i >= 0) next[i] = { ...next[i], quantity: next[i].quantity + qty };
      else next.push({ ...item, quantity: qty });
      persist(next);
    },
    [persist]
  );
  const remove = useCallback(
    (productId) => persist(read().filter((x) => x.productId !== productId)),
    [persist]
  );
  const setQty = useCallback(
    (productId, qty) => {
      const next = read().map((x) => x.productId === productId ? { ...x, quantity: Math.max(1, qty) } : x).filter((x) => x.quantity > 0);
      persist(next);
    },
    [persist]
  );
  const clear = useCallback(() => persist([]), [persist]);
  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    return { items, count, subtotal, add, remove, setQty, clear, hydrated };
  }, [items, add, remove, setQty, clear, hydrated]);
  return /* @__PURE__ */ jsx(Ctx.Provider, { value, children });
}
function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
const ssrSafeStorage = {
  getItem: (key) => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  }
};
function createSupabaseClient() {
  const SUPABASE_URL = "https://qzpivwyhntbjauhtzcjh.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cGl2d3lobnRiamF1aHR6Y2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTczNjYsImV4cCI6MjA5Njc3MzM2Nn0.s7p8LwZMsleh7ykf2juD7p6Q1fRgw_ugJ8KtEKA5bZ8";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      // PKCE flow: Supabase sends ?code= to /auth/callback instead of a
      // #access_token= hash fragment. The code verifier is stored in
      // localStorage and exchanged server-side in the callback route.
      flowType: "pkce",
      storage: ssrSafeStorage,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-serif text-7xl text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center border border-charcoal px-6 py-3 text-[11px] tracking-luxury uppercase text-charcoal hover:bg-charcoal hover:text-ivory transition-colors",
        children: "Return home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-serif text-2xl text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong. Please try again." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => {
          router2.invalidate();
          reset();
        },
        className: "inline-flex items-center justify-center bg-charcoal px-6 py-3 text-[11px] tracking-luxury uppercase text-ivory hover:bg-gold transition-colors",
        children: "Try again"
      }
    ) })
  ] }) });
}
const Route$z = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "IRAYA — Indian Luxury, Quietly Made" },
      { name: "description", content: "IRAYA — an Indian luxury maison of heritage textiles, jewellery and objects." },
      { name: "author", content: "IRAYA" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "IRAYA — Indian Luxury, Quietly Made" },
      { name: "twitter:title", content: "IRAYA — Indian Luxury, Quietly Made" },
      { property: "og:description", content: "IRAYA — an Indian luxury maison of heritage textiles, jewellery and objects." },
      { name: "twitter:description", content: "IRAYA — an Indian luxury maison of heritage textiles, jewellery and objects." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:image", content: "/og-image.png" }
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "shortcut icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Inter:wght@100..900&display=swap" },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function AuthSync() {
  const router2 = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      router2.invalidate();
      queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router2, queryClient]);
  return null;
}
function RootComponent() {
  const { queryClient } = Route$z.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxs(CartProvider, { children: [
    /* @__PURE__ */ jsx(AuthSync, {}),
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Toaster, { position: "bottom-right" }),
    /* @__PURE__ */ jsx(
      Toaster$2,
      {
        position: "bottom-right",
        toastOptions: {
          style: {
            background: "#1A1A1A",
            color: "#FAF8F5",
            border: "1px solid rgba(255,255,255,0.1)",
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            borderRadius: "2px"
          }
        }
      }
    ),
    /* @__PURE__ */ jsx(Analytics, {})
  ] }) });
}
const $$splitComponentImporter$u = () => import("./track-qNYkrpXy.js");
const Route$y = createFileRoute("/track")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Track Your Order — IRAYA"
    }, {
      name: "description",
      content: "Track your IRAYA order shipment with your order number and email."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./terms-D4rZQAwJ.js");
const Route$x = createFileRoute("/terms")({
  head: () => ({
    meta: [{
      title: "Terms & Conditions — IRAYA"
    }, {
      name: "description",
      content: "IRAYA terms and conditions."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./returns-CiMKY8pg.js");
const Route$w = createFileRoute("/returns")({
  head: () => ({
    meta: [{
      title: "Return Policy — IRAYA"
    }, {
      name: "description",
      content: "IRAYA return and exchange policy."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./privacy-D7_KqKto.js");
const Route$v = createFileRoute("/privacy")({
  head: () => ({
    meta: [{
      title: "Privacy Policy — IRAYA"
    }, {
      name: "description",
      content: "IRAYA privacy policy — how we handle your data."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./faqs-BjzVRU5t.js");
const Route$u = createFileRoute("/faqs")({
  head: () => ({
    meta: [{
      title: "FAQs — IRAYA"
    }, {
      name: "description",
      content: "Answers to common questions about IRAYA bags, footwear, shipping, and returns."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./contact-BWNstrBx.js");
const Route$t = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact IRAYA — Get in Touch"
    }, {
      name: "description",
      content: "Reach the IRAYA atelier — email, phone, and address."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const listCategories = createServerFn({
  method: "GET"
}).handler(createSsrRpc("74cf57a5ce5acc5ff7716c464d5de5a2260685d83f4d25828e2026fb3932cf53"));
const listInput = z.object({
  category: z.string().optional(),
  featured: z.boolean().optional(),
  limit: z.number().int().min(1).max(60).optional()
});
const listProducts = createServerFn({
  method: "GET"
}).validator((input) => listInput.parse(input ?? {})).handler(createSsrRpc("51ad93d03c52987e0e52d0164e41771f8765a8919d8a537367eaf795dff9b9d8"));
const getProductBySlug = createServerFn({
  method: "GET"
}).validator((input) => z.object({
  slug: z.string().min(1)
}).parse(input)).handler(createSsrRpc("934a19e0a64899030ca094a104b50f8fc2c2f2533d480be67184ceddaf6faaf0"));
const productsQO = (category) => queryOptions({
  queryKey: ["products", {
    category
  }],
  queryFn: () => listProducts({
    data: {
      category
    }
  })
});
const categoriesQO = queryOptions({
  queryKey: ["categories"],
  queryFn: () => listCategories()
});
const $$splitErrorComponentImporter$2 = () => import("./collection-C_a5jBFP.js");
const $$splitComponentImporter$o = () => import("./collection-DZm6OVNg.js");
const searchSchema = z.object({
  category: z.enum(["bags", "footwear"]).optional()
});
const Route$s = createFileRoute("/collection")({
  validateSearch: (s) => searchSchema.parse(s),
  loaderDeps: ({
    search
  }) => ({
    category: search.category
  }),
  loader: async ({
    context,
    deps
  }) => {
    await Promise.all([context.queryClient.ensureQueryData(productsQO(deps.category)), context.queryClient.ensureQueryData(categoriesQO)]);
  },
  head: ({
    match
  }) => {
    const c = match.search.category;
    const title = c ? `${c.charAt(0).toUpperCase() + c.slice(1)} — IRAYA` : "Collection — IRAYA Bags & Footwear";
    const description = c === "bags" ? "Handcrafted bags from IRAYA — made in India." : c === "footwear" ? "Handcrafted footwear from IRAYA — made in India." : "Browse handcrafted bags and footwear from IRAYA.";
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: description
      }, {
        property: "og:title",
        content: title
      }, {
        property: "og:description",
        content: description
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$o, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent")
});
const $$splitComponentImporter$n = () => import("./checkout-DwumxcHf.js");
const Route$r = createFileRoute("/checkout")({
  head: () => ({
    meta: [{
      title: "Checkout — IRAYA"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./cart-BLiDSpmc.js");
const Route$q = createFileRoute("/cart")({
  head: () => ({
    meta: [{
      title: "Your Bag — IRAYA"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./auth-CcRCDPqP.js");
const Route$p = createFileRoute("/auth")({
  validateSearch: z.object({
    redirect: z.string().optional().refine((value) => !value || value.startsWith("/") && !value.startsWith("//"), {
      message: "redirect must be a relative path"
    })
  }).parse,
  head: () => ({
    meta: [{
      title: "Sign in — IRAYA"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const checkAuthFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("06d1c4397d8d80e59d6dd7a014172b24d07d1c906cfbffadfded6d2e704e3ac2"));
const signInWithPasswordServerFn = createServerFn({
  method: "POST"
}).validator((input) => z.object({
  email: z.string().email(),
  password: z.string()
}).parse(input)).handler(createSsrRpc("a0d3c0fd56dc0ec1b203f8fc17c7f212b37ea6a3d6d9255b9a6f445828607116"));
const signUpServerFn = createServerFn({
  method: "POST"
}).validator((input) => z.object({
  email: z.string().email(),
  password: z.string(),
  full_name: z.string().optional()
}).parse(input)).handler(createSsrRpc("35978e2419cc50dddeacc534bc89e7064e2b8ce08105e4feee0f7c83f6558128"));
const logoutServerFn = createServerFn({
  method: "POST"
}).handler(createSsrRpc("5468b12d0dce68e830e883a63b1dd4aa4723696bd2a0eb3e4f2400fc3fcaff4e"));
const setup2faServerFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("be483e9e42c205c6c13091877a789f444afdfc857e317f374ec0a6ce52792cf0"));
const confirm2faServerFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  code: z.string().length(6),
  secret: z.string()
}).parse(input)).handler(createSsrRpc("81d621abc236bb8841e8fb237186b9ec0d2c6a365f27112db1c0d0bf89fd2254"));
const verify2faServerFn = createServerFn({
  method: "POST"
}).validator((input) => z.object({
  code: z.string(),
  tempToken: z.string()
}).parse(input)).handler(createSsrRpc("07995b0a058f02f571d729587a5a45876b02355e9fc2a6990793c510add58fe2"));
const listMySessions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("27c6a8f3a486a1fe9e0ebb5e008b7ae011f79eeb90681c5496b9a9d09b6f70e4"));
const terminateSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  id: z.string().uuid()
}).parse(input)).handler(createSsrRpc("9a47419efc5357090981ea782cb467e0ba0f1997f9e04a3ffd50e525c202d583"));
const terminateAllOtherSessions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("753bae9d6d697882a272e30d2f37b648143ad3f1643d55b1eaf3440c601ba4ff"));
const changePasswordServerFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  newPassword: z.string()
}).parse(input)).handler(createSsrRpc("c54c041a51f0bd82d88c68f476e9fc7845294a7420241b76161a5bd003f4d5f9"));
const get2faStatusServerFn = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("f8fc6907bb5e4e9589219b29e96be1223aa5d22c62252d4ff7be7670854d5f42"));
const auth_functions = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  changePasswordServerFn,
  checkAuthFn,
  confirm2faServerFn,
  get2faStatusServerFn,
  listMySessions,
  logoutServerFn,
  setup2faServerFn,
  signInWithPasswordServerFn,
  signUpServerFn,
  terminateAllOtherSessions,
  terminateSession,
  verify2faServerFn
}, Symbol.toStringTag, { value: "Module" }));
const $$splitComponentImporter$k = () => import("./account-BTU5dmpx.js");
const Route$o = createFileRoute("/account")({
  beforeLoad: async ({
    location
  }) => {
    const {
      user
    } = await checkAuthFn();
    if (user) {
      throw redirect({
        to: "/_authenticated/account"
      });
    } else {
      throw redirect({
        to: "/auth",
        search: {
          redirect: location.href
        }
      });
    }
  },
  // This component is never rendered (beforeLoad always redirects),
  // but TanStack Router requires one.
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./about-BBTvwJA5.js");
const Route$n = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About IRAYA — Handcrafted Bags & Footwear"
    }, {
      name: "description",
      content: "IRAYA is a house of handcrafted bags and footwear, made in India."
    }, {
      property: "og:title",
      content: "About IRAYA"
    }, {
      property: "og:description",
      content: "A house of handcrafted bags and footwear, made in India."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./route-BFsOu0JM.js");
const Route$m = createFileRoute("/_authenticated")({
  beforeLoad: async ({
    location
  }) => {
    const {
      user
    } = await checkAuthFn();
    if (!user) {
      throw redirect({
        to: "/auth",
        search: {
          redirect: location.href
        }
      });
    }
    return {
      user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const newArrivalsQO = queryOptions({
  queryKey: ["products", {
    featured: true,
    limit: 4
  }],
  queryFn: () => listProducts({
    data: {
      limit: 8
    }
  })
});
const $$splitErrorComponentImporter$1 = () => import("./index-C9WsNWqt.js");
const $$splitComponentImporter$h = () => import("./index-D2GokPEA.js");
const Route$l = createFileRoute("/")({
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(newArrivalsQO),
  head: () => ({
    meta: [{
      title: "IRAYA — Handcrafted Bags & Footwear"
    }, {
      name: "description",
      content: "IRAYA — a house of handcrafted bags and footwear, made in India for those who walk with intention."
    }, {
      property: "og:title",
      content: "IRAYA — Handcrafted Bags & Footwear"
    }, {
      property: "og:description",
      content: "Handcrafted bags and footwear, made in India."
    }, {
      property: "og:type",
      content: "website"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent")
});
const productQO = (slug) => queryOptions({
  queryKey: ["product", slug],
  queryFn: () => getProductBySlug({
    data: {
      slug
    }
  })
});
const $$splitNotFoundComponentImporter = () => import("./collection._slug-B3od-Z54.js");
const $$splitErrorComponentImporter = () => import("./collection._slug-Ctn0xdNC.js");
const $$splitComponentImporter$g = () => import("./collection._slug-DWq4U1aA.js");
const Route$k = createFileRoute("/collection/$slug")({
  loader: ({
    context,
    params
  }) => context.queryClient.ensureQueryData(productQO(params.slug)),
  head: ({
    loaderData
  }) => {
    const p = loaderData;
    if (!p) return {
      meta: [{
        title: "IRAYA"
      }]
    };
    return {
      meta: [{
        title: `${p.name} — IRAYA`
      }, {
        name: "description",
        content: p.description ?? "Handcrafted in India by IRAYA."
      }, {
        property: "og:title",
        content: `${p.name} — IRAYA`
      }, {
        property: "og:description",
        content: p.description ?? ""
      }, ...p.images?.[0] ? [{
        property: "og:image",
        content: p.images[0].url
      }] : []]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$g, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const $$splitComponentImporter$f = () => import("./checkout.success-CMBAMq0K.js");
const Route$j = createFileRoute("/checkout/success")({
  validateSearch: z.object({
    o: z.string().optional()
  }).parse,
  head: () => ({
    meta: [{
      title: "Order confirmed — IRAYA"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./auth.callback-C9cHt_Qd.js");
const exchangeCodeServerFn = createServerFn({
  method: "GET"
}).validator((input) => z.object({
  code: z.string()
}).parse(input)).handler(createSsrRpc("54530985819b491fd79f30ff32967dc944627d853bffa9017064b60497be17f7"));
const Route$i = createFileRoute("/auth/callback")({
  validateSearch: z.object({
    code: z.string().optional(),
    error: z.string().optional(),
    error_description: z.string().optional()
  }).parse,
  beforeLoad: async ({
    search
  }) => {
    if (search.error) {
      throw redirect({
        to: "/auth",
        search: {
          redirect: void 0
        }
      });
    }
    if (!search.code) {
      throw redirect({
        to: "/"
      });
    }
    await exchangeCodeServerFn({
      data: {
        code: search.code
      }
    });
    throw redirect({
      to: "/account"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const getMyProfile = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("5dbf46616266e7bfe81c82694a91090a42de6200b3efc1b9d156faf41ac3a479"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  full_name: z.string().min(1).max(120).optional(),
  phone: z.string().max(20).optional()
}).parse(input)).handler(createSsrRpc("af00eb763dce352dc2f42ef901ef426a138feb40fdc7f79166552837a77fae5f"));
const listMyAddresses = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("7fa8c91db179091ff6cb959e42809f454a284431c683e5e518b443a9cf593173"));
const addressInput = z.object({
  full_name: z.string().min(1).max(120),
  phone: z.string().min(7).max(20),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(80),
  state: z.string().min(1).max(80),
  pincode: z.string().min(4).max(12),
  country: z.string().default("India"),
  label: z.string().max(40).optional(),
  is_default: z.boolean().optional()
});
const addAddress = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => addressInput.parse(input)).handler(createSsrRpc("d0d3c71142e5936e54c42a3643c273b53a56fb29316e6fd26ccc3701adb52d6c"));
const deleteAddress = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  id: z.string().uuid()
}).parse(input)).handler(createSsrRpc("598ff4ff45ff4238adf216e3a30144469c96c670c2c02a41b0509bab983d63a3"));
const listMyWishlist = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("38c174375dacd7a92e9e6050d22909885db1125a7f3c109afcf8e5a28f5e2942"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  productId: z.string().uuid()
}).parse(input)).handler(createSsrRpc("802683fc68d58adcbd14e37e9cea4215fce0391f5b8001fdebe9b23283676a24"));
const getMyRoles = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("addc11dc1fc307c89bfb435d49d20159f73b0c39d6063512ac456398fc06b87e"));
const $$splitComponentImporter$d = () => import("./route-DWJeTODY.js");
const Route$h = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const roles = await getMyRoles();
    if (!roles.includes("admin")) {
      throw redirect({
        to: "/account"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const adminListProducts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("9932f7d91182148199cbc8b49e99aa83ab2855e0f2166e0d0e38e6c091b587df"));
const productInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(160),
  category_slug: z.enum(["bags", "footwear"]),
  description: z.string().max(4e3).optional().default(""),
  price: z.number().min(0).max(1e7),
  discount_price: z.number().min(0).max(1e7).nullable().optional(),
  stock: z.number().int().min(0).max(1e5),
  status: z.enum(["draft", "active", "archived"]).default("active"),
  variants: z.string().max(400).optional().default(""),
  // comma-separated sizes
  images: z.array(z.string().min(1)).max(8).default([])
  // storage paths
});
const adminUpsertProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => productInput.parse(input)).handler(createSsrRpc("8552c7bea139694beea39d17e69f323a972d63fd26947a65dd6b49554eb191c8"));
const adminDeleteProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  id: z.string().uuid()
}).parse(input)).handler(createSsrRpc("0ddf57ac23192120a1e98e48f57343c6fe83e8a1ddcf5df54be83354a1f768ad"));
const adminSignImage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  path: z.string().min(1).max(500)
}).parse(input)).handler(createSsrRpc("1eebec19e04bfe989f1927af14cf4b054b098222893399fbc6b947df32f11ab0"));
const adminListOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("573be2cdf3c95bfa88f6bb3d2080ff0b0c620db545ac53f2f5a039a50348d737"));
const adminUpdateOrderStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  orderId: z.string().uuid(),
  status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]),
  awb_code: z.string().max(60).optional(),
  courier_name: z.string().max(80).optional(),
  tracking_url: z.string().url().max(500).optional()
}).parse(input)).handler(createSsrRpc("9505b54584006d8459dff4f0d9b2b1ccc184fc05200648ce850e9f9f7ee3f723"));
const adminStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("fc54988025651b0d207f9ef4346d9f0fe848ff17785294a4a080cffaee281f4f"));
const adminUploadImage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  base64Data: z.string(),
  fileName: z.string(),
  contentType: z.string()
}).parse(input)).handler(createSsrRpc("72eaf964ab7ce14d623874daf7be210de5431691ecf47076df88fef9c15ca3d3"));
const statsQO = queryOptions({
  queryKey: ["admin-stats"],
  queryFn: () => adminStats()
});
const $$splitComponentImporter$c = () => import("./index-B_qYtKeV.js");
const Route$g = createFileRoute("/_authenticated/admin/")({
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(statsQO),
  head: () => ({
    meta: [{
      title: "Admin — IRAYA"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const addressSchema = z.object({
  full_name: z.string().min(1).max(120),
  phone: z.string().min(7).max(20),
  email: z.string().email().max(255),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional().nullable(),
  city: z.string().min(1).max(80),
  state: z.string().min(1).max(80),
  pincode: z.string().min(4).max(12),
  country: z.string().min(2).max(60).default("India")
});
const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).max(20)
  })).min(1).max(50),
  shipping_address: addressSchema,
  idempotencyKey: z.string().min(8).max(80).regex(/^[a-zA-Z0-9_-]+$/).optional()
}).strict();
const createOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => checkoutSchema.parse(input)).handler(createSsrRpc("7f92d135aa3763ddd5bf6d4d9f84832b6b591cbaa35dcc4048b4b1beed8e7bf3"));
const listMyOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("3265360dd1bb8505874dca36fc08c120c489507fb549e4925a945a8286e7a79a"));
const getMyOrder = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  id: z.string().uuid()
}).parse(input)).handler(createSsrRpc("b407145077ca1f696815c0a6843d9d3ec6cd17b486611e8fb35e8e52b34e9e73"));
const trackOrder = createServerFn({
  method: "POST"
}).validator((input) => z.object({
  orderNumber: z.string().trim().min(3).max(40),
  email: z.string().trim().email().max(255)
}).parse(input)).handler(createSsrRpc("d74efaed9d368b50c737966712aaf37f9bc30edca8be1eed754f166b39b69dcd"));
const profileQO = queryOptions({
  queryKey: ["my-profile"],
  queryFn: () => getMyProfile()
});
const ordersQO = queryOptions({
  queryKey: ["my-orders"],
  queryFn: () => listMyOrders()
});
const rolesQO = queryOptions({
  queryKey: ["my-roles"],
  queryFn: () => getMyRoles()
});
const $$splitComponentImporter$b = () => import("./index-DaXya6du.js");
const Route$f = createFileRoute("/_authenticated/account/")({
  loader: ({
    context
  }) => Promise.all([context.queryClient.ensureQueryData(profileQO), context.queryClient.ensureQueryData(ordersQO), context.queryClient.ensureQueryData(rolesQO)]),
  head: () => ({
    meta: [{
      title: "Account — IRAYA"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const Route$e = createFileRoute("/api/razorpay/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
          console.error("[razorpay/webhook] RAZORPAY_WEBHOOK_SECRET not set");
          return new Response("Not configured", { status: 503 });
        }
        const signature = request.headers.get("x-razorpay-signature") ?? "";
        const body = await request.text();
        const expected = createHmac("sha256", secret).update(body).digest("hex");
        const sig = Buffer.from(signature);
        const exp = Buffer.from(expected);
        const ok = sig.length === exp.length && timingSafeEqual(sig, exp);
        const { recordPaymentEvent, getClientIp } = await import("./security.server-BRG0sDb-.js");
        const ip = getClientIp(request);
        if (!ok) {
          await recordPaymentEvent({
            provider: "razorpay",
            eventType: "invalid_signature",
            signatureValid: false,
            ip,
            payload: { rawLength: body.length }
          });
          return new Response("Invalid signature", { status: 401 });
        }
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const payment = parsed.payload.payment?.entity;
        const order = parsed.payload.order?.entity;
        const rpOrderId = payment?.order_id ?? order?.id ?? null;
        const internalOrderId = payment?.notes?.order_id ?? order?.notes?.order_id ?? null;
        const { supabaseAdmin } = await import("./client.server-ijnlFj_c.js");
        let targetOrderId = internalOrderId ?? null;
        if (!targetOrderId && rpOrderId) {
          const { data: o } = await supabaseAdmin.from("orders").select("id").eq("razorpay_order_id", rpOrderId).maybeSingle();
          targetOrderId = o?.id ?? null;
        }
        await recordPaymentEvent({
          provider: "razorpay",
          eventType: parsed.event,
          paymentId: payment?.id ?? null,
          orderId: targetOrderId,
          amount: payment?.amount ? payment.amount / 100 : order?.amount ? order.amount / 100 : null,
          currency: payment?.currency ?? order?.currency ?? null,
          status: payment?.status ?? order?.status ?? null,
          signatureValid: true,
          ip,
          payload: parsed
        });
        if ((parsed.event === "payment.captured" || parsed.event === "order.paid") && payment) {
          if (payment.id) {
            const { data: existingOrder } = await supabaseAdmin.from("orders").select("id, status").eq("razorpay_payment_id", payment.id).maybeSingle();
            if (existingOrder) {
              if (existingOrder.id !== targetOrderId) {
                const { writeSecurityEvent } = await import("./security.server-BRG0sDb-.js");
                await writeSecurityEvent({
                  eventType: "payment_id_reuse_detected",
                  severity: "critical",
                  ip,
                  details: {
                    paymentId: payment.id,
                    targetOrderId,
                    originalOrderId: existingOrder.id
                  }
                });
                return new Response("Payment ID already used", { status: 400 });
              }
              return new Response("ok", { status: 200 });
            }
          }
          if (targetOrderId) {
            await supabaseAdmin.from("orders").update({
              status: "paid",
              razorpay_payment_id: payment.id,
              razorpay_order_id: payment.order_id
            }).eq("id", targetOrderId).neq("status", "paid");
          }
        }
        return new Response("ok", { status: 200 });
      }
    }
  }
});
const Route$d = createFileRoute("/api/cron/cleanup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cronSecret = request.headers.get("x-cron-secret");
        const expected = process.env.CRON_SECRET;
        if (!expected || cronSecret !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        const { supabaseAdmin } = await import("./client.server-ijnlFj_c.js");
        const now = Date.now();
        const hourAgo = new Date(now - 60 * 60 * 1e3).toISOString();
        const d30 = new Date(now - 30 * 864e5).toISOString();
        const d90 = new Date(now - 90 * 864e5).toISOString();
        const d180 = new Date(now - 180 * 864e5).toISOString();
        const results = {};
        const r1 = await supabaseAdmin.from("rate_limits").delete().lt("created_at", hourAgo).select("key");
        results.rate_limits = r1.error ? r1.error.message : r1.data?.length ?? 0;
        const r2 = await supabaseAdmin.from("idempotency_keys").delete().lt("expires_at", new Date(now).toISOString()).select("key");
        results.idempotency_keys = r2.error ? r2.error.message : r2.data?.length ?? 0;
        const rBlacklist = await supabaseAdmin.from("token_blacklist").delete().lt("expires_at", new Date(now).toISOString()).select("token");
        results.token_blacklist = rBlacklist.error ? rBlacklist.error.message : rBlacklist.data?.length ?? 0;
        const rSessions = await supabaseAdmin.from("user_sessions").delete().lt("last_active", d30).select("id");
        results.user_sessions = rSessions.error ? rSessions.error.message : rSessions.data?.length ?? 0;
        const r3 = await supabaseAdmin.from("login_attempts").delete().lt("created_at", d90).select("id");
        results.login_attempts = r3.error ? r3.error.message : r3.data?.length ?? 0;
        const r4 = await supabaseAdmin.from("login_events").delete().lt("created_at", d180).select("id");
        results.login_events = r4.error ? r4.error.message : r4.data?.length ?? 0;
        const r5 = await supabaseAdmin.from("security_events").delete().lt("created_at", d180).select("id");
        results.security_events = r5.error ? r5.error.message : r5.data?.length ?? 0;
        try {
          const { sendEmail } = await import("./email.server-w0MXyg9U.js");
          const { data: adminRoles } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin");
          if (adminRoles && adminRoles.length > 0) {
            const adminIds = adminRoles.map((r) => r.user_id);
            const { data: adminProfiles } = await supabaseAdmin.from("profiles").select("email").in("id", adminIds);
            const adminEmails = adminProfiles?.map((p) => p.email).filter(Boolean) ?? [];
            for (const email of adminEmails) {
              await sendEmail({
                to: email,
                subject: "IRAYA Security: Automated Cleanup & Maintenance Report",
                html: `
                  <h2>Security Maintenance Complete</h2>
                  <p>The automated cleanup cron job has completed successfully. Summary of operations:</p>
                  <ul>
                    <li><strong>Pruned rate limits:</strong> ${results.rate_limits} records</li>
                    <li><strong>Pruned expired token blacklist:</strong> ${results.token_blacklist} records</li>
                    <li><strong>Pruned inactive user sessions (&gt;30 days):</strong> ${results.user_sessions} records</li>
                    <li><strong>Pruned old login attempts (&gt;90 days):</strong> ${results.login_attempts} records</li>
                    <li><strong>Pruned old login events (&gt;180 days):</strong> ${results.login_events} records</li>
                    <li><strong>Pruned old security events (&gt;180 days):</strong> ${results.security_events} records</li>
                  </ul>
                  <p><strong>Key Rotation Reminder:</strong> This is a automated reminder to audit API secrets (Supabase, Razorpay, Resend) and rotate credentials regularly to comply with security standards.</p>
                  <p>Time of execution: ${new Date(now).toUTCString()}</p>
                `
              });
            }
          }
        } catch (err) {
          console.error("Failed to alert admin during security cleanup:", err);
        }
        return Response.json({ ok: true, deleted: results });
      }
    }
  }
});
const Route$c = createFileRoute("/api/auth/verify-otp")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { twilioClient, TWILIO_VERIFY_SERVICE_SID } = await import("./twilio-Cd-Q8XC8.js");
          const { supabaseAdmin } = await import("./client.server-ijnlFj_c.js");
          const {
            getClientIp,
            detectDeviceType,
            parseUserAgent,
            geoLookup,
            writeSecurityEvent
          } = await import("./security.server-BRG0sDb-.js");
          let body;
          try {
            body = await request.json();
          } catch {
            return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
          }
          const { phone, code } = body;
          if (!phone || !code) {
            return Response.json({ error: "Phone number and code are required." }, { status: 400 });
          }
          let verificationCheck;
          try {
            verificationCheck = await twilioClient.verify.v2.services(TWILIO_VERIFY_SERVICE_SID).verificationChecks.create({ to: phone, code });
          } catch (twilioErr) {
            console.error("Twilio check error:", twilioErr);
            return Response.json(
              { error: twilioErr?.message || "Verification code check failed." },
              { status: twilioErr?.status || 400 }
            );
          }
          if (verificationCheck.status !== "approved") {
            return Response.json({ error: "Invalid or expired verification code." }, { status: 400 });
          }
          const tempSecurePassword = crypto.randomUUID() + "-" + crypto.randomBytes(16).toString("hex") + "A1!";
          const { data: profile, error: profileErr } = await supabaseAdmin.from("profiles").select("id").eq("phone", phone).maybeSingle();
          let userId;
          if (profile && profile.id) {
            userId = profile.id;
            const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
              password: tempSecurePassword
            });
            if (updateErr) {
              console.error("Failed to update user password for OTP handshake:", updateErr);
              throw new Error("Internal server error during session initialization.");
            }
          } else {
            const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
              phone,
              password: tempSecurePassword,
              phone_confirm: true,
              user_metadata: { full_name: "Valued Customer" }
            });
            if (createErr || !newUser.user) {
              console.error("Failed to create user in Supabase:", createErr);
              throw new Error(createErr?.message || "Failed to initialize user profile.");
            }
            userId = newUser.user.id;
          }
          const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
            phone,
            password: tempSecurePassword
          });
          if (authError || !authData.user || !authData.session) {
            console.error("Failed to sign in with password after handshake:", authError);
            throw new Error("Authentication handshake failed.");
          }
          const ip = getClientIp(request);
          const ua = request.headers.get("user-agent") ?? null;
          const deviceType = detectDeviceType(ua);
          const { browserName, browserVersion, os } = parseUserAgent(ua);
          const { country, city } = await geoLookup(ip);
          const { data: sessionRow, error: sessionErr } = await supabaseAdmin.from("user_sessions").insert({
            user_id: userId,
            device_type: deviceType,
            browser_name: browserName,
            browser_version: browserVersion,
            os,
            ip_address: ip,
            country,
            city
          }).select("id").single();
          if (sessionErr || !sessionRow) {
            console.error("Could not initialize session row in database:", sessionErr);
            throw new Error("Could not initialize user session.");
          }
          await writeSecurityEvent({
            userId,
            eventType: "phone_otp_login",
            severity: "info",
            ip,
            userAgent: ua
          });
          const headers = new Headers();
          const secure = true ? "Secure;" : "";
          headers.append(
            "Set-Cookie",
            `sb-access-token=${authData.session.access_token}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=900`
          );
          headers.append(
            "Set-Cookie",
            `sb-refresh-token=${authData.session.refresh_token}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=604800`
          );
          headers.append(
            "Set-Cookie",
            `sb-session-id=${sessionRow.id}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=2592000`
          );
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: crypto.randomUUID() + "-" + crypto.randomBytes(16).toString("hex") + "A2!"
          });
          return new Response(JSON.stringify({ success: true, user: authData.user }), {
            headers
          });
        } catch (err) {
          console.error("verify-otp handler error:", err);
          return Response.json({ error: err?.message || "Internal server error." }, { status: 500 });
        }
      }
    }
  }
});
const Route$b = createFileRoute("/api/auth/send-otp")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { twilioClient, TWILIO_VERIFY_SERVICE_SID } = await import("./twilio-Cd-Q8XC8.js");
          const { getClientIp, checkRateLimit } = await import("./security.server-BRG0sDb-.js");
          let body;
          try {
            body = await request.json();
          } catch {
            return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
          }
          const { phone } = body;
          const E164_REGEX = /^\+[1-9]\d{1,14}$/;
          if (!phone || !E164_REGEX.test(phone)) {
            return Response.json(
              { error: "Invalid phone number format. Must be E.164 format (e.g. +1234567890)." },
              { status: 400 }
            );
          }
          const limitKey = `otp:send:${phone}`;
          const rl = await checkRateLimit(limitKey, 3, 600);
          if (!rl.allowed) {
            return Response.json(
              { error: "Too many OTP requests. Please try again in 10 minutes." },
              { status: 429 }
            );
          }
          const verification = await twilioClient.verify.v2.services(TWILIO_VERIFY_SERVICE_SID).verifications.create({ to: phone, channel: "sms" });
          return Response.json({ success: true, sid: verification.sid });
        } catch (err) {
          console.error("Twilio send-otp error:", err);
          return Response.json(
            { error: err?.message || "Failed to send verification code." },
            { status: err?.status || 500 }
          );
        }
      }
    }
  }
});
const $$splitComponentImporter$a = () => import("./security-Cwvd8HO3.js");
const Route$a = createFileRoute("/_authenticated/admin/security")({
  head: () => ({
    meta: [{
      title: "Security — Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const qo$1 = queryOptions({
  queryKey: ["admin-products"],
  queryFn: () => adminListProducts()
});
const $$splitComponentImporter$9 = () => import("./products-DhM5aE9d.js");
const Route$9 = createFileRoute("/_authenticated/admin/products")({
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(qo$1),
  head: () => ({
    meta: [{
      title: "Admin · Products — IRAYA"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const qo = queryOptions({
  queryKey: ["admin-orders"],
  queryFn: () => adminListOrders()
});
const $$splitComponentImporter$8 = () => import("./orders-T01Jzxbb.js");
const Route$8 = createFileRoute("/_authenticated/admin/orders")({
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(qo),
  head: () => ({
    meta: [{
      title: "Admin · Orders — IRAYA"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const wishlistQO = queryOptions({
  queryKey: ["my-wishlist"],
  queryFn: () => listMyWishlist()
});
const $$splitComponentImporter$7 = () => import("./wishlist-Cyc0bmqh.js");
const Route$7 = createFileRoute("/_authenticated/account/wishlist")({
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(wishlistQO),
  head: () => ({
    meta: [{
      title: "Wishlist — IRAYA"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./sessions-Ddzqkz0y.js");
const Route$6 = createFileRoute("/_authenticated/account/sessions")({
  head: () => ({
    meta: [{
      title: "Active Sessions — IRAYA"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./security-C3ZEv7xa.js");
const Route$5 = createFileRoute("/_authenticated/account/security")({
  head: () => ({
    meta: [{
      title: "Account Security — IRAYA"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./profile-BWGSVnoM.js");
const Route$4 = createFileRoute("/_authenticated/account/profile")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./orders-B9svQ89s.js");
const Route$3 = createFileRoute("/_authenticated/account/orders")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./dashboard-DK26NCaY.js");
const Route$2 = createFileRoute("/_authenticated/account/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const addressesQO = queryOptions({
  queryKey: ["my-addresses"],
  queryFn: () => listMyAddresses()
});
const $$splitComponentImporter$1 = () => import("./addresses-KogUZm_v.js");
const Route$1 = createFileRoute("/_authenticated/account/addresses")({
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(addressesQO),
  head: () => ({
    meta: [{
      title: "Addresses — IRAYA"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const orderQO = (id) => queryOptions({
  queryKey: ["my-order", id],
  queryFn: () => getMyOrder({
    data: {
      id
    }
  })
});
const $$splitComponentImporter = () => import("./_id-Dr5YSFPs.js");
const Route = createFileRoute("/_authenticated/account/orders/$id")({
  loader: ({
    context,
    params
  }) => context.queryClient.ensureQueryData(orderQO(params.id)),
  head: () => ({
    meta: [{
      title: "Order — IRAYA"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TrackRoute = Route$y.update({
  id: "/track",
  path: "/track",
  getParentRoute: () => Route$z
});
const TermsRoute = Route$x.update({
  id: "/terms",
  path: "/terms",
  getParentRoute: () => Route$z
});
const ReturnsRoute = Route$w.update({
  id: "/returns",
  path: "/returns",
  getParentRoute: () => Route$z
});
const PrivacyRoute = Route$v.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$z
});
const FaqsRoute = Route$u.update({
  id: "/faqs",
  path: "/faqs",
  getParentRoute: () => Route$z
});
const ContactRoute = Route$t.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$z
});
const CollectionRoute = Route$s.update({
  id: "/collection",
  path: "/collection",
  getParentRoute: () => Route$z
});
const CheckoutRoute = Route$r.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => Route$z
});
const CartRoute = Route$q.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => Route$z
});
const AuthRoute = Route$p.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$z
});
const AccountRoute = Route$o.update({
  id: "/account",
  path: "/account",
  getParentRoute: () => Route$z
});
const AboutRoute = Route$n.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$z
});
const AuthenticatedRouteRoute = Route$m.update({
  id: "/_authenticated",
  getParentRoute: () => Route$z
});
const IndexRoute = Route$l.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$z
});
const CollectionSlugRoute = Route$k.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => CollectionRoute
});
const CheckoutSuccessRoute = Route$j.update({
  id: "/success",
  path: "/success",
  getParentRoute: () => CheckoutRoute
});
const AuthCallbackRoute = Route$i.update({
  id: "/callback",
  path: "/callback",
  getParentRoute: () => AuthRoute
});
const AuthenticatedAdminRouteRoute = Route$h.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAdminIndexRoute = Route$g.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAccountIndexRoute = Route$f.update({
  id: "/account/",
  path: "/account/",
  getParentRoute: () => AuthenticatedRouteRoute
});
const ApiRazorpayWebhookRoute = Route$e.update({
  id: "/api/razorpay/webhook",
  path: "/api/razorpay/webhook",
  getParentRoute: () => Route$z
});
const ApiCronCleanupRoute = Route$d.update({
  id: "/api/cron/cleanup",
  path: "/api/cron/cleanup",
  getParentRoute: () => Route$z
});
const ApiAuthVerifyOtpRoute = Route$c.update({
  id: "/api/auth/verify-otp",
  path: "/api/auth/verify-otp",
  getParentRoute: () => Route$z
});
const ApiAuthSendOtpRoute = Route$b.update({
  id: "/api/auth/send-otp",
  path: "/api/auth/send-otp",
  getParentRoute: () => Route$z
});
const AuthenticatedAdminSecurityRoute = Route$a.update({
  id: "/security",
  path: "/security",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminProductsRoute = Route$9.update({
  id: "/products",
  path: "/products",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminOrdersRoute = Route$8.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAccountWishlistRoute = Route$7.update({
  id: "/account/wishlist",
  path: "/account/wishlist",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAccountSessionsRoute = Route$6.update({
  id: "/account/sessions",
  path: "/account/sessions",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAccountSecurityRoute = Route$5.update({
  id: "/account/security",
  path: "/account/security",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAccountProfileRoute = Route$4.update({
  id: "/account/profile",
  path: "/account/profile",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAccountOrdersRoute = Route$3.update({
  id: "/account/orders",
  path: "/account/orders",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAccountDashboardRoute = Route$2.update({
  id: "/account/dashboard",
  path: "/account/dashboard",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAccountAddressesRoute = Route$1.update({
  id: "/account/addresses",
  path: "/account/addresses",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAccountOrdersIdRoute = Route.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AuthenticatedAccountOrdersRoute
});
const AuthenticatedAdminRouteRouteChildren = {
  AuthenticatedAdminOrdersRoute,
  AuthenticatedAdminProductsRoute,
  AuthenticatedAdminSecurityRoute,
  AuthenticatedAdminIndexRoute
};
const AuthenticatedAdminRouteRouteWithChildren = AuthenticatedAdminRouteRoute._addFileChildren(
  AuthenticatedAdminRouteRouteChildren
);
const AuthenticatedAccountOrdersRouteChildren = {
  AuthenticatedAccountOrdersIdRoute
};
const AuthenticatedAccountOrdersRouteWithChildren = AuthenticatedAccountOrdersRoute._addFileChildren(
  AuthenticatedAccountOrdersRouteChildren
);
const AuthenticatedRouteRouteChildren = {
  AuthenticatedAdminRouteRoute: AuthenticatedAdminRouteRouteWithChildren,
  AuthenticatedAccountAddressesRoute,
  AuthenticatedAccountDashboardRoute,
  AuthenticatedAccountOrdersRoute: AuthenticatedAccountOrdersRouteWithChildren,
  AuthenticatedAccountProfileRoute,
  AuthenticatedAccountSecurityRoute,
  AuthenticatedAccountSessionsRoute,
  AuthenticatedAccountWishlistRoute,
  AuthenticatedAccountIndexRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const AuthRouteChildren = {
  AuthCallbackRoute
};
const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren);
const CheckoutRouteChildren = {
  CheckoutSuccessRoute
};
const CheckoutRouteWithChildren = CheckoutRoute._addFileChildren(
  CheckoutRouteChildren
);
const CollectionRouteChildren = {
  CollectionSlugRoute
};
const CollectionRouteWithChildren = CollectionRoute._addFileChildren(
  CollectionRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AboutRoute,
  AccountRoute,
  AuthRoute: AuthRouteWithChildren,
  CartRoute,
  CheckoutRoute: CheckoutRouteWithChildren,
  CollectionRoute: CollectionRouteWithChildren,
  ContactRoute,
  FaqsRoute,
  PrivacyRoute,
  ReturnsRoute,
  TermsRoute,
  TrackRoute,
  ApiAuthSendOtpRoute,
  ApiAuthVerifyOtpRoute,
  ApiCronCleanupRoute,
  ApiRazorpayWebhookRoute
};
const routeTree = Route$z._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  terminateAllOtherSessions as A,
  get2faStatusServerFn as B,
  setup2faServerFn as C,
  confirm2faServerFn as D,
  changePasswordServerFn as E,
  addressesQO as F,
  addAddress as G,
  deleteAddress as H,
  Route as I,
  orderQO as J,
  createOrder as K,
  newArrivalsQO as L,
  qo as M,
  adminUpdateOrderStatus as N,
  auth_functions as O,
  router as P,
  Route$s as R,
  Route$p as a,
  signInWithPasswordServerFn as b,
  categoriesQO as c,
  supabase as d,
  Route$k as e,
  productQO as f,
  Route$j as g,
  statsQO as h,
  profileQO as i,
  createSsrRpc as j,
  adminDeleteProduct as k,
  logoutServerFn as l,
  adminUpsertProduct as m,
  adminSignImage as n,
  ordersQO as o,
  productsQO as p,
  qo$1 as q,
  rolesQO as r,
  signUpServerFn as s,
  trackOrder as t,
  useCart as u,
  verify2faServerFn as v,
  adminUploadImage as w,
  wishlistQO as x,
  listMySessions as y,
  terminateSession as z
};

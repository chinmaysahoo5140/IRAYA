import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useCart, d as supabase } from "./router-B46y8PhA.mjs";
import { c as Menu, S as Search, U as User, d as ShoppingBag, X, L as LogIn, e as ShieldCheck, R as RotateCcw, I as Instagram, F as Facebook, T as Twitter } from "../_libs/lucide-react.mjs";
function Navbar() {
  const [scrolled, setScrolled] = reactExports.useState(false);
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [userInitial, setUserInitial] = reactExports.useState(null);
  const { count } = useCart();
  reactExports.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  reactExports.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const name = data.user?.user_metadata?.full_name ?? data.user?.email ?? null;
      setUserInitial(name ? name.charAt(0).toUpperCase() : null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const name = session?.user?.user_metadata?.full_name ?? session?.user?.email ?? null;
        setUserInitial(name ? name.charAt(0).toUpperCase() : null);
      }
    );
    return () => subscription.unsubscribe();
  }, []);
  const navLink = "text-[11px] tracking-wide-2 uppercase text-foreground/80 hover:text-foreground transition-colors duration-300";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "header",
      {
        className: `fixed top-0 left-0 right-0 z-50 transition-all duration-500 mobile-header ${scrolled ? "bg-ivory/85 backdrop-blur-md hairline-b" : "bg-transparent"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-10 grid grid-cols-3 items-center h-16 lg:h-20 navbar-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setDrawerOpen(true),
              className: "md:hidden text-foreground/80 hover:text-foreground transition-colors justify-self-start",
              "aria-label": "Open menu",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-6 w-6", strokeWidth: 1.25 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center gap-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", search: { category: "bags" }, className: navLink, children: "Bags" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", search: { category: "footwear" }, className: navLink, children: "Footwear" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/track", className: navLink, children: "Track" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "justify-self-center logo-link", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-2xl lg:text-[28px] tracking-luxury text-charcoal", children: "IRAYA" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-5 text-foreground/80 right-icons", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", "aria-label": "Search", className: "hover:text-foreground transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-[18px] w-[18px]", strokeWidth: 1.25 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/account",
                "aria-label": "Account",
                className: "relative hover:text-foreground transition-colors",
                children: userInitial ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center justify-center h-[22px] w-[22px] rounded-full bg-charcoal text-ivory text-[10px] font-medium font-sans", children: userInitial }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-[18px] w-[18px]", strokeWidth: 1.25 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/cart", "aria-label": "Bag", className: "relative hover:text-foreground transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-[18px] w-[18px]", strokeWidth: 1.25 }),
              count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-2 text-[9px] tracking-wide-2 text-charcoal font-medium", children: count })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `mobile-drawer-backdrop md:hidden ${drawerOpen ? "open" : ""}`,
        onClick: () => setDrawerOpen(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mobile-drawer md:hidden ${drawerOpen ? "open" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-6 hairline-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-xl tracking-luxury text-charcoal", children: "IRAYA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDrawerOpen(false), "aria-label": "Close menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6 text-foreground/80", strokeWidth: 1.25 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex flex-col p-6 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", search: { category: "bags" }, onClick: () => setDrawerOpen(false), className: "drawer-link", children: "Bags" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", search: { category: "footwear" }, onClick: () => setDrawerOpen(false), className: "drawer-link", children: "Footwear" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", search: {}, onClick: () => setDrawerOpen(false), className: "drawer-link", children: "New Arrivals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/track", onClick: () => setDrawerOpen(false), className: "drawer-link", children: "Track Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hairline-t pt-4 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/account",
            onClick: () => setDrawerOpen(false),
            className: "flex items-center gap-2 drawer-link",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4", strokeWidth: 1.25 }),
              userInitial ? "My Account" : "Sign In"
            ]
          }
        ) })
      ] })
    ] })
  ] });
}
function Footer() {
  const col = "flex flex-col gap-3";
  const head = "text-[11px] tracking-wide-2 uppercase text-ivory/60 mb-3";
  const link = "text-[13px] text-ivory/80 hover:text-gold transition-colors duration-300 text-left";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-charcoal text-ivory mt-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-ivory/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-12 py-8 grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-6 w-6 text-gold", strokeWidth: 1.25 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-ivory", children: "Secured Payments" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] text-ivory/60", children: "256-bit SSL encryption · Razorpay protected" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-6 w-6 text-gold", strokeWidth: 1.25 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] tracking-luxury uppercase text-ivory", children: "Easy Returns" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] text-ivory/60", children: "7-day return window · Hassle-free exchange" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-12 py-20 grid grid-cols-2 md:grid-cols-5 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-3xl tracking-luxury", children: "IRAYA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-sm text-ivory/70 max-w-sm leading-relaxed", children: "A house of handcrafted bags and footwear — made in India, designed for the way you walk through the world." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex gap-4 text-ivory/70", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { "aria-label": "Instagram", href: "https://www.instagram.com/irayaglobal?igsh=MW03aXd4eDZlaXZ3Yg==", target: "_blank", rel: "noopener noreferrer", className: "hover:text-gold transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-4 w-4", strokeWidth: 1.25 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { "aria-label": "Facebook", className: "hover:text-gold transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Facebook, { className: "h-4 w-4", strokeWidth: 1.25 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { "aria-label": "Twitter", className: "hover:text-gold transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "h-4 w-4", strokeWidth: 1.25 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: col, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: head, children: "Shop" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", search: { category: "bags" }, className: link, children: "Shop Bags" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", search: { category: "footwear" }, className: link, children: "Shop Footwear" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/track", className: link, children: "Track Order" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", className: link, children: "My Account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: col, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: head, children: "Maison" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: link, children: "About Us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: link, children: "Contact Us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/faqs", className: link, children: "FAQs" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: col, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: head, children: "Policies" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/returns", className: link, children: "Return Policy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: link, children: "Privacy Policy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/terms", className: link, children: "Terms & Conditions" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-ivory/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-12 py-6 flex flex-col md:flex-row gap-3 items-center justify-between text-[11px] tracking-wide-2 uppercase text-ivory/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " IRAYA · Bags & Footwear · Crafted in India"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "hover:text-gold transition-colors", children: "Privacy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/terms", className: "hover:text-gold transition-colors", children: "Terms" })
      ] })
    ] }) })
  ] });
}
export {
  Footer as F,
  Navbar as N
};

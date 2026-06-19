import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, Search, User, ShoppingBag, X, LogIn, ShieldCheck, RotateCcw, Instagram, Facebook, Twitter } from "lucide-react";
import { u as useCart, d as supabase } from "./router-pa2HfNNz.js";
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userInitial, setUserInitial] = useState(null);
  const { count } = useCart();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "header",
      {
        className: `fixed top-0 left-0 right-0 z-50 transition-all duration-500 mobile-header ${scrolled ? "bg-ivory/85 backdrop-blur-md hairline-b" : "bg-transparent"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-10 grid grid-cols-3 items-center h-16 lg:h-20 navbar-grid", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDrawerOpen(true),
              className: "md:hidden text-foreground/80 hover:text-foreground transition-colors justify-self-start",
              "aria-label": "Open menu",
              children: /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6", strokeWidth: 1.25 })
            }
          ),
          /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center gap-8", children: [
            /* @__PURE__ */ jsx(Link, { to: "/collection", search: { category: "bags" }, className: navLink, children: "Bags" }),
            /* @__PURE__ */ jsx(Link, { to: "/collection", search: { category: "footwear" }, className: navLink, children: "Footwear" }),
            /* @__PURE__ */ jsx(Link, { to: "/track", className: navLink, children: "Track" })
          ] }),
          /* @__PURE__ */ jsx(Link, { to: "/", className: "justify-self-center logo-link", children: /* @__PURE__ */ jsx("span", { className: "font-serif text-2xl lg:text-[28px] tracking-luxury text-charcoal", children: "IRAYA" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-5 text-foreground/80 right-icons", children: [
            /* @__PURE__ */ jsx(Link, { to: "/collection", "aria-label": "Search", className: "hover:text-foreground transition-colors", children: /* @__PURE__ */ jsx(Search, { className: "h-[18px] w-[18px]", strokeWidth: 1.25 }) }),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/account",
                "aria-label": "Account",
                className: "relative hover:text-foreground transition-colors",
                children: userInitial ? /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center h-[22px] w-[22px] rounded-full bg-charcoal text-ivory text-[10px] font-medium font-sans", children: userInitial }) : /* @__PURE__ */ jsx(User, { className: "h-[18px] w-[18px]", strokeWidth: 1.25 })
              }
            ),
            /* @__PURE__ */ jsxs(Link, { to: "/cart", "aria-label": "Bag", className: "relative hover:text-foreground transition-colors", children: [
              /* @__PURE__ */ jsx(ShoppingBag, { className: "h-[18px] w-[18px]", strokeWidth: 1.25 }),
              count > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-2 text-[9px] tracking-wide-2 text-charcoal font-medium", children: count })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `mobile-drawer-backdrop md:hidden ${drawerOpen ? "open" : ""}`,
        onClick: () => setDrawerOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `mobile-drawer md:hidden ${drawerOpen ? "open" : ""}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 hairline-b", children: [
        /* @__PURE__ */ jsx("span", { className: "font-serif text-xl tracking-luxury text-charcoal", children: "IRAYA" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setDrawerOpen(false), "aria-label": "Close menu", children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6 text-foreground/80", strokeWidth: 1.25 }) })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "flex flex-col p-6 gap-6", children: [
        /* @__PURE__ */ jsx(Link, { to: "/collection", search: { category: "bags" }, onClick: () => setDrawerOpen(false), className: "drawer-link", children: "Bags" }),
        /* @__PURE__ */ jsx(Link, { to: "/collection", search: { category: "footwear" }, onClick: () => setDrawerOpen(false), className: "drawer-link", children: "Footwear" }),
        /* @__PURE__ */ jsx(Link, { to: "/collection", search: {}, onClick: () => setDrawerOpen(false), className: "drawer-link", children: "New Arrivals" }),
        /* @__PURE__ */ jsx(Link, { to: "/track", onClick: () => setDrawerOpen(false), className: "drawer-link", children: "Track Orders" }),
        /* @__PURE__ */ jsx("div", { className: "hairline-t pt-4 mt-2", children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/account",
            onClick: () => setDrawerOpen(false),
            className: "flex items-center gap-2 drawer-link",
            children: [
              /* @__PURE__ */ jsx(LogIn, { className: "h-4 w-4", strokeWidth: 1.25 }),
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
  return /* @__PURE__ */ jsxs("footer", { className: "bg-charcoal text-ivory mt-32", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-ivory/10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-12 py-8 grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "h-6 w-6 text-gold", strokeWidth: 1.25 }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] tracking-luxury uppercase text-ivory", children: "Secured Payments" }),
          /* @__PURE__ */ jsx("div", { className: "text-[12px] text-ivory/60", children: "256-bit SSL encryption · Razorpay protected" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(RotateCcw, { className: "h-6 w-6 text-gold", strokeWidth: 1.25 }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] tracking-luxury uppercase text-ivory", children: "Easy Returns" }),
          /* @__PURE__ */ jsx("div", { className: "text-[12px] text-ivory/60", children: "7-day return window · Hassle-free exchange" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-12 py-20 grid grid-cols-2 md:grid-cols-5 gap-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "col-span-2 md:col-span-2", children: [
        /* @__PURE__ */ jsx("div", { className: "font-serif text-3xl tracking-luxury", children: "IRAYA" }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-sm text-ivory/70 max-w-sm leading-relaxed", children: "A house of handcrafted bags and footwear — made in India, designed for the way you walk through the world." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex gap-4 text-ivory/70", children: [
          /* @__PURE__ */ jsx("a", { "aria-label": "Instagram", href: "https://www.instagram.com/irayaglobal?igsh=MW03aXd4eDZlaXZ3Yg==", target: "_blank", rel: "noopener noreferrer", className: "hover:text-gold transition-colors", children: /* @__PURE__ */ jsx(Instagram, { className: "h-4 w-4", strokeWidth: 1.25 }) }),
          /* @__PURE__ */ jsx("a", { "aria-label": "Facebook", className: "hover:text-gold transition-colors", children: /* @__PURE__ */ jsx(Facebook, { className: "h-4 w-4", strokeWidth: 1.25 }) }),
          /* @__PURE__ */ jsx("a", { "aria-label": "Twitter", className: "hover:text-gold transition-colors", children: /* @__PURE__ */ jsx(Twitter, { className: "h-4 w-4", strokeWidth: 1.25 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: col, children: [
        /* @__PURE__ */ jsx("div", { className: head, children: "Shop" }),
        /* @__PURE__ */ jsx(Link, { to: "/collection", search: { category: "bags" }, className: link, children: "Shop Bags" }),
        /* @__PURE__ */ jsx(Link, { to: "/collection", search: { category: "footwear" }, className: link, children: "Shop Footwear" }),
        /* @__PURE__ */ jsx(Link, { to: "/track", className: link, children: "Track Order" }),
        /* @__PURE__ */ jsx(Link, { to: "/account", className: link, children: "My Account" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: col, children: [
        /* @__PURE__ */ jsx("div", { className: head, children: "Maison" }),
        /* @__PURE__ */ jsx(Link, { to: "/about", className: link, children: "About Us" }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", className: link, children: "Contact Us" }),
        /* @__PURE__ */ jsx(Link, { to: "/faqs", className: link, children: "FAQs" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: col, children: [
        /* @__PURE__ */ jsx("div", { className: head, children: "Policies" }),
        /* @__PURE__ */ jsx(Link, { to: "/returns", className: link, children: "Return Policy" }),
        /* @__PURE__ */ jsx(Link, { to: "/privacy", className: link, children: "Privacy Policy" }),
        /* @__PURE__ */ jsx(Link, { to: "/terms", className: link, children: "Terms & Conditions" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-ivory/10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1600px] px-6 lg:px-12 py-6 flex flex-col md:flex-row gap-3 items-center justify-between text-[11px] tracking-wide-2 uppercase text-ivory/50", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " IRAYA · Bags & Footwear · Crafted in India"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
        /* @__PURE__ */ jsx(Link, { to: "/privacy", className: "hover:text-gold transition-colors", children: "Privacy" }),
        /* @__PURE__ */ jsx(Link, { to: "/terms", className: "hover:text-gold transition-colors", children: "Terms" })
      ] })
    ] }) })
  ] });
}
export {
  Footer as F,
  Navbar as N
};

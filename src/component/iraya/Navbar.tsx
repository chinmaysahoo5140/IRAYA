import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, User, ShoppingBag, Menu, X, LogIn } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userInitial, setUserInitial] = useState<string | null>(null);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Resolve the authenticated user's initial for the avatar dot
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const name =
        (data.user?.user_metadata?.full_name as string | undefined) ??
        data.user?.email ??
        null;
      setUserInitial(name ? name.charAt(0).toUpperCase() : null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const name =
          (session?.user?.user_metadata?.full_name as string | undefined) ??
          session?.user?.email ??
          null;
        setUserInitial(name ? name.charAt(0).toUpperCase() : null);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const navLink =
    "text-[11px] tracking-wide-2 uppercase text-foreground/80 hover:text-foreground transition-colors duration-300";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 mobile-header ${
          scrolled ? "bg-ivory/85 backdrop-blur-md hairline-b" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 grid grid-cols-3 items-center h-16 lg:h-20 navbar-grid">
          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden text-foreground/80 hover:text-foreground transition-colors justify-self-start"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" strokeWidth={1.25} />
          </button>

          {/* Desktop Nav (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/collection" search={{ category: "bags" }} className={navLink}>Bags</Link>
            <Link to="/collection" search={{ category: "footwear" }} className={navLink}>Footwear</Link>
            <Link to="/track" className={navLink}>Track</Link>
          </nav>

          {/* Logo (Centered) */}
          <Link to="/" className="justify-self-center logo-link">
            <span className="font-serif text-2xl lg:text-[28px] tracking-luxury text-charcoal">
              IRAYA
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center justify-end gap-5 text-foreground/80 right-icons">
            <Link to="/collection" aria-label="Search" className="hover:text-foreground transition-colors">
              <Search className="h-[18px] w-[18px]" strokeWidth={1.25} />
            </Link>

            {/* Account icon — shows initials if logged in */}
            <Link
              to="/account"
              aria-label="Account"
              className="relative hover:text-foreground transition-colors"
            >
              {userInitial ? (
                <span className="flex items-center justify-center h-[22px] w-[22px] rounded-full bg-charcoal text-ivory text-[10px] font-medium font-sans">
                  {userInitial}
                </span>
              ) : (
                <User className="h-[18px] w-[18px]" strokeWidth={1.25} />
              )}
            </Link>

            <Link to="/cart" aria-label="Bag" className="relative hover:text-foreground transition-colors">
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.25} />
              {count > 0 && (
                <span className="absolute -top-1 -right-2 text-[9px] tracking-wide-2 text-charcoal font-medium">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Drawer Overlay & Content (Mobile Only) */}
      <div
        className={`mobile-drawer-backdrop md:hidden ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />
      <div className={`mobile-drawer md:hidden ${drawerOpen ? "open" : ""}`}>
        <div className="flex items-center justify-between p-6 hairline-b">
          <span className="font-serif text-xl tracking-luxury text-charcoal">IRAYA</span>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <X className="h-6 w-6 text-foreground/80" strokeWidth={1.25} />
          </button>
        </div>
        <nav className="flex flex-col p-6 gap-6">
          <Link to="/collection" search={{ category: "bags" }} onClick={() => setDrawerOpen(false)} className="drawer-link">Bags</Link>
          <Link to="/collection" search={{ category: "footwear" }} onClick={() => setDrawerOpen(false)} className="drawer-link">Footwear</Link>
          <Link to="/collection" search={{}} onClick={() => setDrawerOpen(false)} className="drawer-link">New Arrivals</Link>
          <Link to="/track" onClick={() => setDrawerOpen(false)} className="drawer-link">Track Orders</Link>
          <div className="hairline-t pt-4 mt-2">
            <Link
              to="/account"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2 drawer-link"
            >
              <LogIn className="h-4 w-4" strokeWidth={1.25} />
              {userInitial ? "My Account" : "Sign In"}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}

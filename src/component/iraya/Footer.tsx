import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, ShieldCheck, RotateCcw } from "lucide-react";

export function Footer() {
  const col = "flex flex-col gap-3";
  const head = "text-[11px] tracking-wide-2 uppercase text-ivory/60 mb-3";
  const link = "text-[13px] text-ivory/80 hover:text-gold transition-colors duration-300 text-left";

  return (
    <footer className="bg-charcoal text-ivory mt-32">
      {/* Trust strip */}
      <div className="border-b border-ivory/10">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-6 w-6 text-gold" strokeWidth={1.25} />
            <div>
              <div className="text-[11px] tracking-luxury uppercase text-ivory">Secured Payments</div>
              <div className="text-[12px] text-ivory/60">256-bit SSL encryption · Razorpay protected</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <RotateCcw className="h-6 w-6 text-gold" strokeWidth={1.25} />
            <div>
              <div className="text-[11px] tracking-luxury uppercase text-ivory">Easy Returns</div>
              <div className="text-[12px] text-ivory/60">7-day return window · Hassle-free exchange</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-20 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2 md:col-span-2">
          <div className="font-serif text-3xl tracking-luxury">IRAYA</div>
          <p className="mt-6 text-sm text-ivory/70 max-w-sm leading-relaxed">
            A house of handcrafted bags and footwear — made in India, designed
            for the way you walk through the world.
          </p>
          <div className="mt-6 flex gap-4 text-ivory/70">
            <a aria-label="Instagram" href="https://www.instagram.com/irayaglobal?igsh=MW03aXd4eDZlaXZ3Yg==" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors"><Instagram className="h-4 w-4" strokeWidth={1.25} /></a>
            <a aria-label="Facebook" className="hover:text-gold transition-colors"><Facebook className="h-4 w-4" strokeWidth={1.25} /></a>
            <a aria-label="Twitter" className="hover:text-gold transition-colors"><Twitter className="h-4 w-4" strokeWidth={1.25} /></a>
          </div>
        </div>

        <div className={col}>
          <div className={head}>Shop</div>
          <Link to="/collection" search={{ category: "bags" }} className={link}>Shop Bags</Link>
          <Link to="/collection" search={{ category: "footwear" }} className={link}>Shop Footwear</Link>
          <Link to="/track" className={link}>Track Order</Link>
          <Link to="/account" className={link}>My Account</Link>
        </div>

        <div className={col}>
          <div className={head}>Maison</div>
          <Link to="/about" className={link}>About Us</Link>
          <Link to="/contact" className={link}>Contact Us</Link>
          <Link to="/faqs" className={link}>FAQs</Link>
        </div>

        <div className={col}>
          <div className={head}>Policies</div>
          <Link to="/returns" className={link}>Return Policy</Link>
          <Link to="/privacy" className={link}>Privacy Policy</Link>
          <Link to="/terms" className={link}>Terms &amp; Conditions</Link>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-6 flex flex-col md:flex-row gap-3 items-center justify-between text-[11px] tracking-wide-2 uppercase text-ivory/50">
          <div>© {new Date().getFullYear()} IRAYA · Bags &amp; Footwear · Crafted in India</div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

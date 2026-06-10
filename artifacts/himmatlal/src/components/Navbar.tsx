import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search, Heart, ShoppingBag, Phone } from "lucide-react";
import { useGetSettings } from "@workspace/api-client-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Our Story" },
  { href: "/products", label: "Collections" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Journal" },
  { href: "/testimonials", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

const announcementItems = [
  "Heritage Since 1959 — 65+ Years of Excellence",
  "Free Shipping on Orders Above ₹2,999",
  "Premium Home Furnishings — Handpicked for Your Home",
  "Visit Our Showroom in Vijay Nagar, Indore",
  "Three Generations of Craftsmanship",
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { data: settings } = useGetSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phone = settings?.phone ?? "9827738838";
  const whatsapp = settings?.whatsappNumber ?? "9827738838";

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar h-9 flex items-center overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <div className="marquee-track">
            {[...announcementItems, ...announcementItems].map((item, i) => (
              <span key={i} className="px-10 inline-flex items-center gap-3">
                <span className="text-amber-400 text-xs">✦</span>
                {item}
              </span>
            ))}
          </div>
        </div>
        <a
          href={`tel:${phone}`}
          className="hidden lg:flex items-center gap-1.5 px-5 text-[10px] tracking-widest uppercase border-l border-white/10 text-white/70 hover:text-white transition-colors shrink-0"
        >
          <Phone className="w-3 h-3" />
          {phone}
        </a>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white border-b border-neutral-150 shadow-sm"
            : "bg-white border-b border-neutral-100"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="flex items-center h-[60px] lg:h-[68px] gap-8">

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-1 text-neutral-700 hover:text-black transition-colors"
              onClick={() => setOpen(!open)}
              data-testid="button-menu-toggle"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Left nav — desktop */}
            <nav className="hidden lg:flex items-center gap-7 flex-1">
              {navLinks.slice(0, 4).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`luxury-nav hover-underline transition-colors ${
                    location === l.href ? "text-black" : "text-neutral-500 hover:text-black"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Logo — centered */}
            <div className="flex-1 lg:flex-none flex justify-center lg:absolute lg:left-1/2 lg:-translate-x-1/2">
              <Link href="/" className="flex flex-col items-center">
                <span className="font-serif text-[22px] lg:text-[26px] font-light tracking-[0.12em] text-black leading-none">
                  D Himmatlal
                </span>
                <span className="font-montserrat text-[9px] tracking-[0.28em] uppercase text-neutral-400 font-medium mt-0.5">
                  & Company • Est. 1959
                </span>
              </Link>
            </div>

            {/* Right nav — desktop */}
            <nav className="hidden lg:flex items-center gap-7 flex-1 justify-end">
              {navLinks.slice(4).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`luxury-nav hover-underline transition-colors ${
                    location === l.href ? "text-black" : "text-neutral-500 hover:text-black"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4 ml-auto lg:ml-0">
              <a
                href={`https://wa.me/${whatsapp}?text=Hi%20I'm%20interested%20in%20your%20products`}
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center gap-1.5 btn-luxury-filled text-[10px] py-2 px-4"
                data-testid="button-nav-whatsapp"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-neutral-100 z-50">
            <div className="px-5 py-6 space-y-0">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block py-3.5 luxury-nav border-b border-neutral-50 transition-colors ${
                    location === l.href ? "text-black" : "text-neutral-500"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-5 flex flex-col gap-3">
                <a
                  href={`tel:${phone}`}
                  className="btn-luxury text-center justify-center text-[11px]"
                >
                  Call: {phone}
                </a>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-luxury-filled text-center justify-center text-[11px]"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

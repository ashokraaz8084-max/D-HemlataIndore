import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { useGetSettings } from "@workspace/api-client-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Collections" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { data: settings } = useGetSettings();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className="font-serif text-xl font-bold text-amber-800 leading-tight">
              {settings?.logoText ?? "D Himmatlal"}
            </span>
            <span className="text-xs text-amber-600 tracking-widest uppercase">& Company</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-amber-700 ${
                  location === l.href ? "text-amber-700 border-b-2 border-amber-600 pb-0.5" : "text-stone-600"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Phone CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${settings?.phone ?? "9827738838"}`}
              className="flex items-center gap-1.5 text-sm text-amber-700 font-medium hover:text-amber-800"
              data-testid="link-phone"
            >
              <Phone className="w-4 h-4" />
              {settings?.phone ?? "9827738838"}
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-stone-600 hover:text-amber-700"
            onClick={() => setOpen(!open)}
            data-testid="button-menu-toggle"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-amber-100 px-4 pb-4">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2.5 text-sm font-medium text-stone-600 hover:text-amber-700 border-b border-stone-100 last:border-0"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`tel:${settings?.phone ?? "9827738838"}`}
            className="flex items-center gap-2 mt-3 text-sm text-amber-700 font-medium"
          >
            <Phone className="w-4 h-4" />
            {settings?.phone ?? "9827738838"}
          </a>
        </div>
      )}
    </header>
  );
}

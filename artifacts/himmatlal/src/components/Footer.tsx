import { Link } from "wouter";
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { useGetSettings } from "@workspace/api-client-react";

export default function Footer() {
  const { data: s } = useGetSettings();
  const phone = s?.phone ?? "9827738838";
  const email = s?.email ?? "himmatlal1959@gmail.com";
  const address = s?.address ?? "Vijay Nagar, Indore, Madhya Pradesh";
  const whatsapp = s?.whatsappNumber ?? "9827738838";

  return (
    <footer className="bg-[#111111] text-white">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="section-label text-amber-400/80 mb-2">Stay Connected</p>
            <h3 className="font-serif text-2xl lg:text-3xl font-light text-white">Exclusive Offers & New Collections</h3>
          </div>
          <div className="flex gap-0 w-full max-w-sm">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/5 border border-white/15 text-white text-xs px-4 py-3 outline-none placeholder:text-white/30 focus:border-white/30 transition-colors font-poppins tracking-wide"
            />
            <button className="bg-white text-black text-[10px] font-montserrat tracking-widest uppercase px-5 py-3 hover:bg-amber-50 transition-colors font-semibold shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <div className="font-serif text-2xl font-light tracking-[0.1em] text-white">D Himmatlal</div>
              <div className="font-montserrat text-[9px] tracking-[0.25em] uppercase text-white/30 mt-0.5">&amp; Company · Est. 1959</div>
            </div>
            <p className="text-white/40 text-xs leading-relaxed mb-6 font-light">
              Three generations of premium home furnishings. We bring the finest fabrics and home textiles crafted with timeless elegance.
            </p>
            <div className="flex gap-4">
              {s?.instagramUrl && (
                <a href={s.instagramUrl} target="_blank" rel="noreferrer" className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/40 hover:border-white/40 hover:text-white transition-all">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}
              {s?.facebookUrl && (
                <a href={s.facebookUrl} target="_blank" rel="noreferrer" className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/40 hover:border-white/40 hover:text-white transition-all">
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              )}
              {s?.youtubeUrl && (
                <a href={s.youtubeUrl} target="_blank" rel="noreferrer" className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/40 hover:border-white/40 hover:text-white transition-all">
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              )}
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/40 hover:border-white/40 hover:text-white transition-all text-[10px]"
              >
                W
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-white/30 font-semibold mb-6">Explore</h4>
            <ul className="space-y-3">
              {[["Home", "/"], ["Our Story", "/about"], ["Collections", "/products"], ["Gallery", "/gallery"], ["Journal", "/blog"], ["Reviews", "/testimonials"], ["Contact", "/contact"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-white/55 hover:text-white text-xs tracking-wide transition-colors hover-underline font-light">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-white/30 font-semibold mb-6">Collections</h4>
            <ul className="space-y-3">
              {["Bedsheets", "Dohars", "Curtains", "Sofa Fabrics", "Blankets", "Comforters", "Mattresses", "Pillows & Cushions"].map((c) => (
                <li key={c}>
                  <Link href="/products" className="text-white/55 hover:text-white text-xs tracking-wide transition-colors hover-underline font-light">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-white/30 font-semibold mb-6">Visit Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <MapPin className="w-3.5 h-3.5 text-white/25 mt-0.5 shrink-0" />
                <span className="text-white/55 text-xs leading-relaxed font-light">{address}</span>
              </li>
              <li>
                <a href={`tel:${phone}`} className="flex gap-3 items-center text-white/55 hover:text-white text-xs transition-colors">
                  <Phone className="w-3.5 h-3.5 text-white/25 shrink-0" />{phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex gap-3 items-center text-white/55 hover:text-white text-xs transition-colors">
                  <Mail className="w-3.5 h-3.5 text-white/25 shrink-0" />{email}
                </a>
              </li>
              <li className="pt-2">
                <p className="text-white/25 text-[10px] tracking-wider uppercase mb-1">Hours</p>
                <p className="text-white/50 text-xs font-light">Mon–Sat: 10am – 8pm</p>
                <p className="text-white/50 text-xs font-light">Sunday: 11am – 6pm</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-[10px] tracking-widest uppercase">
            {s?.footerText ?? "© 2024 D Himmatlal and Company. All rights reserved."}
          </p>
          <div className="flex items-center gap-5 text-[10px] tracking-wider uppercase text-white/25">
            <Link href="/admin" className="hover:text-white/60 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

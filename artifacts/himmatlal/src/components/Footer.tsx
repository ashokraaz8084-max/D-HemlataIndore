import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { useGetSettings } from "@workspace/api-client-react";

export default function Footer() {
  const { data: s } = useGetSettings();
  const phone = s?.phone ?? "9827738838";
  const whatsapp = s?.whatsappNumber ?? "9827738838";
  const email = s?.email ?? "himmatlal1959@gmail.com";

  return (
    <footer className="bg-dark-brown text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <span className="font-serif text-2xl font-bold text-amber-400">{s?.logoText ?? "D Himmatlal"}</span>
              <div className="text-xs tracking-widest uppercase text-amber-300/70 mt-0.5">& Company</div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">
              65+ years of heritage in premium home furnishings. Three generations of trust, quality, and craftsmanship.
            </p>
            <div className="flex gap-3 mt-4">
              {s?.facebookUrl && (
                <a href={s.facebookUrl} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-amber-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {s?.instagramUrl && (
                <a href={s.instagramUrl} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-amber-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {s?.youtubeUrl && (
                <a href={s.youtubeUrl} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-amber-400 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-amber-400 font-semibold mb-4 text-sm tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              {[["Home", "/"], ["About Us", "/about"], ["Collections", "/products"], ["Gallery", "/gallery"], ["Blog", "/blog"], ["Contact", "/contact"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-amber-300 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif text-amber-400 font-semibold mb-4 text-sm tracking-wider uppercase">Collections</h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              {["Bedsheets", "Dohars", "Curtains", "Sofa Fabrics", "Blankets", "Comforters", "Mattresses"].map((c) => (
                <li key={c}>
                  <Link href="/products" className="hover:text-amber-300 transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-amber-400 font-semibold mb-4 text-sm tracking-wider uppercase">Contact Us</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                <span>{s?.address ?? "Vijay Nagar, Indore, M.P."}</span>
              </li>
              <li>
                <a href={`tel:${phone}`} className="flex gap-2 hover:text-amber-300 transition-colors">
                  <Phone className="w-4 h-4 mt-0.5 text-amber-500" />
                  {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex gap-2 hover:text-amber-300 transition-colors">
                  <Mail className="w-4 h-4 mt-0.5 text-amber-500" />
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsapp}?text=Hi%20I%27m%20interested%20in%20your%20products`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-2 bg-green-700 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
                >
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="section-divider mt-12 mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>{s?.footerText ?? "© 2024 D Himmatlal and Company. 65+ Years of Trust, Quality & Heritage."}</p>
          <Link href="/admin" className="hover:text-amber-400 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}

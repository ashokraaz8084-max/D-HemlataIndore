import { Link } from "wouter";
import { ArrowRight, MessageCircle, Star, ChevronRight } from "lucide-react";
import { useGetHero, useGetAbout, useGetCategories, useGetProducts, useGetTestimonials, useGetSettings } from "@workspace/api-client-react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1920&q=90&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=90&auto=format&fit=crop",
];

const CATEGORY_IMAGES: Record<string, string> = {
  "bedsheets": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80&auto=format&fit=crop",
  "dohars": "https://images.unsplash.com/photo-1586105449897-20b5efeb3233?w=800&q=80&auto=format&fit=crop",
  "curtains": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop",
  "sofa-fabrics": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&auto=format&fit=crop",
  "blankets": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80&auto=format&fit=crop",
  "comforters": "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800&q=80&auto=format&fit=crop",
  "bedcovers": "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&q=80&auto=format&fit=crop",
  "mattresses": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80&auto=format&fit=crop",
  "pillows-cushions": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80&auto=format&fit=crop",
};

const PRODUCT_PLACEHOLDER = [
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1586105449897-20b5efeb3233?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80&auto=format&fit=crop",
];

function WhatsAppFloat({ number }: { number: string }) {
  return (
    <a
      href={`https://wa.me/${number}?text=Hi%20I'm%20interested%20in%20your%20home%20furnishings`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-3 shadow-lg transition-all hover:scale-105 text-xs font-montserrat tracking-wider uppercase font-semibold"
      data-testid="button-whatsapp-float"
    >
      <MessageCircle className="w-4 h-4" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}

export default function Home() {
  const { data: hero } = useGetHero();
  const { data: about } = useGetAbout();
  const { data: categories } = useGetCategories({ activeOnly: true });
  const { data: products } = useGetProducts({ featured: true, activeOnly: true });
  const { data: testimonials } = useGetTestimonials({ activeOnly: true });
  const { data: settings } = useGetSettings();

  const whatsapp = settings?.whatsappNumber ?? "9827738838";

  return (
    <div className="min-h-screen bg-white">
      <WhatsAppFloat number={whatsapp} />

      {/* ── HERO ── */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
        <img
          src={HERO_IMAGES[0]}
          alt="Premium Home Furnishings"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative h-full flex items-center">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-10 w-full">
            <div className="max-w-xl">
              <p className="section-label text-amber-300/90 mb-5">Heritage Since 1959</p>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white font-light leading-[1.05] mb-6 tracking-[0.02em]">
                {hero?.heading ?? (
                  <>65 Years of Heritage,<br /><em className="italic">Crafted in Every Thread</em></>
                )}
              </h1>
              <p className="text-white/65 text-sm font-light tracking-wide mb-10 max-w-md leading-relaxed">
                {hero?.subheading ?? "Premium home furnishings passed down through three generations — where luxury meets legacy."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={hero?.primaryButtonLink ?? "/products"}
                  className="btn-luxury-filled text-[11px]"
                  data-testid="button-hero-primary"
                >
                  {hero?.primaryButtonText ?? "Explore Collections"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {hero?.secondaryButtonText && (
                  <Link
                    href={hero.secondaryButtonLink ?? "/about"}
                    className="btn-luxury border-white text-white hover:bg-white hover:text-black text-[11px]"
                    data-testid="button-hero-secondary"
                  >
                    {hero.secondaryButtonText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Heritage numbers */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-8">
            <div className="flex gap-10 sm:gap-16">
              {[["65+", "Years of Excellence"], ["1959", "Year Founded"], ["3", "Generations"]].map(([val, label]) => (
                <div key={label} className="text-white">
                  <div className="font-serif text-3xl sm:text-4xl font-light">{val}</div>
                  <div className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-white/50 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-[#1a1a1a] overflow-hidden py-3.5">
        <div className="flex gap-0 marquee-track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex items-center gap-6 px-6 text-[10px] font-montserrat tracking-[0.18em] uppercase text-white/50">
              <span className="text-amber-500">✦</span> Premium Quality
              <span className="text-amber-500">✦</span> Heritage Craftsmanship
              <span className="text-amber-500">✦</span> Three Generations
              <span className="text-amber-500">✦</span> Since 1959
              <span className="text-amber-500">✦</span> Indore's Finest
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-3">Our Collections</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-light text-black leading-tight">
                Crafted for<br /><em className="italic">Every Room</em>
              </h2>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-[10px] font-montserrat tracking-widest uppercase text-black hover:text-neutral-500 transition-colors font-semibold">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
            {(categories ?? Array.from({ length: 9 })).slice(0, 9).map((cat: any, i) => (
              <Link
                key={cat?.id ?? i}
                href={cat ? `/products?category=${cat.id}` : "/products"}
                className="cat-card group block"
                data-testid={cat ? `card-category-${cat.id}` : undefined}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={cat?.imageUrl ?? (cat ? CATEGORY_IMAGES[cat.slug] : undefined) ?? `https://images.unsplash.com/photo-${1631049307264 + i * 10000}?w=400&q=75&auto=format&fit=crop`}
                    alt={cat?.name ?? "Category"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    onError={(e) => {
                      const idx = i % Object.values(CATEGORY_IMAGES).length;
                      (e.target as HTMLImageElement).src = Object.values(CATEGORY_IMAGES)[idx];
                    }}
                  />
                  <div className="cat-card-overlay" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-serif text-white text-lg font-light leading-tight tracking-wide">
                      {cat?.name ?? "Loading..."}
                    </h3>
                    <span className="font-montserrat text-[9px] tracking-widest uppercase text-white/60 mt-1 block group-hover:text-white/80 transition-colors">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/products" className="btn-luxury text-[10px]">View All Collections</Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT / STORY BANNER ── */}
      <section className="bg-[#faf9f7] py-20 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1615873968403-89e068629265?w=900&q=85&auto=format&fit=crop"
                  alt="Our Heritage"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#1a1a1a] p-6 hidden lg:block">
                <div className="font-serif text-4xl text-white font-light">{about?.yearsOfExperience ?? 65}+</div>
                <div className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-white/40 mt-1">Years of Excellence</div>
              </div>
            </div>
            <div>
              <p className="section-label mb-4">Our Legacy</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-light text-black mb-6 leading-tight">
                Three Generations of<br /><em className="italic">Unwavering Craft</em>
              </h2>
              <div className="divider-gold mb-6 ml-0" style={{ margin: "0 0 24px 0" }} />
              <p className="text-neutral-500 text-sm leading-relaxed mb-4 font-light">
                {about?.businessStory?.slice(0, 280) ?? "For over 65 years, Himmatlal and Company has been a cornerstone of quality home furnishings in Indore. Founded in 1959, our journey began with a simple promise — to bring the finest fabrics and home textiles to every Indian home."}
                {(about?.businessStory?.length ?? 0) > 280 ? "..." : ""}
              </p>
              <p className="text-neutral-400 text-xs italic font-light border-l-2 border-[#8b7355] pl-4 mb-8">
                "{about?.legacyText ?? "Three generations, one promise — the finest home furnishings for your family."}"
                <span className="block mt-1 not-italic font-montserrat text-[10px] tracking-widest uppercase text-neutral-400">
                  — {about?.founderName ?? "Late Himmatlal Vadalia"}, Founder
                </span>
              </p>
              <Link href="/about" className="btn-luxury text-[11px]" data-testid="button-about-cta">
                Discover Our Story <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {products && products.length > 0 && (
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
            <div className="text-center mb-14">
              <p className="section-label mb-3">Curated for You</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-light text-black">
                Featured <em className="italic">Collections</em>
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
              {products.slice(0, 8).map((product, i) => (
                <div key={product.id} className="group" data-testid={`card-product-${product.id}`}>
                  <Link href={`/products/${product.id}`}>
                    <div className="product-card-img aspect-[3/4] mb-3">
                      <img
                        src={product.imageUrl ?? PRODUCT_PLACEHOLDER[i % PRODUCT_PLACEHOLDER.length]}
                        alt={product.name}
                        onError={(e) => { (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER[i % PRODUCT_PLACEHOLDER.length]; }}
                      />
                    </div>
                    <div>
                      <p className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-neutral-400 mb-1">{product.categoryName}</p>
                      <h3 className="font-serif text-base font-light text-black group-hover:text-neutral-600 transition-colors leading-snug mb-1">
                        {product.name}
                      </h3>
                      <p className="font-poppins text-sm text-neutral-600">
                        {product.contactForPrice ? (
                          <span className="text-xs tracking-wide">Contact for Price</span>
                        ) : product.price ? (
                          product.price
                        ) : "—"}
                      </p>
                    </div>
                  </Link>
                  <a
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 w-full btn-luxury text-[9px] py-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    data-testid={`button-whatsapp-${product.id}`}
                  >
                    <MessageCircle className="w-3 h-3" />
                    Enquire Now
                  </a>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/products" className="btn-luxury text-[11px]">
                View All Collections <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FULL-WIDTH BANNER ── */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1920&q=85&auto=format&fit=crop"
          alt="Luxury Living"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div>
            <p className="section-label text-amber-300/80 mb-4">The Himmatlal Promise</p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-light leading-tight mb-6">
              Where Every Thread<br /><em className="italic">Tells a Story</em>
            </h2>
            <Link href="/contact" className="btn-luxury border-white text-white hover:bg-white hover:text-black text-[11px]">
              Visit Our Showroom
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 lg:py-28 bg-[#faf9f7]">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Our Difference</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-light text-black">
              The <em className="italic">Himmatlal</em> Promise
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {[
              { num: "01", title: "65+ Years\nof Trust", desc: "A legacy built on integrity and quality since 1959, earning the trust of thousands of families." },
              { num: "02", title: "Premium\nQuality", desc: "Every product is meticulously selected to meet the highest standards of fabric and craftsmanship." },
              { num: "03", title: "Three\nGenerations", desc: "A family-run business carrying deep expertise in home furnishings across three generations." },
              { num: "04", title: "Personalised\nService", desc: "We treat every customer like family, offering personalised guidance to find the perfect piece." },
            ].map(({ num, title, desc }) => (
              <div key={num} className="group">
                <div className="font-cormorant text-5xl font-light text-neutral-100 mb-4 leading-none">{num}</div>
                <h3 className="font-serif text-xl font-light text-black mb-3 whitespace-pre-line leading-snug">{title}</h3>
                <div className="w-6 h-px bg-[#8b7355] mb-4" />
                <p className="text-neutral-500 text-xs leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
            <div className="text-center mb-14">
              <p className="section-label mb-3">What They Say</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-light text-black">
                Customer <em className="italic">Voices</em>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {testimonials.slice(0, 4).map((t) => (
                <div key={t.id} className="border border-neutral-100 p-6 hover:border-neutral-200 transition-colors" data-testid={`card-testimonial-${t.id}`}>
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#8b7355] text-[#8b7355]" />
                    ))}
                  </div>
                  <p className="font-serif text-base font-light text-neutral-600 italic leading-relaxed mb-5">
                    "{t.review}"
                  </p>
                  <div className="border-t border-neutral-50 pt-4">
                    <p className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-black font-semibold">{t.customerName}</p>
                    <p className="font-montserrat text-[9px] text-neutral-400 tracking-wide mt-0.5">Verified Customer</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/testimonials" className="btn-luxury text-[11px]">Read All Reviews</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CONTACT CTA ── */}
      <section className="py-20 lg:py-24 bg-[#1a1a1a]">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 text-center">
          <p className="section-label text-amber-400/70 mb-4">Get in Touch</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-white font-light mb-4">
            Ready to Transform<br /><em className="italic">Your Home?</em>
          </h2>
          <p className="text-white/40 text-sm mb-10 font-light max-w-md mx-auto">
            Visit our showroom in Vijay Nagar, Indore or reach out for a personalised consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-luxury border-white text-white hover:bg-white hover:text-black text-[11px]">
              Contact Us <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href={`https://wa.me/${whatsapp}?text=Hi%20I'd%20like%20to%20know%20more%20about%20your%20home%20furnishings`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-8 py-[13px] text-[11px] font-montserrat tracking-widest uppercase font-semibold transition-colors"
              data-testid="button-whatsapp-cta"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

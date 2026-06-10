import { Link } from "wouter";
import { ArrowRight, Star, Shield, Award, Clock, MessageCircle, ChevronRight } from "lucide-react";
import { useGetHero, useGetAbout, useGetCategories, useGetProducts, useGetTestimonials, useGetSettings } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

function WhatsAppButton({ number, message = "Hi I'm interested in your products" }: { number: string; message?: string }) {
  return (
    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-xl transition-all hover:scale-105"
      data-testid="button-whatsapp-float"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-semibold hidden sm:inline">WhatsApp Us</span>
    </a>
  );
}

export default function Home() {
  const { data: hero, isLoading: heroLoading } = useGetHero();
  const { data: about } = useGetAbout();
  const { data: categories } = useGetCategories({ activeOnly: true });
  const { data: products } = useGetProducts({ featured: true, activeOnly: true });
  const { data: testimonials } = useGetTestimonials({ activeOnly: true });
  const { data: settings } = useGetSettings();

  const whatsapp = settings?.whatsappNumber ?? "9827738838";

  return (
    <div className="min-h-screen">
      <WhatsAppButton number={whatsapp} />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-brown">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-amber-950/80 to-stone-800" />
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,200,100,0.3) 40px, rgba(255,200,100,0.3) 41px)`,
        }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-900/40 border border-amber-700/40 text-amber-300 text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-8">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            Est. 1959 — Three Generations of Excellence
          </div>
          {heroLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-3/4 mx-auto bg-amber-900/30" />
              <Skeleton className="h-8 w-1/2 mx-auto bg-amber-900/30" />
            </div>
          ) : (
            <>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                {hero?.heading ?? "65 Years of Heritage, Crafted in Every Thread"}
              </h1>
              <p className="text-lg sm:text-xl text-amber-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                {hero?.subheading ?? "Premium home furnishings passed down through three generations — where luxury meets legacy."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={hero?.primaryButtonLink ?? "/products"}
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-sm font-semibold text-sm tracking-wide transition-all hover:shadow-lg hover:-translate-y-0.5"
                  data-testid="button-hero-primary"
                >
                  {hero?.primaryButtonText ?? "Explore Collections"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {hero?.secondaryButtonText && (
                  <Link
                    href={hero.secondaryButtonLink ?? "/about"}
                    className="inline-flex items-center gap-2 border border-amber-400/50 text-amber-200 hover:border-amber-300 hover:text-amber-100 px-8 py-4 rounded-sm font-semibold text-sm tracking-wide transition-all"
                    data-testid="button-hero-secondary"
                  >
                    {hero.secondaryButtonText}
                  </Link>
                )}
              </div>
            </>
          )}
          {/* Heritage stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto border-t border-amber-700/30 pt-10">
            {[["65+", "Years"], ["3", "Generations"], ["1959", "Founded"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-serif text-3xl font-bold text-amber-400">{num}</div>
                <div className="text-xs text-amber-300/60 tracking-widest uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-amber-400/30 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 bg-amber-400/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* HERITAGE STRIP */}
      <section className="bg-amber-700 py-5">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-8 text-white text-sm font-medium tracking-wide">
          {["Premium Quality", "65+ Years of Trust", "Three Generations", "Indore's Finest", "100% Authentic"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-200 rounded-full" />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-warm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-amber-600 text-xs tracking-widest uppercase font-semibold mb-3">Our Collections</p>
            <h2 className="font-serif text-4xl font-bold text-stone-800 mb-4">Crafted for Every Room</h2>
            <p className="text-stone-500 max-w-xl mx-auto">From the bedroom to the living room, discover our curated collection of premium home furnishings.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories ? categories.slice(0, 9).map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-amber-100"
                data-testid={`card-category-${cat.id}`}
              >
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <span className="font-serif text-5xl font-bold text-amber-200">{cat.name[0]}</span>
                  )}
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-semibold text-sm text-stone-800 group-hover:text-amber-700 transition-colors">{cat.name}</h3>
                </div>
              </Link>
            )) : Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/products" className="inline-flex items-center gap-2 text-amber-700 font-semibold text-sm hover:text-amber-800 border-b border-amber-300 pb-0.5 transition-colors">
              View All Collections <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {products && products.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-amber-600 text-xs tracking-widest uppercase font-semibold mb-3">Best Sellers</p>
              <h2 className="font-serif text-4xl font-bold text-stone-800 mb-4">Featured Collections</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm border border-stone-100 hover:shadow-md hover:-translate-y-1 transition-all"
                  data-testid={`card-product-${product.id}`}
                >
                  <div className="aspect-square bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="font-serif text-6xl font-bold text-amber-200">{product.name[0]}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-amber-600 mb-1">{product.categoryName}</p>
                    <h3 className="font-semibold text-stone-800 text-sm leading-snug group-hover:text-amber-700 transition-colors mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-700 text-sm">
                        {product.contactForPrice ? "Contact for Price" : product.price ?? "—"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-amber-600 text-xs tracking-widest uppercase font-semibold mb-3">Why Choose Us</p>
            <h2 className="font-serif text-4xl font-bold text-stone-800">The Himmatlal Difference</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "65+ Years Trust", desc: "A legacy built on honesty and quality since 1959." },
              { icon: Award, title: "Premium Quality", desc: "Every product is carefully selected to meet the highest standards." },
              { icon: Clock, title: "Three Generations", desc: "Family-run business with deep expertise in home furnishings." },
              { icon: Star, title: "Trusted by Thousands", desc: "Countless happy families across Madhya Pradesh." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center group">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                  <Icon className="w-7 h-7 text-amber-700" />
                </div>
                <h3 className="font-serif font-bold text-stone-800 mb-2">{title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT / FOUNDER */}
      <section className="py-20 bg-dark-brown text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-400 text-xs tracking-widest uppercase font-semibold mb-4">Our Legacy</p>
              <h2 className="font-serif text-4xl font-bold text-white mb-6">
                {about ? `${about.yearsOfExperience}+ Years of Craft & Heritage` : "65+ Years of Craft & Heritage"}
              </h2>
              <p className="text-stone-300 leading-relaxed mb-6">
                {about?.businessStory?.slice(0, 300) ?? "For over 65 years, Himmatlal and Company has been a cornerstone of quality home furnishings in Indore."}
                {about && about.businessStory.length > 300 ? "..." : ""}
              </p>
              <p className="text-stone-400 text-sm italic mb-8">
                — {about?.founderName ?? "Late Himmatlal Vadalia"}, Founder
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-sm text-sm font-semibold transition-all"
                data-testid="button-about-cta"
              >
                Read Our Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "65+", label: "Years in Business" },
                { value: "3", label: "Generations" },
                { value: "1959", label: "Year Founded" },
                { value: "1000+", label: "Happy Families" },
              ].map(({ value, label }) => (
                <div key={label} className="bg-amber-900/30 border border-amber-800/30 rounded-lg p-6 text-center">
                  <div className="font-serif text-4xl font-bold text-amber-400 mb-2">{value}</div>
                  <div className="text-xs text-stone-400 tracking-wide uppercase">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-amber-600 text-xs tracking-widest uppercase font-semibold mb-3">Testimonials</p>
              <h2 className="font-serif text-4xl font-bold text-stone-800">What Our Customers Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.slice(0, 4).map((t) => (
                <div key={t.id} className="bg-amber-50 rounded-lg p-6 border border-amber-100" data-testid={`card-testimonial-${t.id}`}>
                  <div className="flex mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed mb-4 italic">"{t.review}"</p>
                  <p className="font-semibold text-stone-800 text-sm">— {t.customerName}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/testimonials" className="inline-flex items-center gap-2 text-amber-700 font-semibold text-sm hover:text-amber-800 border-b border-amber-300 pb-0.5">
                View All Reviews <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT CTA */}
      <section className="py-20 bg-gradient-to-br from-amber-700 to-amber-900 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">Ready to Transform Your Home?</h2>
          <p className="text-amber-100/80 mb-8 leading-relaxed">
            Visit our showroom in Vijay Nagar or reach out to us for a personalized consultation. We bring luxury home furnishings to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-amber-800 hover:bg-amber-50 px-8 py-4 rounded-sm font-semibold text-sm transition-all">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/${whatsapp}?text=Hi%20I%27m%20interested%20in%20your%20products`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-sm font-semibold text-sm transition-all"
              data-testid="button-whatsapp-cta"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

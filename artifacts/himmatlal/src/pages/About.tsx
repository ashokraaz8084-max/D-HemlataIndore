import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useGetAbout, useGetSettings } from "@workspace/api-client-react";

export default function About() {
  const { data: about, isLoading } = useGetAbout();
  const { data: settings } = useGetSettings();
  const whatsapp = settings?.whatsappNumber ?? "9827738838";

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1615873968403-89e068629265?w=1920&q=90&auto=format&fit=crop"
          alt="Our Story"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div>
            <p className="section-label text-amber-300/80 mb-4">Our Heritage</p>
            <h1 className="font-serif text-5xl lg:text-6xl text-white font-light leading-tight">
              Three Generations of<br /><em className="italic">Unwavering Craft</em>
            </h1>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">
            <div>
              <p className="section-label mb-4">The Beginning</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-light text-black mb-6 leading-tight">
                {about?.yearsOfExperience ?? 65}+ Years of<br /><em className="italic">Excellence</em>
              </h2>
              <div className="w-10 h-px bg-[#8b7355] mb-8" />
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                  <div className="h-4 bg-neutral-100 rounded animate-pulse w-4/5" />
                  <div className="h-4 bg-neutral-100 rounded animate-pulse w-5/6" />
                </div>
              ) : (
                <>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-6 font-light">
                    {about?.businessStory ?? "For over 65 years, Himmatlal and Company has been a cornerstone of quality home furnishings in Indore. Founded in 1959, our journey began with a simple promise — to bring the finest fabrics and home textiles to every Indian home."}
                  </p>
                  <blockquote className="border-l-2 border-[#8b7355] pl-5 mb-8">
                    <p className="font-serif text-lg italic text-neutral-600 font-light leading-relaxed">
                      "{about?.legacyText ?? "Three generations, one promise — the finest home furnishings for your family."}"
                    </p>
                    <cite className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-neutral-400 not-italic mt-2 block">
                      — {about?.founderName ?? "Late Himmatlal Vadalia"}, Founder
                    </cite>
                  </blockquote>
                </>
              )}
              <Link href="/contact" className="btn-luxury text-[11px]">
                Visit Our Showroom <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85&auto=format&fit=crop"
                  alt="Heritage"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white border border-neutral-100 p-6 shadow-sm hidden lg:block">
                <div className="font-serif text-4xl text-black font-light">1959</div>
                <div className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-neutral-400 mt-1">Year Founded</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-[#1a1a1a] py-14">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              ["1959", "Year Founded"],
              [(about?.yearsOfExperience ?? 65) + "+", "Years of Excellence"],
              ["3", "Generations"],
              ["10,000+", "Families Served"],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-serif text-4xl lg:text-5xl text-white font-light mb-2">{val}</div>
                <div className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-white/30">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generations Timeline */}
      <section className="py-20 lg:py-28 bg-[#faf9f7]">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="text-center mb-16">
            <p className="section-label mb-3">Our Journey</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-light text-black">
              Three Generations,<br /><em className="italic">One Promise</em>
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-0">
            {[
              { year: "1959", gen: "1st Generation", name: "Late Himmatlal Vadalia", desc: "Founded the company with a simple vision: bring quality home furnishings to every Indian home. Built a reputation for honest business and premium quality in Indore's markets." },
              { year: "1980s", gen: "2nd Generation", name: "Sharad Himmatlal Vadalia", desc: "Expanded the business and deepened supplier relationships, modernising operations while carrying forward the founding values of quality, trust and customer care." },
              { year: "2010s", gen: "3rd Generation", name: "Current Leadership", desc: "Blending 65 years of heritage with modern retail experience, bringing the Himmatlal legacy into the digital age while honouring the family's founding promise." },
            ].map(({ year, gen, name, desc }, i) => (
              <div key={gen} className={`grid grid-cols-[80px_1px_1fr] gap-0 ${i < 2 ? "" : ""}`}>
                <div className="text-right pr-8 pt-1">
                  <span className="font-cormorant text-2xl font-light text-neutral-300">{year}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-[#8b7355] rounded-full mt-1.5 shrink-0 z-10" />
                  {i < 2 && <div className="w-px flex-1 bg-neutral-200 min-h-[80px]" />}
                </div>
                <div className="pl-8 pb-12">
                  <span className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-[#8b7355] font-semibold">{gen}</span>
                  <h3 className="font-serif text-xl font-light text-black mt-1 mb-2">{name}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed font-light">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white text-center border-t border-neutral-100">
        <p className="section-label mb-3">Experience the Legacy</p>
        <h2 className="font-serif text-3xl lg:text-4xl font-light text-black mb-6">
          Visit Our <em className="italic">Showroom</em>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" className="btn-luxury text-[11px]">Get Directions</Link>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank" rel="noreferrer"
            className="btn-luxury-filled text-[11px] inline-flex items-center justify-center gap-2"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

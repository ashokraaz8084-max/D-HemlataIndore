import { Star, Quote } from "lucide-react";
import { useGetTestimonials } from "@workspace/api-client-react";

export default function Testimonials() {
  const { data: testimonials, isLoading } = useGetTestimonials({ activeOnly: true });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#faf9f7] border-b border-neutral-100 py-16 lg:py-20 text-center">
        <p className="section-label mb-3">Customer Voices</p>
        <h1 className="font-serif text-5xl lg:text-6xl font-light text-black mb-3">
          What They <em className="italic">Say</em>
        </h1>
        <p className="text-neutral-400 text-xs tracking-wide font-light max-w-md mx-auto">
          Hear from thousands of families who've trusted us for 65 years.
        </p>
      </div>

      {/* Average Rating Strip */}
      {testimonials && testimonials.length > 0 && (
        <div className="border-b border-neutral-100 py-8">
          <div className="max-w-screen-xl mx-auto px-5 lg:px-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-16">
            <div className="text-center">
              <div className="font-serif text-5xl font-light text-black">
                {(testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)}
              </div>
              <div className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-neutral-400 mt-1">Average Rating</div>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#8b7355] text-[#8b7355]" />
              ))}
            </div>
            <div className="text-center">
              <div className="font-serif text-5xl font-light text-black">{testimonials.length}+</div>
              <div className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-neutral-400 mt-1">Happy Customers</div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-14 lg:py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-neutral-100 p-6 animate-pulse">
                <div className="h-3 bg-neutral-100 rounded mb-4 w-20" />
                <div className="h-4 bg-neutral-100 rounded mb-2 w-full" />
                <div className="h-4 bg-neutral-100 rounded mb-2 w-4/5" />
                <div className="h-4 bg-neutral-100 rounded w-3/5" />
              </div>
            ))}
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="border border-neutral-100 p-7 hover:border-neutral-200 hover:shadow-sm transition-all group"
                data-testid={`card-testimonial-${t.id}`}
              >
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? "fill-[#8b7355] text-[#8b7355]" : "text-neutral-200 fill-neutral-100"}`} />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-neutral-100 mb-3" />
                <p className="font-serif text-base font-light text-neutral-600 italic leading-relaxed mb-6">
                  {t.review}
                </p>
                <div className="border-t border-neutral-50 pt-4 flex items-center gap-3">
                  {t.imageUrl ? (
                    <img src={t.imageUrl} alt={t.customerName} className="w-9 h-9 object-cover" />
                  ) : (
                    <div className="w-9 h-9 bg-[#faf9f7] border border-neutral-100 flex items-center justify-center">
                      <span className="font-serif text-sm text-neutral-400">{t.customerName[0]}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-black font-semibold">{t.customerName}</p>
                    <p className="font-montserrat text-[9px] text-neutral-400 tracking-wide mt-0.5">Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-28">
            <p className="font-serif text-2xl font-light text-neutral-300 mb-2">No reviews yet</p>
            <p className="font-montserrat text-[10px] tracking-widest uppercase text-neutral-300">Check back soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

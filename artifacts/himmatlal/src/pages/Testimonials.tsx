import { Star } from "lucide-react";
import { useGetTestimonials } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Testimonials() {
  const { data: testimonials, isLoading } = useGetTestimonials({ activeOnly: true });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-dark-brown py-24 text-center">
        <p className="text-amber-400 text-xs tracking-widest uppercase font-semibold mb-3">Customer Love</p>
        <h1 className="font-serif text-5xl font-bold text-white mb-4">Testimonials</h1>
        <p className="text-stone-400 max-w-xl mx-auto">Hear what our customers say about 65 years of trust and quality.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-xl p-7 shadow-sm border border-stone-100 hover:shadow-md transition-all" data-testid={`card-testimonial-${t.id}`}>
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
                  ))}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-5 italic">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    {t.imageUrl ? (
                      <img src={t.imageUrl} alt={t.customerName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <span className="font-serif font-bold text-amber-700">{t.customerName[0]}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">{t.customerName}</p>
                    <p className="text-xs text-stone-400">Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-stone-400">No testimonials yet</div>
        )}
      </div>
    </div>
  );
}

import { useGetAbout, useGetSettings } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function About() {
  const { data: about, isLoading } = useGetAbout();
  const { data: settings } = useGetSettings();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-dark-brown py-24 text-center">
        <p className="text-amber-400 text-xs tracking-widest uppercase font-semibold mb-3">Our Story</p>
        <h1 className="font-serif text-5xl font-bold text-white mb-4">About Us</h1>
        <p className="text-stone-400 max-w-xl mx-auto">Three generations. One promise. The finest home furnishings for your family.</p>
      </div>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-amber-600 text-xs tracking-widest uppercase font-semibold mb-4">Our Heritage</p>
                <h2 className="font-serif text-3xl font-bold text-stone-800 mb-6">
                  {about?.yearsOfExperience ?? 65}+ Years of Excellence
                </h2>
                <p className="text-stone-600 leading-relaxed text-base mb-6">
                  {about?.businessStory ?? "For over 65 years, Himmatlal and Company has been a cornerstone of quality home furnishings."}
                </p>
                <blockquote className="border-l-4 border-amber-500 pl-5 italic text-stone-500 text-sm">
                  {about?.legacyText ?? "Three generations, one promise — the finest home furnishings for your family."}
                </blockquote>
              </div>
              <div className="space-y-6">
                <div className="bg-amber-50 rounded-lg p-6 border border-amber-100">
                  <h3 className="font-serif text-xl font-bold text-stone-800 mb-3">Our Founder</h3>
                  <p className="text-2xl font-serif text-amber-700 font-bold mb-2">{about?.founderName ?? "Late Himmatlal Vadalia"}</p>
                  <p className="text-stone-500 text-sm">Founded the company in 1959 with a vision to bring quality home textiles to every Indian household.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["1959", "Founded"],
                    [(about?.yearsOfExperience ?? 65) + "+", "Years"],
                    ["3", "Generations"],
                    ["1000+", "Families Served"],
                  ].map(([val, label]) => (
                    <div key={label} className="bg-stone-50 rounded-lg p-4 text-center border border-stone-100">
                      <div className="font-serif text-3xl font-bold text-amber-700">{val}</div>
                      <div className="text-xs text-stone-400 uppercase tracking-wide mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Generations Timeline */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-stone-800">Three Generations of Excellence</h2>
          </div>
          <div className="space-y-8">
            {[
              { gen: "1st Generation", name: "Late Himmatlal Vadalia", years: "1959 – 1990s", desc: "Founded the company with a simple vision: bring quality home furnishings to every Indian home. Built a reputation for honest business and premium quality." },
              { gen: "2nd Generation", name: "Sharad Himmatlal Vadalia", years: "1990s – 2010s", desc: "Expanded the business, deepened supplier relationships, and carried forward the founding values while adapting to modern customer needs." },
              { gen: "3rd Generation", name: "Current Leadership", years: "2010s – Present", desc: "Blending 65 years of heritage with modern retail experience, bringing the Himmatlal legacy into the digital age while honoring the family's founding promise." },
            ].map(({ gen, name, years, desc }, i) => (
              <div key={gen} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">{i + 1}</div>
                  {i < 2 && <div className="w-0.5 h-full bg-amber-200 mt-2 min-h-8" />}
                </div>
                <div className="bg-white rounded-lg p-6 border border-amber-100 flex-1 mb-0">
                  <span className="text-xs text-amber-600 font-semibold uppercase tracking-wide">{gen} · {years}</span>
                  <h3 className="font-serif text-xl font-bold text-stone-800 mt-1 mb-2">{name}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

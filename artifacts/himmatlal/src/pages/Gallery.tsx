import { useGetGallery } from "@workspace/api-client-react";

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1586105449897-20b5efeb3233?w=600&q=80&auto=format&fit=crop",
];

export default function Gallery() {
  const { data: images, isLoading } = useGetGallery();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#faf9f7] border-b border-neutral-100 py-16 lg:py-20 text-center">
        <p className="section-label mb-3">Visual Journey</p>
        <h1 className="font-serif text-5xl lg:text-6xl font-light text-black mb-3">
          Our <em className="italic">Gallery</em>
        </h1>
        <p className="text-neutral-400 text-xs tracking-wide font-light max-w-md mx-auto">
          A glimpse into our world of premium home furnishings — beauty in every thread.
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-14 lg:py-20">
        {isLoading ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`break-inside-avoid animate-pulse bg-neutral-100 ${i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/3]"}`} />
            ))}
          </div>
        ) : images && images.length > 0 ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {images.map((img, i) => (
              <div
                key={img.id}
                className="break-inside-avoid overflow-hidden group cursor-pointer img-zoom"
                data-testid={`img-gallery-${img.id}`}
              >
                <img
                  src={img.imageUrl ?? FALLBACK_IMGS[i % FALLBACK_IMGS.length]}
                  alt={img.title ?? `Gallery ${i + 1}`}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMGS[i % FALLBACK_IMGS.length]; }}
                />
                {img.title && (
                  <div className="bg-white py-2 px-1">
                    <p className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-neutral-400">{img.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3 mb-10">
              {FALLBACK_IMGS.map((src, i) => (
                <div key={i} className="break-inside-avoid overflow-hidden group img-zoom">
                  <img src={src} alt={`Gallery ${i + 1}`} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              ))}
            </div>
            <p className="text-center font-montserrat text-[10px] tracking-widest uppercase text-neutral-300">
              Gallery images can be managed from the admin panel
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

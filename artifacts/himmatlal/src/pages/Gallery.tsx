import { useGetGallery } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Gallery() {
  const { data: images, isLoading } = useGetGallery();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-dark-brown py-24 text-center">
        <p className="text-amber-400 text-xs tracking-widest uppercase font-semibold mb-3">Visual Journey</p>
        <h1 className="font-serif text-5xl font-bold text-white mb-4">Gallery</h1>
        <p className="text-stone-400 max-w-xl mx-auto">A glimpse into our world of premium home furnishings.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
          </div>
        ) : images && images.length > 0 ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((img, i) => (
              <div key={img.id} className="break-inside-avoid rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group" data-testid={`img-gallery-${img.id}`}>
                {img.imageUrl ? (
                  <img
                    src={img.imageUrl}
                    alt={img.title ?? `Gallery ${i + 1}`}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-amber-100 to-stone-100 flex items-center justify-center">
                    <span className="text-amber-300 font-serif text-4xl font-bold">H</span>
                  </div>
                )}
                {img.title && (
                  <div className="p-3 bg-white border-t border-stone-50">
                    <p className="text-xs text-stone-500 font-medium">{img.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-amber-50 to-stone-100 rounded-lg flex items-center justify-center">
                  <span className="font-serif text-6xl font-bold text-amber-200">H</span>
                </div>
              ))}
            </div>
            <p className="text-stone-400 mt-8">Gallery images will appear here once added by the admin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

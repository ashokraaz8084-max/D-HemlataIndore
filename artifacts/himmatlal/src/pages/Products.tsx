import { useState } from "react";
import { Link, useSearch } from "wouter";
import { useGetProducts, useGetCategories, useGetSettings } from "@workspace/api-client-react";
import { MessageCircle, ArrowRight } from "lucide-react";

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

export default function Products() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCat = params.get("category") ? parseInt(params.get("category")!) : undefined;
  const [selectedCat, setSelectedCat] = useState<number | undefined>(initialCat);

  const { data: categories } = useGetCategories();
  const { data: products, isLoading } = useGetProducts(selectedCat ? { categoryId: selectedCat, activeOnly: true } : { activeOnly: true });
  const { data: settings } = useGetSettings();
  const whatsapp = settings?.whatsappNumber ?? "9827738838";

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-[#faf9f7] border-b border-neutral-100 py-16 lg:py-20 text-center">
        <p className="section-label mb-3">Premium Selection</p>
        <h1 className="font-serif text-5xl lg:text-6xl font-light text-black mb-3">
          Our <em className="italic">Collections</em>
        </h1>
        <p className="text-neutral-400 text-xs tracking-wide font-light max-w-md mx-auto">
          Premium home furnishings for every room — crafted with care for 65 years.
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-14">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-12 border-b border-neutral-100 pb-6">
          <span className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-neutral-300 font-semibold mr-3">Filter:</span>
          <button
            onClick={() => setSelectedCat(undefined)}
            className={`px-4 py-1.5 font-montserrat text-[10px] tracking-[0.12em] uppercase font-medium transition-all ${!selectedCat ? "bg-[#1a1a1a] text-white" : "border border-neutral-200 text-neutral-500 hover:border-neutral-800 hover:text-black"}`}
            data-testid="button-filter-all"
          >
            All
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-1.5 font-montserrat text-[10px] tracking-[0.12em] uppercase font-medium transition-all ${selectedCat === cat.id ? "bg-[#1a1a1a] text-white" : "border border-neutral-200 text-neutral-500 hover:border-neutral-800 hover:text-black"}`}
              data-testid={`button-filter-${cat.id}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-neutral-100 mb-3" />
                <div className="h-3 bg-neutral-100 rounded w-1/2 mb-2" />
                <div className="h-4 bg-neutral-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product, i) => (
              <div key={product.id} className="group" data-testid={`card-product-${product.id}`}>
                <Link href={`/products/${product.id}`}>
                  <div className="product-card-img aspect-[3/4] mb-3">
                    <img
                      src={product.imageUrl ?? PRODUCT_PLACEHOLDER[i % PRODUCT_PLACEHOLDER.length]}
                      alt={product.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER[i % PRODUCT_PLACEHOLDER.length]; }}
                    />
                  </div>
                  <div className="mb-1">
                    <p className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-neutral-400 mb-1">{product.categoryName}</p>
                    <h3 className="font-serif text-base font-light text-black group-hover:text-neutral-600 transition-colors leading-snug">
                      {product.name}
                    </h3>
                    <p className="font-poppins text-sm text-neutral-500 mt-1">
                      {product.contactForPrice ? (
                        <span className="font-montserrat text-[10px] tracking-wide uppercase">Contact for Price</span>
                      ) : product.price ?? ""}
                    </p>
                    {!product.inStock && (
                      <span className="font-montserrat text-[9px] tracking-widest uppercase text-neutral-400 border border-neutral-200 px-2 py-0.5 mt-1 inline-block">Out of Stock</span>
                    )}
                  </div>
                </Link>
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 w-full flex items-center justify-center gap-1.5 border border-neutral-200 text-neutral-500 hover:bg-[#25D366] hover:border-[#25D366] hover:text-white font-montserrat text-[9px] tracking-widest uppercase py-2 transition-all opacity-0 group-hover:opacity-100"
                  data-testid={`button-whatsapp-${product.id}`}
                >
                  <MessageCircle className="w-3 h-3" />
                  Enquire
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-28">
            <p className="font-serif text-2xl font-light text-neutral-300 mb-2">No products found</p>
            <p className="font-montserrat text-[10px] tracking-widest uppercase text-neutral-300">Try a different category</p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-neutral-100 bg-[#faf9f7] py-14 text-center">
        <p className="font-serif text-2xl font-light text-black mb-2">
          Looking for something specific?
        </p>
        <p className="text-neutral-400 text-xs tracking-wide mb-6 font-light">Our team is happy to help you find the perfect piece.</p>
        <a
          href={`https://wa.me/${whatsapp}?text=Hi%20I'm%20looking%20for%20home%20furnishings`}
          target="_blank"
          rel="noreferrer"
          className="btn-luxury-filled text-[11px] inline-flex items-center gap-2"
          data-testid="button-whatsapp-bottom"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Chat with Us
        </a>
      </div>
    </div>
  );
}

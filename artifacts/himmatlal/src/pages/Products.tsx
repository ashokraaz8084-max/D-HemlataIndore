import { useState } from "react";
import { Link, useSearch } from "wouter";
import { useGetProducts, useGetCategories } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";
import { useGetSettings } from "@workspace/api-client-react";

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
    <div className="min-h-screen bg-background">
      <div className="bg-dark-brown py-24 text-center">
        <p className="text-amber-400 text-xs tracking-widest uppercase font-semibold mb-3">Our Range</p>
        <h1 className="font-serif text-5xl font-bold text-white mb-4">Collections</h1>
        <p className="text-stone-400 max-w-xl mx-auto">Premium home furnishings for every room and every season.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setSelectedCat(undefined)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${!selectedCat ? "bg-amber-700 text-white border-amber-700" : "border-stone-200 text-stone-600 hover:border-amber-400"}`}
            data-testid="button-filter-all"
          >
            All
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${selectedCat === cat.id ? "bg-amber-700 text-white border-amber-700" : "border-stone-200 text-stone-600 hover:border-amber-400"}`}
              data-testid={`button-filter-${cat.id}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-lg overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all" data-testid={`card-product-${product.id}`}>
                <Link href={`/products/${product.id}`}>
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
                    <p className="text-xs text-stone-400 line-clamp-2 mb-3">{product.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-700 text-sm">
                        {product.contactForPrice ? "Contact for Price" : product.price ?? "—"}
                      </span>
                      {!product.inStock && <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Out of Stock</span>}
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <a
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full bg-green-500 hover:bg-green-600 text-white text-xs py-2 rounded transition-colors"
                    data-testid={`button-whatsapp-${product.id}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Inquire on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-sm">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { Link, useParams } from "wouter";
import { ArrowLeft, MessageCircle, Package, Ruler, Palette, CheckCircle, XCircle } from "lucide-react";
import { useGetProduct, useGetSettings, useCreateInquiry } from "@workspace/api-client-react";

const PRODUCT_PLACEHOLDER = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85&auto=format&fit=crop";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id!);
  const { data: product, isLoading } = useGetProduct(productId, { query: { enabled: !!productId } });
  const { data: settings } = useGetSettings();
  const createInquiry = useCreateInquiry();
  const whatsapp = settings?.whatsappNumber ?? "9827738838";

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    createInquiry.mutate({
      data: { name: "WhatsApp Visitor", email: "wa@inquiry.com", message: `Interested in ${product.name}`, productId: product.id, productName: product.name, type: "product" }
    });
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Please share details.`)}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-neutral-100 py-4 px-5 lg:px-10">
          <div className="h-4 w-32 bg-neutral-100 rounded animate-pulse" />
        </div>
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
            <div className="aspect-[3/4] bg-neutral-100 animate-pulse" />
            <div className="space-y-4 pt-4">
              <div className="h-3 bg-neutral-100 rounded w-24 animate-pulse" />
              <div className="h-8 bg-neutral-100 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-neutral-100 rounded animate-pulse" />
              <div className="h-4 bg-neutral-100 rounded w-4/5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl font-light text-neutral-300 mb-4">Product not found</p>
          <Link href="/products" className="btn-luxury text-[10px]">Back to Collections</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-100 py-4">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 flex items-center gap-2">
          <Link href="/products" className="inline-flex items-center gap-2 font-montserrat text-[10px] tracking-[0.15em] uppercase text-neutral-400 hover:text-black transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Collections
          </Link>
          <span className="text-neutral-200">/</span>
          <span className="font-montserrat text-[10px] tracking-[0.12em] uppercase text-neutral-600">{product.name}</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
          {/* Image */}
          <div className="aspect-[3/4] overflow-hidden bg-[#faf9f7]">
            <img
              src={product.imageUrl ?? PRODUCT_PLACEHOLDER}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER; }}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="section-label mb-3">{product.categoryName}</p>
            <h1 className="font-serif text-4xl lg:text-5xl font-light text-black mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="w-10 h-px bg-[#8b7355] mb-6" />
            <p className="text-neutral-500 text-sm leading-relaxed mb-8 font-light">{product.shortDescription}</p>

            {/* Specs */}
            {(product.fabric || product.size || product.color) && (
              <div className="border-t border-b border-neutral-100 py-5 mb-8 space-y-3">
                {product.fabric && (
                  <div className="flex items-center gap-4">
                    <Package className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                    <span className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-neutral-400 w-16">Fabric</span>
                    <span className="text-sm text-neutral-600 font-light">{product.fabric}</span>
                  </div>
                )}
                {product.size && (
                  <div className="flex items-center gap-4">
                    <Ruler className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                    <span className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-neutral-400 w-16">Size</span>
                    <span className="text-sm text-neutral-600 font-light">{product.size}</span>
                  </div>
                )}
                {product.color && (
                  <div className="flex items-center gap-4">
                    <Palette className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                    <span className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-neutral-400 w-16">Color</span>
                    <span className="text-sm text-neutral-600 font-light">{product.color}</span>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  {product.inStock ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-green-600 font-semibold">In Stock</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                      <span className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-neutral-400">Out of Stock</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-8">
              {product.contactForPrice ? (
                <p className="font-serif text-2xl font-light text-black">Price on Request</p>
              ) : product.price ? (
                <p className="font-serif text-3xl font-light text-black">{product.price}</p>
              ) : null}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleWhatsAppInquiry}
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-montserrat text-[11px] tracking-widest uppercase py-3.5 px-6 font-semibold transition-colors"
                data-testid="button-whatsapp-product"
              >
                <MessageCircle className="w-4 h-4" />
                Enquire on WhatsApp
              </button>
              <Link
                href="/contact"
                className="flex-1 btn-luxury text-[11px] justify-center"
              >
                Contact Us
              </Link>
            </div>

            {/* Full description */}
            {product.fullDescription && (
              <div className="mt-10 pt-8 border-t border-neutral-100">
                <h3 className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-4 font-semibold">Product Details</h3>
                <p className="text-neutral-500 text-sm leading-relaxed font-light">{product.fullDescription}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

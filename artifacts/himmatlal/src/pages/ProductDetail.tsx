import { Link, useParams } from "wouter";
import { ArrowLeft, MessageCircle, Package, Ruler, Palette, CheckCircle, XCircle } from "lucide-react";
import { useGetProduct, useGetSettings, useCreateInquiry } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id!);
  const { data: product, isLoading } = useGetProduct(productId, { query: { enabled: !!productId } });
  const { data: settings } = useGetSettings();
  const createInquiry = useCreateInquiry();
  const { toast } = useToast();
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
      <div className="min-h-screen pt-20 p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 mb-4">Product not found</p>
          <Link href="/products" className="text-amber-700 hover:underline">Back to Collections</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-warm border-b border-amber-100 py-4">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/products" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Collections
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-gradient-to-br from-amber-50 to-stone-100 rounded-xl overflow-hidden flex items-center justify-center">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif text-9xl font-bold text-amber-200">{product.name[0]}</span>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-amber-600 text-xs tracking-widest uppercase font-semibold mb-2">{product.categoryName}</p>
            <h1 className="font-serif text-4xl font-bold text-stone-800 mb-4">{product.name}</h1>
            <p className="text-stone-500 leading-relaxed mb-6">{product.shortDescription}</p>

            {/* Specs */}
            <div className="space-y-3 mb-6 p-5 bg-amber-50 rounded-lg border border-amber-100">
              {product.fabric && (
                <div className="flex items-center gap-3 text-sm">
                  <Package className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-stone-500">Fabric:</span>
                  <span className="font-medium text-stone-700">{product.fabric}</span>
                </div>
              )}
              {product.size && (
                <div className="flex items-center gap-3 text-sm">
                  <Ruler className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-stone-500">Size:</span>
                  <span className="font-medium text-stone-700">{product.size}</span>
                </div>
              )}
              {product.color && (
                <div className="flex items-center gap-3 text-sm">
                  <Palette className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-stone-500">Color:</span>
                  <span className="font-medium text-stone-700">{product.color}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                {product.inStock ? (
                  <><CheckCircle className="w-4 h-4 text-green-600" /><span className="text-green-700 font-medium">In Stock</span></>
                ) : (
                  <><XCircle className="w-4 h-4 text-red-500" /><span className="text-red-600 font-medium">Out of Stock</span></>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mb-8">
              {product.contactForPrice ? (
                <p className="text-2xl font-serif font-bold text-amber-700">Contact for Price</p>
              ) : (
                <p className="text-2xl font-serif font-bold text-amber-700">{product.price}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleWhatsAppInquiry}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-sm font-semibold text-sm transition-all"
                data-testid="button-whatsapp-product"
              >
                <MessageCircle className="w-5 h-5" />
                Inquire on WhatsApp
              </button>
              <Link
                href="/contact"
                className="flex-1 flex items-center justify-center gap-2 border-2 border-amber-600 text-amber-700 hover:bg-amber-50 py-4 px-6 rounded-sm font-semibold text-sm transition-all"
              >
                Contact Us
              </Link>
            </div>

            {/* Full description */}
            {product.fullDescription && (
              <div className="mt-8 pt-8 border-t border-stone-100">
                <h3 className="font-serif text-lg font-bold text-stone-800 mb-3">Product Details</h3>
                <p className="text-stone-500 leading-relaxed text-sm">{product.fullDescription}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useGetInquiries, useDeleteInquiry, getGetInquiriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail, Phone, MessageSquare, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminInquiries() {
  const { data: inquiries, isLoading } = useGetInquiries();
  const del = useDeleteInquiry();
  const qc = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (!confirm("Delete this inquiry?")) return;
    del.mutate({ id }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetInquiriesQueryKey() });
        toast({ title: "Inquiry deleted!" });
      },
      onError: () => toast({ title: "Error deleting inquiry", variant: "destructive" }),
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-stone-800">Inquiries</h1>
        <p className="text-stone-500 text-sm mt-1">Customer messages and product inquiries</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : inquiries && inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div key={inq.id} className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-all" data-testid={`card-inquiry-${inq.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-semibold text-stone-800">{inq.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${inq.type === "product" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>
                      {inq.type}
                    </span>
                    <span className="text-xs text-stone-400">
                      {new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-stone-500 mb-3">
                    <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-amber-700 transition-colors">
                      <Mail className="w-3.5 h-3.5" />{inq.email}
                    </a>
                    {inq.phone && (
                      <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-amber-700 transition-colors">
                        <Phone className="w-3.5 h-3.5" />{inq.phone}
                      </a>
                    )}
                    {inq.productName && (
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />{inq.productName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-stone-300 mt-0.5 shrink-0" />
                    <p className="text-stone-600 text-sm leading-relaxed">{inq.message}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={`mailto:${inq.email}?subject=Re: Your Inquiry at D Himmatlal&body=Dear ${inq.name},%0A%0A`}
                    className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => handleDelete(inq.id)}
                    className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    data-testid={`button-delete-${inq.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-stone-100">
          <Mail className="w-12 h-12 text-stone-200 mx-auto mb-4" />
          <p className="text-stone-400 font-medium">No inquiries yet</p>
          <p className="text-stone-300 text-sm mt-1">Customer inquiries will appear here</p>
        </div>
      )}
    </div>
  );
}

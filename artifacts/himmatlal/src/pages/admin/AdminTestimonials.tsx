import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial, getGetTestimonialsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, X, Star } from "lucide-react";

const schema = z.object({
  customerName: z.string().min(1),
  review: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});
type FormData = z.infer<typeof schema>;

function TestimonialForm({ initial, onSave, onCancel, loading }: { initial?: any; onSave: (d: FormData) => void; onCancel: () => void; loading: boolean }) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? { ...initial, imageUrl: initial.imageUrl ?? "" }
      : { customerName: "", review: "", rating: 5, imageUrl: "", isActive: true },
  });

  const rating = form.watch("rating");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 bg-amber-50 border border-amber-100 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-stone-800">{initial ? "Edit Testimonial" : "Add Testimonial"}</h3>
          <button type="button" onClick={onCancel}><X className="w-4 h-4 text-stone-400" /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="customerName" render={({ field }) => (
            <FormItem><FormLabel>Customer Name</FormLabel><FormControl><Input {...field} data-testid="input-customerName" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="imageUrl" render={({ field }) => (
            <FormItem><FormLabel>Photo URL</FormLabel><FormControl><Input {...field} value={field.value ?? ""} data-testid="input-imageUrl" /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="review" render={({ field }) => (
          <FormItem><FormLabel>Review</FormLabel><FormControl><Textarea {...field} rows={4} data-testid="input-review" /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="rating" render={({ field }) => (
          <FormItem>
            <FormLabel>Rating</FormLabel>
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => field.onChange(n)}>
                  <Star className={`w-6 h-6 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-stone-200"} transition-colors`} />
                </button>
              ))}
              <span className="text-sm text-stone-500 ml-2">{rating}/5</span>
            </div>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="isActive" render={({ field }) => (
          <FormItem className="flex items-center gap-2 space-y-0">
            <FormControl><input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} className="w-4 h-4 accent-amber-600" data-testid="checkbox-isActive" /></FormControl>
            <FormLabel className="font-normal">Active (visible on website)</FormLabel>
          </FormItem>
        )} />
        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="bg-amber-700 hover:bg-amber-600 text-white" data-testid="button-save">{loading ? "Saving..." : "Save"}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Form>
  );
}

export default function AdminTestimonials() {
  const { data: testimonials, isLoading } = useGetTestimonials();
  const create = useCreateTestimonial();
  const update = useUpdateTestimonial();
  const del = useDeleteTestimonial();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [adding, setAdding] = useState(false);
  const invalidate = () => qc.invalidateQueries({ queryKey: getGetTestimonialsQueryKey() });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-800">Testimonials</h1>
          <p className="text-stone-500 text-sm mt-1">Manage customer reviews</p>
        </div>
        {!adding && !editing && (
          <Button onClick={() => setAdding(true)} className="bg-amber-700 hover:bg-amber-600 text-white" data-testid="button-add">
            <Plus className="w-4 h-4 mr-1" /> Add Review
          </Button>
        )}
      </div>

      {adding && <TestimonialForm onSave={(d) => create.mutate({ data: d }, { onSuccess: () => { invalidate(); setAdding(false); toast({ title: "Review added!" }); }, onError: () => toast({ title: "Error", variant: "destructive" }) })} onCancel={() => setAdding(false)} loading={create.isPending} />}
      {editing && <TestimonialForm initial={editing} onSave={(d) => update.mutate({ id: editing.id, data: d }, { onSuccess: () => { invalidate(); setEditing(null); toast({ title: "Review updated!" }); }, onError: () => toast({ title: "Error", variant: "destructive" }) })} onCancel={() => setEditing(null)} loading={update.isPending} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? <div className="text-stone-400 text-sm">Loading...</div> : testimonials?.map((t) => (
          <div key={t.id} className="bg-white rounded-xl p-6 shadow-sm border border-stone-100" data-testid={`card-testimonial-${t.id}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center font-serif font-bold text-amber-700">
                  {t.customerName[0]}
                </div>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{t.customerName}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />)}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.isActive ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-500"}`}>{t.isActive ? "Active" : "Hidden"}</span>
              </div>
            </div>
            <p className="text-stone-500 text-sm italic mb-4">"{t.review}"</p>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(t); setAdding(false); }} className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-700 border border-stone-200 px-2 py-1 rounded" data-testid={`button-edit-${t.id}`}><Pencil className="w-3 h-3" /> Edit</button>
              <button onClick={() => { if (confirm("Delete?")) del.mutate({ id: t.id }, { onSuccess: () => { invalidate(); toast({ title: "Deleted!" }); } }); }} className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-600 border border-stone-200 px-2 py-1 rounded" data-testid={`button-delete-${t.id}`}><Trash2 className="w-3 h-3" /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

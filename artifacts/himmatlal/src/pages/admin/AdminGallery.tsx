import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetGallery, useCreateGalleryImage, useUpdateGalleryImage, useDeleteGalleryImage, getGetGalleryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const schema = z.object({
  title: z.string().optional().nullable(),
  imageUrl: z.string().url("Valid URL required"),
  category: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).default(0),
});
type FormData = z.infer<typeof schema>;

function GalleryForm({ initial, onSave, onCancel, loading }: { initial?: any; onSave: (d: FormData) => void; onCancel: () => void; loading: boolean }) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? { ...initial, title: initial.title ?? "", category: initial.category ?? "" }
      : { title: "", imageUrl: "", category: "", displayOrder: 0 },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 bg-amber-50 border border-amber-100 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-stone-800">{initial ? "Edit Image" : "Add Image"}</h3>
          <button type="button" onClick={onCancel}><X className="w-4 h-4 text-stone-400" /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="imageUrl" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Image URL *</FormLabel><FormControl><Input {...field} placeholder="https://..." data-testid="input-imageUrl" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value ?? ""} data-testid="input-title" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem><FormLabel>Category Tag</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="e.g. Bedsheets" data-testid="input-category" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="displayOrder" render={({ field }) => (
            <FormItem><FormLabel>Display Order</FormLabel><FormControl><Input type="number" {...field} data-testid="input-displayOrder" /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="bg-amber-700 hover:bg-amber-600 text-white" data-testid="button-save">{loading ? "Saving..." : "Save"}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Form>
  );
}

export default function AdminGallery() {
  const { data: images, isLoading } = useGetGallery();
  const create = useCreateGalleryImage();
  const update = useUpdateGalleryImage();
  const del = useDeleteGalleryImage();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [adding, setAdding] = useState(false);
  const invalidate = () => qc.invalidateQueries({ queryKey: getGetGalleryQueryKey() });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-800">Gallery</h1>
          <p className="text-stone-500 text-sm mt-1">Manage gallery images</p>
        </div>
        {!adding && !editing && (
          <Button onClick={() => setAdding(true)} className="bg-amber-700 hover:bg-amber-600 text-white" data-testid="button-add">
            <Plus className="w-4 h-4 mr-1" /> Add Image
          </Button>
        )}
      </div>

      {adding && <GalleryForm onSave={(d) => create.mutate({ data: d }, { onSuccess: () => { invalidate(); setAdding(false); toast({ title: "Image added!" }); }, onError: () => toast({ title: "Error", variant: "destructive" }) })} onCancel={() => setAdding(false)} loading={create.isPending} />}
      {editing && <GalleryForm initial={editing} onSave={(d) => update.mutate({ id: editing.id, data: d }, { onSuccess: () => { invalidate(); setEditing(null); toast({ title: "Image updated!" }); }, onError: () => toast({ title: "Error", variant: "destructive" }) })} onCancel={() => setEditing(null)} loading={update.isPending} />}

      {isLoading ? <div className="text-stone-400 text-sm">Loading...</div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images?.map((img) => (
            <div key={img.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100" data-testid={`card-gallery-${img.id}`}>
              <div className="aspect-square bg-amber-50 flex items-center justify-center overflow-hidden">
                {img.imageUrl ? (
                  <img src={img.imageUrl} alt={img.title ?? "Gallery"} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <span className="text-amber-200 font-serif text-4xl font-bold">H</span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-stone-700 truncate">{img.title ?? "Untitled"}</p>
                {img.category && <p className="text-xs text-stone-400">{img.category}</p>}
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditing(img); setAdding(false); }} className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-stone-400 hover:text-amber-700" data-testid={`button-edit-${img.id}`}><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => { if (confirm("Delete image?")) del.mutate({ id: img.id }, { onSuccess: () => { invalidate(); toast({ title: "Deleted!" }); } }); }} className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-stone-400 hover:text-red-600" data-testid={`button-delete-${img.id}`}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

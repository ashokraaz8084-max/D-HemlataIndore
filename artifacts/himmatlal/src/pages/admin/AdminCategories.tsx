import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, getGetCategoriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});
type FormData = z.infer<typeof schema>;

type Category = { id: number; name: string; slug: string; description?: string | null; imageUrl?: string | null; displayOrder: number; isActive: boolean };

function CategoryForm({ initial, onSave, onCancel, loading }: { initial?: Category; onSave: (d: FormData) => void; onCancel: () => void; loading: boolean }) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? { ...initial, description: initial.description ?? "", imageUrl: initial.imageUrl ?? "" }
      : { name: "", slug: "", description: "", imageUrl: "", displayOrder: 0, isActive: true },
  });

  const name = form.watch("name");
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("name", e.target.value);
    if (!initial) form.setValue("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 bg-amber-50 border border-amber-100 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-stone-800">{initial ? "Edit Category" : "Add Category"}</h3>
          <button type="button" onClick={onCancel} className="text-stone-400 hover:text-stone-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} onChange={handleNameChange} data-testid="input-name" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="slug" render={({ field }) => (
            <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} data-testid="input-slug" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="imageUrl" render={({ field }) => (
            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} value={field.value ?? ""} data-testid="input-imageUrl" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="displayOrder" render={({ field }) => (
            <FormItem><FormLabel>Display Order</FormLabel><FormControl><Input type="number" {...field} data-testid="input-displayOrder" /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} rows={2} data-testid="input-description" /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="bg-amber-700 hover:bg-amber-600 text-white" data-testid="button-save">{loading ? "Saving..." : "Save"}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Form>
  );
}

export default function AdminCategories() {
  const { data: categories, isLoading } = useGetCategories();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const del = useDeleteCategory();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Category | null>(null);
  const [adding, setAdding] = useState(false);

  const invalidate = () => qc.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });

  const handleCreate = (data: FormData) => {
    create.mutate({ data }, { onSuccess: () => { invalidate(); setAdding(false); toast({ title: "Category created!" }); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
  };
  const handleUpdate = (data: FormData) => {
    if (!editing) return;
    update.mutate({ id: editing.id, data }, { onSuccess: () => { invalidate(); setEditing(null); toast({ title: "Category updated!" }); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
  };
  const handleDelete = (id: number) => {
    if (!confirm("Delete this category?")) return;
    del.mutate({ id }, { onSuccess: () => { invalidate(); toast({ title: "Category deleted!" }); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-800">Categories</h1>
          <p className="text-stone-500 text-sm mt-1">Manage product categories</p>
        </div>
        {!adding && !editing && (
          <Button onClick={() => setAdding(true)} className="bg-amber-700 hover:bg-amber-600 text-white" data-testid="button-add">
            <Plus className="w-4 h-4 mr-1" /> Add Category
          </Button>
        )}
      </div>

      {adding && <CategoryForm onSave={handleCreate} onCancel={() => setAdding(false)} loading={create.isPending} />}
      {editing && <CategoryForm initial={editing} onSave={handleUpdate} onCancel={() => setEditing(null)} loading={update.isPending} />}

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-stone-400 text-sm">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-stone-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {categories?.map((cat) => (
                <tr key={cat.id} className="hover:bg-stone-50 transition-colors" data-testid={`row-category-${cat.id}`}>
                  <td className="px-6 py-4 font-medium text-stone-800">{cat.name}</td>
                  <td className="px-6 py-4 text-stone-400 font-mono text-xs">{cat.slug}</td>
                  <td className="px-6 py-4 text-stone-500">{cat.displayOrder}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${cat.isActive ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                      {cat.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setEditing(cat as Category); setAdding(false); }} className="text-stone-400 hover:text-amber-700 p-1" data-testid={`button-edit-${cat.id}`}><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(cat.id)} className="text-stone-400 hover:text-red-600 p-1" data-testid={`button-delete-${cat.id}`}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

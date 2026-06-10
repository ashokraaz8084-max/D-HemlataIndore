import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetProducts, useGetCategories, useCreateProduct, useUpdateProduct, useDeleteProduct, getGetProductsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, X, Star } from "lucide-react";

const schema = z.object({
  categoryId: z.coerce.number().int().min(1, "Category required"),
  name: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  contactForPrice: z.boolean().default(false),
  fabric: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  inStock: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
type FormData = z.infer<typeof schema>;

function ProductForm({ initial, categories, onSave, onCancel, loading }: { initial?: any; categories: any[]; onSave: (d: FormData) => void; onCancel: () => void; loading: boolean }) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? { ...initial, categoryId: initial.categoryId, shortDescription: initial.shortDescription ?? "", fullDescription: initial.fullDescription ?? "", price: initial.price ?? "", fabric: initial.fabric ?? "", size: initial.size ?? "", color: initial.color ?? "", imageUrl: initial.imageUrl ?? "" }
      : { categoryId: 0, name: "", slug: "", shortDescription: "", fullDescription: "", price: "", contactForPrice: false, fabric: "", size: "", color: "", imageUrl: "", inStock: true, isFeatured: false, isActive: true },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 bg-amber-50 border border-amber-100 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-stone-800">{initial ? "Edit Product" : "Add Product"}</h3>
          <button type="button" onClick={onCancel}><X className="w-4 h-4 text-stone-400" /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="categoryId" render={({ field }) => (
            <FormItem><FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={String(field.value)}>
                <FormControl><SelectTrigger data-testid="select-category"><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                <SelectContent>{categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} onChange={(e) => { field.onChange(e); if (!initial) form.setValue("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }} data-testid="input-name" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="slug" render={({ field }) => (
            <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} data-testid="input-slug" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="price" render={({ field }) => (
            <FormItem><FormLabel>Price</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="₹1,299" data-testid="input-price" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="fabric" render={({ field }) => (
            <FormItem><FormLabel>Fabric</FormLabel><FormControl><Input {...field} value={field.value ?? ""} data-testid="input-fabric" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="size" render={({ field }) => (
            <FormItem><FormLabel>Size</FormLabel><FormControl><Input {...field} value={field.value ?? ""} data-testid="input-size" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="color" render={({ field }) => (
            <FormItem><FormLabel>Color</FormLabel><FormControl><Input {...field} value={field.value ?? ""} data-testid="input-color" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="imageUrl" render={({ field }) => (
            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} value={field.value ?? ""} data-testid="input-imageUrl" /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="shortDescription" render={({ field }) => (
          <FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} rows={2} data-testid="input-shortDescription" /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="fullDescription" render={({ field }) => (
          <FormItem><FormLabel>Full Description</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} rows={4} data-testid="input-fullDescription" /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="flex gap-6 flex-wrap">
          {(["contactForPrice", "inStock", "isFeatured", "isActive"] as const).map((name) => (
            <FormField key={name} control={form.control} name={name} render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl><input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} className="w-4 h-4 accent-amber-600" data-testid={`checkbox-${name}`} /></FormControl>
                <FormLabel className="font-normal capitalize">{name.replace(/([A-Z])/g, " $1")}</FormLabel>
              </FormItem>
            )} />
          ))}
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="bg-amber-700 hover:bg-amber-600 text-white" data-testid="button-save">{loading ? "Saving..." : "Save"}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Form>
  );
}

export default function AdminProducts() {
  const { data: products, isLoading } = useGetProducts();
  const { data: categories } = useGetCategories();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const del = useDeleteProduct();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [adding, setAdding] = useState(false);

  const invalidate = () => qc.invalidateQueries({ queryKey: getGetProductsQueryKey() });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-800">Products</h1>
          <p className="text-stone-500 text-sm mt-1">Manage your product catalog</p>
        </div>
        {!adding && !editing && (
          <Button onClick={() => setAdding(true)} className="bg-amber-700 hover:bg-amber-600 text-white" data-testid="button-add">
            <Plus className="w-4 h-4 mr-1" /> Add Product
          </Button>
        )}
      </div>

      {adding && (
        <ProductForm
          categories={categories ?? []}
          onSave={(data) => create.mutate({ data }, { onSuccess: () => { invalidate(); setAdding(false); toast({ title: "Product created!" }); }, onError: () => toast({ title: "Error", variant: "destructive" }) })}
          onCancel={() => setAdding(false)}
          loading={create.isPending}
        />
      )}
      {editing && (
        <ProductForm
          initial={editing}
          categories={categories ?? []}
          onSave={(data) => update.mutate({ id: editing.id, data }, { onSuccess: () => { invalidate(); setEditing(null); toast({ title: "Product updated!" }); }, onError: () => toast({ title: "Error", variant: "destructive" }) })}
          onCancel={() => setEditing(null)}
          loading={update.isPending}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-stone-400 text-sm">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-stone-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {products?.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors" data-testid={`row-product-${p.id}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                        {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" /> : <span className="text-amber-300 font-serif font-bold">{p.name[0]}</span>}
                      </div>
                      <div>
                        <p className="font-medium text-stone-800 flex items-center gap-1">
                          {p.name}
                          {p.isFeatured && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                        </p>
                        <p className="text-xs text-stone-400">{p.fabric}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-500">{p.categoryName}</td>
                  <td className="px-6 py-4 text-stone-600">{p.contactForPrice ? "Contact" : p.price ?? "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-500"}`}>{p.isActive ? "Active" : "Hidden"}</span>
                      {!p.inStock && <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600">Out of Stock</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setEditing(p); setAdding(false); }} className="text-stone-400 hover:text-amber-700 p-1" data-testid={`button-edit-${p.id}`}><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => { if (confirm("Delete product?")) del.mutate({ id: p.id }, { onSuccess: () => { invalidate(); toast({ title: "Deleted!" }); } }); }} className="text-stone-400 hover:text-red-600 p-1" data-testid={`button-delete-${p.id}`}><Trash2 className="w-4 h-4" /></button>
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

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog, getGetBlogsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  category: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  publishedDate: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});
type FormData = z.infer<typeof schema>;

function BlogForm({ initial, onSave, onCancel, loading }: { initial?: any; onSave: (d: FormData) => void; onCancel: () => void; loading: boolean }) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? { ...initial, category: initial.category ?? "", imageUrl: initial.imageUrl ?? "", publishedDate: initial.publishedDate ?? "" }
      : { title: "", slug: "", content: "", category: "", imageUrl: "", publishedDate: new Date().toISOString().split("T")[0], isActive: true },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 bg-amber-50 border border-amber-100 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-stone-800">{initial ? "Edit Blog" : "Add Blog"}</h3>
          <button type="button" onClick={onCancel}><X className="w-4 h-4 text-stone-400" /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Title</FormLabel><FormControl><Input {...field} onChange={(e) => { field.onChange(e); if (!initial) form.setValue("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }} data-testid="input-title" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="slug" render={({ field }) => (
            <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} data-testid="input-slug" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="e.g. Home Decor" data-testid="input-category" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="imageUrl" render={({ field }) => (
            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} value={field.value ?? ""} data-testid="input-imageUrl" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="publishedDate" render={({ field }) => (
            <FormItem><FormLabel>Published Date</FormLabel><FormControl><Input type="date" {...field} value={field.value ?? ""} data-testid="input-publishedDate" /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea {...field} rows={10} data-testid="input-content" /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="isActive" render={({ field }) => (
          <FormItem className="flex items-center gap-2 space-y-0">
            <FormControl><input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} className="w-4 h-4 accent-amber-600" data-testid="checkbox-isActive" /></FormControl>
            <FormLabel className="font-normal">Published</FormLabel>
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

export default function AdminBlogs() {
  const { data: blogs, isLoading } = useGetBlogs();
  const create = useCreateBlog();
  const update = useUpdateBlog();
  const del = useDeleteBlog();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [adding, setAdding] = useState(false);
  const invalidate = () => qc.invalidateQueries({ queryKey: getGetBlogsQueryKey() });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-800">Blogs</h1>
          <p className="text-stone-500 text-sm mt-1">Manage blog posts</p>
        </div>
        {!adding && !editing && (
          <Button onClick={() => setAdding(true)} className="bg-amber-700 hover:bg-amber-600 text-white" data-testid="button-add">
            <Plus className="w-4 h-4 mr-1" /> Add Blog
          </Button>
        )}
      </div>

      {adding && <BlogForm onSave={(d) => create.mutate({ data: d }, { onSuccess: () => { invalidate(); setAdding(false); toast({ title: "Blog created!" }); }, onError: () => toast({ title: "Error", variant: "destructive" }) })} onCancel={() => setAdding(false)} loading={create.isPending} />}
      {editing && <BlogForm initial={editing} onSave={(d) => update.mutate({ id: editing.id, data: d }, { onSuccess: () => { invalidate(); setEditing(null); toast({ title: "Blog updated!" }); }, onError: () => toast({ title: "Error", variant: "destructive" }) })} onCancel={() => setEditing(null)} loading={update.isPending} />}

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        {isLoading ? <div className="p-6 text-stone-400 text-sm">Loading...</div> : (
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-stone-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {blogs?.map((b) => (
                <tr key={b.id} className="hover:bg-stone-50 transition-colors" data-testid={`row-blog-${b.id}`}>
                  <td className="px-6 py-4 font-medium text-stone-800 max-w-xs truncate">{b.title}</td>
                  <td className="px-6 py-4 text-stone-500">{b.category ?? "—"}</td>
                  <td className="px-6 py-4 text-stone-500">{b.publishedDate ? new Date(b.publishedDate).toLocaleDateString("en-IN") : "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${b.isActive ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-500"}`}>{b.isActive ? "Published" : "Draft"}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setEditing(b); setAdding(false); }} className="text-stone-400 hover:text-amber-700 p-1" data-testid={`button-edit-${b.id}`}><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => { if (confirm("Delete blog?")) del.mutate({ id: b.id }, { onSuccess: () => { invalidate(); toast({ title: "Deleted!" }); } }); }} className="text-stone-400 hover:text-red-600 p-1" data-testid={`button-delete-${b.id}`}><Trash2 className="w-4 h-4" /></button>
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

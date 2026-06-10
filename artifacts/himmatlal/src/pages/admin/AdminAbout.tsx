import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetAbout, useUpdateAbout, getGetAboutQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  businessStory: z.string().min(1),
  founderName: z.string().min(1),
  legacyText: z.string().min(1),
  yearsOfExperience: z.coerce.number().int().min(1),
  imageUrl: z.string().optional().nullable(),
  founderImageUrl: z.string().optional().nullable(),
});
type FormData = z.infer<typeof schema>;

export default function AdminAbout() {
  const { data, isLoading } = useGetAbout();
  const update = useUpdateAbout();
  const qc = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { businessStory: "", founderName: "", legacyText: "", yearsOfExperience: 65, imageUrl: "", founderImageUrl: "" },
  });

  useEffect(() => {
    if (data) form.reset({ ...data, imageUrl: data.imageUrl ?? "", founderImageUrl: data.founderImageUrl ?? "" });
  }, [data, form]);

  const onSubmit = (values: FormData) => {
    update.mutate({ data: values }, {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAboutQueryKey() }); toast({ title: "About section saved!" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">About Section</h1>
      <p className="text-stone-500 text-sm mb-8">Edit the business story and founder information.</p>
      {isLoading ? <div className="text-stone-400 text-sm">Loading...</div> : (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-stone-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="businessStory" render={({ field }) => (
                <FormItem><FormLabel>Business Story</FormLabel><FormControl><Textarea {...field} rows={5} data-testid="input-businessStory" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="legacyText" render={({ field }) => (
                <FormItem><FormLabel>Legacy Text (Quote)</FormLabel><FormControl><Textarea {...field} rows={3} data-testid="input-legacyText" /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="founderName" render={({ field }) => (
                  <FormItem><FormLabel>Founder Name</FormLabel><FormControl><Input {...field} data-testid="input-founderName" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="yearsOfExperience" render={({ field }) => (
                  <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" {...field} data-testid="input-yearsOfExperience" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>About Image URL</FormLabel><FormControl><Input {...field} value={field.value ?? ""} data-testid="input-imageUrl" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="founderImageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Founder Image URL</FormLabel><FormControl><Input {...field} value={field.value ?? ""} data-testid="input-founderImageUrl" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <Button type="submit" disabled={update.isPending} className="bg-amber-700 hover:bg-amber-600 text-white" data-testid="button-save">
                {update.isPending ? "Saving..." : "Save About Section"}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetHero, useUpdateHero, getGetHeroQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  heading: z.string().min(1),
  subheading: z.string().min(1),
  primaryButtonText: z.string().min(1),
  primaryButtonLink: z.string().min(1),
  secondaryButtonText: z.string().optional().nullable(),
  secondaryButtonLink: z.string().optional().nullable(),
  backgroundImageUrl: z.string().optional().nullable(),
});
type FormData = z.infer<typeof schema>;

export default function AdminHero() {
  const { data, isLoading } = useGetHero();
  const update = useUpdateHero();
  const qc = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { heading: "", subheading: "", primaryButtonText: "", primaryButtonLink: "", secondaryButtonText: "", secondaryButtonLink: "", backgroundImageUrl: "" },
  });

  useEffect(() => {
    if (data) form.reset({ ...data, secondaryButtonText: data.secondaryButtonText ?? "", secondaryButtonLink: data.secondaryButtonLink ?? "", backgroundImageUrl: data.backgroundImageUrl ?? "" });
  }, [data, form]);

  const onSubmit = (values: FormData) => {
    update.mutate({ data: values }, {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getGetHeroQueryKey() }); toast({ title: "Hero section saved!" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Hero Section</h1>
      <p className="text-stone-500 text-sm mb-8">Edit the main hero banner displayed on the home page.</p>
      {isLoading ? <div className="text-stone-400 text-sm">Loading...</div> : (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-stone-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="heading" render={({ field }) => (
                <FormItem><FormLabel>Heading</FormLabel><FormControl><Textarea {...field} rows={2} data-testid="input-heading" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="subheading" render={({ field }) => (
                <FormItem><FormLabel>Subheading</FormLabel><FormControl><Textarea {...field} rows={3} data-testid="input-subheading" /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="primaryButtonText" render={({ field }) => (
                  <FormItem><FormLabel>Primary Button Text</FormLabel><FormControl><Input {...field} data-testid="input-primaryButtonText" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="primaryButtonLink" render={({ field }) => (
                  <FormItem><FormLabel>Primary Button Link</FormLabel><FormControl><Input {...field} data-testid="input-primaryButtonLink" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="secondaryButtonText" render={({ field }) => (
                  <FormItem><FormLabel>Secondary Button Text</FormLabel><FormControl><Input {...field} value={field.value ?? ""} data-testid="input-secondaryButtonText" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="secondaryButtonLink" render={({ field }) => (
                  <FormItem><FormLabel>Secondary Button Link</FormLabel><FormControl><Input {...field} value={field.value ?? ""} data-testid="input-secondaryButtonLink" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="backgroundImageUrl" render={({ field }) => (
                <FormItem><FormLabel>Background Image URL</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="https://..." data-testid="input-backgroundImageUrl" /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={update.isPending} className="bg-amber-700 hover:bg-amber-600 text-white" data-testid="button-save">
                {update.isPending ? "Saving..." : "Save Hero Section"}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

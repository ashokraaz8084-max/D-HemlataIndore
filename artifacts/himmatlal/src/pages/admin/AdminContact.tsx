import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetContact, useUpdateContact, getGetContactQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  address: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  whatsappNumber: z.string().min(1),
  businessHours: z.string().optional().nullable(),
  googleMapEmbed: z.string().optional().nullable(),
});
type FormData = z.infer<typeof schema>;

export default function AdminContact() {
  const { data, isLoading } = useGetContact();
  const update = useUpdateContact();
  const qc = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { address: "", phone: "", email: "", whatsappNumber: "", businessHours: "", googleMapEmbed: "" },
  });

  useEffect(() => {
    if (data) form.reset({ ...data, businessHours: data.businessHours ?? "", googleMapEmbed: data.googleMapEmbed ?? "" });
  }, [data, form]);

  const onSubmit = (values: FormData) => {
    update.mutate({ data: values }, {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getGetContactQueryKey() }); toast({ title: "Contact details saved!" }); },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Contact Details</h1>
      <p className="text-stone-500 text-sm mb-8">Manage the contact information displayed on the website.</p>
      {isLoading ? <div className="text-stone-400 text-sm">Loading...</div> : (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-stone-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem><FormLabel>Address</FormLabel><FormControl><Textarea {...field} rows={2} data-testid="input-address" /></FormControl><FormMessage /></FormItem>
              )} />
              {[
                { name: "phone" as const, label: "Phone" },
                { name: "email" as const, label: "Email" },
                { name: "whatsappNumber" as const, label: "WhatsApp Number" },
                { name: "businessHours" as const, label: "Business Hours" },
              ].map(({ name, label }) => (
                <FormField key={name} control={form.control} name={name} render={({ field }) => (
                  <FormItem><FormLabel>{label}</FormLabel><FormControl><Input {...field} value={field.value ?? ""} data-testid={`input-${name}`} /></FormControl><FormMessage /></FormItem>
                )} />
              ))}
              <FormField control={form.control} name="googleMapEmbed" render={({ field }) => (
                <FormItem><FormLabel>Google Maps Embed Code</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} rows={4} placeholder='<iframe src="..." ...></iframe>' data-testid="input-googleMapEmbed" /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={update.isPending} className="bg-amber-700 hover:bg-amber-600 text-white" data-testid="button-save">
                {update.isPending ? "Saving..." : "Save Contact Details"}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

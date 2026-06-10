import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  businessName: z.string().min(1),
  logoText: z.string().min(1),
  logoImageUrl: z.string().optional().nullable(),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  whatsappNumber: z.string().min(1),
  facebookUrl: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  footerText: z.string().min(1),
});
type FormData = z.infer<typeof schema>;

export default function AdminSettings() {
  const { data, isLoading } = useGetSettings();
  const update = useUpdateSettings();
  const qc = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { businessName: "", logoText: "", logoImageUrl: "", phone: "", email: "", address: "", whatsappNumber: "", facebookUrl: "", instagramUrl: "", youtubeUrl: "", footerText: "" },
  });

  useEffect(() => {
    if (data) form.reset({ ...data, logoImageUrl: data.logoImageUrl ?? "", facebookUrl: data.facebookUrl ?? "", instagramUrl: data.instagramUrl ?? "", youtubeUrl: data.youtubeUrl ?? "" });
  }, [data, form]);

  const onSubmit = (values: FormData) => {
    update.mutate(
      { data: values },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
          toast({ title: "Settings saved!" });
        },
        onError: () => toast({ title: "Error saving settings", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Site Settings</h1>
      <p className="text-stone-500 text-sm mb-8">Manage your business information displayed on the website.</p>
      {isLoading ? <div className="text-stone-400 text-sm">Loading...</div> : (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-stone-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {[
                { name: "businessName" as const, label: "Business Name" },
                { name: "logoText" as const, label: "Logo Text" },
                { name: "logoImageUrl" as const, label: "Logo Image URL" },
                { name: "phone" as const, label: "Phone" },
                { name: "email" as const, label: "Email" },
                { name: "whatsappNumber" as const, label: "WhatsApp Number" },
                { name: "facebookUrl" as const, label: "Facebook URL" },
                { name: "instagramUrl" as const, label: "Instagram URL" },
                { name: "youtubeUrl" as const, label: "YouTube URL" },
              ].map(({ name, label }) => (
                <FormField key={name} control={form.control} name={name} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl><Input {...field} value={field.value ?? ""} data-testid={`input-${name}`} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl><Textarea {...field} rows={2} data-testid="input-address" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="footerText" render={({ field }) => (
                <FormItem>
                  <FormLabel>Footer Text</FormLabel>
                  <FormControl><Textarea {...field} rows={2} data-testid="input-footerText" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={update.isPending} className="bg-amber-700 hover:bg-amber-600 text-white" data-testid="button-save">
                {update.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

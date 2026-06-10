import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { useGetContact, useGetSettings, useCreateInquiry } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type FormData = z.infer<typeof schema>;

export default function Contact() {
  const { data: contact } = useGetContact();
  const { data: settings } = useGetSettings();
  const createInquiry = useCreateInquiry();
  const { toast } = useToast();
  const whatsapp = settings?.whatsappNumber ?? contact?.whatsappNumber ?? "9827738838";

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const onSubmit = (data: FormData) => {
    createInquiry.mutate(
      { data: { ...data, phone: data.phone ?? null, productId: null, productName: null, type: "contact" } },
      {
        onSuccess: () => {
          toast({ title: "Message sent!", description: "We'll get back to you soon." });
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-dark-brown py-24 text-center">
        <p className="text-amber-400 text-xs tracking-widest uppercase font-semibold mb-3">Get in Touch</p>
        <h1 className="font-serif text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-stone-400 max-w-xl mx-auto">Visit our showroom or reach out to us for any inquiries.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-800 mb-8">Visit Our Showroom</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800 mb-0.5">Address</p>
                  <p className="text-stone-500 text-sm">{contact?.address ?? "Vijay Nagar, Indore, Madhya Pradesh, India"}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800 mb-0.5">Phone</p>
                  <a href={`tel:${contact?.phone ?? "9827738838"}`} className="text-amber-700 text-sm hover:underline">{contact?.phone ?? "9827738838"}</a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800 mb-0.5">Email</p>
                  <a href={`mailto:${contact?.email ?? "himmatlal1959@gmail.com"}`} className="text-amber-700 text-sm hover:underline">{contact?.email ?? "himmatlal1959@gmail.com"}</a>
                </div>
              </div>
              {contact?.businessHours && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800 mb-0.5">Business Hours</p>
                    <p className="text-stone-500 text-sm">{contact.businessHours}</p>
                  </div>
                </div>
              )}
              <a
                href={`https://wa.me/${whatsapp}?text=Hi%20I%20have%20an%20inquiry`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-sm font-semibold text-sm transition-all mt-4"
                data-testid="button-whatsapp-contact"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Map placeholder */}
            {contact?.googleMapEmbed ? (
              <div className="mt-8 rounded-xl overflow-hidden h-48 border border-amber-100" dangerouslySetInnerHTML={{ __html: contact.googleMapEmbed }} />
            ) : (
              <div className="mt-8 rounded-xl bg-amber-50 border border-amber-100 h-48 flex items-center justify-center">
                <div className="text-center text-stone-400">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-amber-300" />
                  <p className="text-sm">Vijay Nagar, Indore</p>
                  <p className="text-xs mt-1">Map embed can be added from admin panel</p>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-stone-100">
            <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">Send us a Message</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl><Input placeholder="Rajesh Sharma" {...field} data-testid="input-name" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input placeholder="email@example.com" {...field} data-testid="input-email" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl><Input placeholder="9876543210" {...field} data-testid="input-phone" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl><Textarea placeholder="Tell us about your requirements..." rows={5} {...field} data-testid="input-message" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-600 text-white py-3" disabled={createInquiry.isPending} data-testid="button-submit">
                  {createInquiry.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

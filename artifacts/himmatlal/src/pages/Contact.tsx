import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { useGetContact, useGetSettings, useCreateInquiry } from "@workspace/api-client-react";
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    createInquiry.mutate(
      { data: { ...data, phone: data.phone ?? null, productId: null, productName: null, type: "contact" } },
      {
        onSuccess: () => {
          toast({ title: "Message sent!", description: "We'll get back to you soon." });
          reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-[#faf9f7] border-b border-neutral-100 py-16 lg:py-20 text-center">
        <p className="section-label mb-3">Reach Out</p>
        <h1 className="font-serif text-5xl lg:text-6xl font-light text-black mb-3">
          Get in <em className="italic">Touch</em>
        </h1>
        <p className="text-neutral-400 text-xs tracking-wide font-light max-w-md mx-auto">
          Visit our showroom or send us a message — we'd love to hear from you.
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
          {/* Contact Info */}
          <div>
            <p className="section-label mb-4">Our Showroom</p>
            <h2 className="font-serif text-3xl font-light text-black mb-8">
              Come <em className="italic">Visit Us</em>
            </h2>
            <div className="space-y-7 mb-10">
              <div className="flex gap-5 items-start group">
                <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center shrink-0 group-hover:border-neutral-800 transition-colors">
                  <MapPin className="w-4 h-4 text-neutral-500" />
                </div>
                <div>
                  <p className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-1">Address</p>
                  <p className="text-sm text-neutral-600 font-light leading-relaxed">{contact?.address ?? "Vijay Nagar, Indore, Madhya Pradesh, India"}</p>
                </div>
              </div>
              <div className="flex gap-5 items-start group">
                <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center shrink-0 group-hover:border-neutral-800 transition-colors">
                  <Phone className="w-4 h-4 text-neutral-500" />
                </div>
                <div>
                  <p className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-1">Phone</p>
                  <a href={`tel:${contact?.phone ?? "9827738838"}`} className="text-sm text-black hover:text-neutral-600 transition-colors font-light">
                    {contact?.phone ?? "9827738838"}
                  </a>
                </div>
              </div>
              <div className="flex gap-5 items-start group">
                <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center shrink-0 group-hover:border-neutral-800 transition-colors">
                  <Mail className="w-4 h-4 text-neutral-500" />
                </div>
                <div>
                  <p className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-1">Email</p>
                  <a href={`mailto:${contact?.email ?? "himmatlal1959@gmail.com"}`} className="text-sm text-black hover:text-neutral-600 transition-colors font-light">
                    {contact?.email ?? "himmatlal1959@gmail.com"}
                  </a>
                </div>
              </div>
              {contact?.businessHours && (
                <div className="flex gap-5 items-start group">
                  <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center shrink-0 group-hover:border-neutral-800 transition-colors">
                    <Clock className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div>
                    <p className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-1">Hours</p>
                    <p className="text-sm text-neutral-600 font-light">{contact.businessHours}</p>
                  </div>
                </div>
              )}
            </div>

            <a
              href={`https://wa.me/${whatsapp}?text=Hi%20I%20have%20an%20inquiry`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-montserrat text-[11px] tracking-widest uppercase px-6 py-3 font-semibold transition-colors"
              data-testid="button-whatsapp-contact"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>

            {contact?.googleMapEmbed ? (
              <div className="mt-10 overflow-hidden h-52 border border-neutral-100" dangerouslySetInnerHTML={{ __html: contact.googleMapEmbed }} />
            ) : (
              <div className="mt-10 bg-[#faf9f7] border border-neutral-100 h-52 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-neutral-200" />
                  <p className="font-montserrat text-[10px] tracking-widest uppercase text-neutral-300">Vijay Nagar, Indore</p>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div>
            <p className="section-label mb-4">Send a Message</p>
            <h2 className="font-serif text-3xl font-light text-black mb-8">
              We'd Love to <em className="italic">Hear From You</em>
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-neutral-500 block mb-1.5">Your Name</label>
                <input
                  {...register("name")}
                  placeholder="Rajesh Sharma"
                  className="w-full border border-neutral-200 px-4 py-3 text-sm font-light outline-none focus:border-neutral-800 transition-colors placeholder:text-neutral-300 font-poppins"
                  data-testid="input-name"
                />
                {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-neutral-500 block mb-1.5">Email</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="email@example.com"
                  className="w-full border border-neutral-200 px-4 py-3 text-sm font-light outline-none focus:border-neutral-800 transition-colors placeholder:text-neutral-300 font-poppins"
                  data-testid="input-email"
                />
                {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-neutral-500 block mb-1.5">Phone (Optional)</label>
                <input
                  {...register("phone")}
                  placeholder="9876543210"
                  className="w-full border border-neutral-200 px-4 py-3 text-sm font-light outline-none focus:border-neutral-800 transition-colors placeholder:text-neutral-300 font-poppins"
                  data-testid="input-phone"
                />
              </div>
              <div>
                <label className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-neutral-500 block mb-1.5">Message</label>
                <textarea
                  {...register("message")}
                  placeholder="Tell us about your requirements..."
                  rows={5}
                  className="w-full border border-neutral-200 px-4 py-3 text-sm font-light outline-none focus:border-neutral-800 transition-colors placeholder:text-neutral-300 font-poppins resize-none"
                  data-testid="input-message"
                />
                {errors.message && <p className="text-red-500 text-[10px] mt-1">{errors.message.message}</p>}
              </div>
              <button
                type="submit"
                disabled={createInquiry.isPending}
                className="btn-luxury-filled w-full justify-center text-[11px] disabled:opacity-50"
                data-testid="button-submit"
              >
                {createInquiry.isPending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

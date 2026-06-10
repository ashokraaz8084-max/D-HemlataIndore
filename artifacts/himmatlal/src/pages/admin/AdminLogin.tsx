import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { setToken } from "@/lib/auth";
import { Lock } from "lucide-react";

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});
type FormData = z.infer<typeof schema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const login = useAdminLogin();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: FormData) => {
    login.mutate(
      { data },
      {
        onSuccess: (res) => {
          setToken(res.token);
          setLocation("/admin/dashboard");
        },
        onError: () => {
          toast({ title: "Login failed", description: "Invalid email or password.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-dark-brown flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-700/30 border border-amber-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mb-1">Admin Login</h1>
          <p className="text-stone-400 text-sm">D Himmatlal and Company</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-stone-300 text-sm">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@himmatlal.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-stone-500 focus:border-amber-500"
                      {...field}
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-stone-300 text-sm">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/10 border-white/20 text-white placeholder:text-stone-500 focus:border-amber-500"
                      {...field}
                      data-testid="input-password"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )} />
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 font-semibold"
                disabled={login.isPending}
                data-testid="button-login"
              >
                {login.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
          <p className="text-xs text-stone-500 text-center mt-6">
            Default: admin@himmatlal.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}

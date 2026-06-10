import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { getToken } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminLayout from "@/components/AdminLayout";
import AdminGuard from "@/components/AdminGuard";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Gallery from "@/pages/Gallery";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Testimonials from "@/pages/Testimonials";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

import AdminLogin from "@/pages/admin/AdminLogin";
import Dashboard from "@/pages/admin/Dashboard";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminHero from "@/pages/admin/AdminHero";
import AdminAbout from "@/pages/admin/AdminAbout";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminGallery from "@/pages/admin/AdminGallery";
import AdminBlogs from "@/pages/admin/AdminBlogs";
import AdminTestimonials from "@/pages/admin/AdminTestimonials";
import AdminContact from "@/pages/admin/AdminContact";
import AdminInquiries from "@/pages/admin/AdminInquiries";

setAuthTokenGetter(() => getToken());

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public pages */}
      <Route path="/" component={() => <PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" component={() => <PublicLayout><About /></PublicLayout>} />
      <Route path="/products" component={() => <PublicLayout><Products /></PublicLayout>} />
      <Route path="/products/:id" component={() => <PublicLayout><ProductDetail /></PublicLayout>} />
      <Route path="/gallery" component={() => <PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/blog" component={() => <PublicLayout><Blog /></PublicLayout>} />
      <Route path="/blog/:id" component={() => <PublicLayout><BlogDetail /></PublicLayout>} />
      <Route path="/testimonials" component={() => <PublicLayout><Testimonials /></PublicLayout>} />
      <Route path="/contact" component={() => <PublicLayout><Contact /></PublicLayout>} />

      {/* Admin auth */}
      <Route path="/admin" component={AdminLogin} />

      {/* Admin protected pages */}
      <Route path="/admin/dashboard" component={() => <AdminGuard><AdminLayout><Dashboard /></AdminLayout></AdminGuard>} />
      <Route path="/admin/settings" component={() => <AdminGuard><AdminLayout><AdminSettings /></AdminLayout></AdminGuard>} />
      <Route path="/admin/hero" component={() => <AdminGuard><AdminLayout><AdminHero /></AdminLayout></AdminGuard>} />
      <Route path="/admin/about" component={() => <AdminGuard><AdminLayout><AdminAbout /></AdminLayout></AdminGuard>} />
      <Route path="/admin/categories" component={() => <AdminGuard><AdminLayout><AdminCategories /></AdminLayout></AdminGuard>} />
      <Route path="/admin/products" component={() => <AdminGuard><AdminLayout><AdminProducts /></AdminLayout></AdminGuard>} />
      <Route path="/admin/gallery" component={() => <AdminGuard><AdminLayout><AdminGallery /></AdminLayout></AdminGuard>} />
      <Route path="/admin/blogs" component={() => <AdminGuard><AdminLayout><AdminBlogs /></AdminLayout></AdminGuard>} />
      <Route path="/admin/testimonials" component={() => <AdminGuard><AdminLayout><AdminTestimonials /></AdminLayout></AdminGuard>} />
      <Route path="/admin/contact" component={() => <AdminGuard><AdminLayout><AdminContact /></AdminLayout></AdminGuard>} />
      <Route path="/admin/inquiries" component={() => <AdminGuard><AdminLayout><AdminInquiries /></AdminLayout></AdminGuard>} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

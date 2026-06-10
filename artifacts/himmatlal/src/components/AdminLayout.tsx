import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Settings, Image, Star, Mail, BarChart2,
  Package, Tag, BookOpen, Phone, LogOut, ChevronRight, User
} from "lucide-react";
import { useAdminLogout, useGetAdminMe } from "@workspace/api-client-react";
import { removeToken } from "@/lib/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/hero", label: "Hero Section", icon: Image },
  { href: "/admin/about", label: "About Section", icon: User },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/blogs", label: "Blogs", icon: BookOpen },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/contact", label: "Contact Details", icon: Phone },
  { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const logout = useAdminLogout();
  const { data: me } = useGetAdminMe({ query: { retry: false } });

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        removeToken();
        setLocation("/admin");
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="w-64 admin-sidebar flex flex-col shrink-0 fixed top-0 left-0 h-full z-40 overflow-y-auto">
        <div className="p-6 border-b border-white/5">
          <div className="font-serif text-xl font-bold text-amber-400">D Himmatlal</div>
          <div className="text-xs text-stone-500 mt-0.5">Admin Panel</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  active
                    ? "bg-amber-700/30 text-amber-300 border border-amber-700/30"
                    : "text-stone-400 hover:bg-white/5 hover:text-stone-200"
                }`}
                data-testid={`link-admin-${label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-amber-400" : "text-stone-500 group-hover:text-stone-300"}`} />
                {label}
                {active && <ChevronRight className="w-3 h-3 ml-auto text-amber-500" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          {me?.email && (
            <div className="px-3 py-2 mb-2">
              <p className="text-xs text-stone-500 truncate">{me.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-stone-400 hover:bg-red-900/20 hover:text-red-400 transition-all"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}

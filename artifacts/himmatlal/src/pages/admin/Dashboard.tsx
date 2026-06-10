import { useGetDashboardStats } from "@workspace/api-client-react";
import { Package, Tag, Mail, BookOpen, Star, Image, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  const statCards = stats ? [
    { label: "Products", value: stats.totalProducts, icon: Package, color: "bg-amber-50 text-amber-700" },
    { label: "Categories", value: stats.totalCategories, icon: Tag, color: "bg-blue-50 text-blue-700" },
    { label: "Inquiries", value: stats.totalInquiries, icon: Mail, color: "bg-green-50 text-green-700" },
    { label: "Blogs", value: stats.totalBlogs, icon: BookOpen, color: "bg-purple-50 text-purple-700" },
    { label: "Testimonials", value: stats.totalTestimonials, icon: Star, color: "bg-rose-50 text-rose-700" },
    { label: "Gallery Images", value: stats.totalGalleryImages, icon: Image, color: "bg-teal-50 text-teal-700" },
  ] : [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-stone-800">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-1">Welcome to the D Himmatlal admin panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
          : statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-stone-100">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-stone-800 font-serif">{value}</div>
              <div className="text-xs text-stone-400 mt-0.5">{label}</div>
            </div>
          ))}
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="font-serif font-bold text-stone-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            Recent Inquiries
          </h2>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
          <div className="divide-y divide-stone-50">
            {stats.recentInquiries.map((inq) => (
              <div key={inq.id} className="px-6 py-4 flex items-center justify-between" data-testid={`row-inquiry-${inq.id}`}>
                <div>
                  <p className="font-medium text-stone-800 text-sm">{inq.name}</p>
                  <p className="text-xs text-stone-400">{inq.email} · {inq.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-400">{new Date(inq.createdAt).toLocaleDateString("en-IN")}</p>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full mt-0.5 inline-block">{inq.type}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-stone-400 text-sm">No inquiries yet</div>
        )}
      </div>
    </div>
  );
}

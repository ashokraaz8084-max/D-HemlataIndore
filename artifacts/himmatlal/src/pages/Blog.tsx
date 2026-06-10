import { Link } from "wouter";
import { useGetBlogs } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";

export default function Blog() {
  const { data: blogs, isLoading } = useGetBlogs({ activeOnly: true });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-dark-brown py-24 text-center">
        <p className="text-amber-400 text-xs tracking-widest uppercase font-semibold mb-3">Knowledge & Inspiration</p>
        <h1 className="font-serif text-5xl font-bold text-white mb-4">Our Blog</h1>
        <p className="text-stone-400 max-w-xl mx-auto">Tips, stories, and insights from 65 years of home furnishing expertise.</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
          </div>
        ) : blogs && blogs.length > 0 ? (
          <div className="space-y-8">
            {blogs.map((blog) => (
              <article key={blog.id} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all flex flex-col sm:flex-row" data-testid={`card-blog-${blog.id}`}>
                <div className="sm:w-56 aspect-video sm:aspect-auto bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {blog.imageUrl ? (
                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <span className="font-serif text-5xl font-bold text-amber-200">{blog.title[0]}</span>
                  )}
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    {blog.category && <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">{blog.category}</span>}
                    {blog.publishedDate && (
                      <span className="flex items-center gap-1 text-xs text-stone-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(blog.publishedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                  <Link href={`/blog/${blog.id}`}>
                    <h2 className="font-serif text-xl font-bold text-stone-800 group-hover:text-amber-700 transition-colors mb-2 leading-snug">{blog.title}</h2>
                  </Link>
                  <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">{blog.content.slice(0, 200)}...</p>
                  <Link href={`/blog/${blog.id}`} className="mt-4 text-amber-700 text-sm font-semibold hover:text-amber-800 transition-colors self-start border-b border-amber-300 pb-0.5">
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg font-medium">No blog posts yet</p>
            <p className="text-sm mt-2">Check back soon for home decor tips and inspiration.</p>
          </div>
        )}
      </div>
    </div>
  );
}

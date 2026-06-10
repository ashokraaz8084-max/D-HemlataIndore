import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar } from "lucide-react";
import { useGetBlog } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: blog, isLoading } = useGetBlog(parseInt(id!), { query: { enabled: !!id } });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-warm border-b border-amber-100 py-4">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : blog ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                {blog.category && <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">{blog.category}</span>}
                {blog.publishedDate && (
                  <span className="flex items-center gap-1 text-xs text-stone-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(blog.publishedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                )}
              </div>
              <h1 className="font-serif text-4xl font-bold text-stone-800 leading-snug mb-6">{blog.title}</h1>
            </div>

            {blog.imageUrl && (
              <div className="rounded-xl overflow-hidden mb-8 aspect-video">
                <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-stone prose-headings:font-serif max-w-none">
              {blog.content.split('\n\n').map((para, i) => (
                <p key={i} className="text-stone-600 leading-relaxed mb-4">{para}</p>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-stone-400">Blog post not found</div>
        )}
      </div>
    </div>
  );
}

import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useGetBlog } from "@workspace/api-client-react";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: blog, isLoading } = useGetBlog(parseInt(id!), { query: { enabled: !!id } });

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-100 py-4">
        <div className="max-w-3xl mx-auto px-5 lg:px-10">
          <Link href="/blog" className="inline-flex items-center gap-2 font-montserrat text-[10px] tracking-[0.15em] uppercase text-neutral-400 hover:text-black transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 lg:px-10 py-12 lg:py-16">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-neutral-100 rounded w-3/4" />
            <div className="h-4 bg-neutral-100 rounded w-1/4" />
            <div className="h-64 bg-neutral-100" />
            <div className="h-4 bg-neutral-100 rounded" />
            <div className="h-4 bg-neutral-100 rounded w-4/5" />
          </div>
        ) : blog ? (
          <article>
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                {blog.category && (
                  <span className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-[#8b7355] font-semibold">{blog.category}</span>
                )}
                {blog.publishedDate && (
                  <>
                    <span className="text-neutral-200">·</span>
                    <span className="font-montserrat text-[9px] tracking-wide text-neutral-400">
                      {new Date(blog.publishedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </>
                )}
              </div>
              <h1 className="font-serif text-4xl lg:text-5xl font-light text-black leading-tight mb-6">
                {blog.title}
              </h1>
              <div className="w-10 h-px bg-[#8b7355]" />
            </div>

            {blog.imageUrl && (
              <div className="aspect-[16/9] overflow-hidden mb-10 img-zoom">
                <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose max-w-none">
              {blog.content.split('\n\n').map((para, i) => (
                <p key={i} className="text-neutral-600 text-sm leading-relaxed mb-5 font-light">
                  {para}
                </p>
              ))}
            </div>

            <div className="border-t border-neutral-100 mt-12 pt-8 flex items-center justify-between">
              <Link href="/blog" className="btn-luxury text-[10px]">
                <ArrowLeft className="w-3 h-3" /> More Articles
              </Link>
              <Link href="/contact" className="btn-luxury-filled text-[10px]">
                Visit Our Showroom
              </Link>
            </div>
          </article>
        ) : (
          <div className="text-center py-28">
            <p className="font-serif text-2xl font-light text-neutral-300 mb-4">Article not found</p>
            <Link href="/blog" className="btn-luxury text-[10px]">Back to Journal</Link>
          </div>
        )}
      </div>
    </div>
  );
}

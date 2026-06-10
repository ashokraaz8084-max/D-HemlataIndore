import { Link } from "wouter";
import { useGetBlogs } from "@workspace/api-client-react";
import { ArrowRight } from "lucide-react";

const BLOG_IMGS = [
  "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80&auto=format&fit=crop",
];

export default function Blog() {
  const { data: blogs, isLoading } = useGetBlogs({ activeOnly: true });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#faf9f7] border-b border-neutral-100 py-16 lg:py-20 text-center">
        <p className="section-label mb-3">Stories & Insights</p>
        <h1 className="font-serif text-5xl lg:text-6xl font-light text-black mb-3">
          The <em className="italic">Journal</em>
        </h1>
        <p className="text-neutral-400 text-xs tracking-wide font-light max-w-md mx-auto">
          Tips, stories and insights from 65 years of home furnishing expertise.
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-14 lg:py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-neutral-100 mb-4" />
                <div className="h-3 bg-neutral-100 rounded mb-2 w-1/3" />
                <div className="h-5 bg-neutral-100 rounded mb-2 w-4/5" />
                <div className="h-4 bg-neutral-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {blogs.map((blog, i) => (
              <article key={blog.id} className="group" data-testid={`card-blog-${blog.id}`}>
                <Link href={`/blog/${blog.id}`}>
                  <div className="aspect-[4/3] overflow-hidden mb-4 img-zoom">
                    <img
                      src={blog.imageUrl ?? BLOG_IMGS[i % BLOG_IMGS.length]}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).src = BLOG_IMGS[i % BLOG_IMGS.length]; }}
                    />
                  </div>
                </Link>
                <div className="flex items-center gap-3 mb-2">
                  {blog.category && (
                    <span className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-[#8b7355] font-semibold">{blog.category}</span>
                  )}
                  {blog.publishedDate && (
                    <>
                      <span className="text-neutral-200">·</span>
                      <span className="font-montserrat text-[9px] tracking-wide text-neutral-400">
                        {new Date(blog.publishedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </>
                  )}
                </div>
                <Link href={`/blog/${blog.id}`}>
                  <h2 className="font-serif text-xl font-light text-black group-hover:text-neutral-600 transition-colors leading-snug mb-2">
                    {blog.title}
                  </h2>
                </Link>
                <p className="text-neutral-500 text-xs leading-relaxed mb-4 font-light line-clamp-3">
                  {blog.content.slice(0, 200)}...
                </p>
                <Link
                  href={`/blog/${blog.id}`}
                  className="inline-flex items-center gap-2 font-montserrat text-[10px] tracking-[0.12em] uppercase text-black hover:text-neutral-500 transition-colors font-semibold hover-underline"
                >
                  Read More <ArrowRight className="w-3 h-3" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-28">
            <p className="font-serif text-2xl font-light text-neutral-300 mb-2">No posts yet</p>
            <p className="font-montserrat text-[10px] tracking-widest uppercase text-neutral-300">Check back soon for home decor tips</p>
          </div>
        )}
      </div>
    </div>
  );
}

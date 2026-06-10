import { Router } from "express";
import { db, productsTable, categoriesTable, inquiriesTable, blogsTable, testimonialsTable, galleryTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/dashboard/stats", async (req, res) => {
  try {
    const [products, categories, inquiries, blogs, testimonials, gallery] = await Promise.all([
      db.select().from(productsTable),
      db.select().from(categoriesTable),
      db.select().from(inquiriesTable).orderBy(desc(inquiriesTable.createdAt)),
      db.select().from(blogsTable),
      db.select().from(testimonialsTable),
      db.select().from(galleryTable),
    ]);

    res.json({
      totalProducts: products.length,
      totalCategories: categories.length,
      totalInquiries: inquiries.length,
      totalBlogs: blogs.length,
      totalTestimonials: testimonials.length,
      totalGalleryImages: gallery.length,
      recentInquiries: inquiries.slice(0, 5),
    });
  } catch (err) {
    logger.error({ err }, "Failed to get dashboard stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

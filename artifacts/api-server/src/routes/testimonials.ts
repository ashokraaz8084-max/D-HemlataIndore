import { Router } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/testimonials", async (req, res) => {
  try {
    const activeOnly = req.query.activeOnly === "true";
    let rows = await db.select().from(testimonialsTable).orderBy(desc(testimonialsTable.createdAt));
    if (activeOnly) rows = rows.filter(r => r.isActive);
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get testimonials");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/testimonials", async (req, res) => {
  try {
    const [created] = await db.insert(testimonialsTable).values({ ...req.body, updatedAt: new Date() }).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to create testimonial");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/testimonials/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [updated] = await db.update(testimonialsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(testimonialsTable.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update testimonial");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/testimonials/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete testimonial");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

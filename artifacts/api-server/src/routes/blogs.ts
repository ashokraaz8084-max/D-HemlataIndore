import { Router } from "express";
import { db, blogsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/blogs", async (req, res) => {
  try {
    const activeOnly = req.query.activeOnly === "true";
    let rows = await db.select().from(blogsTable).orderBy(desc(blogsTable.createdAt));
    if (activeOnly) rows = rows.filter(r => r.isActive);
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get blogs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blogs", async (req, res) => {
  try {
    const [created] = await db.insert(blogsTable).values({ ...req.body, updatedAt: new Date() }).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to create blog");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blogs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [row] = await db.select().from(blogsTable).where(eq(blogsTable.id, id));
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to get blog");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/blogs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [updated] = await db.update(blogsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(blogsTable.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update blog");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/blogs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(blogsTable).where(eq(blogsTable.id, id));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete blog");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

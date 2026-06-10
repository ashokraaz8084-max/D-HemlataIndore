import { Router } from "express";
import { db, galleryTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/gallery", async (req, res) => {
  try {
    const rows = await db.select().from(galleryTable).orderBy(asc(galleryTable.displayOrder));
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get gallery");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/gallery", async (req, res) => {
  try {
    const [created] = await db.insert(galleryTable).values(req.body).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to create gallery image");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/gallery/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [updated] = await db.update(galleryTable).set(req.body).where(eq(galleryTable.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update gallery image");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/gallery/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(galleryTable).where(eq(galleryTable.id, id));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete gallery image");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

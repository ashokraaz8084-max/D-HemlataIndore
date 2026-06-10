import { Router } from "express";
import { db, categoriesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/categories", async (req, res) => {
  try {
    const activeOnly = req.query.activeOnly === "true";
    let rows;
    if (activeOnly) {
      rows = await db.select().from(categoriesTable).where(eq(categoriesTable.isActive, true)).orderBy(asc(categoriesTable.displayOrder));
    } else {
      rows = await db.select().from(categoriesTable).orderBy(asc(categoriesTable.displayOrder));
    }
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const [created] = await db.insert(categoriesTable).values({ ...req.body, updatedAt: new Date() }).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to create category");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [row] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id));
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to get category");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [updated] = await db.update(categoriesTable).set({ ...req.body, updatedAt: new Date() }).where(eq(categoriesTable.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update category");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete category");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

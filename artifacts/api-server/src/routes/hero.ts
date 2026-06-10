import { Router } from "express";
import { db, heroSectionTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router = Router();

router.get("/hero", async (req, res) => {
  try {
    const rows = await db.select().from(heroSectionTable).limit(1);
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    logger.error({ err }, "Failed to get hero");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/hero", async (req, res) => {
  try {
    const rows = await db.select().from(heroSectionTable).limit(1);
    const body = req.body;
    if (rows.length === 0) {
      const [created] = await db.insert(heroSectionTable).values({ ...body, updatedAt: new Date() }).returning();
      return res.json(created);
    }
    const [updated] = await db.update(heroSectionTable).set({ ...body, updatedAt: new Date() }).returning();
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update hero");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import { Router } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router = Router();

router.get("/settings", async (req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable).limit(1);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    logger.error({ err }, "Failed to get settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable).limit(1);
    const body = req.body;
    if (rows.length === 0) {
      const [created] = await db.insert(siteSettingsTable).values({ ...body, updatedAt: new Date() }).returning();
      return res.json(created);
    }
    const [updated] = await db.update(siteSettingsTable).set({ ...body, updatedAt: new Date() }).returning();
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

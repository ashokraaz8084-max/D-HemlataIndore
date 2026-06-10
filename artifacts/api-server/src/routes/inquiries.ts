import { Router } from "express";
import { db, inquiriesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/inquiries", async (req, res) => {
  try {
    const rows = await db.select().from(inquiriesTable).orderBy(desc(inquiriesTable.createdAt));
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get inquiries");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/inquiries", async (req, res) => {
  try {
    const [created] = await db.insert(inquiriesTable).values(req.body).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to create inquiry");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/inquiries/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(inquiriesTable).where(eq(inquiriesTable.id, id));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete inquiry");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

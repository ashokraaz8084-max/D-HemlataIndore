import { Router } from "express";
import { db, productsTable, categoriesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const { categoryId, featured, activeOnly } = req.query;
    let rows = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        slug: productsTable.slug,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        shortDescription: productsTable.shortDescription,
        fullDescription: productsTable.fullDescription,
        price: productsTable.price,
        contactForPrice: productsTable.contactForPrice,
        imageUrl: productsTable.imageUrl,
        galleryImages: productsTable.galleryImages,
        fabric: productsTable.fabric,
        size: productsTable.size,
        color: productsTable.color,
        inStock: productsTable.inStock,
        isFeatured: productsTable.isFeatured,
        isActive: productsTable.isActive,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .orderBy(desc(productsTable.createdAt));

    if (categoryId) rows = rows.filter(r => r.categoryId === parseInt(categoryId as string));
    if (featured === "true") rows = rows.filter(r => r.isFeatured);
    if (activeOnly === "true") rows = rows.filter(r => r.isActive);

    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to get products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const [created] = await db.insert(productsTable).values({ ...req.body, updatedAt: new Date() }).returning();
    res.status(201).json({ ...created, categoryName: null });
  } catch (err) {
    logger.error({ err }, "Failed to create product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [row] = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        slug: productsTable.slug,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        shortDescription: productsTable.shortDescription,
        fullDescription: productsTable.fullDescription,
        price: productsTable.price,
        contactForPrice: productsTable.contactForPrice,
        imageUrl: productsTable.imageUrl,
        galleryImages: productsTable.galleryImages,
        fabric: productsTable.fabric,
        size: productsTable.size,
        color: productsTable.color,
        inStock: productsTable.inStock,
        isFeatured: productsTable.isFeatured,
        isActive: productsTable.isActive,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, id));
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to get product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [updated] = await db.update(productsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(productsTable.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ ...updated, categoryName: null });
  } catch (err) {
    logger.error({ err }, "Failed to update product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete product");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

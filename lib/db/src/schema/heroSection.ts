import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const heroSectionTable = pgTable("hero_sections", {
  id: serial("id").primaryKey(),
  heading: text("heading").notNull(),
  subheading: text("subheading").notNull(),
  primaryButtonText: text("primary_button_text").notNull(),
  primaryButtonLink: text("primary_button_link").notNull(),
  secondaryButtonText: text("secondary_button_text"),
  secondaryButtonLink: text("secondary_button_link"),
  backgroundImageUrl: text("background_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHeroSectionSchema = createInsertSchema(heroSectionTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertHeroSection = z.infer<typeof insertHeroSectionSchema>;
export type HeroSection = typeof heroSectionTable.$inferSelect;

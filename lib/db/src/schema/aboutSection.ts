import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const aboutSectionTable = pgTable("about_sections", {
  id: serial("id").primaryKey(),
  businessStory: text("business_story").notNull(),
  founderName: text("founder_name").notNull(),
  legacyText: text("legacy_text").notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  imageUrl: text("image_url"),
  founderImageUrl: text("founder_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAboutSectionSchema = createInsertSchema(aboutSectionTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAboutSection = z.infer<typeof insertAboutSectionSchema>;
export type AboutSection = typeof aboutSectionTable.$inferSelect;

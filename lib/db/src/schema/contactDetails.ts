import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contactDetailsTable = pgTable("contact_details", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  googleMapEmbed: text("google_map_embed"),
  businessHours: text("business_hours"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertContactDetailsSchema = createInsertSchema(contactDetailsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertContactDetails = z.infer<typeof insertContactDetailsSchema>;
export type ContactDetails = typeof contactDetailsTable.$inferSelect;

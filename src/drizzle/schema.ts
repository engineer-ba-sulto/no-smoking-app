import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userProfile = sqliteTable("user_profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  smokingStartDate: text("smoking_start_date").notNull(), // ISO文字列
  cigsPerDay: integer("cigs_per_day").notNull(),
  pricePerPack: real("price_per_pack").notNull(),
  cigsPerPack: integer("cigs_per_pack").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

export const userProfile = sqliteTable("user_profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userName: text("user_name").notNull(),
  smokingStartDate: text("smoking_start_date").notNull(), // ISO文字列
  cigsPerDay: integer("cigs_per_day").notNull(),
  pricePerPack: real("price_per_pack").notNull(),
  cigsPerPack: integer("cigs_per_pack").notNull(),
  motivations: text("motivations").notNull(), // JSON文字列として保存
  hasCompletedOnboarding: integer("has_completed_onboarding", {
    mode: "boolean",
  })
    .notNull()
    .default(false),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// zod を使用して入力データ用のスキーマを定義
export const userProfileInputSchema = z.object({
  userName: z
    .string()
    .min(1, { message: "名前を入力してください" })
    .max(50, { message: "名前は50文字以内で入力してください" }),
  smokingStartDate: z
    .string()
    .datetime({ message: "有効なISO形式の日付文字列である必要があります" }),
  cigsPerDay: z
    .number()
    .int()
    .min(0, { message: "0以上の数値を入力してください" }),
  pricePerPack: z.number().min(0, { message: "0以上の数値を入力してください" }),
  cigsPerPack: z
    .number()
    .int()
    .min(0, { message: "0以上の数値を入力してください" }),
  motivations: z.string().min(1, { message: "動機を入力してください" }),
  hasCompletedOnboarding: z.boolean().optional().default(false),
});

// 新規作成用の型定義
export type CreateUserProfileInput = z.infer<typeof userProfileInputSchema>;

// 更新用の型定義 (全プロパティをオプショナルに)
export type UpdateUserProfileInput = z.infer<typeof userProfileInputSchema>;

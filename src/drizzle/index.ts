import { drizzle } from "drizzle-orm/expo-sqlite";
import { sqlite } from "./connection";
import * as schema from "./schema";

// Drizzle ORMインスタンスを作成
export const db = drizzle(sqlite, { schema });

// スキーマをエクスポート
export * from "./schema";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

// SQLiteデータベースの初期化（change listener有効化）
const expo = openDatabaseSync("no-smoking-app.db", {
  enableChangeListener: true,
});

// Drizzle ORMの初期化
export const db = drizzle(expo, { schema });

// 型エクスポート
export type Database = typeof db;

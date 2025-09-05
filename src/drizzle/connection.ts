import { openDatabaseSync } from "expo-sqlite";

// データベースファイル名
const DATABASE_NAME = "no-smoking-app.db";

// データベース接続を確立
export const sqlite = openDatabaseSync(DATABASE_NAME);

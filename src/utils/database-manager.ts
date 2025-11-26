import { sql } from "drizzle-orm";
import { db } from "../drizzle";
import * as schema from "../drizzle/schema";

/**
 * データベース管理ユーティリティ
 * テストデータの投入・削除・リセット機能を提供
 */
export class DatabaseManager {
  /**
   * テストデータを投入する
   */
  static async seedTestData() {
    try {
      console.log("🌱 テストデータの投入を開始...");

      // 既存データの確認
      const existingProfiles = await db.select().from(schema.userProfile);

      if (existingProfiles.length > 0) {
        console.log("⚠️ 既存データが存在します。先にリセットしてください。");
        return {
          success: false,
          message: "既存データが存在します。先にリセットしてください。",
          data: existingProfiles,
        };
      }

      // テストデータの挿入
      const testData = {
        userName: "テストユーザー",
        smokingStartDate: new Date().toISOString(),
        cigsPerDay: 20,
        pricePerPack: 500,
        cigsPerPack: 20,
        motivations: JSON.stringify(["健康のため", "節約のため"]),
      };

      const newProfile = await db
        .insert(schema.userProfile)
        .values(testData)
        .returning();

      console.log("✅ テストデータの投入が完了しました:", newProfile);

      return {
        success: true,
        message: "テストデータの投入が完了しました",
        data: newProfile,
      };
    } catch (error) {
      console.error("❌ テストデータ投入エラー:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * すべてのデータを削除する
   */
  static async clearAllData() {
    try {
      console.log("🗑️ データの削除を開始...");

      // すべてのユーザープロフィールを削除
      const deletedProfiles = await db.delete(schema.userProfile).returning();

      console.log("✅ データの削除が完了しました:", deletedProfiles);

      return {
        success: true,
        message: `${deletedProfiles.length}件のデータを削除しました`,
        data: deletedProfiles,
      };
    } catch (error) {
      console.error("❌ データ削除エラー:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * データベースを完全にリセットする
   */
  static async resetDatabase() {
    try {
      console.log("🔄 データベースのリセットを開始...");

      // テーブルを削除して再作成
      await db.run(sql`DROP TABLE IF EXISTS user_profile`);
      await db.run(sql`
        CREATE TABLE user_profile (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          smoking_start_date TEXT NOT NULL,
          cigs_per_day INTEGER NOT NULL,
          price_per_pack REAL NOT NULL,
          cigs_per_pack INTEGER NOT NULL,
          created_at TEXT DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
          updated_at TEXT DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
        )
      `);

      console.log("✅ データベースのリセットが完了しました");

      return {
        success: true,
        message: "データベースのリセットが完了しました",
      };
    } catch (error) {
      console.error("❌ データベースリセットエラー:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 現在のデータベース状態を取得する
   */
  static async getDatabaseStatus() {
    try {
      const profiles = await db.select().from(schema.userProfile);

      return {
        success: true,
        message: `データベースには${profiles.length}件のレコードがあります`,
        data: {
          recordCount: profiles.length,
          profiles: profiles,
        },
      };
    } catch (error) {
      console.error("❌ データベース状態取得エラー:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * カスタムSQLクエリを実行する
   */
  static async executeCustomQuery(query: string) {
    try {
      console.log("🔍 カスタムクエリを実行:", query);

      const result = await db.run(sql.raw(query));

      console.log("✅ クエリ実行完了:", result);

      return {
        success: true,
        message: "クエリが正常に実行されました",
        data: result,
      };
    } catch (error) {
      console.error("❌ クエリ実行エラー:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

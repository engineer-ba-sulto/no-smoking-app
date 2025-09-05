// マイグレーションテスト用ユーティリティ
import { db } from "../drizzle";
import { userProfile } from "../drizzle/schema";

export async function testMigration() {
  try {
    // 既存データの取得
    const profiles = await db.select().from(userProfile);
    console.log("既存データ数:", profiles.length);

    // 各レコードの整合性確認
    for (const profile of profiles) {
      console.log("ID:", profile.id);
      console.log("禁煙開始日:", profile.smokingStartDate);
      console.log("1日の本数:", profile.cigsPerDay);
      console.log("1箱の価格:", profile.pricePerPack);
      console.log("1箱の本数:", profile.cigsPerPack);
      console.log("作成日時:", profile.createdAt);
      console.log("更新日時:", profile.updatedAt);
      console.log("---");
    }

    // データの挿入テスト
    const newProfile = await db
      .insert(userProfile)
      .values({
        smokingStartDate: new Date().toISOString(),
        cigsPerDay: 20,
        pricePerPack: 500.0,
        cigsPerPack: 20,
      })
      .returning();

    console.log("新規データ挿入テスト:", newProfile);

    console.log("マイグレーションテスト完了");
    return { success: true, profiles, newProfile };
  } catch (error) {
    console.error("マイグレーションテストエラー:", error);
    return { success: false, error };
  }
}

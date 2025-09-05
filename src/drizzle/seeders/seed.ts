import { db } from "../index";
import * as schema from "../schema";
import { DummyDataGenerator } from "./dummy-data-generator";
import { testDataSets } from "./test-data-sets";

// 基本的なシーディングデータ（後方互換性のため保持）
export const seedData = {
  userProfile: {
    smokingStartDate: new Date().toISOString(),
    cigsPerDay: 20,
    pricePerPack: 500,
    cigsPerPack: 20,
  },
};

// シーディングオプションの型定義
export type SeedingOptions = {
  mode: "basic" | "random" | "scenario" | "test-set";
  scenario?: "beginner" | "intermediate" | "advanced" | "heavySmoker";
  testSet?: "basicSet" | "edgeCaseSet" | "achievementTestSet";
  count?: number; // ランダムモードでの生成件数
  clearExisting?: boolean; // 既存データをクリアするかどうか
};

/**
 * データベースにシーディングデータを投入する
 * @param options シーディングオプション
 * @returns シーディング結果
 */
export const seedDatabase = async (
  options: SeedingOptions = { mode: "basic" }
) => {
  try {
    const {
      mode = "basic",
      scenario = "beginner",
      testSet = "basicSet",
      count = 5,
      clearExisting = false,
    } = options;

    // 既存データの確認
    const existingProfiles = await db.select().from(schema.userProfile);

    if (existingProfiles.length > 0 && !clearExisting) {
      console.log("Database already has data, skipping seed");
      return { success: true, message: "Database already seeded" };
    }

    // 既存データをクリアする場合
    if (clearExisting && existingProfiles.length > 0) {
      await db.delete(schema.userProfile);
      console.log("Existing data cleared");
    }

    let dataToInsert: schema.CreateUserProfileInput[] = [];

    // モードに応じてデータを生成
    switch (mode) {
      case "basic":
        dataToInsert = [seedData.userProfile];
        break;

      case "random":
        dataToInsert = Array.from({ length: count }, () =>
          DummyDataGenerator.createRandomUserProfile()
        );
        break;

      case "scenario":
        dataToInsert = [DummyDataGenerator.createSpecificUserProfile(scenario)];
        break;

      case "test-set":
        dataToInsert = testDataSets[testSet];
        break;

      default:
        throw new Error(`Unknown seeding mode: ${mode}`);
    }

    // データの挿入
    const insertedProfiles = await db
      .insert(schema.userProfile)
      .values(dataToInsert)
      .returning();

    console.log(`Seed data inserted (${mode} mode):`, insertedProfiles);

    return {
      success: true,
      message: `Database seeded successfully with ${mode} mode`,
      data: insertedProfiles,
      count: insertedProfiles.length,
    };
  } catch (error) {
    console.error("Seed error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

/**
 * 基本的なシーディング（後方互換性のため）
 */
export const seedDatabaseBasic = async () => {
  return seedDatabase({ mode: "basic" });
};

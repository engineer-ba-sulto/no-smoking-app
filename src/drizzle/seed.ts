import { db } from "./index";
import * as schema from "./schema";

export const seedData = {
  userProfile: {
    smokingStartDate: new Date().toISOString(),
    cigsPerDay: 20,
    pricePerPack: 500,
    cigsPerPack: 20,
  },
};

export const seedDatabase = async () => {
  try {
    // 既存データの確認
    const existingProfiles = await db.select().from(schema.userProfile);

    console.log("existingProfiles", existingProfiles);
    if (existingProfiles.length > 0) {
      console.log("Database already has data, skipping seed");
      return { success: true, message: "Database already seeded" };
    }

    // テストデータの挿入
    const newProfile = await db
      .insert(schema.userProfile)
      .values(seedData.userProfile)
      .returning();

    console.log("Seed data inserted:", newProfile);

    return {
      success: true,
      message: "Database seeded successfully",
      data: newProfile,
    };
  } catch (error) {
    console.error("Seed error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

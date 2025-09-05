import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import * as schema from "../drizzle/schema";

export const testDatabaseOperations = async () => {
  try {
    // テストデータの挿入
    const newProfile = await db
      .insert(schema.userProfile)
      .values({
        smokingStartDate: new Date().toISOString(),
        cigsPerDay: 20,
        pricePerPack: 500,
        cigsPerPack: 20,
      })
      .returning();

    console.log("Inserted profile:", newProfile);

    // データの取得
    const profiles = await db.select().from(schema.userProfile);
    console.log("All profiles:", profiles);

    // データの更新
    if (newProfile[0]) {
      const updatedProfile = await db
        .update(schema.userProfile)
        .set({ cigsPerDay: 15 })
        .where(eq(schema.userProfile.id, newProfile[0].id))
        .returning();

      console.log("Updated profile:", updatedProfile);
    }

    return {
      success: true,
      message: "Database operations completed successfully",
    };
  } catch (error) {
    console.error("Database test error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

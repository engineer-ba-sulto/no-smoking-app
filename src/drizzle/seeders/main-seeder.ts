import { db, userProfile } from "@/drizzle";
import { userProfileRepository } from "@/drizzle/repositories/user-profile-repository";
import { CreateUserProfileInput } from "@/drizzle/schema";

/**
 * メインシーダークラス
 * データベースへのデータ投入（シーディング）を管理する
 */
export class MainSeeder {
  private userProfileRepository: typeof userProfileRepository;

  constructor() {
    this.userProfileRepository = userProfileRepository;
  }

  /**
   * データベースの全データをクリアする
   */
  async clearAllData(): Promise<void> {
    await db.delete(userProfile);
  }

  /**
   * データベースにデータが存在するかどうかを確認する
   * @returns データが存在する場合はtrue、存在しない場合はfalse
   */
  async hasData(): Promise<boolean> {
    try {
      const profile = await db.query.userProfile.findFirst();
      return profile !== null;
    } catch (error) {
      console.error("Error checking data existence:", error);
      return false;
    }
  }

  /**
   * 単一のデータパターンをデータベースに投入する
   * 既存データを削除してから新しいデータを投入する
   * @param data 投入するデータ
   */
  async seedSinglePattern(data: CreateUserProfileInput): Promise<void> {
    try {
      console.log("Starting seedSinglePattern with data:", data);

      // 既存データを削除
      await this.clearAllData();
      console.log("Existing data cleared");

      // 新しいデータを投入
      const result = await this.userProfileRepository.create(data);
      console.log("New data created:", result);
    } catch (error) {
      console.error("Error in seedSinglePattern:", error);
      throw error;
    }
  }
}

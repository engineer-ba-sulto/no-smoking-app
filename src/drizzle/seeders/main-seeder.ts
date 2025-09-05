import { db, userProfile } from "@/drizzle";
import { userProfileRepository } from "@/drizzle/repositories/user-profile-repository";
import { CreateUserProfileInput } from "@/drizzle/schema";
import { DummyDataGenerator } from "./dummy-data-generator";

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
   * 指定されたデータセットをデータベースに投入する
   * @param dataSet 投入するデータセット
   */
  async seedFromDataSet(dataSet: CreateUserProfileInput[]): Promise<void> {
    for (const data of dataSet) {
      await this.userProfileRepository.create(data);
    }
  }

  /**
   * ランダムなデータを指定された件数分投入する
   * @param count 投入する件数
   */
  async seedRandomData(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      const randomData = DummyDataGenerator.createRandomUserProfile();
      await this.userProfileRepository.create(randomData);
    }
  }

  /**
   * 現在データベースに格納されているuser_profileの件数を確認する
   */
  async verify(): Promise<void> {
    const profiles = await this.userProfileRepository.findAll();
    console.log(`現在のuser_profileレコード数: ${profiles.length}件`);
  }

  /**
   * 現在データベースに格納されているuser_profileの件数を取得する
   * @returns レコード数
   */
  async getCurrentRecordCount(): Promise<number> {
    try {
      const profiles = await this.userProfileRepository.findAll();
      return profiles.length;
    } catch (error) {
      console.error("Error getting record count:", error);
      return 0;
    }
  }

  /**
   * データベースの状態を確認する（デバッグ用）
   */
  async checkDatabaseStatus(): Promise<void> {
    try {
      console.log("Checking database status...");
      const profiles = await this.userProfileRepository.findAll();
      console.log("Current profiles:", profiles);
      console.log("Profile count:", profiles.length);
    } catch (error) {
      console.error("Database status check failed:", error);
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

import { db, userProfile } from "@/drizzle";
import { userProfileRepository } from "@/drizzle/repositories/user-profile-repository";
import { CreateUserProfileInput } from "@/drizzle/schema";
import { initialStartupPatterns } from "./test-data-sets";

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

  /**
   * 初回起動用のテストデータパターンを取得する
   * @returns 初回起動用のテストデータパターン配列
   */
  getInitialStartupPatterns() {
    return initialStartupPatterns;
  }

  /**
   * 初回起動用のデフォルトパターンを投入する
   * 最も一般的な「初回起動パターン」を自動選択して投入
   */
  async seedInitialStartupDefault(): Promise<void> {
    try {
      console.log("Starting seedInitialStartupDefault");

      // 既存データを削除
      await this.clearAllData();
      console.log("Existing data cleared");

      // デフォルトの初回起動パターンを取得（最初のパターン）
      const defaultPattern = initialStartupPatterns[0];
      if (!defaultPattern) {
        throw new Error("初期起動パターンが見つかりません");
      }

      // 新しいデータを投入
      const result = await this.userProfileRepository.create(
        defaultPattern.data
      );
      console.log("Initial startup data created:", result);
    } catch (error) {
      console.error("Error in seedInitialStartupDefault:", error);
      throw error;
    }
  }
}

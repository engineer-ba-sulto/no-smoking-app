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
}

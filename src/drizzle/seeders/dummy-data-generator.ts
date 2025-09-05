import { formatISO, subDays, subMonths, subWeeks } from "date-fns";
import { CreateUserProfileInput } from "../schema";

/**
 * ダミーデータ生成クラス
 * 開発用データのシーディングに必要な、多様なシナリオを想定したダミーデータを生成する
 */
export class DummyDataGenerator {
  /**
   * ランダムな値を持つユーザープロファイルを生成する
   * @returns ランダムな値を持つCreateUserProfileInputオブジェクト
   */
  static createRandomUserProfile(): CreateUserProfileInput {
    // 喫煙開始日: 過去1年以内のランダムな日付
    const now = new Date();
    const oneYearAgo = subDays(now, 365);
    const randomDaysAgo = Math.floor(Math.random() * 365);
    const smokingStartDate = formatISO(subDays(now, randomDaysAgo));

    // 1日の喫煙本数: 5〜40の範囲でランダムな整数
    const cigsPerDay = Math.floor(Math.random() * 36) + 5;

    // タバコ1箱の価格: 500〜800の範囲でランダムな整数
    const pricePerPack = Math.floor(Math.random() * 301) + 500;

    // 1箱の本数: [10, 20, 25]の配列からランダムに1つを選択
    const cigsPerPackOptions = [10, 20, 25];
    const cigsPerPack =
      cigsPerPackOptions[Math.floor(Math.random() * cigsPerPackOptions.length)];

    return {
      smokingStartDate,
      cigsPerDay,
      pricePerPack,
      cigsPerPack,
    };
  }

  /**
   * 特定のシナリオに基づいたプロファイルを生成する
   * @param scenario シナリオの種類
   * @returns 指定されたシナリオに基づくCreateUserProfileInputオブジェクト
   */
  static createSpecificUserProfile(
    scenario: "beginner" | "intermediate" | "advanced" | "heavySmoker"
  ): CreateUserProfileInput {
    const now = new Date();
    let smokingStartDate: string;
    let cigsPerDay: number;
    let pricePerPack: number;
    let cigsPerPack: number;

    switch (scenario) {
      case "beginner":
        // 禁煙開始からちょうど1日経過したデータ
        smokingStartDate = formatISO(subDays(now, 1));
        cigsPerDay = 15;
        pricePerPack = 600;
        cigsPerPack = 20;
        break;

      case "intermediate":
        // 禁煙開始からちょうど1週間経過したデータ
        smokingStartDate = formatISO(subWeeks(now, 1));
        cigsPerDay = 20;
        pricePerPack = 650;
        cigsPerPack = 20;
        break;

      case "advanced":
        // 禁煙開始からちょうど1ヶ月経過したデータ
        smokingStartDate = formatISO(subMonths(now, 1));
        cigsPerDay = 25;
        pricePerPack = 700;
        cigsPerPack = 20;
        break;

      case "heavySmoker":
        // 喫煙量が多いユーザーデータ
        smokingStartDate = formatISO(subDays(now, 30));
        cigsPerDay = 40;
        pricePerPack = 800;
        cigsPerPack = 20;
        break;

      default:
        throw new Error(`Unknown scenario: ${scenario}`);
    }

    return {
      smokingStartDate,
      cigsPerDay,
      pricePerPack,
      cigsPerPack,
    };
  }
}

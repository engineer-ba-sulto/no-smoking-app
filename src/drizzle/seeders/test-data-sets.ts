import { formatISO, subDays, subHours, subMinutes, subYears } from "date-fns";
import { CreateUserProfileInput } from "../schema";

/**
 * 再利用可能な静的テストデータセット
 * 様々なテストシナリオに対応したデータセットを定義する
 */
export const testDataSets = {
  /**
   * UIの基本的な表示確認に使う、2〜3件の典型的なユーザーデータ
   */
  basicSet: [
    {
      smokingStartDate: formatISO(subDays(new Date(), 7)),
      cigsPerDay: 15,
      pricePerPack: 600,
      cigsPerPack: 20,
    },
    {
      smokingStartDate: formatISO(subDays(new Date(), 30)),
      cigsPerDay: 20,
      pricePerPack: 650,
      cigsPerPack: 20,
    },
    {
      smokingStartDate: formatISO(subDays(new Date(), 90)),
      cigsPerDay: 25,
      pricePerPack: 700,
      cigsPerPack: 20,
    },
  ] as CreateUserProfileInput[],

  /**
   * 計算ロジックの境界値テストに使用するデータ
   */
  edgeCaseSet: [
    {
      // 禁煙開始が1分前
      smokingStartDate: formatISO(subMinutes(new Date(), 1)),
      cigsPerDay: 10,
      pricePerPack: 500,
      cigsPerPack: 20,
    },
    {
      // 禁煙開始がちょうど1年前
      smokingStartDate: formatISO(subYears(new Date(), 1)),
      cigsPerDay: 30,
      pricePerPack: 750,
      cigsPerPack: 20,
    },
    {
      // cigsPerDayが0のユーザー
      smokingStartDate: formatISO(subDays(new Date(), 14)),
      cigsPerDay: 0,
      pricePerPack: 600,
      cigsPerPack: 20,
    },
    {
      // pricePerPackが0のユーザー
      smokingStartDate: formatISO(subDays(new Date(), 21)),
      cigsPerDay: 15,
      pricePerPack: 0,
      cigsPerPack: 20,
    },
  ] as CreateUserProfileInput[],

  /**
   * アチーブメント機能のテストを容易にするためのデータセット
   */
  achievementTestSet: [
    {
      // 禁煙23時間後のユーザー（もうすぐ1日達成）
      smokingStartDate: formatISO(subHours(new Date(), 23)),
      cigsPerDay: 20,
      pricePerPack: 650,
      cigsPerPack: 20,
    },
    {
      // 禁煙6日と23時間後のユーザー（もうすぐ1週間達成）
      smokingStartDate: formatISO(subHours(new Date(), 6 * 24 + 23)),
      cigsPerDay: 25,
      pricePerPack: 700,
      cigsPerPack: 20,
    },
    {
      // 禁煙29日と23時間後のユーザー（もうすぐ1ヶ月達成）
      smokingStartDate: formatISO(subHours(new Date(), 29 * 24 + 23)),
      cigsPerDay: 30,
      pricePerPack: 750,
      cigsPerPack: 20,
    },
    {
      // 禁煙364日と23時間後のユーザー（もうすぐ1年達成）
      smokingStartDate: formatISO(subHours(new Date(), 364 * 24 + 23)),
      cigsPerDay: 35,
      pricePerPack: 800,
      cigsPerPack: 20,
    },
  ] as CreateUserProfileInput[],
};

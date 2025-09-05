import { subDays, subHours, subMinutes, subYears } from "date-fns";
import { CreateUserProfileInput } from "../schema";

/**
 * テストデータパターンの型定義
 */
export interface TestDataPattern {
  id: string;
  name: string;
  description: string;
  category: "basic" | "edgeCase" | "achievement";
  data: CreateUserProfileInput;
}

/**
 * 11種類の個別テストデータパターン
 * 各パターンを個別に選択して登録できる
 */
export const testDataPatterns: TestDataPattern[] = [
  // 基本パターン (3件)
  {
    id: "basic-1week",
    name: "1週間経過パターン",
    description: "7日前に禁煙を開始した典型的なユーザー",
    category: "basic",
    data: {
      smokingStartDate: subDays(new Date(), 7).toISOString(),
      cigsPerDay: 15,
      pricePerPack: 600,
      cigsPerPack: 20,
    },
  },
  {
    id: "basic-1month",
    name: "1ヶ月経過パターン",
    description: "30日前に禁煙を開始した典型的なユーザー",
    category: "basic",
    data: {
      smokingStartDate: subDays(new Date(), 30).toISOString(),
      cigsPerDay: 20,
      pricePerPack: 650,
      cigsPerPack: 20,
    },
  },
  {
    id: "basic-3months",
    name: "3ヶ月経過パターン",
    description: "90日前に禁煙を開始した典型的なユーザー",
    category: "basic",
    data: {
      smokingStartDate: subDays(new Date(), 90).toISOString(),
      cigsPerDay: 25,
      pricePerPack: 700,
      cigsPerPack: 20,
    },
  },

  // 境界値テストパターン (4件)
  {
    id: "edge-1minute",
    name: "1分前パターン",
    description: "1分前に禁煙を開始した極短期間のユーザー",
    category: "edgeCase",
    data: {
      smokingStartDate: subMinutes(new Date(), 1).toISOString(),
      cigsPerDay: 10,
      pricePerPack: 500,
      cigsPerPack: 20,
    },
  },
  {
    id: "edge-1year",
    name: "1年経過パターン",
    description: "1年前に禁煙を開始した長期ユーザー",
    category: "edgeCase",
    data: {
      smokingStartDate: subYears(new Date(), 1).toISOString(),
      cigsPerDay: 30,
      pricePerPack: 750,
      cigsPerPack: 20,
    },
  },
  {
    id: "edge-zero-cigarettes",
    name: "喫煙本数0パターン",
    description: "喫煙本数が0の特殊ケース",
    category: "edgeCase",
    data: {
      smokingStartDate: subDays(new Date(), 14).toISOString(),
      cigsPerDay: 0,
      pricePerPack: 600,
      cigsPerPack: 20,
    },
  },
  {
    id: "edge-zero-price",
    name: "タバコ価格0パターン",
    description: "タバコ価格が0の特殊ケース",
    category: "edgeCase",
    data: {
      smokingStartDate: subDays(new Date(), 21).toISOString(),
      cigsPerDay: 15,
      pricePerPack: 0,
      cigsPerPack: 20,
    },
  },

  // アチーブメントテストパターン (4件)
  {
    id: "achievement-1day",
    name: "1日達成直前パターン",
    description: "23時間後に禁煙開始（もうすぐ1日達成）",
    category: "achievement",
    data: {
      smokingStartDate: subHours(new Date(), 23).toISOString(),
      cigsPerDay: 20,
      pricePerPack: 650,
      cigsPerPack: 20,
    },
  },
  {
    id: "achievement-1week",
    name: "1週間達成直前パターン",
    description: "6日23時間後に禁煙開始（もうすぐ1週間達成）",
    category: "achievement",
    data: {
      smokingStartDate: subHours(new Date(), 6 * 24 + 23).toISOString(),
      cigsPerDay: 25,
      pricePerPack: 700,
      cigsPerPack: 20,
    },
  },
  {
    id: "achievement-1month",
    name: "1ヶ月達成直前パターン",
    description: "29日23時間後に禁煙開始（もうすぐ1ヶ月達成）",
    category: "achievement",
    data: {
      smokingStartDate: subHours(new Date(), 29 * 24 + 23).toISOString(),
      cigsPerDay: 30,
      pricePerPack: 750,
      cigsPerPack: 20,
    },
  },
  {
    id: "achievement-1year",
    name: "1年達成直前パターン",
    description: "364日23時間後に禁煙開始（もうすぐ1年達成）",
    category: "achievement",
    data: {
      smokingStartDate: subHours(new Date(), 364 * 24 + 23).toISOString(),
      cigsPerDay: 35,
      pricePerPack: 800,
      cigsPerPack: 20,
    },
  },
];

/**
 * 後方互換性のための従来のデータセット（非推奨）
 * @deprecated 個別パターン選択を使用してください
 */
export const testDataSets = {
  basicSet: testDataPatterns
    .filter((p) => p.category === "basic")
    .map((p) => p.data),

  edgeCaseSet: testDataPatterns
    .filter((p) => p.category === "edgeCase")
    .map((p) => p.data),

  achievementTestSet: testDataPatterns
    .filter((p) => p.category === "achievement")
    .map((p) => p.data),

  get allSets(): CreateUserProfileInput[] {
    return testDataPatterns.map((p) => p.data);
  },
};

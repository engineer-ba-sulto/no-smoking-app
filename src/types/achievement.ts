export type AchievementCategory = "duration" | "cigarettes" | "money";
export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  goal: number; // 達成目標値（秒、本、円など）
  tier: AchievementTier; // UI表示用のランク
  unit: string; // UI表示用の単位
}

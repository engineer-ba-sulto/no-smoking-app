import { AchievementCategory } from "@/types/achievement";
import { OutcomeData } from "@/types/outcome";

/**
 * アチーブメントの現在値と目標値を計算します。
 * @param category - アチーブメントのカテゴリ
 * @param goal - 目標値（秒、本、円など）
 * @param outcomes - 現在の成果データ
 * @returns 現在値と目標値のペア
 */
export const calculateAchievementProgress = (
  category: AchievementCategory,
  goal: number,
  outcomes: OutcomeData
): { currentValue: number; targetValue: number } => {
  switch (category) {
    case "duration":
      // 時間系のアチーブメント
      if (goal <= 86400) {
        // 24時間以下の場合（時間単位）
        const currentHours = Math.floor(outcomes.durationInSeconds / 3600);
        const targetHours = Math.floor(goal / 3600);
        return {
          currentValue: currentHours,
          targetValue: targetHours,
        };
      } else {
        // 24時間以上の場合（日単位）
        const currentDays = Math.floor(outcomes.durationInSeconds / 86400);
        const targetDays = Math.floor(goal / 86400);
        return {
          currentValue: currentDays,
          targetValue: targetDays,
        };
      }

    case "cigarettes":
      // タバコ本数のアチーブメント
      return {
        currentValue: outcomes.resistedCigarettes,
        targetValue: goal,
      };

    case "money":
      // 金額のアチーブメント
      return {
        currentValue: outcomes.savedMoney,
        targetValue: goal,
      };

    default:
      return {
        currentValue: 0,
        targetValue: goal,
      };
  }
};

/**
 * アチーブメントの進捗率を計算します。
 * @param currentValue - 現在値
 * @param targetValue - 目標値
 * @returns 進捗率（0-1の範囲）
 */
export const calculateProgressPercentage = (
  currentValue: number,
  targetValue: number
): number => {
  if (targetValue === 0) return 0;
  return Math.min(currentValue / targetValue, 1);
};

/**
 * 残り必要な値を計算します。
 * @param currentValue - 現在値
 * @param targetValue - 目標値
 * @returns 残り必要な値
 */
export const calculateRemainingValue = (
  currentValue: number,
  targetValue: number
): number => {
  return Math.max(targetValue - currentValue, 0);
};

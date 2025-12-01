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
      // 時間系のアチーブメント（1分単位で表示）
      const currentMinutes = Math.floor(outcomes.durationInSeconds / 60);
      const targetMinutes = Math.floor(goal / 60);
      return {
        currentValue: currentMinutes,
        targetValue: targetMinutes,
      };

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

/**
 * 分単位の時間を「何日何時間何分」の形式でフォーマットします。
 * @param minutes - 分単位の時間
 * @returns フォーマットされた時間文字列
 */
export const formatTimeRemaining = (minutes: number): string => {
  if (minutes <= 0) return "0分";

  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const remainingMinutes = minutes % 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}日`);
  }
  if (hours > 0) {
    parts.push(`${hours}時間`);
  }
  if (remainingMinutes > 0) {
    parts.push(`${remainingMinutes}分`);
  }

  return parts.join("");
};

/**
 * 秒単位の時間を「何日何時間何分何秒」の形式でフォーマットします。
 * 1分未満の場合は秒単位で表示します。
 * @param seconds - 秒単位の時間
 * @returns フォーマットされた時間文字列
 */
export const formatTimeRemainingWithSeconds = (seconds: number): string => {
  if (seconds <= 0) return "0秒";

  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}日`);
  }
  if (hours > 0) {
    parts.push(`${hours}時間`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}分`);
  }
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds}秒`);
  }

  return parts.join("");
};

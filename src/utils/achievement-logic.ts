import { ACHIEVEMENTS } from "../constants/achievements";
import { Achievement, AchievementStatus } from "../types/achievement";
import { OutcomeData } from "../types/outcome";

/**
 * 単一のアチーブメントが達成されているか判定します。
 * @param achievement - 判定対象のアチーブメント定義
 * @param outcomes - 現在の成果データ
 * @returns 達成していれば true, 未達成なら false
 */
export const isAchievementUnlocked = (
  achievement: Achievement,
  outcomes: OutcomeData
): boolean => {
  switch (achievement.category) {
    case "duration":
      return outcomes.durationInSeconds >= achievement.goal;
    case "cigarettes":
      return outcomes.resistedCigarettes >= achievement.goal;
    case "money":
      return outcomes.savedMoney >= achievement.goal;
    default:
      return false;
  }
};

/**
 * すべてのアチーブメントの達成状況を判定します。
 * @param outcomes - 現在の成果データ
 * @returns 全アチーブメントの達成状況リスト
 */
export const checkAllAchievements = (
  outcomes: OutcomeData
): AchievementStatus[] => {
  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    isUnlocked: isAchievementUnlocked(achievement, outcomes),
  }));
};

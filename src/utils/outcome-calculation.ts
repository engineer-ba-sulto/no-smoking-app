import { UserProfile } from "../types/user";

/**
 * 我慢したタバコの本数を計算します。
 * @param profile - ユーザープロファイル
 * @param totalSeconds - 禁煙継続時間の合計秒数
 * @returns 我慢した本数
 */
export const calculateResistedCigarettes = (
  profile: UserProfile,
  totalSeconds: number
): number => {
  const cigarettesPerSecond =
    profile.smokingHabit.cigarettesPerDay / (24 * 60 * 60);
  const resistedCigarettes = cigarettesPerSecond * totalSeconds;
  return resistedCigarettes;
};

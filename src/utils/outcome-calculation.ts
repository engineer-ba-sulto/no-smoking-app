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

/**
 * 節約できた金額を計算します。
 * @param profile - ユーザープロファイル
 * @param resistedCigarettes - 我慢したタバコの本数
 * @returns 節約金額
 */
export const calculateSavedMoney = (
  profile: UserProfile,
  resistedCigarettes: number
): number => {
  const { pricePerPack, cigarettesPerPack } = profile.smokingHabit;
  if (cigarettesPerPack === 0) {
    return 0; // 0除算を避ける
  }
  const pricePerCigarette = pricePerPack / cigarettesPerPack;
  const savedMoney = pricePerCigarette * resistedCigarettes;
  return Math.floor(savedMoney); // 小数点以下は切り捨てる
};

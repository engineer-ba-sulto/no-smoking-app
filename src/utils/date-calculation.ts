import { Duration, intervalToDuration } from "date-fns";

/**
 * 禁煙開始日時から現在までの経過時間を計算します。
 * @param startDate - 禁煙開始日時
 * @returns 経過時間を示す Duration オブジェクト
 */
export const calculateSmokingCessationDuration = (
  startDate: Date
): Duration => {
  const endDate = new Date(); // 現在時刻
  return intervalToDuration({ start: startDate, end: endDate });
};

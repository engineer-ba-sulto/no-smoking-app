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

/**
 * Duration オブジェクトを「X年Yヶ月Z日...」の形式の文字列に変換します。
 * @param duration - Duration オブジェクト
 * @returns フォーマットされた文字列
 */
export const formatDuration = (duration: Duration): string => {
  const parts = [
    duration.years && `${duration.years}年`,
    duration.months && `${duration.months}ヶ月`,
    duration.days && `${duration.days}日`,
    duration.hours && `${duration.hours}時間`,
    duration.minutes && `${duration.minutes}分`,
    duration.seconds && `${duration.seconds}秒`,
  ].filter(Boolean); // null や undefined を除去

  return parts.join("");
};

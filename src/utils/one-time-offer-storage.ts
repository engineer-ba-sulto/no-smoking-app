import AsyncStorage from "@react-native-async-storage/async-storage";

const ONE_TIME_OFFER_DISMISSED_KEY = "one-time-offer-dismissed";

/**
 * ワンタイムオファーが既に閉じられたかどうかを確認します。
 * @returns 既に閉じられた場合はtrue、そうでない場合はfalse
 */
export async function hasDismissedOneTimeOffer(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONE_TIME_OFFER_DISMISSED_KEY);
    return value === "true";
  } catch (error) {
    console.error("ワンタイムオファーの状態取得エラー:", error);
    return false;
  }
}

/**
 * ワンタイムオファーを閉じたことを記録します。
 */
export async function markOneTimeOfferAsDismissed(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONE_TIME_OFFER_DISMISSED_KEY, "true");
  } catch (error) {
    console.error("ワンタイムオファーの状態保存エラー:", error);
  }
}

/**
 * ワンタイムオファーの状態をリセットします（デバッグ用）。
 */
export async function resetOneTimeOfferState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONE_TIME_OFFER_DISMISSED_KEY);
  } catch (error) {
    console.error("ワンタイムオファーの状態リセットエラー:", error);
  }
}


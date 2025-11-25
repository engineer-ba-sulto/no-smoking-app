import { router } from "expo-router";
import Purchases from "react-native-purchases";

/**
 * サブスクリプション状態をチェックし、既に有効なサブスクリプションがある場合はメイン画面に遷移
 * @param onNoSubscription サブスクリプションがない場合に実行するコールバック関数
 * @returns サブスクリプションがある場合はtrue、ない場合はfalse
 */
export async function checkSubscriptionStatus(
  onNoSubscription: () => Promise<void>
): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const hasActiveSubscription =
      customerInfo.entitlements.active["premium"] !== undefined;

    if (hasActiveSubscription) {
      // 既に有効なサブスクリプションがある場合はメイン画面に遷移
      console.log("有効なサブスクリプションを検出、メイン画面に遷移");
      router.replace("/(tabs)");
      return true;
    }

    // サブスクリプションがない場合はコールバックを実行
    await onNoSubscription();
    return false;
  } catch (error) {
    console.error("サブスクリプション状態確認エラー:", error);
    // エラーが発生した場合はコールバックを実行
    await onNoSubscription();
    return false;
  }
}

import Purchases, {
  LOG_LEVEL,
  PURCHASES_ERROR_CODE,
  PurchasesError,
  PurchasesPackage,
} from "react-native-purchases";

/**
 * 購入キャンセル関連のメッセージかどうかを判定
 */
function isPurchaseCancelledMessage(
  message: string | null | undefined
): boolean {
  if (!message) return false;
  const cancelledKeywords = [
    "Purchase was cancelled",
    "PURCHASE_CANCELLED",
    "userCancelled",
  ];
  return cancelledKeywords.some((keyword) => message.includes(keyword));
}

/**
 * RevenueCatのカスタムログハンドラーを設定
 * 購入キャンセル関連のログを無視し、Babelのconstruct.jsエラーを防ぐ
 */
export function setupRevenueCatLogHandler(): void {
  Purchases.setLogHandler((logLevel, message) => {
    try {
      // 購入キャンセル関連のメッセージは無視
      if (isPurchaseCancelledMessage(message)) {
        return;
      }

      // その他のログは通常通り処理
      switch (logLevel) {
        case LOG_LEVEL.VERBOSE:
          if (__DEV__) {
            console.debug("[RC Verbose]", message);
          }
          break;
        case LOG_LEVEL.DEBUG:
          if (__DEV__) {
            console.debug("[RC Debug]", message);
          }
          break;
        case LOG_LEVEL.INFO:
          console.info("[RC Info]", message);
          break;
        case LOG_LEVEL.WARN:
          console.warn("[RC Warn]", message);
          break;
        case LOG_LEVEL.ERROR:
          console.error("[RC Error]", message);
          break;
      }
    } catch {
      // ログハンドラー内でエラーが発生した場合は無視
      // これにより、Babelのconstruct.jsエラーを防ぐ
    }
  });
}

/**
 * エラーが購入キャンセルエラーかどうかを判定
 */
export function isPurchaseCancelledError(
  error: unknown
): error is PurchasesError {
  if (!error || typeof error !== "object") return false;
  if (!("code" in error) || !("message" in error)) return false;

  const purchasesError = error as PurchasesError;
  return (
    purchasesError.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR ||
    (purchasesError as any).userCancelled === true
  );
}

/**
 * 購入処理を実行し、エラーハンドリングを行う
 * @param pkg 購入するパッケージ
 * @returns 購入成功時はcustomerInfoを返す。キャンセル時はnullを返す。エラー時は例外を投げる
 */
export async function purchasePackageSafely(
  pkg: PurchasesPackage
): Promise<{ customerInfo: any } | null> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { customerInfo };
  } catch (error) {
    // 購入キャンセルの場合はnullを返す（エラーとして扱わない）
    if (isPurchaseCancelledError(error)) {
      console.log("購入がキャンセルされました");
      return null;
    }

    // その他のエラーは再スロー
    throw error;
  }
}

/**
 * 購入を復元し、エラーハンドリングを行う
 * @returns 復元成功時はcustomerInfoを返す。エラー時は例外を投げる
 */
export async function restorePurchasesSafely(): Promise<{
  customerInfo: any;
  hasActiveEntitlements: boolean;
}> {
  try {
    const customerInfo = await Purchases.restorePurchases();

    // アクティブなエンタイトルメントがあるかチェック
    const activeEntitlements = Object.keys(customerInfo.entitlements.active);
    const hasActiveEntitlements = activeEntitlements.length > 0;

    return {
      customerInfo,
      hasActiveEntitlements,
    };
  } catch (error) {
    // エラーは再スロー（呼び出し側で処理）
    throw error;
  }
}

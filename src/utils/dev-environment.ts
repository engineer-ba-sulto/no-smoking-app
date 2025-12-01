import Constants from "expo-constants";

/**
 * 開発環境かどうかを判定する関数
 * development buildでも確実に動作するように複数の方法で判定
 */
export const isDevelopmentEnvironment = (): boolean => {
  // 1. __DEV__フラグ（通常の開発環境）
  if (__DEV__) {
    return true;
  }

  // 2. Expo Constants の releaseChannel をチェック
  const releaseChannel = Constants.expoConfig?.extra?.releaseChannel;
  if (releaseChannel === "development" || releaseChannel === "dev") {
    return true;
  }

  // 3. アプリのバンドルIDやスキームで判定
  const bundleIdentifier = Constants.expoConfig?.ios?.bundleIdentifier;
  const androidPackage = Constants.expoConfig?.android?.package;

  // 開発用のバンドルIDパターンをチェック
  if (
    bundleIdentifier?.includes(".dev") ||
    bundleIdentifier?.includes(".development") ||
    androidPackage?.includes(".dev") ||
    androidPackage?.includes(".development")
  ) {
    return true;
  }

  // 4. 環境変数で判定
  if (
    process.env.NODE_ENV === "development" ||
    process.env.EXPO_PUBLIC_ENV === "development"
  ) {
    return true;
  }

  // 5. デバッグモードの判定
  if (Constants.isDevice === false) {
    // シミュレーター/エミュレーターで実行されている場合
    return true;
  }

  return false;
};

/**
 * 開発者向け機能を表示するかどうかを判定
 * より厳密な条件で開発者向け機能の表示を制御
 */
export const shouldShowDeveloperFeatures = (): boolean => {
  // 基本的な開発環境判定
  if (!isDevelopmentEnvironment()) {
    return false;
  }

  // 追加の条件があればここに追加
  // 例：特定のユーザーID、デバッグフラグなど

  return true;
};

/**
 * 開発環境の情報を取得（デバッグ用）
 */
export const getDevelopmentInfo = () => {
  return {
    __DEV__,
    releaseChannel: Constants.expoConfig?.extra?.releaseChannel,
    bundleIdentifier: Constants.expoConfig?.ios?.bundleIdentifier,
    androidPackage: Constants.expoConfig?.android?.package,
    nodeEnv: process.env.NODE_ENV,
    expoPublicEnv: process.env.EXPO_PUBLIC_ENV,
    isDevice: Constants.isDevice,
    isDevelopment: isDevelopmentEnvironment(),
    shouldShowDevFeatures: shouldShowDeveloperFeatures(),
  };
};

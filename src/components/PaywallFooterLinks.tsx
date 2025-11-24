import * as Linking from "expo-linking";
import React from "react";
import { Alert, View } from "react-native";
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from "../constants/urls";
import { restorePurchasesSafely } from "../utils/revenuecat";
import LinkButton from "./LinkButton";

interface PaywallFooterLinksProps {
  /** 利用規約ボタンが押された時に実行される関数 */
  onTermsPress?: () => void;
  /** プライバシーポリシーボタンが押された時に実行される関数 */
  onPrivacyPress?: () => void;
  /** 復元ボタンが押された時に実行される関数（指定された場合はこちらが優先される） */
  onRestorePress?: () => void;
}

/**
 * ペイウォール画面のフッターリンクコンポーネント
 * 利用規約、プライバシーポリシー、復元のリンクを表示
 */
export default function PaywallFooterLinks({
  onTermsPress,
  onPrivacyPress,
  onRestorePress,
}: PaywallFooterLinksProps) {
  /**
   * 利用規約のURLを開く
   */
  const handleTermsPress = async () => {
    // カスタムハンドラーが指定されている場合はそちらを使用
    if (onTermsPress) {
      onTermsPress();
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(TERMS_OF_SERVICE_URL);
      if (canOpen) {
        await Linking.openURL(TERMS_OF_SERVICE_URL);
      } else {
        Alert.alert("エラー", "利用規約ページを開くことができませんでした。");
      }
    } catch (error) {
      console.error("利用規約リンクエラー:", error);
      Alert.alert("エラー", "利用規約ページを開くことができませんでした。");
    }
  };

  /**
   * プライバシーポリシーのURLを開く
   */
  const handlePrivacyPress = async () => {
    // カスタムハンドラーが指定されている場合はそちらを使用
    if (onPrivacyPress) {
      onPrivacyPress();
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(PRIVACY_POLICY_URL);
      if (canOpen) {
        await Linking.openURL(PRIVACY_POLICY_URL);
      } else {
        Alert.alert(
          "エラー",
          "プライバシーポリシーページを開くことができませんでした。"
        );
      }
    } catch (error) {
      console.error("プライバシーポリシーリンクエラー:", error);
      Alert.alert(
        "エラー",
        "プライバシーポリシーページを開くことができませんでした。"
      );
    }
  };

  /**
   * 購入を復元する
   */
  const handleRestore = async () => {
    // カスタムハンドラーが指定されている場合はそちらを使用
    if (onRestorePress) {
      onRestorePress();
      return;
    }

    try {
      const result = await restorePurchasesSafely();

      if (result.hasActiveEntitlements) {
        const activeCount = Object.keys(
          result.customerInfo.entitlements.active
        ).length;
        Alert.alert("復元完了", `${activeCount}件の購入を復元しました。`);
      } else {
        Alert.alert(
          "復元できませんでした",
          "復元できる購入が見つかりませんでした。"
        );
      }
    } catch (error) {
      console.error("復元エラー:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "購入の復元中にエラーが発生しました。";
      Alert.alert("復元エラー", errorMessage);
    }
  };

  return (
    <View className="flex-row justify-center gap-4 mt-3">
      <LinkButton text="利用規約" onPress={handleTermsPress} />
      <LinkButton text="プライバシーポリシー" onPress={handlePrivacyPress} />
      <LinkButton text="復元" onPress={handleRestore} />
    </View>
  );
}

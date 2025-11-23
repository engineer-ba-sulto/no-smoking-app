import React from "react";
import { View } from "react-native";
import LinkButton from "./LinkButton";

interface PaywallFooterLinksProps {
  /** 利用規約ボタンが押された時に実行される関数 */
  onTermsPress?: () => void;
  /** プライバシーポリシーボタンが押された時に実行される関数 */
  onPrivacyPress?: () => void;
  /** 復元ボタンが押された時に実行される関数 */
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
  return (
    <View className="flex-row justify-center gap-4 mt-3">
      <LinkButton
        text="利用規約"
        onPress={
          onTermsPress ||
          (() => {
            console.log("利用規約が押されました");
          })
        }
      />
      <LinkButton
        text="プライバシーポリシー"
        onPress={
          onPrivacyPress ||
          (() => {
            console.log("プライバシーポリシーが押されました");
          })
        }
      />
      <LinkButton
        text="復元"
        onPress={
          onRestorePress ||
          (() => {
            console.log("復元が押されました");
          })
        }
      />
    </View>
  );
}


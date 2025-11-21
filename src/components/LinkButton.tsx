import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface LinkButtonProps {
  /** ボタンに表示するテキスト */
  text: string;
  /** ボタンが押された時に実行される関数 */
  onPress: () => void;
}

/**
 * リンクスタイルのボタンコンポーネント
 * 利用規約やプライバシーポリシーなどのリンクに使用
 */
export default function LinkButton({ text, onPress }: LinkButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text className="text-sm text-gray-500 underline">{text}</Text>
    </TouchableOpacity>
  );
}

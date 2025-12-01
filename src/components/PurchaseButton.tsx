import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface PurchaseButtonProps {
  /** 購入ボタンが押された時に実行される関数 */
  onPress: () => void;
  /** ローディング状態 */
  isLoading: boolean;
  /** ボタンを無効化するかどうか */
  disabled?: boolean;
  /** ボタンに表示するテキスト */
  text: string;
  /** 追加のクラス名 */
  className?: string;
}

/**
 * 購入用のボタンコンポーネント
 * ローディング状態の表示と無効化状態の管理を行う
 */
export default function PurchaseButton({
  onPress,
  isLoading,
  disabled = false,
  text,
  className = "",
}: PurchaseButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      className={`bg-emerald-500 rounded-xl py-4 items-center shadow-lg shadow-emerald-200 ${className}`}
      onPress={onPress}
      disabled={isDisabled}
      style={{ opacity: isDisabled ? 0.6 : 1 }}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text className="text-white text-lg font-bold">{text}</Text>
      )}
    </TouchableOpacity>
  );
}


import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { PurchasesPackage } from "react-native-purchases";

interface PackageCardProps {
  pkg: PurchasesPackage;
  isSelected?: boolean;
  onSelect?: (pkg: PurchasesPackage) => void;
}

export default function PackageCard({
  pkg,
  isSelected = false,
  onSelect,
}: PackageCardProps) {
  /**
   * パッケージ識別子に基づいて表示テキストを取得
   */
  const getPackageDescription = (identifier: string): string => {
    switch (identifier) {
      case "$rc_trial":
        return "最初の7日間は無料";
      case "$rc_annual":
        return "このオファーは二度と表示されません。";
      default:
        return "いつでもキャンセル可能";
    }
  };

  /**
   * パッケージ識別子に基づいてバッジテキストを取得
   */
  const getPackageBadgeText = (identifier: string): string | null => {
    switch (identifier) {
      case "$rc_trial":
        return "70%割引";
      case "$rc_annual":
        return "80%割引";
      default:
        return null;
    }
  };

  const badgeText = getPackageBadgeText(pkg.identifier);

  const cardContent = (
    <View
      className={`w-full bg-white rounded-2xl p-8 mb-4 items-center border shadow-lg ${
        isSelected
          ? "border-emerald-500 shadow-emerald-200"
          : "border-gray-200 shadow-gray-200"
      }`}
    >
      <Text className="text-gray-800 text-lg font-semibold">
        {pkg.product.title}
      </Text>
      <View className="flex-row items-baseline my-4">
        <Text className="text-gray-800 text-5xl font-extrabold">
          {pkg.product.priceString}
        </Text>
      </View>
      <Text className="text-gray-600 font-medium mb-6">
        {getPackageDescription(pkg.identifier)}
      </Text>
      {/* パッケージに応じたバッジを表示 */}
      {badgeText && (
        <View className="bg-emerald-500 px-6 py-2 rounded-full shadow-lg border-b-2 border-emerald-600">
          <Text className="text-white font-extrabold text-lg">{badgeText}</Text>
        </View>
      )}
    </View>
  );

  // onSelectが提供されている場合はTouchableOpacityでラップ
  if (onSelect) {
    return (
      <TouchableOpacity onPress={() => onSelect(pkg)}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  // onSelectが提供されていない場合はViewのみ
  return cardContent;
}

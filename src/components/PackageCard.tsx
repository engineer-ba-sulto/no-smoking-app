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
        return "お見逃しなく！";
      default:
        return "いつでもキャンセル可能";
    }
  };

  /**
   * 無料トライアル後の自動課金情報を取得
   */
  const getTrialAutoRenewalInfo = (
    identifier: string,
    priceString: string
  ): string | null => {
    if (identifier === "$rc_trial") {
      return `無料トライアル終了後、自動的に${priceString}が請求されます`;
    }
    return null;
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
      <Text className="text-gray-600 font-medium mb-2">
        {getPackageDescription(pkg.identifier)}
      </Text>
      {/* 無料トライアル後の自動課金情報を表示 */}
      {getTrialAutoRenewalInfo(pkg.identifier, pkg.product.priceString) && (
        <View className="w-full mb-4">
          <Text className="text-gray-700 text-sm font-semibold text-center">
            {getTrialAutoRenewalInfo(pkg.identifier, pkg.product.priceString)}
          </Text>
        </View>
      )}
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

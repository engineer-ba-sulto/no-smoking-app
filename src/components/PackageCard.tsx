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
        {pkg.product.description ||
          (pkg.identifier === "$rc_trial"
            ? "最初の7日間は無料"
            : "いつでもキャンセル可能")}
      </Text>
      {/* トライアルプランの場合はバッジを表示 */}
      {pkg.identifier === "$rc_trial" && (
        <View className="bg-emerald-500 px-4 py-1 rounded-full">
          <Text className="text-white font-bold text-sm">70%割引</Text>
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


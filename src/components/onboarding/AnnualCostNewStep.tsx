import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface AnnualCostNewStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const AnnualCostNewStep = ({
  onNext,
  animatedStyle,
}: AnnualCostNewStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      年間コスト
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      年間のコストを考えてみましょう
    </Text>
    <View className="w-full mb-4">
      <View className="bg-green-50 rounded-xl p-3 mb-3 border border-green-200">
        <Text className="text-base font-bold text-green-800 mb-2 text-center">
          📅 年間コスト計算
        </Text>
        <Text className="text-2xl font-bold text-green-900 text-center mb-1">
          219,000円
        </Text>
        <Text className="text-xs text-green-700 text-center mb-2">
          600円 × 365日 = 219,000円
        </Text>
        <View className="bg-green-100 rounded-lg p-1">
          <Text className="text-green-800 text-center font-semibold text-xs">
            💰 月額換算: 18,250円
          </Text>
        </View>
      </View>
      <View className="bg-blue-50 rounded-xl p-3 border border-blue-200">
        <Text className="text-base font-bold text-blue-800 mb-2 text-center">
          📊 219,000円でできること
        </Text>
        <View className="space-y-1">
          <Text className="text-xs text-blue-700">
            • 高級ホテル宿泊 3-4泊分
          </Text>
          <Text className="text-xs text-blue-700">
            • 高級レストラン 20-30回分
          </Text>
        </View>
      </View>
    </View>
    <Text className="text-lg font-semibold text-gray-800 text-center">
      年間のコストを考えてみましょう 📅
    </Text>
  </OnboardingStepWrapper>
);

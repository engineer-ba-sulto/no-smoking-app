import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface TenYearCostStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const TenYearCostStep = ({
  onNext,
  animatedStyle,
}: TenYearCostStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      10年コスト
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      10年間の経済損失を考えてみましょう
    </Text>
    <View className="w-full mb-4">
      <View className="bg-orange-50 rounded-xl p-3 mb-3 border border-orange-200">
        <Text className="text-base font-bold text-orange-800 mb-2 text-center">
          🚗 10年間の総額
        </Text>
        <Text className="text-2xl font-bold text-orange-900 text-center mb-1">
          2,190,000円
        </Text>
        <Text className="text-xs text-orange-700 text-center mb-2">
          219,000円 × 10年 = 2,190,000円
        </Text>
        <View className="bg-orange-100 rounded-lg p-1">
          <Text className="text-orange-800 text-center font-bold text-xs">
            🚗 新車1台分の価格！
          </Text>
        </View>
      </View>
      <View className="bg-red-50 rounded-xl p-3 border border-red-200">
        <Text className="text-base font-bold text-red-800 mb-2 text-center">
          💡 10年でできること
        </Text>
        <View className="space-y-1">
          <Text className="text-xs text-red-700">• 新車購入（頭金含む）</Text>
          <Text className="text-xs text-red-700">• 住宅ローンの頭金</Text>
        </View>
      </View>
    </View>
    <Text className="text-lg font-semibold text-gray-800 text-center">
      10年間の経済損失を考えてみましょう 🚗
    </Text>
  </OnboardingStepWrapper>
);

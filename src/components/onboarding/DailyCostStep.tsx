import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface DailyCostStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const DailyCostStep = ({
  onNext,
  animatedStyle,
}: DailyCostStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      1日のコスト
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      1日あたりのコストを計算してみましょう
    </Text>
    <View className="w-full mb-4">
      <View className="bg-blue-50 rounded-xl p-3 mb-3 border border-blue-200">
        <Text className="text-base font-bold text-blue-800 mb-2 text-center">
          💰 コスト計算
        </Text>
        <View className="space-y-1">
          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-blue-700">1日の本数:</Text>
            <Text className="font-semibold text-blue-800 text-sm">20本</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-blue-700">1箱の価格:</Text>
            <Text className="font-semibold text-blue-800 text-sm">600円</Text>
          </View>
          <View className="border-t border-blue-300 pt-1 mt-1">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-semibold text-blue-800">
                1日のコスト:
              </Text>
              <Text className="text-lg font-bold text-blue-900">600円</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="bg-orange-50 rounded-xl p-3 border border-orange-200">
        <Text className="text-base font-bold text-orange-800 mb-2 text-center">
          ⏰ 600円でできること
        </Text>
        <View className="space-y-1">
          <Text className="text-xs text-orange-700">• ランチ代 2-3回分</Text>
          <Text className="text-xs text-orange-700">• コーヒー 10-15杯分</Text>
        </View>
      </View>
    </View>
    <Text className="text-lg font-semibold text-gray-800 text-center">
      1日あたりのコストを意識しましょう ⏰
    </Text>
  </OnboardingStepWrapper>
);

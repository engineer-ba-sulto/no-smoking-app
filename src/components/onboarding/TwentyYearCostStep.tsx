import { LinearGradient } from "expo-linear-gradient";
import { Home } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface TwentyYearCostStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const TwentyYearCostStep = ({
  onNext,
  animatedStyle,
}: TwentyYearCostStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <View className="mb-8">
      <LinearGradient
        colors={["#EF4444", "#DC2626"]}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Home size={40} color="#ffffff" strokeWidth={2} />
      </LinearGradient>
    </View>
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      20年コスト
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      20年間の経済損失を考えてみましょう
    </Text>
    <View className="w-full mb-4">
      <View className="bg-red-50 rounded-xl p-3 mb-3 border border-red-200">
        <Text className="text-base font-bold text-red-800 mb-2 text-center">
          🏠 20年間の総額
        </Text>
        <Text className="text-2xl font-bold text-red-900 text-center mb-1">
          4,380,000円
        </Text>
        <Text className="text-xs text-red-700 text-center mb-2">
          219,000円 × 20年 = 4,380,000円
        </Text>
        <View className="bg-red-100 rounded-lg p-1">
          <Text className="text-red-800 text-center font-bold text-xs">
            🏠 住宅の頭金分！
          </Text>
        </View>
      </View>
      <View className="bg-purple-50 rounded-xl p-3 border border-purple-200">
        <Text className="text-base font-bold text-purple-800 mb-2 text-center">
          💰 20年でできること
        </Text>
        <View className="space-y-1">
          <Text className="text-xs text-purple-700">• 住宅ローンの頭金</Text>
          <Text className="text-xs text-purple-700">
            • 子供2人の教育費（大学まで）
          </Text>
        </View>
      </View>
    </View>
    <Text className="text-lg font-semibold text-gray-800 text-center">
      20年間の経済損失を考えてみましょう 🏠
    </Text>
  </OnboardingStepWrapper>
);

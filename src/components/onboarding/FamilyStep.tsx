import { LinearGradient } from "expo-linear-gradient";
import { Heart } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface FamilyStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const FamilyStep = ({ onNext, animatedStyle }: FamilyStepProps) => (
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
        <Heart size={40} color="#ffffff" strokeWidth={2} />
      </LinearGradient>
    </View>
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      家族・大切な人
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      そのお金でできる家族・大切な人への投資
    </Text>
    <View className="w-full mb-4">
      <View className="bg-red-50 rounded-xl p-2 mb-2 border border-red-200">
        <Text className="text-sm font-semibold text-red-800 mb-1">
          👨‍👩‍👧‍👦 家族との思い出作り
        </Text>
        <Text className="text-xs text-red-700">
          家族旅行毎年・レストラン月2-3回・イベント・体験月1回
        </Text>
      </View>
      <View className="bg-red-50 rounded-xl p-2 mb-2 border border-red-200">
        <Text className="text-sm font-semibold text-red-800 mb-1">
          🎁 プレゼント購入
        </Text>
        <Text className="text-xs text-red-700">
          誕生日プレゼント・記念日プレゼント・サプライズプレゼント
        </Text>
      </View>
      <View className="bg-red-50 rounded-xl p-2 mb-2 border border-red-200">
        <Text className="text-sm font-semibold text-red-800 mb-1">
          🎓 教育費・習い事代
        </Text>
        <Text className="text-xs text-red-700">
          子供の習い事・教育費の準備・学習教材の購入
        </Text>
      </View>
      <View className="bg-red-50 rounded-xl p-2 border border-red-200">
        <Text className="text-sm font-semibold text-red-800 mb-1">
          💝 健康・安全への投資
        </Text>
        <Text className="text-xs text-red-700">
          健康診断・医療費・保険料の支払い・安全な住環境の整備
        </Text>
      </View>
    </View>
    <Text className="text-lg font-semibold text-gray-800 text-center">
      そのお金でできる家族・大切な人への投資 💝
    </Text>
  </OnboardingStepWrapper>
);

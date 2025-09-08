import { LinearGradient } from "expo-linear-gradient";
import { Shield } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface OtherRiskStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const OtherRiskStep = ({
  onNext,
  animatedStyle,
}: OtherRiskStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <View className="mb-8">
      <LinearGradient
        colors={["#8B5CF6", "#7C3AED"]}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Shield size={40} color="#ffffff" strokeWidth={2} />
      </LinearGradient>
    </View>
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      その他の健康リスク
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      タバコは全身の健康に影響を与えます
    </Text>
    <View className="w-full mb-4">
      <View className="bg-purple-50 rounded-xl p-2 mb-2 border border-purple-200">
        <Text className="text-sm font-semibold text-purple-800 mb-1">
          🍯 糖尿病のリスク
        </Text>
        <Text className="text-xs text-purple-700">
          インスリン抵抗性増加・糖尿病になりやすい
        </Text>
      </View>
      <View className="bg-purple-50 rounded-xl p-2 mb-2 border border-purple-200">
        <Text className="text-sm font-semibold text-purple-800 mb-1">
          🛡️ 免疫力の低下
        </Text>
        <Text className="text-xs text-purple-700">
          感染症にかかりやすく・治りにくくなる
        </Text>
      </View>
      <View className="bg-purple-50 rounded-xl p-2 border border-purple-200">
        <Text className="text-sm font-semibold text-purple-800 mb-1">
          ⏰ 早期老化
        </Text>
        <Text className="text-xs text-purple-700">
          肌の老化・歯の黄ばみ・口臭の原因
        </Text>
      </View>
    </View>
    <Text className="text-lg font-semibold text-gray-800 text-center">
      全身の健康を守りましょう 🛡️
    </Text>
  </OnboardingStepWrapper>
);

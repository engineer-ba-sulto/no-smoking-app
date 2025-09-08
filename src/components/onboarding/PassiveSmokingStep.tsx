import { LinearGradient } from "expo-linear-gradient";
import { Users } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface PassiveSmokingStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const PassiveSmokingStep = ({
  onNext,
  animatedStyle,
}: PassiveSmokingStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <View className="mb-8">
      <LinearGradient
        colors={["#3B82F6", "#2563EB"]}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Users size={40} color="#ffffff" strokeWidth={2} />
      </LinearGradient>
    </View>
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      受動喫煙の影響
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      大切な人を守りましょう
    </Text>
    <View className="w-full mb-4">
      <View className="bg-blue-50 rounded-xl p-2 mb-2 border border-blue-200">
        <Text className="text-sm font-semibold text-blue-800 mb-1">
          👶 子供への影響
        </Text>
        <Text className="text-xs text-blue-700">
          喘息リスク2-3倍・中耳炎・学習能力低下
        </Text>
      </View>
      <View className="bg-blue-50 rounded-xl p-2 mb-2 border border-blue-200">
        <Text className="text-sm font-semibold text-blue-800 mb-1">
          👨‍👩‍👧‍👦 家族への影響
        </Text>
        <Text className="text-xs text-blue-700">
          肺がん・心臓病・呼吸器疾患のリスク増加
        </Text>
      </View>
      <View className="bg-blue-50 rounded-xl p-2 border border-blue-200">
        <Text className="text-sm font-semibold text-blue-800 mb-1">
          🏢 職場・公共の場
        </Text>
        <Text className="text-xs text-blue-700">
          同僚への健康被害・公共の場での迷惑
        </Text>
      </View>
    </View>
    <Text className="text-lg font-semibold text-gray-800 text-center">
      大切な人を守りましょう 👨‍👩‍👧‍👦
    </Text>
  </OnboardingStepWrapper>
);

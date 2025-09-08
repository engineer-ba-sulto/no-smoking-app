import { LinearGradient } from "expo-linear-gradient";
import { Wind } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface LungRiskStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const LungRiskStep = ({ onNext, animatedStyle }: LungRiskStepProps) => (
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
        <Wind size={40} color="#ffffff" strokeWidth={2} />
      </LinearGradient>
    </View>
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      呼吸器への影響
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      タバコはあなたの肺と呼吸機能を破壊します
    </Text>
    <View className="w-full mb-4">
      <View className="bg-blue-50 rounded-xl p-2 mb-2 border border-blue-200">
        <Text className="text-sm font-semibold text-blue-800 mb-1">
          🫁 COPD（慢性閉塞性肺疾患）
        </Text>
        <Text className="text-xs text-blue-700">
          呼吸困難・慢性的な咳・息切れが進行
        </Text>
      </View>
      <View className="bg-blue-50 rounded-xl p-2 mb-2 border border-blue-200">
        <Text className="text-sm font-semibold text-blue-800 mb-1">
          🎯 肺がんのリスク
        </Text>
        <Text className="text-xs text-blue-700">
          非喫煙者より15-30倍高いリスク
        </Text>
      </View>
      <View className="bg-blue-50 rounded-xl p-2 border border-blue-200">
        <Text className="text-sm font-semibold text-blue-800 mb-1">
          😮‍💨 喘息の悪化
        </Text>
        <Text className="text-xs text-blue-700">
          気道の炎症悪化・発作が頻発
        </Text>
      </View>
    </View>
    <Text className="text-lg font-semibold text-gray-800 text-center">
      自由な呼吸を取り戻しましょう 🌬️
    </Text>
  </OnboardingStepWrapper>
);

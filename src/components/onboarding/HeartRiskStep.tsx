import { LinearGradient } from "expo-linear-gradient";
import { Heart } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface HeartRiskStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const HeartRiskStep = ({
  onNext,
  animatedStyle,
}: HeartRiskStepProps) => (
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
      心臓と血管への影響
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      タバコはあなたの心臓と血管に深刻なダメージを与えます
    </Text>
    <View className="w-full mb-4">
      <View className="bg-red-50 rounded-xl p-2 mb-2 border border-red-200">
        <Text className="text-sm font-semibold text-red-800 mb-1">
          💔 心筋梗塞のリスク
        </Text>
        <Text className="text-xs text-red-700">
          非喫煙者より2-4倍高いリスク
        </Text>
      </View>
      <View className="bg-red-50 rounded-xl p-2 mb-2 border border-red-200">
        <Text className="text-sm font-semibold text-red-800 mb-1">
          🧠 脳卒中のリスク
        </Text>
        <Text className="text-xs text-red-700">
          血管の詰まりや破裂のリスクが大幅増加
        </Text>
      </View>
      <View className="bg-red-50 rounded-xl p-2 border border-red-200">
        <Text className="text-sm font-semibold text-red-800 mb-1">
          📈 高血圧の悪化
        </Text>
        <Text className="text-xs text-red-700">
          血管収縮により血圧が上昇し続ける
        </Text>
      </View>
    </View>
    <Text className="text-lg font-semibold text-gray-800 text-center">
      あなたの心臓を守りましょう ❤️
    </Text>
  </OnboardingStepWrapper>
);

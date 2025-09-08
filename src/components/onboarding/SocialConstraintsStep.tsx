import { LinearGradient } from "expo-linear-gradient";
import { MapPin } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface SocialConstraintsStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const SocialConstraintsStep = ({
  onNext,
  animatedStyle,
}: SocialConstraintsStepProps) => (
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
        <MapPin size={40} color="#ffffff" strokeWidth={2} />
      </LinearGradient>
    </View>
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      社会的制約
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      自由な生活を手に入れましょう
    </Text>
    <View className="w-full mb-4">
      <View className="bg-purple-50 rounded-xl p-2 mb-2 border border-purple-200">
        <Text className="text-sm font-semibold text-purple-800 mb-1">
          🚭 喫煙場所の制限
        </Text>
        <Text className="text-xs text-purple-700">
          屋内喫煙禁止・公共の場での制限・職場での制限
        </Text>
      </View>
      <View className="bg-purple-50 rounded-xl p-2 mb-2 border border-purple-200">
        <Text className="text-sm font-semibold text-purple-800 mb-1">
          👀 周囲からの視線
        </Text>
        <Text className="text-xs text-purple-700">
          非喫煙者からの視線・子供の前での喫煙・社会的評価の低下
        </Text>
      </View>
      <View className="bg-purple-50 rounded-xl p-2 mb-2 border border-purple-200">
        <Text className="text-sm font-semibold text-purple-800 mb-1">
          🏢 職場での制約
        </Text>
        <Text className="text-xs text-purple-700">
          喫煙休憩の制限・同僚との関係性・昇進への影響
        </Text>
      </View>
      <View className="bg-purple-50 rounded-xl p-2 border border-purple-200">
        <Text className="text-sm font-semibold text-purple-800 mb-1">
          🎯 自由な生活
        </Text>
        <Text className="text-xs text-purple-700">
          どこでも自由に過ごせる・時間制約からの解放・社会的制約からの解放
        </Text>
      </View>
    </View>
    <Text className="text-lg font-semibold text-gray-800 text-center">
      自由な生活を手に入れましょう 🗺️
    </Text>
  </OnboardingStepWrapper>
);

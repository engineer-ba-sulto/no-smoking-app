import { LinearGradient } from "expo-linear-gradient";
import { Watch } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface WantsHobbiesStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const WantsHobbiesStep = ({
  onNext,
  animatedStyle,
}: WantsHobbiesStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <View className="mb-8">
      <LinearGradient
        colors={["#EC4899", "#DB2777"]}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Watch size={40} color="#ffffff" strokeWidth={2} />
      </LinearGradient>
    </View>
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      欲しいもの・趣味
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      そのお金で買える欲しいもの・趣味
    </Text>
    <View className="w-full mb-4">
      <View className="bg-pink-50 rounded-xl p-2 mb-2 border border-pink-200">
        <Text className="text-sm font-semibold text-pink-800 mb-1">
          ⌚ 高級時計
        </Text>
        <Text className="text-xs text-pink-700">
          ロレックス2-3個・オメガ3-4個・セイコー5-6個
        </Text>
      </View>
      <View className="bg-pink-50 rounded-xl p-2 mb-2 border border-pink-200">
        <Text className="text-sm font-semibold text-pink-800 mb-1">
          📱 最新スマホ
        </Text>
        <Text className="text-xs text-pink-700">
          iPhone毎年購入・Android毎年購入・タブレット2-3台
        </Text>
      </View>
      <View className="bg-pink-50 rounded-xl p-2 mb-2 border border-pink-200">
        <Text className="text-sm font-semibold text-pink-800 mb-1">
          🎵 楽器・カメラ
        </Text>
        <Text className="text-xs text-pink-700">
          高級カメラ2-3台・楽器（ギター、ピアノ）・オーディオ機器
        </Text>
      </View>
      <View className="bg-pink-50 rounded-xl p-2 border border-pink-200">
        <Text className="text-sm font-semibold text-pink-800 mb-1">
          🎮 趣味用品
        </Text>
        <Text className="text-xs text-pink-700">
          ゲーム機毎年購入・スポーツ用品・アート用品
        </Text>
      </View>
    </View>
    <Text className="text-lg font-semibold text-gray-800 text-center">
      そのお金で買える欲しいもの・趣味 ⌚
    </Text>
  </OnboardingStepWrapper>
);

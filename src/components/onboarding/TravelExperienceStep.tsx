import { LinearGradient } from "expo-linear-gradient";
import { Plane } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface TravelExperienceStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const TravelExperienceStep = ({
  onNext,
  animatedStyle,
}: TravelExperienceStepProps) => (
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
        <Plane size={40} color="#ffffff" strokeWidth={2} />
      </LinearGradient>
    </View>
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      旅行・体験
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      そのお金でできる旅行・体験
    </Text>
    <View className="w-full mb-4">
      <View className="bg-purple-50 rounded-xl p-2 mb-2 border border-purple-200">
        <Text className="text-sm font-semibold text-purple-800 mb-1">
          ✈️ 海外旅行
        </Text>
        <Text className="text-xs text-purple-700">
          ヨーロッパ3-4回・アジア6-8回・アメリカ2-3回
        </Text>
      </View>
      <View className="bg-purple-50 rounded-xl p-2 mb-2 border border-purple-200">
        <Text className="text-sm font-semibold text-purple-800 mb-1">
          🗾 国内旅行
        </Text>
        <Text className="text-xs text-purple-700">
          沖縄10回・北海道8回・京都奈良15回
        </Text>
      </View>
      <View className="bg-purple-50 rounded-xl p-2 mb-2 border border-purple-200">
        <Text className="text-sm font-semibold text-purple-800 mb-1">
          ♨️ 温泉旅行
        </Text>
        <Text className="text-xs text-purple-700">
          高級温泉宿20回・日帰り温泉100回・温泉地巡り30回
        </Text>
      </View>
      <View className="bg-purple-50 rounded-xl p-2 border border-purple-200">
        <Text className="text-sm font-semibold text-purple-800 mb-1">
          🎯 特別体験
        </Text>
        <Text className="text-xs text-purple-700">
          スカイダイビング50回・ゴルフ100回・料理教室200回
        </Text>
      </View>
    </View>
    <Text className="text-lg font-semibold text-gray-800 text-center">
      そのお金でできる旅行・体験 ✈️
    </Text>
  </OnboardingStepWrapper>
);

import { LinearGradient } from "expo-linear-gradient";
import { Heart } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface SupportStepProps {
  onComplete: () => void;
  animatedStyle: any;
}

export const SupportStep = ({
  onComplete,
  animatedStyle,
}: SupportStepProps) => (
  <OnboardingStepWrapper
    onNext={onComplete}
    animatedStyle={animatedStyle}
    buttonTitle="最高のサポートを受け取る"
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
        <Heart size={40} color="#ffffff" strokeWidth={2} />
      </LinearGradient>
    </View>
    <Text className="text-2xl font-semibold text-gray-800 text-center mb-4 leading-8">
      私たちが24時間{"\n"}あなたに寄り添います。
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-10">
      大切な節目をお祝いするために、{"\n"}
      応援メッセージを受け取ってください。
    </Text>
  </OnboardingStepWrapper>
);

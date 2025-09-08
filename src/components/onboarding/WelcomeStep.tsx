import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface WelcomeStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const WelcomeStep = ({ onNext, animatedStyle }: WelcomeStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="一緒にがんばる"
  >
    <View className="mb-8">
      <LinearGradient
        colors={["#10B981", "#059669"]}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Sparkles size={40} color="#ffffff" strokeWidth={2} />
      </LinearGradient>
    </View>
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      禁煙アプリへようこそ！
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-10">
      禁煙という人生を変える、大きな一歩を{"\n"}
      踏み出してくださり嬉しいです。{"\n"}
      あなたの禁煙成功を全力でサポートします。
    </Text>
  </OnboardingStepWrapper>
);

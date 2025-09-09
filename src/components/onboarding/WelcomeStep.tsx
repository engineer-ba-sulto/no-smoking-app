import React from "react";
import { Text } from "react-native";
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

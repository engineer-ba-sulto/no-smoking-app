import React from "react";
import { Text } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface QuestionnaireStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const QuestionnaireStep = ({
  onNext,
  animatedStyle,
}: QuestionnaireStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="アンケートを始める"
  >
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      禁煙記録のため
    </Text>
    <Text className="text-2xl font-semibold text-gray-800 text-center mb-4">
      アンケートをお願いします
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-10">
      あなたの禁煙をより効果的にサポートするために、{"\n"}
      いくつかの質問にお答えください。{"\n\n"}
      記録を取ることで、あなたの進歩を可視化し、{"\n"}
      モチベーションを維持できます。
    </Text>
  </OnboardingStepWrapper>
);

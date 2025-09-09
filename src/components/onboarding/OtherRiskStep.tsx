import React from "react";
import { Text } from "react-native";
import { RiskCardData } from "../../types/risk-card";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";
import { RiskCardList } from "./ui/RiskCardList";

interface OtherRiskStepProps {
  onNext: () => void;
  animatedStyle: any;
  userName: string;
}

const otherRiskCards: RiskCardData[] = [
  {
    emoji: "🍯",
    title: "糖尿病のリスク",
    description: "インスリン抵抗性増加・糖尿病になりやすい",
  },
  {
    emoji: "🛡️",
    title: "免疫力の低下",
    description: "感染症にかかりやすく・治りにくくなる",
  },
  {
    emoji: "⏰",
    title: "早期老化",
    description: "肌の老化・歯の黄ばみ・口臭の原因",
  },
];

export const OtherRiskStep = ({
  onNext,
  animatedStyle,
  userName,
}: OtherRiskStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      {userName}さん
    </Text>
    <Text className="text-xl font-bold text-gray-600 text-center leading-6 mb-6">
      タバコは全身の健康に影響を与えます
    </Text>
    <RiskCardList cards={otherRiskCards} color="purple" />
    <Text className="text-lg font-semibold text-gray-800 text-center">
      {userName}さんの全身の健康を守りましょう 🛡️
    </Text>
  </OnboardingStepWrapper>
);

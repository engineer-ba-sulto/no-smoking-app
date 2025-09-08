import React from "react";
import { Text } from "react-native";
import { RiskCardData } from "../../types/risk-card";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";
import { RiskCardList } from "./ui/RiskCardList";

interface FamilyStepProps {
  onNext: () => void;
  animatedStyle: any;
}

const familyInvestmentCards: RiskCardData[] = [
  {
    emoji: "👨‍👩‍👧‍👦",
    title: "家族との思い出作り",
    description: "家族旅行毎年・レストラン月2-3回・イベント・体験月1回",
  },
  {
    emoji: "🎁",
    title: "プレゼント購入",
    description: "誕生日プレゼント・記念日プレゼント・サプライズプレゼント",
  },
  {
    emoji: "🎓",
    title: "教育費・習い事代",
    description: "子供の習い事・教育費の準備・学習教材の購入",
  },
  {
    emoji: "💝",
    title: "健康・安全への投資",
    description: "健康診断・医療費・保険料の支払い・安全な住環境の整備",
  },
];

export const FamilyStep = ({ onNext, animatedStyle }: FamilyStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      家族・大切な人
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      そのお金でできる家族・大切な人への投資
    </Text>
    <RiskCardList cards={familyInvestmentCards} color="red" />
    <Text className="text-lg font-semibold text-gray-800 text-center">
      そのお金でできる家族・大切な人への投資 💝
    </Text>
  </OnboardingStepWrapper>
);

import React from "react";
import { Text } from "react-native";
import { RiskCardData } from "../../types/risk-card";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";
import { RiskCardList } from "./ui/RiskCardList";

interface LungRiskStepProps {
  onNext: () => void;
  animatedStyle: any;
}

const lungRiskCards: RiskCardData[] = [
  {
    emoji: "🫁",
    title: "COPD（慢性閉塞性肺疾患）",
    description: "呼吸困難・慢性的な咳・息切れが進行",
  },
  {
    emoji: "🎯",
    title: "肺がんのリスク",
    description: "非喫煙者より15-30倍高いリスク",
  },
  {
    emoji: "😮‍💨",
    title: "喘息の悪化",
    description: "気道の炎症悪化・発作が頻発",
  },
];

export const LungRiskStep = ({ onNext, animatedStyle }: LungRiskStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      呼吸器への影響
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      タバコはあなたの肺と呼吸機能を破壊します
    </Text>
    <RiskCardList cards={lungRiskCards} color="blue" />
    <Text className="text-lg font-semibold text-gray-800 text-center">
      自由な呼吸を取り戻しましょう 🌬️
    </Text>
  </OnboardingStepWrapper>
);

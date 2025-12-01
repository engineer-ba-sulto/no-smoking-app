import React from "react";
import { Text } from "react-native";
import { RiskCardData } from "../../types/risk-card";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";
import { RiskCardList } from "./ui/RiskCardList";

interface PassiveSmokingStepProps {
  onNext: () => void;
  animatedStyle: any;
}

const passiveSmokingCards: RiskCardData[] = [
  {
    emoji: "👶",
    title: "子供への影響",
    description: "喘息リスク2-3倍・中耳炎・学習能力低下",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    title: "家族への影響",
    description: "肺がん・心臓病・呼吸器疾患のリスク増加",
  },
  {
    emoji: "🏢",
    title: "職場・公共の場",
    description: "同僚への健康被害・公共の場での迷惑",
  },
];

export const PassiveSmokingStep = ({
  onNext,
  animatedStyle,
}: PassiveSmokingStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      受動喫煙の影響
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      大切な人を守りましょう
    </Text>
    <RiskCardList cards={passiveSmokingCards} color="blue" />
    <Text className="text-lg font-semibold text-gray-800 text-center">
      大切な人を守りましょう 👨‍👩‍👧‍👦
    </Text>
  </OnboardingStepWrapper>
);

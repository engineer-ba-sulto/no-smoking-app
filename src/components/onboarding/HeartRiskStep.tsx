import React from "react";
import { Text } from "react-native";
import { RiskCardData } from "../../types/risk-card";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";
import { RiskCardList } from "./ui/RiskCardList";

interface HeartRiskStepProps {
  onNext: () => void;
  animatedStyle: any;
}

const heartRiskCards: RiskCardData[] = [
  {
    emoji: "💔",
    title: "心筋梗塞のリスク",
    description: "非喫煙者より2-4倍高いリスク",
  },
  {
    emoji: "🧠",
    title: "脳卒中のリスク",
    description: "血管の詰まりや破裂のリスクが大幅増加",
  },
  {
    emoji: "📈",
    title: "高血圧の悪化",
    description: "血管収縮により血圧が上昇し続ける",
  },
];

export const HeartRiskStep = ({
  onNext,
  animatedStyle,
}: HeartRiskStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      心臓と血管への影響
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      タバコはあなたの心臓と血管に深刻なダメージを与えます
    </Text>
    <RiskCardList cards={heartRiskCards} color="red" />
    <Text className="text-lg font-semibold text-gray-800 text-center">
      あなたの心臓を守りましょう ❤️
    </Text>
  </OnboardingStepWrapper>
);

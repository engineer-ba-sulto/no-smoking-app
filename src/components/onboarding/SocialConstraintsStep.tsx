import React from "react";
import { Text } from "react-native";
import { RiskCardData } from "../../types/risk-card";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";
import { RiskCardList } from "./ui/RiskCardList";

interface SocialConstraintsStepProps {
  onNext: () => void;
  animatedStyle: any;
}

const socialConstraintsCards: RiskCardData[] = [
  {
    emoji: "🚭",
    title: "喫煙場所の制限",
    description: "屋内喫煙禁止・公共の場での制限・職場での制限",
  },
  {
    emoji: "👀",
    title: "周囲からの視線",
    description: "非喫煙者からの視線・子供の前での喫煙・社会的評価の低下",
  },
  {
    emoji: "🏢",
    title: "職場での制約",
    description: "喫煙休憩の制限・同僚との関係性・昇進への影響",
  },
  {
    emoji: "🎯",
    title: "自由な生活",
    description:
      "どこでも自由に過ごせる・時間制約からの解放・社会的制約からの解放",
  },
];

export const SocialConstraintsStep = ({
  onNext,
  animatedStyle,
}: SocialConstraintsStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      社会的制約
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      自由な生活を手に入れましょう
    </Text>
    <RiskCardList cards={socialConstraintsCards} color="purple" />
    <Text className="text-lg font-semibold text-gray-800 text-center">
      自由な生活を手に入れましょう 🗺️
    </Text>
  </OnboardingStepWrapper>
);

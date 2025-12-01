import React from "react";
import { Text } from "react-native";
import { RiskCardData } from "../../types/risk-card";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";
import { RiskCardList } from "./ui/RiskCardList";

interface AppearanceImpactStepProps {
  onNext: () => void;
  animatedStyle: any;
}

const appearanceImpactCards: RiskCardData[] = [
  {
    emoji: "😷",
    title: "口臭・体臭",
    description: "タバコの独特な臭い・口臭悪化・髪や服に染み付く",
  },
  {
    emoji: "🦷",
    title: "歯の黄ばみ",
    description: "歯の着色・黄ばみ・歯周病リスク・口元の印象悪化",
  },
  {
    emoji: "👤",
    title: "肌の老化",
    description: "肌の乾燥・くすみ・シワの増加・弾力性の低下",
  },
  {
    emoji: "👔",
    title: "服装への影響",
    description: "服に染み付く臭い・ヤニのシミ・清潔感の欠如",
  },
];

export const AppearanceImpactStep = ({
  onNext,
  animatedStyle,
}: AppearanceImpactStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      臭い・見た目の影響
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      清潔感と美しさを取り戻しましょう
    </Text>
    <RiskCardList cards={appearanceImpactCards} color="orange" />
    <Text className="text-lg font-semibold text-gray-800 text-center">
      清潔感と美しさを取り戻しましょう ✨
    </Text>
  </OnboardingStepWrapper>
);

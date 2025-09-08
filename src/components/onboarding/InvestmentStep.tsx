import React from "react";
import { Text } from "react-native";
import { RiskCardData } from "../../types/risk-card";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";
import { RiskCardList } from "./ui/RiskCardList";

interface InvestmentStepProps {
  onNext: () => void;
  animatedStyle: any;
}

const investmentCards: RiskCardData[] = [
  {
    emoji: "📈",
    title: "投資信託",
    description: "年間219,000円の積立投資・10年で約300万円・20年で約700万円",
  },
  {
    emoji: "🏦",
    title: "定期預金",
    description: "年間219,000円の定期預金・10年で約220万円・安全な資産形成",
  },
  {
    emoji: "💰",
    title: "将来のための貯蓄",
    description: "老後資金の準備・子供の教育費・住宅購入資金",
  },
  {
    emoji: "🎯",
    title: "複利効果",
    description: "時間を味方につける・雪だるま式に資産増加・将来の経済的自由",
  },
];

export const InvestmentStep = ({
  onNext,
  animatedStyle,
}: InvestmentStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      投資・資産形成
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      そのお金でできる投資・資産形成
    </Text>
    <RiskCardList cards={investmentCards} color="green" />
    <Text className="text-lg font-semibold text-gray-800 text-center">
      そのお金でできる投資・資産形成 📈
    </Text>
  </OnboardingStepWrapper>
);

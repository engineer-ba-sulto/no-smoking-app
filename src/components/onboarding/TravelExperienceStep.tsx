import React from "react";
import { Text } from "react-native";
import { RiskCardData } from "../../types/risk-card";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";
import { RiskCardList } from "./ui/RiskCardList";

interface TravelExperienceStepProps {
  onNext: () => void;
  animatedStyle: any;
}

const travelExperienceCards: RiskCardData[] = [
  {
    emoji: "✈️",
    title: "海外旅行",
    description: "ヨーロッパ3-4回・アジア6-8回・アメリカ2-3回",
  },
  {
    emoji: "🗾",
    title: "国内旅行",
    description: "沖縄10回・北海道8回・京都奈良15回",
  },
  {
    emoji: "♨️",
    title: "温泉旅行",
    description: "高級温泉宿20回・日帰り温泉100回・温泉地巡り30回",
  },
  {
    emoji: "🎯",
    title: "特別体験",
    description: "スカイダイビング50回・ゴルフ100回・料理教室200回",
  },
];

export const TravelExperienceStep = ({
  onNext,
  animatedStyle,
}: TravelExperienceStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      旅行・体験
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      そのお金でできる旅行・体験
    </Text>
    <RiskCardList cards={travelExperienceCards} color="purple" />
    <Text className="text-lg font-semibold text-gray-800 text-center">
      そのお金でできる旅行・体験 ✈️
    </Text>
  </OnboardingStepWrapper>
);

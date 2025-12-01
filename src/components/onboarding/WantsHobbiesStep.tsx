import React from "react";
import { Text } from "react-native";
import { RiskCardData } from "../../types/risk-card";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";
import { RiskCardList } from "./ui/RiskCardList";

interface WantsHobbiesStepProps {
  onNext: () => void;
  animatedStyle: any;
}

const wantsHobbiesCards: RiskCardData[] = [
  {
    emoji: "⌚",
    title: "高級時計",
    description: "ロレックス2-3個・オメガ3-4個・セイコー5-6個",
  },
  {
    emoji: "📱",
    title: "最新スマホ",
    description: "iPhone毎年購入・Android毎年購入・タブレット2-3台",
  },
  {
    emoji: "🎵",
    title: "楽器・カメラ",
    description: "高級カメラ2-3台・楽器（ギター、ピアノ）・オーディオ機器",
  },
  {
    emoji: "🎮",
    title: "趣味用品",
    description: "ゲーム機毎年購入・スポーツ用品・アート用品",
  },
];

export const WantsHobbiesStep = ({
  onNext,
  animatedStyle,
}: WantsHobbiesStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      欲しいもの・趣味
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      そのお金で買える欲しいもの・趣味
    </Text>
    <RiskCardList cards={wantsHobbiesCards} color="pink" />
    <Text className="text-lg font-semibold text-gray-800 text-center">
      そのお金で買える欲しいもの・趣味 ⌚
    </Text>
  </OnboardingStepWrapper>
);

import React from "react";
import { Text } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";
import { MotivationSelector } from "./ui/MotivationSelector";

interface MotivationStepProps {
  onNext: () => void;
  animatedStyle: any;
  selectedMotivations: string[];
  onSelectionChange: (motivations: string[]) => void;
}

export const MotivationStep = ({
  onNext,
  animatedStyle,
  selectedMotivations,
  onSelectionChange,
}: MotivationStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    disabled={selectedMotivations.length === 0}
    title="あなたが禁煙を決意した、\n一番の理由は何ですか？"
  >
    <Text className="text-sm text-gray-400 text-center mb-8">(複数選択可)</Text>
    <MotivationSelector
      selectedMotivations={selectedMotivations}
      onSelectionChange={onSelectionChange}
    />
  </OnboardingStepWrapper>
);

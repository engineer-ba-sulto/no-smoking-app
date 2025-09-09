import React from "react";
import { View } from "react-native";
import { NumberStepper } from "../NumberStepper";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface CigarettesStepProps {
  onNext: () => void;
  animatedStyle: any;
  cigarettesPerDay: number;
  onCigarettesChange: (value: number) => void;
}

export const CigarettesStep = ({
  onNext,
  animatedStyle,
  cigarettesPerDay,
  onCigarettesChange,
}: CigarettesStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    title={`1日に、およそ何本くらい\n吸っていましたか？`}
  >
    <View className="my-10">
      <NumberStepper
        value={cigarettesPerDay}
        onChange={onCigarettesChange}
        min={1}
        max={80}
        suffix="本"
      />
    </View>
  </OnboardingStepWrapper>
);

import React from "react";
import { View } from "react-native";
import { NumberStepper } from "../NumberStepper";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface PackSizeStepProps {
  onNext: () => void;
  animatedStyle: any;
  cigarettesPerPack: number;
  onCigarettesPerPackChange: (value: number) => void;
}

export const PackSizeStep = ({
  onNext,
  animatedStyle,
  cigarettesPerPack,
  onCigarettesPerPackChange,
}: PackSizeStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    title={`1箱の本数は\n何本でしたか？`}
  >
    <View className="my-10">
      <NumberStepper
        value={cigarettesPerPack}
        onChange={onCigarettesPerPackChange}
        min={10}
        max={50}
        step={1}
        suffix="本"
      />
    </View>
  </OnboardingStepWrapper>
);

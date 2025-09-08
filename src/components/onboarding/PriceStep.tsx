import React from "react";
import { View } from "react-native";
import { NumberStepper } from "../NumberStepper";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface PriceStepProps {
  onNext: () => void;
  animatedStyle: any;
  pricePerPack: number;
  onPriceChange: (value: number) => void;
}

export const PriceStep = ({
  onNext,
  animatedStyle,
  pricePerPack,
  onPriceChange,
}: PriceStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    title="タバコ1箱の価格は\nいくらでしたか？"
  >
    <View className="my-10">
      <NumberStepper
        value={pricePerPack}
        onChange={onPriceChange}
        min={100}
        max={2000}
        step={10}
        suffix="円"
      />
    </View>
  </OnboardingStepWrapper>
);

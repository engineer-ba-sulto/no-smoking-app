import React from "react";
import { View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface ReadyStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const ReadyStep = ({ onNext, animatedStyle }: ReadyStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="今、この瞬間から始める"
    title="準備は整いました。\n\nあなたの新しい人生は、\nいつから始まりますか？"
  >
    <View className="w-full my-8" />
  </OnboardingStepWrapper>
);

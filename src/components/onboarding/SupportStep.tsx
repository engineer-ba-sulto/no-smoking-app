import React from "react";
import { Text } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface SupportStepProps {
  onComplete: () => void;
  animatedStyle: any;
}

export const SupportStep = ({
  onComplete,
  animatedStyle,
}: SupportStepProps) => (
  <OnboardingStepWrapper
    onNext={onComplete}
    animatedStyle={animatedStyle}
    buttonTitle="最高のサポートを受け取る"
  >
    <Text className="text-2xl font-semibold text-gray-800 text-center mb-4 leading-8">
      私たちが24時間{"\n"}あなたに寄り添います。
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-10">
      大切な節目をお祝いするために、{"\n"}
      応援メッセージを受け取ってください。
    </Text>
  </OnboardingStepWrapper>
);

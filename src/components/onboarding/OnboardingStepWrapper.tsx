import React from "react";
import { Text } from "react-native";
import Animated from "react-native-reanimated";
import { StepButton } from "../StepButton";

interface OnboardingStepWrapperProps {
  children: React.ReactNode;
  title?: string;
  onNext: () => void;
  disabled?: boolean;
  buttonTitle?: string;
  animatedStyle: any;
}

export const OnboardingStepWrapper = ({
  children,
  title,
  onNext,
  disabled = false,
  buttonTitle = "次へ >",
  animatedStyle,
}: OnboardingStepWrapperProps) => (
  <Animated.View
    style={animatedStyle}
    className="items-center justify-center max-h-[600px] px-5"
  >
    {title && (
      <Text className="text-2xl font-semibold text-gray-800 text-center mb-4 leading-8">
        {title}
      </Text>
    )}
    {children}
    <StepButton
      title={buttonTitle}
      onPress={onNext}
      disabled={disabled}
      className="w-full mt-5"
    />
  </Animated.View>
);

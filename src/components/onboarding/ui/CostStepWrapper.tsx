import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "../OnboardingStepWrapper";

interface CostStepWrapperProps {
  title: string;
  description: string;
  finalMessage: string;
  onNext: () => void;
  animatedStyle: any;
  children: React.ReactNode;
}

export const CostStepWrapper: React.FC<CostStepWrapperProps> = ({
  title,
  description,
  finalMessage,
  onNext,
  animatedStyle,
  children,
}) => {
  return (
    <OnboardingStepWrapper
      onNext={onNext}
      animatedStyle={animatedStyle}
      buttonTitle="詳しく知る"
    >
      <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
        {title}
      </Text>
      <Text className="text-base text-gray-600 text-center leading-6 mb-6">
        {description}
      </Text>

      <View className="w-full mb-4">{children}</View>

      <Text className="text-lg font-semibold text-gray-800 text-center">
        {finalMessage}
      </Text>
    </OnboardingStepWrapper>
  );
};

import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: Props) {
  return (
    <View className="items-center py-4">
      <Text className="text-xs text-gray-400 font-medium mb-2">
        ({currentStep}/{totalSteps})
      </Text>
      <View className="flex-row items-center">
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index < currentStep ? 'bg-primary-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>
    </View>
  );
}
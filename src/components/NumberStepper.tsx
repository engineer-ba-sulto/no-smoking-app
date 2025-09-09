import * as Haptics from "expo-haptics";
import { Minus, Plus } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export function NumberStepper({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
  suffix = "",
}: Props) {
  const handleDecrease = () => {
    if (value > min) {
      // 軽い振動フィードバック
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(value - step);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      // 軽い振動フィードバック
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(value + step);
    }
  };

  return (
    <View className="flex-row items-center justify-center">
      <TouchableOpacity
        className={`w-11 h-11 rounded-full items-center justify-center border-2 ${
          value <= min
            ? "bg-gray-50 border-gray-300"
            : "bg-primary-50 border-primary-500"
        }`}
        onPress={handleDecrease}
        disabled={value <= min}
        activeOpacity={0.7}
      >
        <Minus
          size={20}
          color={value <= min ? "#D1D5DB" : "#10B981"}
          strokeWidth={2}
        />
      </TouchableOpacity>

      <View className="flex-row items-baseline mx-10">
        <Text className="text-4xl font-bold text-gray-800">{value}</Text>
        {suffix && <Text className="text-lg text-gray-600 ml-1">{suffix}</Text>}
      </View>

      <TouchableOpacity
        className={`w-11 h-11 rounded-full items-center justify-center border-2 ${
          value >= max
            ? "bg-gray-50 border-gray-300"
            : "bg-primary-50 border-primary-500"
        }`}
        onPress={handleIncrease}
        disabled={value >= max}
        activeOpacity={0.7}
      >
        <Plus
          size={20}
          color={value >= max ? "#D1D5DB" : "#10B981"}
          strokeWidth={2}
        />
      </TouchableOpacity>
    </View>
  );
}

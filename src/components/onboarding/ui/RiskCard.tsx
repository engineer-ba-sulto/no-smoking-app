import { BlurView } from "expo-blur";
import React from "react";
import { Text, View } from "react-native";
import { RiskCardColor } from "../../../types/risk-card";

interface RiskCardProps {
  emoji: string;
  title: string;
  description: string;
  color: RiskCardColor;
}

export const RiskCard: React.FC<RiskCardProps> = ({
  emoji,
  title,
  description,
  color,
}) => {
  const colorClasses = {
    red: {
      tint: "light" as const,
      borderColor: "rgba(248, 113, 113, 0.3)",
      title: "text-red-900",
      description: "text-red-800",
    },
    blue: {
      tint: "light" as const,
      borderColor: "rgba(59, 130, 246, 0.3)",
      title: "text-blue-900",
      description: "text-blue-800",
    },
    purple: {
      tint: "light" as const,
      borderColor: "rgba(147, 51, 234, 0.3)",
      title: "text-purple-900",
      description: "text-purple-800",
    },
    orange: {
      tint: "light" as const,
      borderColor: "rgba(249, 115, 22, 0.3)",
      title: "text-orange-900",
      description: "text-orange-800",
    },
    green: {
      tint: "light" as const,
      borderColor: "rgba(34, 197, 94, 0.3)",
      title: "text-green-900",
      description: "text-green-800",
    },
    pink: {
      tint: "light" as const,
      borderColor: "rgba(236, 72, 153, 0.3)",
      title: "text-pink-900",
      description: "text-pink-800",
    },
  };

  const classes = colorClasses[color];

  return (
    <View
      className="mb-3"
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <BlurView intensity={20} tint={classes.tint} className="rounded-2xl p-4">
        <Text className={`text-base font-bold ${classes.title} mb-2`}>
          {emoji} {title}
        </Text>
        <Text className={`text-sm leading-5 ${classes.description}`}>
          {description}
        </Text>
      </BlurView>
    </View>
  );
};

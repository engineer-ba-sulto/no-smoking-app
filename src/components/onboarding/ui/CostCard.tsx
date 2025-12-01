import { BlurView } from "expo-blur";
import React from "react";
import { Text, View } from "react-native";
import { CostCardData } from "../../../types/cost-card";

interface CostCardProps {
  data: CostCardData;
}

export const CostCard: React.FC<CostCardProps> = ({ data }) => {
  const colorClasses = {
    red: {
      tint: "light" as const,
      borderColor: "rgba(248, 113, 113, 0.3)",
      title: "text-red-900",
      amount: "text-red-900",
      calculation: "text-red-800",
      highlight: "bg-red-100",
      highlightText: "text-red-800",
    },
    blue: {
      tint: "light" as const,
      borderColor: "rgba(59, 130, 246, 0.3)",
      title: "text-blue-900",
      amount: "text-blue-900",
      calculation: "text-blue-800",
      highlight: "bg-blue-100",
      highlightText: "text-blue-800",
    },
    green: {
      tint: "light" as const,
      borderColor: "rgba(34, 197, 94, 0.3)",
      title: "text-green-900",
      amount: "text-green-900",
      calculation: "text-green-800",
      highlight: "bg-green-100",
      highlightText: "text-green-800",
    },
    orange: {
      tint: "light" as const,
      borderColor: "rgba(249, 115, 22, 0.3)",
      title: "text-orange-900",
      amount: "text-orange-900",
      calculation: "text-orange-800",
      highlight: "bg-orange-100",
      highlightText: "text-orange-800",
    },
    purple: {
      tint: "light" as const,
      borderColor: "rgba(147, 51, 234, 0.3)",
      title: "text-purple-900",
      amount: "text-purple-900",
      calculation: "text-purple-800",
      highlight: "bg-purple-100",
      highlightText: "text-purple-800",
    },
  };

  const classes = colorClasses[data.color];

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
        <Text
          className={`text-base font-bold ${classes.title} mb-2 text-center`}
        >
          {data.emoji} {data.title}
        </Text>

        {data.amount && (
          <Text
            className={`text-2xl font-bold ${classes.amount} text-center mb-1`}
          >
            {data.amount}
          </Text>
        )}

        {data.calculation && (
          <Text className={`text-xs ${classes.calculation} text-center mb-2`}>
            {data.calculation}
          </Text>
        )}

        {data.highlight && (
          <View className={`${classes.highlight} rounded-lg p-1`}>
            <Text
              className={`${classes.highlightText} text-center font-bold text-xs`}
            >
              {data.highlight}
            </Text>
          </View>
        )}
      </BlurView>
    </View>
  );
};

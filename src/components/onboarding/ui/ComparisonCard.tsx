import { BlurView } from "expo-blur";
import React from "react";
import { Text, View } from "react-native";
import { ComparisonCardData } from "../../../types/cost-card";

interface ComparisonCardProps {
  data: ComparisonCardData;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ data }) => {
  const colorClasses = {
    red: {
      tint: "light" as const,
      borderColor: "rgba(248, 113, 113, 0.3)",
      title: "text-red-900",
      item: "text-red-800",
    },
    blue: {
      tint: "light" as const,
      borderColor: "rgba(59, 130, 246, 0.3)",
      title: "text-blue-900",
      item: "text-blue-800",
    },
    green: {
      tint: "light" as const,
      borderColor: "rgba(34, 197, 94, 0.3)",
      title: "text-green-900",
      item: "text-green-800",
    },
    orange: {
      tint: "light" as const,
      borderColor: "rgba(249, 115, 22, 0.3)",
      title: "text-orange-900",
      item: "text-orange-800",
    },
    purple: {
      tint: "light" as const,
      borderColor: "rgba(147, 51, 234, 0.3)",
      title: "text-purple-900",
      item: "text-purple-800",
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

        <View className="space-y-1">
          {data.items.map((item, index) => (
            <Text key={index} className={`text-xs ${classes.item}`}>
              • {item}
            </Text>
          ))}
        </View>
      </BlurView>
    </View>
  );
};

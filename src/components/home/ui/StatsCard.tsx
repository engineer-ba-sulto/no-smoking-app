import { BlurView } from "expo-blur";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

export function StatsCard({ icon, label, value, color }: Props) {
  return (
    <View
      className="w-[48%] mb-4"
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
      <BlurView
        intensity={20}
        tint="light"
        className="rounded-xl p-5 items-center"
      >
        <View
          className="w-12 h-12 rounded-full items-center justify-center mb-3"
          style={{ backgroundColor: `${color}25` }}
        >
          {icon}
        </View>
        <Text className="text-base text-gray-800 text-center mb-2 font-bold">
          {label}
        </Text>
        <Text
          className="text-xl font-bold text-center"
          style={{ color: `${color}FF` }} // 完全に不透明にして読みやすく
        >
          {value}
        </Text>
      </BlurView>
    </View>
  );
}

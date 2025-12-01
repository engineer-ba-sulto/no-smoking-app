import { BlurView } from "expo-blur";
import React from "react";
import { Text, View } from "react-native";

interface HeaderProps {
  title: string;
  subtitle?: string;
  healthStatus?: {
    icon: React.ReactNode;
    text: string;
  };
}

export function AppHeader({ title, subtitle, healthStatus }: HeaderProps) {
  const containerClassName = "relative z-10 rounded-b-3xl overflow-hidden";

  const blurViewStyle = {
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "rgba(16, 185, 129, 0.3)",
  };

  return (
    <View
      className={containerClassName}
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
      <BlurView intensity={20} tint="light" style={blurViewStyle}>
        {subtitle ? (
          <Text className="text-lg font-semibold text-emerald-800 mb-2">
            {subtitle}
          </Text>
        ) : null}

        <Text className="text-2xl font-bold text-emerald-800 text-center">
          {title}
        </Text>

        {healthStatus && (
          <View className="flex-row items-center bg-emerald-100/80 px-3 py-1.5 rounded-xl self-start mt-2">
            {healthStatus.icon}
            <Text className="text-xs text-emerald-800 ml-1.5 font-medium">
              {healthStatus.text}
            </Text>
          </View>
        )}
      </BlurView>
    </View>
  );
}

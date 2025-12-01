import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";

interface GlassmorphismButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
  blurIntensity?: number;
  tint?: "default" | "light" | "dark";
}

export function GlassmorphismButton({
  title,
  onPress,
  disabled = false,
  variant = "primary",
  className = "",
  blurIntensity = 20,
  tint = "light",
}: GlassmorphismButtonProps) {
  // ボタンが押された時のハンドラー
  const handlePress = () => {
    if (variant === "primary") {
      // primaryボタン：中程度の振動
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      // secondaryボタン：選択フィードバック
      Haptics.selectionAsync();
    }
    onPress();
  };

  if (variant === "secondary") {
    return (
      <TouchableOpacity
        className={`py-4 items-center ${className}`}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text className="text-sm text-emerald-700 underline font-medium">
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  const buttonStyle: ViewStyle = {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  };

  return (
    <TouchableOpacity
      className={`${disabled ? "opacity-50" : ""} ${className}`}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      style={buttonStyle}
    >
      <BlurView
        intensity={blurIntensity}
        tint={tint}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          alignItems: "center",
          backgroundColor: disabled
            ? "rgba(209, 213, 219, 0.3)"
            : "rgba(16, 185, 129, 0.3)",
          borderWidth: disabled ? 5 : 0,
          borderColor: disabled ? "rgba(156, 163, 175, 1)" : "transparent",
        }}
      >
        <Text
          className={`text-base font-bold ${
            disabled ? "text-black" : "text-emerald-800"
          }`}
        >
          {title}
        </Text>
      </BlurView>
    </TouchableOpacity>
  );
}

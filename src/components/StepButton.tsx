import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
}

export function StepButton({
  title,
  onPress,
  disabled = false,
  variant = "primary",
  className = "",
}: Props) {
  if (variant === "secondary") {
    return (
      <TouchableOpacity
        className={`py-4 items-center ${className}`}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text className="text-sm text-gray-600 underline">{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className={`rounded-xl ${disabled ? "opacity-50" : ""} ${className}`}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={disabled ? ["#D1D5DB", "#9CA3AF"] : ["#10B981", "#059669"]}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text
          className={`text-base font-semibold ${
            disabled ? "text-gray-100" : "text-white"
          }`}
        >
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

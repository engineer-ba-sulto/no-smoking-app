import { Save } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SaveButtonProps {
  onSave: () => void;
  isValid?: boolean;
  isSaving: boolean;
  disabled?: boolean;
  buttonText?: string;
  savingText?: string;
  className?: string;
  showIcon?: boolean;
  variant?: "primary" | "secondary";
}

export function SaveButton({
  onSave,
  isValid = true,
  isSaving,
  disabled = false,
  buttonText = "保存",
  savingText = "保存中...",
  className = "",
  showIcon = true,
  variant = "primary",
}: SaveButtonProps) {
  const isDisabled = disabled || isSaving || !isValid;

  const getButtonStyle = () => {
    if (variant === "secondary") {
      return `rounded-xl py-4 px-6 border-2 ${
        isDisabled
          ? "bg-gray-100 border-gray-300"
          : "bg-white border-emerald-500"
      }`;
    }

    return `rounded-xl py-4 px-6 shadow-sm ${
      isDisabled ? "bg-gray-400" : "bg-emerald-500"
    }`;
  };

  const getTextStyle = () => {
    if (variant === "secondary") {
      return `text-lg font-semibold ${
        isDisabled ? "text-gray-400" : "text-emerald-600"
      }`;
    }

    return `text-lg font-semibold ${
      isDisabled ? "text-gray-200" : "text-white"
    }`;
  };

  const getIconColor = () => {
    if (variant === "secondary") {
      return isDisabled ? "#9CA3AF" : "#10B981";
    }
    return isDisabled ? "#E5E7EB" : "#ffffff";
  };

  return (
    <View className={`mt-6 mb-8 ${className}`}>
      <TouchableOpacity
        onPress={onSave}
        className={getButtonStyle()}
        activeOpacity={0.8}
        disabled={isDisabled}
      >
        <View className="flex-row items-center justify-center">
          {showIcon && (
            <Save size={20} color={getIconColor()} strokeWidth={2} />
          )}
          <Text className={`${showIcon ? "ml-2" : ""} ${getTextStyle()}`}>
            {isSaving ? savingText : buttonText}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

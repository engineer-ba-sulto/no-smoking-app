import { X } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

interface CloseButtonProps {
  onPress: () => void;
  topOffset?: number; // iOS用のtop位置を調整可能にする（デフォルト: 50）
}

export default function CloseButton({
  onPress,
  topOffset = 50,
}: CloseButtonProps) {
  return (
    <View
      style={[
        styles.closeButton,
        { top: Platform.OS === "android" ? 20 : topOffset },
      ]}
    >
      <TouchableOpacity onPress={onPress} className="p-1">
        <X size={24} className="text-gray-400" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    left: 20,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

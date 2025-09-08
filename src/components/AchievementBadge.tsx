import { AchievementStatus } from "@/types/achievement";
import {
  calculateProgressPercentage,
  calculateRemainingValue,
  formatTimeRemaining,
  formatTimeRemainingWithSeconds,
} from "@/utils/achievement-progress";
import { Award, Lock } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  achievement: AchievementStatus & {
    targetValue: number;
    currentValue: number;
  };
  // 秒単位の残り時間を計算するための追加プロパティ
  remainingSeconds?: number;
}

const tierColors = {
  bronze: "#CD7C32",
  silver: "#C0C0C0",
  gold: "#FFD700",
  platinum: "#E5E4E2",
};

export function AchievementBadge({ achievement, remainingSeconds }: Props) {
  const tierColor = tierColors[achievement.tier];
  const isAchieved = achievement.isUnlocked;
  const progress = calculateProgressPercentage(
    achievement.currentValue,
    achievement.targetValue
  );
  const remaining = calculateRemainingValue(
    achievement.currentValue,
    achievement.targetValue
  );

  return (
    <TouchableOpacity
      className={`w-[48%] bg-white rounded-xl p-4 mb-4 items-center shadow-sm ${
        isAchieved ? "border border-primary-500" : "opacity-80"
      }`}
      activeOpacity={0.8}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center mb-2"
        style={{
          backgroundColor: isAchieved ? `${tierColor}20` : "#f3f4f6",
        }}
      >
        {isAchieved ? (
          <Award size={24} color={tierColor} strokeWidth={2} />
        ) : (
          <Lock size={24} color="#9CA3AF" strokeWidth={2} />
        )}
      </View>

      <Text
        className="text-xs font-bold mb-1"
        style={{ color: isAchieved ? tierColor : "#9CA3AF" }}
      >
        [{achievement.tier.toUpperCase()}]
      </Text>

      <Text
        className={`text-sm font-semibold text-center mb-1 ${
          isAchieved ? "text-gray-800" : "text-gray-400"
        }`}
      >
        {achievement.title}
      </Text>

      <Text
        className={`text-xs text-center leading-4 mb-2 ${
          isAchieved ? "text-gray-600" : "text-gray-300"
        }`}
      >
        {achievement.description}
      </Text>

      {!isAchieved && (
        <View className="w-full items-center">
          <Text className="text-xs text-center mb-1.5">
            <Text className="text-gray-400">目標まであと </Text>
            <Text className="text-primary-500 font-semibold">
              {achievement.category === "duration"
                ? remainingSeconds !== undefined && remainingSeconds < 60
                  ? formatTimeRemainingWithSeconds(remainingSeconds)
                  : formatTimeRemaining(remaining)
                : `${remaining.toLocaleString()}${achievement.unit}`}
            </Text>
          </Text>
          <View className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </View>
        </View>
      )}

      {isAchieved && (
        <Text className="text-xs text-primary-500 text-center mt-1">
          タップして詳細を見る
        </Text>
      )}
    </TouchableOpacity>
  );
}

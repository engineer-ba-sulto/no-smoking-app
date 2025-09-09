import { AchievementStatus } from "@/types/achievement";
import {
  calculateProgressPercentage,
  calculateRemainingValue,
  formatTimeRemaining,
  formatTimeRemainingWithSeconds,
} from "@/utils/achievement-progress";
import { BlurView } from "expo-blur";
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
      <TouchableOpacity
        activeOpacity={0.8}
        className={`rounded-xl ${!isAchieved ? "opacity-80" : ""}`}
      >
        <BlurView
          intensity={20}
          tint="light"
          className="rounded-xl p-4 items-center"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
        >
          <View
            className="w-12 h-12 rounded-full items-center justify-center mb-3"
            style={{
              backgroundColor: isAchieved
                ? `${tierColor}25`
                : "rgba(243, 244, 246, 0.5)",
            }}
          >
            {isAchieved ? (
              <Award size={24} color={tierColor} strokeWidth={2} />
            ) : (
              <Lock size={24} color="#9CA3AF" strokeWidth={2} />
            )}
          </View>

          <Text
            className="text-sm font-bold mb-1"
            style={{ color: isAchieved ? tierColor : "#9CA3AF" }}
          >
            [{achievement.tier.toUpperCase()}]
          </Text>

          <Text
            className={`text-base font-semibold text-center mb-1 ${
              isAchieved ? "text-gray-800" : "text-gray-500"
            }`}
          >
            {achievement.title}
          </Text>

          {isAchieved && (
            <Text className="text-sm text-center leading-4 mb-2 text-gray-700">
              {achievement.description}
            </Text>
          )}

          {!isAchieved && (
            <View className="w-full items-center">
              <View className="w-full items-center mb-1.5">
                <Text className="text-sm text-gray-500 text-center mb-1">
                  目標まであと
                </Text>
                <Text className="text-ms text-emerald-600 font-semibold text-center">
                  {achievement.category === "duration"
                    ? remainingSeconds !== undefined && remainingSeconds < 60
                      ? formatTimeRemainingWithSeconds(remainingSeconds)
                      : formatTimeRemaining(remaining)
                    : `${remaining.toLocaleString()}${achievement.unit}`}
                </Text>
              </View>
              <View className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${progress * 100}%` }}
                />
              </View>
            </View>
          )}

          {/* {isAchieved && (
            <Text className="text-sm text-emerald-600 text-center mt-1">
              タップして詳細を見る
            </Text>
          )} */}
        </BlurView>
      </TouchableOpacity>
    </View>
  );
}

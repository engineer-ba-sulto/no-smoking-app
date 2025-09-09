import { AchievementBadge } from "@/components/AchievementBadge";
import { AppHeader } from "@/components/AppHeader";
import { HealthTimeline } from "@/components/HealthTimeline";
import { ProgressChart } from "@/components/ProgressChart";
import {
  CHART_PERIODS,
  CHART_TYPES,
  TabType,
} from "@/constants/achievements-ui";
import { DEFAULT_BACKGROUND } from "@/constants/backgrounds";
import { useQuitTimer } from "@/hooks/useQuitTimer";
import { useSmokerData } from "@/hooks/useSmokerData";
import { checkAllAchievements } from "@/utils/achievement-logic";
import { calculateAchievementProgress } from "@/utils/achievement-progress";
import { BlurView } from "expo-blur";
import { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AchievementsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("badges");
  const [chartPeriod, setChartPeriod] = useState<"week" | "month" | "year">(
    "month"
  );
  const [chartType, setChartType] = useState<"money" | "cigarettes">("money");

  const { smokerData } = useSmokerData();
  const { quitStats } = useQuitTimer(
    smokerData?.quitDate,
    smokerData?.cigarettesPerDay,
    smokerData?.pricePerPack,
    smokerData?.cigarettesPerPack
  );

  // quitStatsをOutcomeData型に変換してcheckAllAchievements関数を呼び出し
  const outcomeData = {
    durationInSeconds: quitStats.totalSeconds,
    resistedCigarettes: quitStats.cigarettesNotSmoked,
    savedMoney: quitStats.moneySaved,
  };

  const achievementStatuses = checkAllAchievements(outcomeData);

  // AchievementStatusをAchievementBadgeが期待する型に変換
  const achievements = achievementStatuses.map((status) => {
    // 新しいプログレス計算ロジックを使用
    const { currentValue, targetValue } = calculateAchievementProgress(
      status.category,
      status.goal,
      outcomeData
    );

    return {
      id: status.id,
      title: status.title,
      description: status.description,
      category: status.category,
      goal: status.goal,
      tier: status.tier,
      unit: status.unit,
      isUnlocked: status.isUnlocked,
      targetValue,
      currentValue,
    };
  });

  const getChartSummary = () => {
    const period =
      chartPeriod === "week"
        ? "今週"
        : chartPeriod === "month"
        ? "今月"
        : "今年";
    const moneyValue = Math.floor(
      quitStats.moneySaved *
        (chartPeriod === "week" ? 0.25 : chartPeriod === "month" ? 1 : 12)
    );
    const cigaretteValue = Math.floor(
      quitStats.cigarettesNotSmoked *
        (chartPeriod === "week" ? 0.25 : chartPeriod === "month" ? 1 : 12)
    );

    return {
      money: `${period}の合計節約額: ¥${moneyValue.toLocaleString()}`,
      cigarettes: `${period}の合計我慢本数: ${cigaretteValue}本`,
    };
  };

  return (
    <ImageBackground
      source={DEFAULT_BACKGROUND.source}
      className="flex-1"
      resizeMode="cover"
    >
      {/* 半透明のオーバーレイ */}
      <View className="absolute inset-0 bg-white/80" />
      {/* Header */}
      <AppHeader title="あなたの成果" />
      {/* Tab navigation */}
      {/* TODO グラフと健康は今後表示する = コメントを外す */}
      {/* <View
        className="mx-5 mt-4 relative z-10 rounded-xl overflow-hidden"
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
          className="p-1"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
        >
          <View className="flex-row">
            {TABS.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TouchableOpacity
                  key={tab.key}
                  className={`flex-1 flex-row items-center justify-center py-3 px-2 rounded-lg ${
                    activeTab === tab.key ? "bg-emerald-100/50" : ""
                  }`}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <IconComponent
                    size={18}
                    color={activeTab === tab.key ? "#10B981" : "#9CA3AF"}
                    strokeWidth={2}
                  />
                  <Text
                    className={`text-sm ml-1.5 font-medium ${
                      activeTab === tab.key
                        ? "text-emerald-800 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View> */}
      {/* Content */}
      <ScrollView
        className="flex-1 px-5 pt-5 relative z-10"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "badges" && (
          <View className="pb-5">
            <View
              className="rounded-xl overflow-hidden"
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
                className="p-5 mb-4 rounded-xl overflow-hidden"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
              >
                <Text className="text-lg font-semibold text-gray-800 text-center">
                  ■ 獲得したバッジ一覧
                </Text>
              </BlurView>
            </View>
            <View className="flex-row flex-wrap justify-between">
              {achievements.map((achievement) => {
                // 時間系バッジの場合、秒単位の残り時間を計算
                const remainingSeconds =
                  achievement.category === "duration"
                    ? Math.max(
                        0,
                        achievement.targetValue * 60 - quitStats.totalSeconds
                      )
                    : undefined;

                return (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    remainingSeconds={remainingSeconds}
                  />
                );
              })}
            </View>
          </View>
        )}

        {activeTab === "graphs" && (
          <View className="pb-5">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              ■ あなたの成長グラフ
            </Text>

            {/* Chart controls */}
            <View className="mb-5">
              <View className="bg-white rounded-lg p-1 mb-3 shadow-sm">
                <View className="flex-row">
                  {CHART_PERIODS.map((period) => (
                    <TouchableOpacity
                      key={period.key}
                      className={`flex-1 py-2 items-center rounded-md ${
                        chartPeriod === period.key ? "bg-primary-50" : ""
                      }`}
                      onPress={() => setChartPeriod(period.key)}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          chartPeriod === period.key
                            ? "text-primary-500 font-semibold"
                            : "text-gray-400"
                        }`}
                      >
                        {period.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-row justify-end">
                {CHART_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    className={`px-3 py-1.5 rounded-md ml-2 ${
                      chartType === type.key ? "bg-primary-500" : "bg-gray-200"
                    }`}
                    onPress={() => setChartType(type.key)}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        chartType === type.key
                          ? "text-white font-semibold"
                          : "text-gray-600"
                      }`}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Chart display */}
            <View className="bg-white rounded-xl p-5 mb-4 shadow-sm">
              <Text className="text-base font-semibold text-gray-800 mb-4 text-center">
                {CHART_PERIODS.find((p) => p.key === chartPeriod)?.label}間・
                {CHART_TYPES.find((t) => t.key === chartType)?.label}の推移
              </Text>
              <ProgressChart
                period={chartPeriod}
                type={chartType}
                quitStats={quitStats}
              />
            </View>

            {/* Summary */}
            <View className="bg-white rounded-xl p-5 shadow-sm">
              <Text className="text-base font-semibold text-gray-800 mb-3">
                ▼ サマリー
              </Text>
              <Text className="text-sm text-gray-600 mb-2 font-medium">
                {getChartSummary().money}
              </Text>
              <Text className="text-sm text-gray-600 font-medium">
                {getChartSummary().cigarettes}
              </Text>
            </View>
          </View>
        )}

        {activeTab === "health" && (
          <View className="pb-5">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              ■ あなたの体の変化（タイムライン）
            </Text>
            <HealthTimeline quitStats={quitStats} />
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

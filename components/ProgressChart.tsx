import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Text, View } from "react-native";

const { width } = Dimensions.get("window");

interface QuitStats {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  moneySaved: number;
  cigarettesNotSmoked: number;
  lifeExtended: string;
  nextMilestone: string;
}

interface Props {
  period: "week" | "month" | "year";
  type: "money" | "cigarettes";
  quitStats: QuitStats;
}

export function ProgressChart({ period, type, quitStats }: Props) {
  // Generate mock data for demonstration
  const generateChartData = () => {
    const dataPoints = period === "week" ? 7 : period === "month" ? 30 : 12;
    const maxValue =
      type === "money" ? quitStats.moneySaved : quitStats.cigarettesNotSmoked;

    return Array.from({ length: dataPoints }, (_, index) => {
      const progress = (index + 1) / dataPoints;
      return Math.floor(maxValue * progress * (0.7 + Math.random() * 0.3));
    });
  };

  const data = generateChartData();
  const maxValue = Math.max(...data);
  const chartWidth = width - 80; // Account for padding
  const chartHeight = 120;
  const barWidth = chartWidth / data.length - 4;

  const getLabel = (index: number) => {
    if (period === "week") {
      const days = ["月", "火", "水", "木", "金", "土", "日"];
      return days[index];
    } else if (period === "month") {
      return `${index + 1}`;
    } else {
      return `${index + 1}月`;
    }
  };

  const formatValue = (value: number) => {
    if (type === "money") {
      return `¥${value.toLocaleString()}`;
    } else {
      return `${value}本`;
    }
  };

  return (
    <View className="items-center">
      {/* Chart area */}
      <View className="w-full items-center mb-5">
        <View className="flex-row items-end h-35 px-2" style={{ height: 140 }}>
          {data.map((value, index) => {
            const height = maxValue > 0 ? (value / maxValue) * chartHeight : 0;
            return (
              <View key={index} className="items-center mx-0.5">
                <View
                  className="bg-gray-200 rounded-t-sm justify-end overflow-hidden"
                  style={{ width: barWidth, height: chartHeight }}
                >
                  <LinearGradient
                    colors={["#10B981", "#059669"]}
                    style={{
                      width: barWidth,
                      height: height,
                      borderRadius: 4,
                    }}
                  />
                </View>
                <Text className="text-xs text-gray-400 mt-1 font-medium">
                  {getLabel(index)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Current value display */}
      <View className="items-center py-3 px-5 bg-primary-50 rounded-lg border border-primary-500">
        <Text className="text-xs text-primary-600 font-medium mb-1">
          現在の合計
        </Text>
        <Text className="text-lg font-bold text-primary-500">
          {formatValue(
            type === "money"
              ? quitStats.moneySaved
              : quitStats.cigarettesNotSmoked
          )}
        </Text>
      </View>
    </View>
  );
}

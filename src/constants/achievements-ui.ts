import { Award, Heart, TrendingUp } from "lucide-react-native";

export type TabType = "badges" | "graphs" | "health";

export const TABS = [
  { key: "badges" as TabType, label: "バッジ", icon: Award },
  { key: "graphs" as TabType, label: "グラフ", icon: TrendingUp },
  { key: "health" as TabType, label: "健康", icon: Heart },
];

export const CHART_PERIODS = [
  { key: "week" as const, label: "週" },
  { key: "month" as const, label: "月" },
  { key: "year" as const, label: "年" },
];

export const CHART_TYPES = [
  { key: "money" as const, label: "節約金額" },
  { key: "cigarettes" as const, label: "我慢した本数" },
];

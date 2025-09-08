import { Achievement } from "../types/achievement";

export const ACHIEVEMENTS: Achievement[] = [
  // 最も達成しやすい順序に並べ替え
  // 1時間達成 (最も早く達成可能)
  {
    id: "duration_1h",
    title: "1時間達成",
    description: "禁煙への第一歩。",
    category: "duration",
    goal: 3600,
    tier: "bronze",
    unit: "分",
  },
  // 3時間達成 (最初の壁を越える)
  {
    id: "duration_3h",
    title: "3時間達成",
    description: "最初の壁を越えました。",
    category: "duration",
    goal: 10800,
    tier: "bronze",
    unit: "分",
  },
  // 6時間達成 (半日を乗り越える)
  {
    id: "duration_6h",
    title: "6時間達成",
    description: "半日を乗り越えました。",
    category: "duration",
    goal: 21600,
    tier: "bronze",
    unit: "分",
  },
  // 12時間達成 (半日達成)
  {
    id: "duration_12h",
    title: "12時間達成",
    description: "半日達成！順調です。",
    category: "duration",
    goal: 43200,
    tier: "bronze",
    unit: "分",
  },
  // 10本我慢 (1時間程度で達成可能)
  {
    id: "cigarettes_10",
    title: "10本我慢",
    description: "タバコを10本我慢しました。",
    category: "cigarettes",
    goal: 10,
    tier: "bronze",
    unit: "本",
  },
  // 500円節約 (1時間程度で達成可能)
  {
    id: "money_500",
    title: "500円節約",
    description: "ワンコインの価値。",
    category: "money",
    goal: 500,
    tier: "bronze",
    unit: "円",
  },
  // 20本我慢 (1日程度で達成可能)
  {
    id: "cigarettes_20",
    title: "20本我慢",
    description: "タバコを1箱分我慢しました。",
    category: "cigarettes",
    goal: 20,
    tier: "bronze",
    unit: "本",
  },
  // 24時間達成 (1日で達成)
  {
    id: "duration_24h",
    title: "24時間達成",
    description: "最初の大きな壁を突破！",
    category: "duration",
    goal: 86400,
    tier: "bronze",
    unit: "分",
  },
  // 1000円節約 (1-2日程度で達成可能)
  {
    id: "money_1000",
    title: "1000円節約",
    description: "節約金額が1000円を突破！",
    category: "money",
    goal: 1000,
    tier: "silver",
    unit: "円",
  },
  // 50本我慢 (2-3日程度で達成可能)
  {
    id: "cigarettes_50",
    title: "50本我慢",
    description: "着実に成果が出ています。",
    category: "cigarettes",
    goal: 50,
    tier: "bronze",
    unit: "本",
  },
  // 禁煙1週間 (7日で達成)
  {
    id: "duration_7d",
    title: "禁煙1週間",
    description: "7日間の継続、素晴らしいです。",
    category: "duration",
    goal: 604800,
    tier: "silver",
    unit: "分",
  },
  // 100本我慢 (5-7日程度で達成可能)
  {
    id: "cigarettes_100",
    title: "100本我慢",
    description: "健康への大きな投資です。",
    category: "cigarettes",
    goal: 100,
    tier: "silver",
    unit: "本",
  },
  // 5000円節約 (1-2週間程度で達成可能)
  {
    id: "money_5000",
    title: "5000円節約",
    description: "節約金額が5000円に到達しました。",
    category: "money",
    goal: 5000,
    tier: "silver",
    unit: "円",
  },
  // 禁煙1ヶ月 (30日で達成)
  {
    id: "duration_30d",
    title: "禁煙1ヶ月",
    description: "大きな節目を迎えました。",
    category: "duration",
    goal: 2592000,
    tier: "gold",
    unit: "分",
  },
  // 1万円節約 (1-2ヶ月程度で達成可能)
  {
    id: "money_10000",
    title: "1万円節約",
    description: "経済的メリットを実感！",
    category: "money",
    goal: 10000,
    tier: "gold",
    unit: "円",
  },
  // 禁煙2ヶ月 (60日で達成)
  {
    id: "duration_2m",
    title: "禁煙2ヶ月",
    description: "2ヶ月継続、素晴らしい成果です。",
    category: "duration",
    goal: 5184000,
    tier: "gold",
    unit: "分",
  },
  // 禁煙100日 (100日で達成 - 最も困難)
  {
    id: "duration_100d",
    title: "禁煙100日",
    description: "もう習慣は過去のもの。",
    category: "duration",
    goal: 8640000,
    tier: "platinum",
    unit: "分",
  },
];

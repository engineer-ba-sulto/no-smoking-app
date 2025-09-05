# T2-3-1: アチーブメントの定義とデータ構造の設計

## 概要

アプリケーションに実装されるすべてのアチーブメント（実績）のデータ構造を設計・実装します。
この定義は、既存の `achievements.tsx` で使用されていた定義と統合し、両方のアチーブメントを網羅するように拡張されています。

## 目的

- アチーブメントの情報を一元管理し、保守性・拡張性を高める。
- 判定ロジックが参照する、信頼性の高いマスターデータを作成する。

## 依存関係

- **依存タスク**: T2-1 (日付計算ユーティリティ)
- **担当領域**: ビジネスロジック

## 実装詳細

`achievements.tsx` で定義されていたアチーブメントと、元々のビジネスロジック用のアチーブメントを統合し、データ構造を拡張します。
UI 表示で必要となる `tier` (ランク) と `unit` (単位) を追加し、すべてのアチーブメントをこの新しい構造で再定義します。

### 1. アチーブメントの型定義

`src/types/achievement.ts` に定義する `Achievement` 型を以下のように拡張します。

```typescript
export type AchievementCategory = "duration" | "cigarettes" | "money";
export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  goal: number; // 達成目標値（秒、本、円など）
  tier: AchievementTier; // UI表示用のランク
  unit: string; // UI表示用の単位
}
```

### 2. アチーブメント定義の実装

`src/constants/achievements.ts` に実装する `ACHIEVEMENTS` 配列を以下のように更新します。

```typescript
import { Achievement } from "../types/achievement";

export const ACHIEVEMENTS: Achievement[] = [
  // 時間系 (goalは秒単位)
  {
    id: "duration_1h",
    title: "1時間達成",
    description: "禁煙への第一歩。",
    category: "duration",
    goal: 3600,
    tier: "bronze",
    unit: "時間",
  },
  {
    id: "duration_24h",
    title: "24時間達成",
    description: "最初の大きな壁を突破！",
    category: "duration",
    goal: 86400,
    tier: "bronze",
    unit: "日",
  },
  {
    id: "duration_7d",
    title: "禁煙1週間",
    description: "7日間の継続、素晴らしいです。",
    category: "duration",
    goal: 604800,
    tier: "silver",
    unit: "日",
  },
  {
    id: "duration_30d",
    title: "禁煙1ヶ月",
    description: "大きな節目を迎えました。",
    category: "duration",
    goal: 2592000,
    tier: "gold",
    unit: "日",
  },
  {
    id: "duration_2m",
    title: "禁煙2ヶ月",
    description: "2ヶ月継続、素晴らしい成果です。",
    category: "duration",
    goal: 5184000,
    tier: "gold",
    unit: "日",
  },
  {
    id: "duration_100d",
    title: "禁煙100日",
    description: "もう習慣は過去のもの。",
    category: "duration",
    goal: 8640000,
    tier: "platinum",
    unit: "日",
  },
  // 本数系 (goalは本数)
  {
    id: "cigarettes_10",
    title: "10本我慢",
    description: "タバコを10本我慢しました。",
    category: "cigarettes",
    goal: 10,
    tier: "bronze",
    unit: "本",
  },
  {
    id: "cigarettes_20",
    title: "20本我慢",
    description: "タバコを1箱分我慢しました。",
    category: "cigarettes",
    goal: 20,
    tier: "bronze",
    unit: "本",
  },
  {
    id: "cigarettes_50",
    title: "50本我慢",
    description: "着実に成果が出ています。",
    category: "cigarettes",
    goal: 50,
    tier: "bronze",
    unit: "本",
  },
  {
    id: "cigarettes_100",
    title: "100本我慢",
    description: "健康への大きな投資です。",
    category: "cigarettes",
    goal: 100,
    tier: "silver",
    unit: "本",
  },
  // 金額系 (goalは円)
  {
    id: "money_500",
    title: "500円節約",
    description: "ワンコインの価値。",
    category: "money",
    goal: 500,
    tier: "bronze",
    unit: "円",
  },
  {
    id: "money_1000",
    title: "1000円節約",
    description: "節約金額が1000円を突破！",
    category: "money",
    goal: 1000,
    tier: "silver",
    unit: "円",
  },
  {
    id: "money_5000",
    title: "5000円節約",
    description: "節約金額が5000円に到達しました。",
    category: "money",
    goal: 5000,
    tier: "silver",
    unit: "円",
  },
  {
    id: "money_10000",
    title: "1万円節約",
    description: "経済的メリットを実感！",
    category: "money",
    goal: 10000,
    tier: "gold",
    unit: "円",
  },
];
```

## 実装手順

1. **`src/types/achievement.ts` を作成し、`Achievement` 型を定義**します。
2. **`src/constants/achievements.ts` を作成し、`ACHIEVEMENTS` 配列を実装**します。
3. **機能要件で定義されているすべてのアチーブメントを網羅**しているか確認します。

## 完了条件

- [ ] アチーブメントの型定義が作成されている。
- [ ] すべてのアチーブメントのマスターデータが定数として実装されている。
- [ ] データ構造が拡張可能（新しいアチーブメントの追加が容易）になっている。

## 次のタスク

- **T2-2-0**: 成果計算ロジックの実装
- **依存関係**: アチーブメントの定義が固まったことで、次はその達成度を測るための具体的な成果（我慢した本数や節約金額）を計算するロジックを実装します。

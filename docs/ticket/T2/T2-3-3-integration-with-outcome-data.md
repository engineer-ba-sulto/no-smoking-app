# T2-3-3: 成果データとの統合と判定結果の出力

## 概要

これまでに実装したモジュールを統合し、現在の成果データからすべてのアチーブメントの達成状況リストを生成する高レベルな関数を実装します。

## 目的

- UI レイヤーが直接利用できる形式で、アチーブメントの全達成状況データを提供する。
- これまで実装した各ロジック（成果計算、アチーブメント定義、個別判定）を結合する。

## 依存関係

- **依存タスク**: T2-3-2
- **担当領域**: ビジネスロジック

## 実装詳細

### 1. 達成状況の型定義

UI レイヤーに渡すデータの型を `src/types/achievement.ts` に定義します。

```typescript
import { Achievement } from "./achievement";

export interface AchievementStatus extends Achievement {
  isUnlocked: boolean;
}
```

### 2. 統合判定関数の実装

`src/utils/achievement-logic.ts` に、現在の成果データを引数に取り、すべてのアチーブメントの達成状況リストを返す `checkAllAchievements` 関数を実装します。

```typescript
import { ACHIEVEMENTS } from "../constants/achievements";
import { AchievementStatus } from "../types/achievement";
import { OutcomeData } from "../types/outcome";
import { isAchievementUnlocked } from "./achievement-logic";

/**
 * すべてのアチーブメントの達成状況を判定します。
 * @param outcomes - 現在の成果データ
 * @returns 全アチーブメントの達成状況リスト
 */
export const checkAllAchievements = (
  outcomes: OutcomeData
): AchievementStatus[] => {
  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    isUnlocked: isAchievementUnlocked(achievement, outcomes),
  }));
};
```

## 実装手順

1. **`AchievementStatus` 型を定義**します。
2. **`checkAllAchievements` 関数を `src/utils/achievement-logic.ts` に実装**します。

## 完了条件

- [ ] `checkAllAchievements` 関数が実装されている。
- [ ] 関数が、すべてのアチーブメント情報とそれぞれの達成状況（`isUnlocked`）を含む配列を返す。

## 次のタスク

- **T3-2**: [F03] 「アチーブメント」機能の画面組み込み
- **依存関係**: ビジネスロジックが全て完成し、UI が必要とするデータ形式で提供できるようになったため、フロントエンドとの連携に進むことができます。

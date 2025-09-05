# T2-3-2: アチーブメント達成条件の判定ロジック実装

## 概要

現在の成果データ（継続時間、我慢した本数、節約金額）と、単一のアチーブメント定義を比較し、そのアチーブメントが達成されているかどうかを判定する純粋関数を実装します。

## 目的

- アチーブメント判定のコアとなるロジックを実装する。
- 再利用可能でテストが容易な判定関数を作成する。

## 依存関係

- **依存タスク**: T2-3-0, T2-3-1, T2-2
- **担当領域**: ビジネスロジック

## 実装詳細

### 1. 成果データの型定義

判定ロジックが受け取る成果データの型を `src/types/outcome.ts` などに定義します。

```typescript
export interface OutcomeData {
  durationInSeconds: number;
  resistedCigarettes: number;
  savedMoney: number;
}
```

### 2. 達成判定関数の実装

`src/utils/achievement-logic.ts` に、成果データとアチーブメント定義を引数に取り、達成状況を真偽値で返す `isAchievementUnlocked` 関数を実装します。

```typescript
import { Achievement } from "../types/achievement";
import { OutcomeData } from "../types/outcome";

/**
 * 単一のアチーブメントが達成されているか判定します。
 * @param achievement - 判定対象のアチーブメント定義
 * @param outcomes - 現在の成果データ
 * @returns 達成していれば true, 未達成なら false
 */
export const isAchievementUnlocked = (
  achievement: Achievement,
  outcomes: OutcomeData
): boolean => {
  switch (achievement.category) {
    case "duration":
      return outcomes.durationInSeconds >= achievement.goal;
    case "cigarettes":
      return outcomes.resistedCigarettes >= achievement.goal;
    case "money":
      return outcomes.savedMoney >= achievement.goal;
    default:
      return false;
  }
};
```

## 実装手順

1. **`src/utils/achievement-logic.ts` ファイルを作成**します。
2. **成果データの型 `OutcomeData` を定義**します。
3. **`isAchievementUnlocked` 関数を実装**します。

## 完了条件

- [ ] `isAchievementUnlocked` 関数が実装されている。
- [ ] すべてのアチーブメントカテゴリに対して正しく判定が行える。

## 次のタスク

- **T2-3-3**: 成果データとの統合と判定結果の出力
- **依存関係**: 個々のアチーブメントを判定するロジックが完成したため、これをすべてのアチーブメントに適用する処理に進めます。

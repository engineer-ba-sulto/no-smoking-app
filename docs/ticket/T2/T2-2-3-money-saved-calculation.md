# T2-2-3: 節約金額の計算ロジック実装

## 概要

ユーザープロファイルと我慢したタバコの本数に基づき、節約できた金額を計算する純粋関数を実装します。

## 目的

- ユーザーの禁煙成果のもう一つの主要な指標である「節約金額」を算出する。
- ユーザーに禁煙継続のモチベーションを与えるためのデータを提供する。

## 依存関係

- **依存タスク**: T2-2-2
- **担当領域**: ビジネスロジック

## 実装詳細

### 1. 節約金額計算関数の実装

`src/utils/outcome-calculation.ts` に、`UserProfile` と我慢した本数を引数に取り、節約金額を返す `calculateSavedMoney` 関数を実装します。

```typescript
import { UserProfile } from "../types/user";

/**
 * 節約できた金額を計算します。
 * @param profile - ユーザープロファイル
 * @param resistedCigarettes - 我慢したタバコの本数
 * @returns 節約金額
 */
export const calculateSavedMoney = (
  profile: UserProfile,
  resistedCigarettes: number
): number => {
  const { pricePerPack, cigarettesPerPack } = profile.smokingHabit;
  if (cigarettesPerPack === 0) {
    return 0; // 0除算を避ける
  }
  const pricePerCigarette = pricePerPack / cigarettesPerPack;
  const savedMoney = pricePerCigarette * resistedCigarettes;
  return Math.floor(savedMoney); // 小数点以下は切り捨てる
};
```

## 実装手順

1. **`src/utils/outcome-calculation.ts` に `calculateSavedMoney` 関数を実装**します。

## 完了条件

- [ ] `calculateSavedMoney` 関数が実装されている。
- [ ] 0 除算などのエッジケースが考慮されている。

## 次のタスク

- **T2-3-0**: [F03] アチーブメント判定ロジックの実装
- **依存関係**: 成果計算ロジックが完成したため、これらのデータを用いてアチーブメントの達成判定を行うことができます。

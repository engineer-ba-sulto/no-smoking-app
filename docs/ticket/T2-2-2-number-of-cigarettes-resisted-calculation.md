# T2-2-2: 我慢した本数の計算ロジック実装

## 概要

ユーザープロファイルと禁煙継続時間に基づき、我慢できたタバコの本数を計算する純粋関数を実装します。

## 目的

- ユーザーの禁煙成果の主要な指標の一つである「我慢した本数」を算出する。
- UI や他のロジックで再利用可能な、信頼性の高い計算モジュールを提供する。

## 依存関係

- **依存タスク**: T2-2-1, T2-1
- **担当領域**: ビジネスロジック

## 実装詳細

### 1. 我慢した本数計算関数の実装

`src/utils/outcome-calculation.ts` に、`UserProfile` と禁煙継続時間（秒単位の合計など）を引数に取り、我慢した本数を返す `calculateResistedCigarettes` 関数を実装します。

```typescript
import { UserProfile } from "../types/user";

/**
 * 我慢したタバコの本数を計算します。
 * @param profile - ユーザープロファイル
 * @param totalSeconds - 禁煙継続時間の合計秒数
 * @returns 我慢した本数
 */
export const calculateResistedCigarettes = (
  profile: UserProfile,
  totalSeconds: number
): number => {
  const cigarettesPerSecond =
    profile.smokingHabit.cigarettesPerDay / (24 * 60 * 60);
  const resistedCigarettes = cigarettesPerSecond * totalSeconds;
  return resistedCigarettes;
};
```

※`totalSeconds` は T2-1 で実装した `Duration` から計算する必要があります。

## 実装手順

1. **`src/utils/outcome-calculation.ts` ファイルを作成**します。
2. **`calculateResistedCigarettes` 関数を実装**します。

## 完了条件

- [ ] `calculateResistedCigarettes` 関数が実装されている。
- [ ] 0 本/日のようなエッジケースでも正しく動作する。

## 次のタスク

- **T2-2-3**: 節約金額の計算ロジック実装
- **依存関係**: 我慢した本数が計算できるようになったため、これを利用して節約金額を算出できます。

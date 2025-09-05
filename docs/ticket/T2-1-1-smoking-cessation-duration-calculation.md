# T2-1-1: 禁煙継続時間の計算ロジック実装

## 概要

禁煙開始日時から現在時刻までの経過時間を計算するコアロジックを実装します。

## 目的

- ユーザーの禁煙継続時間を正確に把握する。
- アプリの主要な指標である「禁煙時間」を算出する機能を提供する。

## 依存関係

- **依存タスク**: T2-1-0
- **担当領域**: ビジネスロジック

## 実装詳細

### 1. 継続時間計算関数の実装

`date-fns` の `intervalToDuration` を使用して、2 つの日付間の期間を計算する関数 `calculateSmokingCessationDuration` を `src/utils/date-calculation.ts` に実装します。

```typescript
import { intervalToDuration, Duration } from "date-fns";

/**
 * 禁煙開始日時から現在までの経過時間を計算します。
 * @param startDate - 禁煙開始日時
 * @returns 経過時間を示す Duration オブジェクト
 */
export const calculateSmokingCessationDuration = (
  startDate: Date
): Duration => {
  const endDate = new Date(); // 現在時刻
  return intervalToDuration({ start: startDate, end: endDate });
};
```

## 実装手順

1. **`src/utils/date-calculation.ts` ファイルを作成**します。
2. **`calculateSmokingCessationDuration` 関数を実装**します。

## 完了条件

- [ ] `calculateSmokingCessationDuration` 関数が実装されている。
- [ ] 境界値（日付の変わり目など）でも正しく計算できることが確認されている。

## 次のタスク

- **T2-3-1**: アチーブメントの定義とデータ構造の設計
- **依存関係**: 日付計算の基盤が整ったため、次にアプリケーションの目標となるアチーブメントの定義に進みます。

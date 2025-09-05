# T2-1-2: 日付関連の補助ユーティリティ関数実装

## 概要

禁煙継続時間やその他の日付データを UI に適した形式で表示するための、補助的なユーティリティ関数を実装します。

## 目的

- 計算されたデータを人間が読みやすい形式に変換する。
- UI レイヤーでのデータフォーマット処理を共通化する。

## 依存関係

- **依存タスク**: T2-1-1
- **担当領域**: ビジネスロジック

## 実装詳細

### 1. Duration オブジェクトのフォーマット関数

T2-1-2 で計算した `Duration` オブジェクトを、画面表示用の文字列に変換する関数 `formatDuration` を実装します。

```typescript
import { Duration } from "date-fns";

/**
 * Duration オブジェクトを「X年Yヶ月Z日...」の形式の文字列に変換します。
 * @param duration - Duration オブジェクト
 * @returns フォーマットされた文字列
 */
export const formatDuration = (duration: Duration): string => {
  const parts = [
    duration.years && `${duration.years}年`,
    duration.months && `${duration.months}ヶ月`,
    duration.days && `${duration.days}日`,
    duration.hours && `${duration.hours}時間`,
    duration.minutes && `${duration.minutes}分`,
    duration.seconds && `${duration.seconds}秒`,
  ].filter(Boolean); // null や undefined を除去

  return parts.join("");
};
```

### 2. その他の補助関数

必要に応じて、特定の日付フォーマット（例: `yyyy/MM/dd`）に変換する関数なども実装します。

## 実装手順

1. **`src/utils/date-calculation.ts` に `formatDuration` 関数を実装**します。
2. **その他に必要な日付関連ユーティリティがあれば追加実装**を行います。

## 完了条件

- [ ] `formatDuration` 関数が実装されている。
- [ ] `Duration` オブジェクトを人間が読みやすい文字列に正しく変換できる。
- [ ] `date-calculation.ts` モジュールが完成し、他の機能から利用できる状態になる。

## 次のタスク

- **T2-3-1**: アチーブメントの定義とデータ構造の設計
- **依存関係**: 日付計算の基盤が整ったため、次にアプリケーションの目標となるアチーブメントの定義に進みます。

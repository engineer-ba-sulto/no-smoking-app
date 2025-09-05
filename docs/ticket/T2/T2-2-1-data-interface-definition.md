# T2-2-1: 成果計算のためのデータインターフェース定義

## 概要

成果計算ロジックで必要となる `user_profile` テーブルのデータ構造を TypeScript の型（interface または type）として定義します。

## 目的

- 計算ロジックの入力データの型を明確にし、静的型付けによる安全性を確保する。
- データベースのスキーマとビジネスロジックの間の契約を定義する。

## 依存関係

- **依存タスク**: T2-2-0, T1-2
- **担当領域**: ビジネスロジック

## 実装詳細

### 1. `UserProfile` 型の定義

`src/types/user.ts` のような型定義ファイルに、成果計算に必要な `user_profile` のカラムに対応する型を定義します。

```typescript
export interface UserProfile {
  smokingHabit: {
    cigarettesPerDay: number; // 1日の喫煙本数
    pricePerPack: number; // 1箱あたりの価格
    cigarettesPerPack: number; // 1箱あたりの本数
  };
  quitDate: Date; // 禁煙開始日時
  // その他、計算に必要なプロパティ
}
```

※この型定義は `drizzle/schema.ts` のスキーマ定義と整合性が取れている必要があります。実際のカラム名や型に合わせて調整します。

## 実装手順

1. **`drizzle/schema.ts` の `userProfile` テーブル定義を確認**します。
2. **成果計算に必要なフィールド（`cigarettesPerDay`, `pricePerPack`, `cigarettesPerPack`, `quitDate` など）を特定**します。
3. **型定義ファイル（例: `src/types/user.ts`）を作成し、`UserProfile` 型を定義**します。

## 完了条件

- [ ] 成果計算ロジックの入力として使用する `UserProfile` 型が定義されている。
- [ ] 型定義が `drizzle/schema.ts` のスキーマと一致している。

## 次のタスク

- **T2-2-2**: 我慢した本数の計算ロジック実装
- **依存関係**: データ構造が定義されたことで、これを引数に取る具体的な計算ロジックの実装に進むことができます。

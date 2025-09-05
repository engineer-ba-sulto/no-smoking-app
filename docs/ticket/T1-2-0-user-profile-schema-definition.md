# T1-2-0: user_profile テーブルのスキーマ定義

## 概要

機能要件定義書で定められた必須の 3 大機能（F01, F02, F03）を実装するために必要な`user_profile`テーブルのスキーマを完全に定義する。現在のスキーマを機能要件に合わせて拡張し、禁煙アプリの全機能をサポートできるデータ構造を構築する。

## 目的

- 機能要件 F01（見える化）で必要な全データ項目をスキーマに定義する
- 機能要件 F03（アチーブメント）で必要な計算に使用するデータ項目を確保する
- 将来的な機能拡張に対応できる柔軟なスキーマ設計を行う
- データの整合性と型安全性を保証する

## 依存関係

- **依存タスク**: T1-1（Drizzle ORM と Expo SQLite の導入・設定）
- **担当領域**: データベース設計

## サブチケット

- **T1-2-1**: 現在のスキーマ分析と要件整理
- **T1-2-2**: 機能要件に基づくスキーマ拡張
- **T1-2-3**: マイグレーションファイルの生成とテスト

## 実装詳細

### 現在のスキーマ状況

```typescript
export const userProfile = sqliteTable("user_profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  smokingStartDate: text("smoking_start_date").notNull(), // ISO文字列
  cigsPerDay: integer("cigs_per_day").notNull(),
  pricePerPack: real("price_per_pack").notNull(),
  cigsPerPack: integer("cigs_per_pack").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});
```

### 機能要件との対応関係

#### F01（見える化機能）で必要なデータ

- `smokingStartDate`: 禁煙継続時間カウンターの計算に使用
- `cigsPerDay`: 我慢した本数カウンターの計算に使用
- `pricePerPack`: 節約金額カウンターの計算に使用
- `cigsPerPack`: 節約金額カウンターの計算に使用

#### F03（アチーブメント機能）で必要なデータ

- `smokingStartDate`: 時間ベースのアチーブメント判定に使用
- `cigsPerDay`: 本数ベースのアチーブメント判定に使用
- `pricePerPack`, `cigsPerPack`: 金額ベースのアチーブメント判定に使用

### 追加検討項目

- ユーザー名やニックネームの管理
- アプリの設定情報（通知設定など）
- 最終更新日時の自動更新機能

## 実装手順

1. **現在のスキーマ分析**

   - 既存のスキーマ定義を詳細に分析
   - 機能要件との対応関係を整理
   - 不足している項目を特定

2. **スキーマ拡張設計**

   - 機能要件を満たすための追加項目を設計
   - データ型と制約を決定
   - インデックス設計を検討

3. **マイグレーション生成**
   - 新しいスキーマに基づいてマイグレーションファイルを生成
   - 既存データの移行方法を検討
   - テストデータでの動作確認

## 完了条件

- [ ] 機能要件 F01 で必要な全データ項目がスキーマに定義されている
- [ ] 機能要件 F03 で必要な全データ項目がスキーマに定義されている
- [ ] スキーマの型定義が TypeScript で正しく生成されている
- [ ] マイグレーションファイルが正常に生成されている
- [ ] 既存のテストデータでマイグレーションが正常に動作する
- [ ] スキーマのドキュメントが更新されている

## 次のタスク

- **T1-3**: データ操作用リポジトリ層の実装
- **依存関係**: このタスクの完了後に実行可能

## 参考資料

- [機能要件定義書](docs/functional-requirements.md)
- [Drizzle ORM 公式ドキュメント](https://orm.drizzle.team/)
- [SQLite データ型リファレンス](https://www.sqlite.org/datatype3.html)

## 備考

- 現在のスキーマは基本的な項目は揃っているが、機能要件を完全に満たすために細かな調整が必要
- マイグレーション時は既存データの整合性を保つことが重要
- 将来的な機能拡張を考慮した設計を行う

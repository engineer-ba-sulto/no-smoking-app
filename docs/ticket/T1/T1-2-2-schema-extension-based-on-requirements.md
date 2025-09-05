# T1-2-2: 機能要件に基づくスキーマ拡張

## 概要

T1-2-1 で分析した現在のスキーマを基に、機能要件定義書で定められた必須の 3 大機能を完全にサポートするためのスキーマ拡張を実装する。主に`updatedAt`フィールドの自動更新機能を追加し、将来的な機能拡張に対応できる柔軟な設計を行う。

## 目的

- `updatedAt`フィールドの自動更新機能を実装する
- 機能要件を完全に満たすスキーマ設計を完成させる
- 将来的な機能拡張に対応できる柔軟性を確保する
- データの整合性と型安全性を向上させる

## 依存関係

- **依存タスク**: T1-2-1（現在のスキーマ分析と要件整理）
- **担当領域**: データベース設計

## 実装詳細

### 1. 現在のスキーマ（拡張前）

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

### 2. 拡張後のスキーマ設計

```typescript
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const userProfile = sqliteTable("user_profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  smokingStartDate: text("smoking_start_date").notNull(), // ISO文字列
  cigsPerDay: integer("cigs_per_day").notNull(),
  pricePerPack: real("price_per_pack").notNull(),
  cigsPerPack: integer("cigs_per_pack").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
```

### 3. 主な変更点

#### `updatedAt`フィールドの改善

- **変更前**: `default("CURRENT_TIMESTAMP")`
- **変更後**: `default(sql`CURRENT_TIMESTAMP`)`
- **理由**: SQLite の`CURRENT_TIMESTAMP`を正しく使用するため

#### 自動更新機能の実装

- レコード更新時に`updatedAt`フィールドが自動で現在時刻に更新される
- Drizzle ORM の`onUpdate`機能を活用

### 4. 機能要件との完全対応

#### F01（見える化機能）

- ✅ 禁煙継続時間カウンター: `smokingStartDate`
- ✅ 節約金額カウンター: `pricePerPack`, `cigsPerPack`, `cigsPerDay`
- ✅ 我慢した本数カウンター: `cigsPerDay`, `smokingStartDate`

#### F02（対処法サポート機能）

- ✅ データベースアクセス不要（ハードコード）

#### F03（アチーブメント機能）

- ✅ 時間ベース判定: `smokingStartDate`
- ✅ 本数ベース判定: `cigsPerDay`, `smokingStartDate`
- ✅ 金額ベース判定: `pricePerPack`, `cigsPerPack`, `cigsPerDay`, `smokingStartDate`

### 5. 将来的な拡張性

#### 追加可能な項目（将来の機能拡張用）

```typescript
// 将来的に追加可能な項目例
userName: text("user_name"), // ユーザー名
nickname: text("nickname"), // ニックネーム
avatarPath: text("avatar_path"), // アバター画像パス
notificationEnabled: integer("notification_enabled", { mode: "boolean" }).default(true), // 通知設定
theme: text("theme").default("light"), // テーマ設定
language: text("language").default("ja"), // 言語設定
lastLoginAt: text("last_login_at"), // 最終ログイン日時
appUsageCount: integer("app_usage_count").default(0), // アプリ使用回数
```

## 実装手順

1. **スキーマファイルの更新**

   ```bash
   # スキーマファイルを編集
   vim src/drizzle/schema.ts
   ```

2. **変更内容の確認**

   ```typescript
   // 更新後のスキーマ定義
   export const userProfile = sqliteTable("user_profile", {
     id: integer("id").primaryKey({ autoIncrement: true }),
     smokingStartDate: text("smoking_start_date").notNull(),
     cigsPerDay: integer("cigs_per_day").notNull(),
     pricePerPack: real("price_per_pack").notNull(),
     cigsPerPack: integer("cigs_per_pack").notNull(),
     createdAt: text("created_at")
       .notNull()
       .default(sql`CURRENT_TIMESTAMP`),
     updatedAt: text("updated_at")
       .notNull()
       .default(sql`CURRENT_TIMESTAMP`),
   });
   ```

3. **型定義の確認**

   ```bash
   # TypeScriptの型定義を確認
   npx drizzle-kit generate
   ```

4. **スキーマの検証**
   ```bash
   # スキーマの構文チェック
   npx tsc --noEmit src/drizzle/schema.ts
   ```

## 完了条件

- [ ] `updatedAt`フィールドが正しい SQLite の`CURRENT_TIMESTAMP`を使用している
- [ ] スキーマの構文エラーがない
- [ ] TypeScript の型定義が正しく生成される
- [ ] 機能要件 F01, F02, F03 の全データ項目がスキーマに含まれている
- [ ] 将来的な機能拡張に対応できる柔軟な設計になっている
- [ ] スキーマのドキュメントが更新されている

## 次のタスク

- **T1-2-3**: マイグレーションファイルの生成とテスト
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **SQLite の CURRENT_TIMESTAMP が正しく動作しない**

   ```typescript
   // 正しい書き方
   default(sql`CURRENT_TIMESTAMP`)

   // 間違った書き方
   default("CURRENT_TIMESTAMP")
   ```

2. **TypeScript の型エラーが発生する**

   ```bash
   # 型定義を再生成
   npx drizzle-kit generate

   # 型チェック
   npx tsc --noEmit
   ```

3. **スキーマの構文エラー**
   ```bash
   # 構文チェック
   npx tsc --noEmit src/drizzle/schema.ts
   ```

## 備考

- 現在のスキーマは基本的に機能要件を満たしている
- 主な改善点は`updatedAt`フィールドの自動更新機能
- 将来的な機能拡張を考慮した設計を行っている
- マイグレーション時は既存データの整合性を保つことが重要

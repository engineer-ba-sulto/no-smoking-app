# T1-1-3: ディレクトリ構造とファイル作成

## 概要

Drizzle ORM の動作に必要なディレクトリ構造を作成し、データベース接続とスキーマ定義のファイルを作成する。

## 目的

- プロジェクトの適切なディレクトリ構造の構築
- データベース接続設定ファイルの作成
- テーブルスキーマ定義ファイルの作成
- Drizzle 設定ファイルの作成

## 依存関係

- **依存タスク**: T1-1-2（設定ファイルの更新）
- **担当領域**: プロジェクト構造

## 実装詳細

### 1. ディレクトリ構造の作成

#### 作成するディレクトリ

```
src/
└── drizzle/
    └── migrations/  # マイグレーションファイル用（自動生成される）
```

#### 作成コマンド

```bash
mkdir -p src/drizzle/migrations
```

### 2. 作成するファイル

#### 2-1. `drizzle.config.ts` - Drizzle 設定（ルートディレクトリ）

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle",
  dialect: "sqlite",
  driver: "expo", // 重要：Expo用の設定
} satisfies Config;
```

#### 2-2. `src/drizzle/index.ts` - データベース接続設定

```typescript
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

// SQLiteデータベースの初期化（change listener有効化）
const expo = openDatabaseSync("no-smoking-app.db", {
  enableChangeListener: true,
});

// Drizzle ORMの初期化
export const db = drizzle(expo, { schema });

// 型エクスポート
export type Database = typeof db;
```

#### 2-3. `src/drizzle/schema.ts` - テーブルスキーマ定義

```typescript
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

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

## 実装手順

1. **ディレクトリ構造の作成**

   ```bash
   mkdir -p src/drizzle/migrations
   ```

2. **drizzle.config.ts の作成**

   - ルートディレクトリにファイルを作成
   - 上記の設定内容を記述

3. **src/drizzle/index.ts の作成**

   - データベース接続設定を記述
   - 型エクスポートを含める

4. **src/drizzle/schema.ts の作成**

   - userProfile テーブルのスキーマ定義
   - 機能要件に必要な全カラムを定義

5. **ファイルの構文チェック**

   ```bash
   # TypeScript の構文チェック
   npx tsc --noEmit
   ```

6. **ディレクトリ構造の確認**
   ```bash
   tree src/drizzle
   # または
   ls -la src/drizzle/
   ```

## ファイルの説明

### drizzle.config.ts

- Drizzle Kit の設定ファイル
- スキーマファイルの場所とマイグレーション出力先を指定
- Expo 用のドライバー設定

### src/drizzle/index.ts

- データベース接続の初期化
- Drizzle ORM インスタンスの作成
- 型安全性のための型エクスポート

### src/drizzle/schema.ts

- データベーステーブルの定義
- 機能要件（F01, F02, F03）に必要な全カラム
- 型安全性を保証するスキーマ定義

## スキーマの詳細

### userProfile テーブル

- **id**: 主キー（自動増分）
- **smokingStartDate**: 禁煙開始日時（ISO 文字列）
- **cigsPerDay**: 1 日の喫煙本数
- **pricePerPack**: タバコ 1 箱の価格
- **cigsPerPack**: 1 箱の本数
- **createdAt**: 作成日時
- **updatedAt**: 更新日時

## 完了条件

- [ ] src/drizzle/ ディレクトリの作成完了
- [ ] src/drizzle/migrations/ ディレクトリの作成完了
- [ ] drizzle.config.ts の作成完了
- [ ] src/drizzle/index.ts の作成完了
- [ ] src/drizzle/schema.ts の作成完了
- [ ] TypeScript 構文チェック完了
- [ ] ディレクトリ構造の確認完了

## 次のタスク

- **T1-1-4**: マイグレーション生成とテスト
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **TypeScript エラー**: インポートパスの確認
2. **ディレクトリ作成エラー**: 権限の確認
3. **ファイル作成エラー**: パスの確認

### 解決方法

```bash
# 権限の確認
ls -la src/

# ディレクトリの再作成
rm -rf src/drizzle
mkdir -p src/drizzle/migrations
```

## 備考

- スキーマ定義は機能要件に基づいて設計
- 型安全性を重視した実装
- マイグレーション用のディレクトリも事前に準備

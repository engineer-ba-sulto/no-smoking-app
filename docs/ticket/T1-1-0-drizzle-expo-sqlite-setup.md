# T1-1: Drizzle ORM と Expo SQLite の導入・設定

## 概要

全機能の基礎となるデータベース環境を構築し、アプリケーションの骨格を完成させる。

## 目的

- Drizzle ORM と Expo SQLite をプロジェクトに導入
- データベース接続の設定
- マイグレーション機能の準備
- 基本的なデータベース操作の環境構築

## 依存関係

- **依存タスク**: なし
- **担当領域**: データベース

## 実装詳細

### 1. 必要な依存関係の追加

```json
{
  "dependencies": {
    // 既存の依存関係に追加
    "expo-sqlite": "next", // 公式推奨のnextバージョン
    "drizzle-orm": "^0.36.4",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    // 既存のdevDependenciesに追加
    "drizzle-kit": "^0.30.0",
    "babel-plugin-inline-import": "^1.0.0" // マイグレーション用
  }
}
```

### 2. プロジェクト構造

```
/Users/macbookhiro/Desktop/Project/ReactNativeProject/no-smoking-app/
├── drizzle.config.ts     # Drizzle設定ファイル（ルート）
├── src/
│   ├── drizzle/
│   │   ├── index.ts      # データベース接続設定
│   │   ├── schema.ts     # テーブルスキーマ定義
│   │   └── migrations/   # マイグレーションファイル（自動生成）
│   └── ...
└── ...
```

### 3. 実装ファイル

#### 3-1. `drizzle.config.ts` - Drizzle 設定（ルートディレクトリ）

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle",
  dialect: "sqlite",
  driver: "expo", // 重要：Expo用の設定
} satisfies Config;
```

#### 3-2. `src/drizzle/index.ts` - データベース接続設定

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

#### 3-3. `src/drizzle/schema.ts` - テーブルスキーマ定義

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

#### 3-4. `babel.config.js` - Babel 設定の更新

```javascript
module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["inline-import", { extensions: [".sql"] }], // SQLファイルのインライン化
    ],
  };
};
```

#### 3-5. `metro.config.js` - Metro 設定の更新

```javascript
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql"); // SQLファイルの解決

module.exports = config;
```

#### 3-6. `package.json`のスクリプト追加

```json
{
  "scripts": {
    // 既存のスクリプトに追加
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

### 4. マイグレーション機能の実装

#### 4-1. アプリ起動時のマイグレーション実行

```typescript
// src/app/_layout.tsx または App.tsx
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { db } from '../drizzle';

export default function App() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return ...your application component;
}
```

### 5. Live Queries 機能（リアルタイム更新）

```typescript
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "../drizzle";
import * as schema from "../drizzle/schema";

const MyComponent = () => {
  // データが変更されると自動的に再レンダリング
  const { data } = useLiveQuery(db.select().from(schema.userProfile));

  return <Text>{JSON.stringify(data)}</Text>;
};
```

## 実装手順

1. **依存関係のインストール**

   ```bash
   bun add expo-sqlite@next drizzle-orm date-fns
   bun add -D drizzle-kit babel-plugin-inline-import
   ```

2. **設定ファイルの更新**

   - `babel.config.js`にプラグイン追加
   - `metro.config.js`に SQL 拡張子追加

3. **ディレクトリ構造の作成**

   ```bash
   mkdir -p src/drizzle
   ```

4. **ファイルの作成**

   - ルートディレクトリに`drizzle.config.ts`を作成
   - `src/drizzle/`内に他のファイルを作成

5. **マイグレーションの生成**

   ```bash
   bun run db:generate
   ```

6. **アプリケーションでのマイグレーション実行**
   - `useMigrations`フックを使用してアプリ起動時に実行

## 機能要件との整合性

機能要件定義書から必要なデータ項目：

- `smokingStartDate`: 禁煙開始日時
- `cigsPerDay`: 1 日の喫煙本数
- `pricePerPack`: タバコ 1 箱の価格
- `cigsPerPack`: 1 箱の本数

これらすべてを`schema.ts`で定義し、F01、F02、F03 の全機能で使用可能な状態にする。

## 次のタスクへの準備

- スキーマ定義が完了することで、T1-2 のリポジトリ層実装が可能
- 型安全性を確保したデータベース操作の基盤が整う
- マイグレーション機能により、スキーマ変更の管理が可能
- テストデータの投入により、アプリケーションの動作確認が可能

## 参考資料

- [Drizzle ORM Expo SQLite 公式ドキュメント](https://orm.drizzle.team/docs/connect-expo-sqlite)
- 実装計画書: フェーズ 1 - 開発環境とデータ基盤のセットアップ

## 完了条件

- [ ] 依存関係のインストール完了
- [ ] 設定ファイルの更新完了
- [ ] ディレクトリ構造の作成完了
- [ ] データベース接続設定の実装完了
- [ ] スキーマ定義の実装完了
- [ ] マイグレーション機能の実装完了
- [ ] アプリケーション統合完了
- [ ] テストデータの投入完了
- [ ] 動作確認完了

## 備考

- 公式ドキュメントに準拠した実装
- Live Queries 機能によりリアルタイム更新が可能
- 型安全性を確保したデータベース操作
- マイグレーション機能によりスキーマ変更の管理が可能

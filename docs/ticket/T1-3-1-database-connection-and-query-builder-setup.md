# T1-3-1: データベース接続とクエリビルダーの設定

## 概要

Drizzle ORM と Expo SQLite を連携させ、アプリケーション全体で利用可能なデータベース接続を確立し、型安全なクエリビルダーをセットアップする。このタスクは、データリポジトリ層の基盤となる部分を構築する。

## 目的

- `expo-sqlite/next` を使用して、永続的な SQLite データベース接続を確立する
- Drizzle ORM のインスタンスを初期化し、データベーススキーマと関連付ける
- アプリケーションのどの部分からでも利用できる、シングルトンなデータベースインスタンスを提供する

## 依存関係

- **親タスク**: T1-3-0 (データ操作用リポジトリ層の実装)
- **担当領域**: バックエンド

## 実装詳細

### 1. データベース接続の確立

`src/drizzle/connection.ts` ファイルにて、`expo-sqlite/next` を用いて SQLite データベースへの接続を確立する。

```typescript
// src/drizzle/connection.ts
import { openDatabaseSync } from "expo-sqlite/next";

// データベースファイル名
const DATABASE_NAME = "no-smoking-app.db";

// データベース接続を確立
export const sqlite = openDatabaseSync(DATABASE_NAME);
```

### 2. Drizzle ORM インスタンスの初期化

`src/drizzle/index.ts` ファイルにて、確立した SQLite 接続と `schema.ts` で定義されたスキーマを使用して、Drizzle ORM のインスタンスを初期化する。

```typescript
// src/drizzle/index.ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { sqlite } from "./connection";
import * as schema from "./schema";

// Drizzle ORMインスタンスを作成
export const db = drizzle(sqlite, { schema });

// スキーマをエクスポート
export * from "./schema";
```

### 3. クエリビルダーの提供

Drizzle のインスタンス (`db`) がクエリビルダーとして機能するため、特別なクエリビルダークラスの実装は不要。`db` インスタンスをエクスポートし、リポジトリ層で直接利用する。

## 実装手順

1. `src/drizzle/connection.ts` を作成し、`openDatabaseSync` を用いてデータベース接続を確立するコードを記述する。
2. `src/drizzle/index.ts` を作成し、`drizzle` 関数を用いて ORM インスタンスを初期化するコードを記述する。
3. `db` インスタンスとスキーマが他のモジュールから `import { db } from "@/drizzle"` のようにして利用できることを確認する。

## 完了条件

- [ ] `src/drizzle/connection.ts` にデータベース接続処理が実装されている。
- [ ] `src/drizzle/index.ts` に Drizzle ORM の初期化処理が実装されている。
- [ ] `db` インスタンスが正しく初期化され、型情報がスキーマと一致している。
- [ ] アプリケーション起動時にデータベース接続に関するエラーが発生しない。

## 次のタスク

- **T1-3-2**: ユーザープロファイル取得機能の実装

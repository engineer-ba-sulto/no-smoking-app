# T1-3-1: データベース接続とクエリビルダーの設定

## 概要

Drizzle ORM を使用してデータベース接続を設定し、ユーザープロファイルの操作に必要なクエリビルダーを初期化する。SQLite データベースとの接続を確立し、リポジトリ層の基盤となるデータベース操作環境を構築する。

## 目的

- SQLite データベースとの接続を確立する
- Drizzle ORM のクエリビルダーを初期化する
- データベース操作の基盤となる設定を完了する
- 接続エラーのハンドリング機能を実装する

## 依存関係

- **依存タスク**: T1-2（user_profile テーブルのスキーマ定義）
- **担当領域**: バックエンド

## 実装詳細

### 1. データベース接続の設定

#### データベース接続ファイルの作成

```typescript
// src/drizzle/connection.ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

// SQLiteデータベースの初期化
const expo = openDatabaseSync("no_smoking_app.db");

// Drizzle ORMの初期化
export const db = drizzle(expo, { schema });

// データベース接続のテスト
export const testConnection = async () => {
  try {
    // 簡単なクエリで接続をテスト
    const result = await db.select().from(schema.userProfile).limit(1);
    console.log("データベース接続成功");
    return true;
  } catch (error) {
    console.error("データベース接続エラー:", error);
    return false;
  }
};
```

#### データベース設定の管理

```typescript
// src/drizzle/config.ts
export const databaseConfig = {
  name: "no_smoking_app.db",
  version: "1.0",
  description: "No Smoking App Database",
  size: 2000000, // 2MB
  location: "default",
} as const;

// データベースの初期化設定
export const initDatabase = async () => {
  try {
    // データベースファイルの存在確認
    const db = openDatabaseSync(databaseConfig.name);

    // テーブルの存在確認
    const tables = await db.getAllAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='user_profile'
    `);

    if (tables.length === 0) {
      console.log("テーブルが存在しません。マイグレーションが必要です。");
      return false;
    }

    console.log("データベース初期化完了");
    return true;
  } catch (error) {
    console.error("データベース初期化エラー:", error);
    return false;
  }
};
```

### 2. クエリビルダーの設定

#### 基本的なクエリビルダーの実装

```typescript
// src/drizzle/query-builder.ts
import { db } from "./connection";
import { userProfile } from "./schema";
import { eq, and, or, desc, asc } from "drizzle-orm";

// 基本的なクエリビルダー
export const queryBuilder = {
  // 全件取得
  selectAll: () => db.select().from(userProfile),

  // IDによる取得
  selectById: (id: number) =>
    db.select().from(userProfile).where(eq(userProfile.id, id)),

  // 条件による取得
  selectWhere: (conditions: any) =>
    db.select().from(userProfile).where(conditions),

  // 挿入
  insert: (data: any) => db.insert(userProfile).values(data),

  // 更新
  update: (id: number, data: any) =>
    db.update(userProfile).set(data).where(eq(userProfile.id, id)),

  // 削除
  delete: (id: number) => db.delete(userProfile).where(eq(userProfile.id, id)),
};
```

#### 高度なクエリビルダーの実装

```typescript
// src/drizzle/advanced-query-builder.ts
import { db } from "./connection";
import { userProfile } from "./schema";
import { eq, and, or, desc, asc, count, sum, avg } from "drizzle-orm";

// 高度なクエリビルダー
export const advancedQueryBuilder = {
  // 件数取得
  count: () => db.select({ count: count() }).from(userProfile),

  // 条件付き件数取得
  countWhere: (conditions: any) =>
    db.select({ count: count() }).from(userProfile).where(conditions),

  // 統計情報取得
  getStats: () =>
    db
      .select({
        totalUsers: count(),
        avgCigsPerDay: avg(userProfile.cigsPerDay),
        avgPricePerPack: avg(userProfile.pricePerPack),
      })
      .from(userProfile),

  // 最新のユーザー取得
  getLatestUsers: (limit: number = 10) =>
    db
      .select()
      .from(userProfile)
      .orderBy(desc(userProfile.createdAt))
      .limit(limit),

  // 複数条件での検索
  search: (searchConditions: {
    minCigsPerDay?: number;
    maxCigsPerDay?: number;
    minPricePerPack?: number;
    maxPricePerPack?: number;
  }) => {
    let query = db.select().from(userProfile);

    if (searchConditions.minCigsPerDay !== undefined) {
      query = query.where(
        eq(userProfile.cigsPerDay, searchConditions.minCigsPerDay)
      );
    }

    if (searchConditions.maxCigsPerDay !== undefined) {
      query = query.where(
        eq(userProfile.cigsPerDay, searchConditions.maxCigsPerDay)
      );
    }

    if (searchConditions.minPricePerPack !== undefined) {
      query = query.where(
        eq(userProfile.pricePerPack, searchConditions.minPricePerPack)
      );
    }

    if (searchConditions.maxPricePerPack !== undefined) {
      query = query.where(
        eq(userProfile.pricePerPack, searchConditions.maxPricePerPack)
      );
    }

    return query;
  },
};
```

### 3. エラーハンドリングの実装

#### データベースエラーハンドリング

```typescript
// src/drizzle/error-handler.ts
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: any
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

export const handleDatabaseError = (error: any): DatabaseError => {
  if (error.code === "SQLITE_CONSTRAINT") {
    return new DatabaseError(
      "データベース制約エラー",
      "CONSTRAINT_ERROR",
      error
    );
  }

  if (error.code === "SQLITE_BUSY") {
    return new DatabaseError("データベースがビジーです", "BUSY_ERROR", error);
  }

  if (error.code === "SQLITE_LOCKED") {
    return new DatabaseError(
      "データベースがロックされています",
      "LOCKED_ERROR",
      error
    );
  }

  return new DatabaseError("データベースエラー", "UNKNOWN_ERROR", error);
};
```

#### 接続エラーのハンドリング

```typescript
// src/drizzle/connection-handler.ts
import { testConnection } from "./connection";
import { DatabaseError } from "./error-handler";

export const ensureConnection = async (): Promise<boolean> => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new DatabaseError(
        "データベース接続に失敗しました",
        "CONNECTION_ERROR"
      );
    }
    return true;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      "接続確認中にエラーが発生しました",
      "CONNECTION_CHECK_ERROR",
      error
    );
  }
};
```

## 実装手順

1. **データベース接続ファイルの作成**

   ```bash
   # データベース接続ファイルを作成
   touch src/drizzle/connection.ts
   touch src/drizzle/config.ts
   ```

2. **基本的な接続設定の実装**

   ```typescript
   // src/drizzle/connection.ts
   import { drizzle } from "drizzle-orm/expo-sqlite";
   import { openDatabaseSync } from "expo-sqlite";
   import * as schema from "./schema";

   const expo = openDatabaseSync("no_smoking_app.db");
   export const db = drizzle(expo, { schema });
   ```

3. **クエリビルダーの実装**

   ```bash
   # クエリビルダーファイルを作成
   touch src/drizzle/query-builder.ts
   touch src/drizzle/advanced-query-builder.ts
   ```

4. **エラーハンドリングの実装**

   ```bash
   # エラーハンドリングファイルを作成
   touch src/drizzle/error-handler.ts
   touch src/drizzle/connection-handler.ts
   ```

5. **接続テストの実装**

   ```typescript
   // 接続テストの実行
   import { testConnection } from "./src/drizzle/connection";

   const testResult = await testConnection();
   console.log("接続テスト結果:", testResult);
   ```

6. **動作確認**

   ```bash
   # TypeScriptの型チェック
   npx tsc --noEmit src/drizzle/connection.ts

   # 接続テストの実行
   npx tsx test-connection.ts
   ```

## 完了条件

- [ ] SQLite データベースとの接続が確立されている
- [ ] Drizzle ORM のクエリビルダーが初期化されている
- [ ] 基本的なクエリビルダーが実装されている
- [ ] 高度なクエリビルダーが実装されている
- [ ] エラーハンドリング機能が実装されている
- [ ] 接続テストが正常に動作する
- [ ] TypeScript の型チェックが通る
- [ ] データベース操作の基盤が完成している

## 次のタスク

- **T1-3-2**: ユーザープロファイル取得機能の実装
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **データベース接続エラー**

   ```bash
   # データベースファイルの権限確認
   ls -la *.db

   # データベースファイルの削除と再作成
   rm -f no_smoking_app.db
   npx drizzle-kit migrate
   ```

2. **Drizzle ORM の初期化エラー**

   ```bash
   # 依存関係の確認
   npm list drizzle-orm drizzle-orm-expo-sqlite

   # 依存関係の再インストール
   npm install drizzle-orm drizzle-orm-expo-sqlite
   ```

3. **TypeScript の型エラー**

   ```bash
   # 型定義の確認
   npx tsc --noEmit src/drizzle/connection.ts

   # 型定義の再生成
   npx drizzle-kit generate
   ```

4. **クエリビルダーのエラー**

   ```bash
   # スキーマファイルの確認
   cat src/drizzle/schema.ts

   # マイグレーションの確認
   npx drizzle-kit introspect
   ```

## 備考

- データベース接続はアプリケーションの起動時に一度だけ初期化する
- エラーハンドリングは適切なエラーメッセージとエラーコードを提供する
- クエリビルダーは再利用可能で型安全な設計にする
- 接続テストは定期的に実行してデータベースの状態を確認する

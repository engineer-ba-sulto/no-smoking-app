# T1-1-5: アプリケーション統合

## 概要

生成されたマイグレーションファイルをアプリケーションに統合し、アプリ起動時の自動マイグレーション実行と Live Queries 機能の実装を行う。

## 目的

- アプリ起動時の自動マイグレーション実行
- Live Queries 機能の実装
- データベース接続の動作確認
- アプリケーション全体での統合テスト

## 依存関係

- **依存タスク**: T1-1-4（マイグレーション生成とテスト）
- **担当領域**: アプリケーション統合

## 実装詳細

### 1. アプリ起動時のマイグレーション実行

#### 1-1. マイグレーションファイルのインポート設定

```typescript
// src/drizzle/migrations/index.ts
import migrations from "./migrations";

export default migrations;
```

#### 1-2. アプリケーションでのマイグレーション実行

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

### 2. Live Queries 機能の実装

#### 2-1. 基本的な Live Query の実装

```typescript
// src/components/UserProfileDisplay.tsx
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "../drizzle";
import * as schema from "../drizzle/schema";

const UserProfileDisplay = () => {
  // データが変更されると自動的に再レンダリング
  const { data, error } = useLiveQuery(db.select().from(schema.userProfile));

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!data || data.length === 0) {
    return <Text>No user profile found</Text>;
  }

  const profile = data[0];

  return (
    <View>
      <Text>禁煙開始日: {profile.smokingStartDate}</Text>
      <Text>1日の喫煙本数: {profile.cigsPerDay}</Text>
      <Text>1箱の価格: {profile.pricePerPack}円</Text>
      <Text>1箱の本数: {profile.cigsPerPack}</Text>
    </View>
  );
};

export default UserProfileDisplay;
```

### 3. データベース操作のテスト

#### 3-1. 基本的な CRUD 操作のテスト

```typescript
// src/utils/database-test.ts
import { db } from "../drizzle";
import * as schema from "../drizzle/schema";

export const testDatabaseOperations = async () => {
  try {
    // テストデータの挿入
    const newProfile = await db
      .insert(schema.userProfile)
      .values({
        smokingStartDate: new Date().toISOString(),
        cigsPerDay: 20,
        pricePerPack: 500,
        cigsPerPack: 20,
      })
      .returning();

    console.log("Inserted profile:", newProfile);

    // データの取得
    const profiles = await db.select().from(schema.userProfile);
    console.log("All profiles:", profiles);

    // データの更新
    if (newProfile[0]) {
      const updatedProfile = await db
        .update(schema.userProfile)
        .set({ cigsPerDay: 15 })
        .where(eq(schema.userProfile.id, newProfile[0].id))
        .returning();

      console.log("Updated profile:", updatedProfile);
    }

    return {
      success: true,
      message: "Database operations completed successfully",
    };
  } catch (error) {
    console.error("Database test error:", error);
    return { success: false, error: error.message };
  }
};
```

## 実装手順

1. **マイグレーションファイルのインポート設定**

   - `src/drizzle/migrations/index.ts` を作成
   - マイグレーションファイルをエクスポート

2. **アプリケーションでのマイグレーション実行**

   - `src/app/_layout.tsx` または `App.tsx` を更新
   - `useMigrations` フックを使用

3. **Live Queries 機能の実装**

   - テスト用コンポーネントを作成
   - `useLiveQuery` フックを使用

4. **データベース操作のテスト**

   - テスト用ユーティリティ関数を作成
   - CRUD 操作の動作確認

5. **アプリケーションの動作確認**

   ```bash
   # 開発サーバーの起動
   bun start
   ```

6. **統合テストの実行**
   - マイグレーションの自動実行確認
   - データベース操作の動作確認
   - Live Queries の動作確認

## テスト項目

### 1. マイグレーション実行テスト

- [ ] アプリ起動時にマイグレーションが自動実行される
- [ ] エラーなくマイグレーションが完了する
- [ ] データベーステーブルが正しく作成される

### 2. Live Queries テスト

- [ ] データ変更時に自動的に再レンダリングされる
- [ ] エラーハンドリングが正しく動作する
- [ ] 空データの処理が正しく動作する

### 3. データベース操作テスト

- [ ] データの挿入が正しく動作する
- [ ] データの取得が正しく動作する
- [ ] データの更新が正しく動作する
- [ ] エラーハンドリングが正しく動作する

### 4. アプリケーション統合テスト

- [ ] アプリが正常に起動する
- [ ] データベース接続が確立される
- [ ] 全機能が連携して動作する

## 完了条件

- [ ] マイグレーションファイルのインポート設定完了
- [ ] アプリケーションでのマイグレーション実行完了
- [ ] Live Queries 機能の実装完了
- [ ] データベース操作のテスト完了
- [ ] アプリケーションの動作確認完了
- [ ] 統合テストの実行完了
- [ ] エラーハンドリングの確認完了

## 次のタスク

- **T1-1-6**: テストデータの投入
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **マイグレーション実行エラー**

   ```bash
   # エラーログの確認
   console.log("Migration error:", error);
   ```

2. **Live Queries の動作不良**

   ```bash
   # データベース接続の確認
   console.log("Database connection:", db);
   ```

3. **アプリケーション起動エラー**
   ```bash
   # 開発サーバーの再起動
   bun start --clear
   ```

### 解決方法

```bash
# データベースファイルのリセット
rm -f no-smoking-app.db

# アプリケーションの再起動
bun start --clear
```

## 備考

- マイグレーションはアプリ起動時に自動実行される
- Live Queries によりリアルタイム更新が可能
- エラーハンドリングを適切に実装
- テスト用のデータ操作関数を用意

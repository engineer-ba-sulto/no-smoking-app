# T1-1-6: テストデータの投入

## 概要

データベースの動作確認とアプリケーションの統合テストのために、初期テストデータを投入する。

## 目的

- データベース接続の動作確認
- Live Queries 機能のテスト
- UI 表示の動作確認
- アプリケーション全体の統合テスト

## 依存関係

- **依存タスク**: T1-1-5（アプリケーション統合）
- **担当領域**: データベーステスト

## 実装詳細

### 1. シードデータの定義

#### 1-1. テスト用ユーザープロフィールデータ

```typescript
// src/drizzle/seed.ts
import { db } from "./index";
import * as schema from "./schema";

export const seedData = {
  userProfile: {
    smokingStartDate: new Date().toISOString(),
    cigsPerDay: 20,
    pricePerPack: 500,
    cigsPerPack: 20,
  },
};
```

### 2. シード関数の実装

#### 2-1. 基本的なシード関数

```typescript
// src/drizzle/seed.ts
export const seedDatabase = async () => {
  try {
    // 既存データの確認
    const existingProfiles = await db.select().from(schema.userProfile);

    if (existingProfiles.length > 0) {
      console.log("Database already has data, skipping seed");
      return { success: true, message: "Database already seeded" };
    }

    // テストデータの挿入
    const newProfile = await db
      .insert(schema.userProfile)
      .values(seedData.userProfile)
      .returning();

    console.log("Seed data inserted:", newProfile);

    return {
      success: true,
      message: "Database seeded successfully",
      data: newProfile,
    };
  } catch (error) {
    console.error("Seed error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
```

### 3. アプリケーション統合

#### 3-1. 開発環境での自動シード

```typescript
// src/app/_layout.tsx に追加
import { seedDatabase } from "../drizzle/seed";

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  // 開発環境でのみシード実行
  useEffect(() => {
    if (success && __DEV__) {
      seedDatabase();
    }
  }, [success]);

  // ... 既存のコード
}
```

#### 3-2. 手動シードスクリプト

```typescript
// scripts/seed.ts
import { seedDatabase } from "../src/drizzle/seed";

const runSeed = async () => {
  console.log("Starting database seed...");
  const result = await seedDatabase();

  if (result.success) {
    console.log("✅ Seed completed:", result.message);
  } else {
    console.error("❌ Seed failed:", result.error);
    process.exit(1);
  }
};

runSeed();
```

### 4. package.json スクリプトの追加

```json
{
  "scripts": {
    "db:seed": "bun run scripts/seed.ts",
    "db:reset": "rm -f no-smoking-app.db && bun run db:generate && bun run db:seed"
  }
}
```

## 実装手順

1. **シードファイルの作成**

   - `src/drizzle/seed.ts` を作成
   - テストデータの定義とシード関数を実装

2. **アプリケーション統合**

   - 開発環境での自動シード実行を追加
   - エラーハンドリングを実装

3. **手動シードスクリプトの作成**

   - `scripts/seed.ts` を作成
   - コマンドラインからの実行を可能にする

4. **package.json スクリプトの追加**

   - `db:seed` と `db:reset` スクリプトを追加

5. **動作確認**
   - シードデータの投入確認
   - UI 表示の動作確認
   - Live Queries の動作確認

## テスト項目

### 1. シードデータ投入テスト

- [ ] 空のデータベースにテストデータが正しく投入される
- [ ] 既存データがある場合はスキップされる
- [ ] エラーハンドリングが正しく動作する

### 2. UI 表示テスト

- [ ] `UserProfileDisplay`コンポーネントでデータが表示される
- [ ] Live Queries が正しく動作する
- [ ] データの変更がリアルタイムで反映される

### 3. 統合テスト

- [ ] アプリケーション全体が正常に動作する
- [ ] データベース操作が正しく実行される
- [ ] エラー時の適切な処理が行われる

## 完了条件

- [ ] `src/drizzle/seed.ts` の作成完了
- [ ] アプリケーション統合完了
- [ ] 手動シードスクリプトの作成完了
- [ ] package.json スクリプトの追加完了
- [ ] シードデータ投入の動作確認完了
- [ ] UI 表示の動作確認完了
- [ ] 統合テストの実行完了

## 次のタスク

- **T1-2**: user_profile テーブルのスキーマ定義
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **シードデータの重複投入**

   ```typescript
   // 既存データの確認を追加
   const existingProfiles = await db.select().from(schema.userProfile);
   ```

2. **開発環境でのみ実行**

   ```typescript
   // __DEV__ フラグを使用
   if (success && __DEV__) {
     seedDatabase();
   }
   ```

3. **データベースリセット**
   ```bash
   # データベースをリセットして再シード
   bun run db:reset
   ```

## 備考

- シードデータは開発環境でのみ実行される
- 本番環境では実行されない
- 既存データがある場合はスキップされる
- 手動でのシード実行も可能

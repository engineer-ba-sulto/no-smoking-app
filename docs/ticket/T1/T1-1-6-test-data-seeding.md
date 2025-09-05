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

#### 3-2. データベース管理 UI（新機能）

```typescript
// src/utils/database-manager.ts
export class DatabaseManager {
  static async seedTestData() {
    /* テストデータ投入 */
  }
  static async clearAllData() {
    /* データ削除 */
  }
  static async resetDatabase() {
    /* DB完全リセット */
  }
  static async getDatabaseStatus() {
    /* 状態確認 */
  }
  static async executeCustomQuery(query: string) {
    /* カスタムSQL実行 */
  }
}
```

#### 3-3. 設定画面への統合

```typescript
// src/app/(tabs)/settings.tsx
// 開発環境でのみ表示される「データベース管理」ボタンを追加
// 専用画面（/database-manager）へのナビゲーション
```

## 実装手順

1. **シードファイルの作成**

   - `src/drizzle/seed.ts` を作成
   - テストデータの定義とシード関数を実装

2. **アプリケーション統合**

   - 開発環境での自動シード実行を追加
   - エラーハンドリングを実装

3. **データベース管理 UI の実装**

   - `src/utils/database-manager.ts` を作成
   - `src/components/DatabaseManager.tsx` を作成
   - `src/app/database-manager.tsx` を作成

4. **設定画面への統合**

   - 開発環境でのみ表示される「データベース管理」ボタンを追加
   - 専用画面へのナビゲーション機能を実装

5. **動作確認**
   - シードデータの投入確認
   - UI 表示の動作確認
   - Live Queries の動作確認
   - データベース管理 UI の動作確認

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

- [x] `src/drizzle/seed.ts` の作成完了
- [x] アプリケーション統合完了
- [x] データベース管理 UI の実装完了
- [x] 設定画面への統合完了
- [x] シードデータ投入の動作確認完了
- [x] UI 表示の動作確認完了
- [x] 統合テストの実行完了

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

## 備考

- シードデータは開発環境でのみ実行される
- 本番環境では実行されない
- 既存データがある場合はスキップされる
- アプリ内 UI からデータベース管理が可能
- カスタム SQL クエリの実行が可能
- データベースの完全リセット機能
- 開発者向けの専用管理画面

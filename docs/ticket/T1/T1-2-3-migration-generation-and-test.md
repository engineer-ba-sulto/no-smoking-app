# T1-2-3: マイグレーションファイルの生成とテスト

## 概要

T1-2-2 で拡張したスキーマ定義に基づいて、新しいマイグレーションファイルを生成し、既存データとの互換性を保ちながらスキーマの更新を安全に実行する。マイグレーションの動作確認とテストを行い、データの整合性を保証する。

## 目的

- 拡張されたスキーマに基づくマイグレーションファイルの生成
- 既存データとの互換性を保った安全なスキーマ更新
- マイグレーションの動作確認とテスト
- データの整合性と型安全性の保証

## 依存関係

- **依存タスク**: T1-2-2（機能要件に基づくスキーマ拡張）
- **担当領域**: データベース設計

## 実装詳細

### 1. マイグレーション生成前の準備

#### 現在のマイグレーション状況の確認

```bash
# 既存のマイグレーションファイルを確認
ls -la src/drizzle/migrations/

# 現在のマイグレーション履歴を確認
cat src/drizzle/migrations/meta/_journal.json
```

#### スキーマ変更内容の確認

```typescript
// 変更前（T1-2-2で更新されたスキーマ）
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

### 2. マイグレーションファイルの生成

#### Drizzle Kit を使用したマイグレーション生成

```bash
# マイグレーションファイルを生成
npx drizzle-kit generate

# 生成されたマイグレーションファイルを確認
ls -la src/drizzle/migrations/
```

#### 生成されるマイグレーションファイルの内容確認

```sql
-- 例: 0001_xxx.sql
-- 既存のテーブル構造を確認し、必要に応じてALTER文を生成
-- updatedAtフィールドのdefault値の変更が含まれる可能性
```

### 3. マイグレーションのテスト

#### テスト用データベースでの動作確認

```bash
# テスト用のデータベースでマイグレーションを実行
npx drizzle-kit migrate

# マイグレーション後のスキーマ確認
npx drizzle-kit introspect
```

#### 既存データの整合性確認

```typescript
// テスト用スクリプト: migration-test.ts
import { db } from "./src/drizzle";
import { userProfile } from "./src/drizzle/schema";
import { eq } from "drizzle-orm";

async function testMigration() {
  try {
    // 既存データの取得
    const profiles = await db.select().from(userProfile);
    console.log("既存データ数:", profiles.length);

    // 各レコードの整合性確認
    for (const profile of profiles) {
      console.log("ID:", profile.id);
      console.log("禁煙開始日:", profile.smokingStartDate);
      console.log("1日の本数:", profile.cigsPerDay);
      console.log("1箱の価格:", profile.pricePerPack);
      console.log("1箱の本数:", profile.cigsPerPack);
      console.log("作成日時:", profile.createdAt);
      console.log("更新日時:", profile.updatedAt);
      console.log("---");
    }

    console.log("マイグレーションテスト完了");
  } catch (error) {
    console.error("マイグレーションテストエラー:", error);
  }
}

testMigration();
```

### 4. マイグレーション実行

#### 本番環境でのマイグレーション実行

```bash
# 本番環境でのマイグレーション実行
npx drizzle-kit migrate

# マイグレーション後の確認
npx drizzle-kit introspect
```

#### マイグレーション後の動作確認

```typescript
// アプリケーションでの動作確認
import { db } from "./src/drizzle";
import { userProfile } from "./src/drizzle/schema";

// データの取得テスト
const profiles = await db.select().from(userProfile);
console.log("マイグレーション後のデータ:", profiles);

// データの挿入テスト
const newProfile = await db
  .insert(userProfile)
  .values({
    smokingStartDate: new Date().toISOString(),
    cigsPerDay: 20,
    pricePerPack: 500.0,
    cigsPerPack: 20,
  })
  .returning();

console.log("新規データ挿入テスト:", newProfile);
```

## 実装手順

1. **既存マイグレーション状況の確認**

   ```bash
   # 既存のマイグレーションファイルを確認
   ls -la src/drizzle/migrations/
   cat src/drizzle/migrations/meta/_journal.json
   ```

2. **マイグレーションファイルの生成**

   ```bash
   # 新しいマイグレーションファイルを生成
   npx drizzle-kit generate
   ```

3. **生成されたマイグレーションファイルの確認**

   ```bash
   # 最新のマイグレーションファイルを確認
   ls -la src/drizzle/migrations/ | tail -5
   cat src/drizzle/migrations/[最新ファイル名].sql
   ```

4. **テスト環境でのマイグレーション実行**

   ```bash
   # テスト用データベースでマイグレーション実行
   npx drizzle-kit migrate
   ```

5. **マイグレーション後の動作確認**

   ```bash
   # スキーマの確認
   npx drizzle-kit introspect

   # テストスクリプトの実行
   npx tsx migration-test.ts
   ```

6. **本番環境でのマイグレーション実行**
   ```bash
   # 本番環境でのマイグレーション実行
   npx drizzle-kit migrate
   ```

## 完了条件

- [ ] 新しいマイグレーションファイルが正常に生成されている
- [ ] マイグレーションファイルの内容が期待通りである
- [ ] テスト環境でのマイグレーションが正常に実行される
- [ ] 既存データの整合性が保たれている
- [ ] マイグレーション後のスキーマが正しく反映されている
- [ ] アプリケーションでのデータ操作が正常に動作する
- [ ] マイグレーションのロールバック手順が確認されている

## 次のタスク

- **T1-3**: データ操作用リポジトリ層の実装
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **マイグレーションファイルが生成されない**

   ```bash
   # スキーマファイルの構文エラーを確認
   npx tsc --noEmit src/drizzle/schema.ts

   # Drizzle設定ファイルの確認
   cat drizzle.config.ts
   ```

2. **マイグレーション実行時にエラーが発生する**

   ```bash
   # データベースファイルの権限確認
   ls -la *.db

   # データベースの整合性確認
   sqlite3 [データベースファイル] "PRAGMA integrity_check;"
   ```

3. **既存データが失われる**

   ```bash
   # マイグレーション前のバックアップ作成
   cp [データベースファイル] [データベースファイル].backup

   # 必要に応じてバックアップから復元
   cp [データベースファイル].backup [データベースファイル]
   ```

4. **スキーマの変更が反映されない**

   ```bash
   # マイグレーション履歴の確認
   cat src/drizzle/migrations/meta/_journal.json

   # 手動でマイグレーション実行
   npx drizzle-kit migrate
   ```

## 備考

- マイグレーション実行前には必ずデータベースのバックアップを作成する
- テスト環境での動作確認を十分に行ってから本番環境で実行する
- マイグレーションのロールバック手順を事前に確認しておく
- 既存データの整合性を保つことが最重要

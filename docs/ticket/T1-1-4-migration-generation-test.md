# T1-1-4: マイグレーション生成とテスト

## 概要

Drizzle Kit を使用してマイグレーションファイルを生成し、データベースの初期化とテストを実行する。

## 目的

- スキーマ定義からマイグレーションファイルの生成
- データベースの初期化テスト
- マイグレーション機能の動作確認

## 依存関係

- **依存タスク**: T1-1-3（ディレクトリ構造とファイル作成）
- **担当領域**: データベース管理

## 実装詳細

### 1. package.json スクリプトの追加

#### 追加するスクリプト

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

### 2. マイグレーション生成

#### 生成コマンド

```bash
bun run db:generate
```

#### 生成されるファイル

```
src/drizzle/
├── migrations/
│   └── 0000_initial_schema.sql
└── meta/
    └── _journal.json
```

### 3. 生成されるマイグレーションファイルの内容

#### 0000_initial_schema.sql（予想される内容）

```sql
CREATE TABLE IF NOT EXISTS "user_profile" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "smoking_start_date" text NOT NULL,
  "cigs_per_day" integer NOT NULL,
  "price_per_pack" real NOT NULL,
  "cigs_per_pack" integer NOT NULL,
  "created_at" text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
  "updated_at" text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
```

### 4. マイグレーションファイルの確認

#### 生成されたファイルの確認

```bash
# マイグレーションファイルの確認
ls -la src/drizzle/migrations/

# SQLファイルの内容確認
cat src/drizzle/migrations/*.sql

# メタファイルの確認
cat src/drizzle/meta/_journal.json
```

## 実装手順

1. **package.json のスクリプト追加**

   - 上記のスクリプトを package.json に追加

2. **マイグレーション生成の実行**

   ```bash
   bun run db:generate
   ```

3. **生成されたファイルの確認**

   ```bash
   # ファイル一覧の確認
   ls -la src/drizzle/migrations/

   # SQLファイルの内容確認
   cat src/drizzle/migrations/*.sql
   ```

4. **Drizzle Studio での確認（オプション）**

   ```bash
   bun run db:studio
   ```

5. **マイグレーションファイルの検証**

   - SQL の構文が正しいか確認
   - テーブル定義が要件通りか確認

6. **エラーハンドリングの確認**
   - 生成時のエラーメッセージの確認
   - 必要に応じてスキーマの修正

## テスト項目

### 1. マイグレーション生成テスト

- [ ] エラーなくマイグレーションファイルが生成される
- [ ] SQL ファイルの内容が正しい
- [ ] メタファイルが適切に生成される

### 2. スキーマ検証テスト

- [ ] userProfile テーブルが正しく定義されている
- [ ] 全カラムが要件通り定義されている
- [ ] データ型が適切に設定されている

### 3. ファイル構造テスト

- [ ] migrations ディレクトリが作成されている
- [ ] meta ディレクトリが作成されている
- [ ] ファイルの命名規則が正しい

## 完了条件

- [ ] package.json スクリプトの追加完了
- [ ] マイグレーション生成の実行完了
- [ ] 生成されたファイルの確認完了
- [ ] SQL ファイルの内容検証完了
- [ ] エラーハンドリングの確認完了
- [ ] Drizzle Studio での動作確認完了（オプション）

## 次のタスク

- **T1-1-5**: アプリケーション統合
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **マイグレーション生成エラー**

   ```bash
   # エラーメッセージの確認
   bun run db:generate
   ```

2. **スキーマファイルの構文エラー**

   ```bash
   # TypeScript の構文チェック
   npx tsc --noEmit
   ```

3. **設定ファイルの問題**
   ```bash
   # drizzle.config.ts の確認
   cat drizzle.config.ts
   ```

### 解決方法

```bash
# キャッシュクリア
rm -rf src/drizzle/migrations
rm -rf src/drizzle/meta

# 再生成
bun run db:generate
```

## 備考

- マイグレーションファイルは自動生成される
- 生成後は手動で編集しない
- スキーマ変更時は再生成が必要
- Drizzle Studio は開発時のデータ確認に便利

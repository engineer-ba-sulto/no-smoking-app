# T1-1-1: 依存関係のインストール

## 概要

Drizzle ORM と Expo SQLite の導入に必要な依存関係を bun を使用してインストールする。

## 目的

- 必要なパッケージをプロジェクトに追加
- 開発環境と本番環境の依存関係を適切に分離
- bun を使用した高速インストール

## 依存関係

- **依存タスク**: なし
- **担当領域**: パッケージ管理

## 実装詳細

### 1. インストールする依存関係

#### 本番依存関係

```json
{
  "dependencies": {
    "expo-sqlite": "next", // 公式推奨のnextバージョン
    "drizzle-orm": "^0.36.4",
    "date-fns": "^4.1.0"
  }
}
```

#### 開発依存関係

```json
{
  "devDependencies": {
    "drizzle-kit": "^0.30.0",
    "babel-plugin-inline-import": "^1.0.0" // マイグレーション用
  }
}
```

### 2. インストールコマンド

```bash
# 本番依存関係のインストール
bun add expo-sqlite@next drizzle-orm date-fns

# 開発依存関係のインストール
bun add -D drizzle-kit babel-plugin-inline-import
```

### 3. パッケージの説明

#### expo-sqlite@next

- Expo アプリで SQLite データベースを使用するためのパッケージ
- `@next` バージョンは最新機能と Live Queries サポートを含む

#### drizzle-orm

- TypeScript ファーストの ORM
- 型安全性とパフォーマンスを提供

#### date-fns

- 日付操作ライブラリ
- 禁煙継続時間の計算に使用

#### drizzle-kit

- Drizzle ORM の開発ツール
- マイグレーション生成と管理

#### babel-plugin-inline-import

- SQL ファイルをバンドルに直接埋め込むためのプラグイン
- Expo でのマイグレーション実行に必要

## 実装手順

1. **現在の package.json の確認**

   ```bash
   cat package.json
   ```

2. **本番依存関係のインストール**

   ```bash
   bun add expo-sqlite@next drizzle-orm date-fns
   ```

3. **開発依存関係のインストール**

   ```bash
   bun add -D drizzle-kit babel-plugin-inline-import
   ```

4. **インストール結果の確認**

   ```bash
   bun list
   ```

5. **package.json の更新確認**
   ```bash
   cat package.json
   ```

## 完了条件

- [ ] expo-sqlite@next のインストール完了
- [ ] drizzle-orm のインストール完了
- [ ] date-fns のインストール完了
- [ ] drizzle-kit のインストール完了
- [ ] babel-plugin-inline-import のインストール完了
- [ ] package.json の更新確認完了
- [ ] bun.lock の更新確認完了

## 次のタスク

- **T1-1-2**: 設定ファイルの更新（babel, metro）
- **依存関係**: このタスクの完了後に実行可能

## 備考

- bun を使用することで npm/yarn より高速なインストールが可能
- 既存の bun.lock ファイルとの整合性を保つ
- バージョン指定により安定性を確保

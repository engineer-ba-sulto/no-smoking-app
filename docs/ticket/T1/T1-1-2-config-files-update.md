# T1-1-2: 設定ファイルの更新

## 概要

Drizzle ORM と Expo SQLite の動作に必要な設定ファイル（babel.config.js, metro.config.js）を更新する。

## 目的

- SQL ファイルのインライン化設定
- Metro バンドラーでの SQL ファイル解決設定
- マイグレーション機能の有効化

## 依存関係

- **依存タスク**: T1-1-1（依存関係のインストール）
- **担当領域**: ビルド設定

## 実装詳細

### 1. babel.config.js の更新

#### 現在の設定確認

```bash
cat babel.config.js
```

#### 更新後の設定

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

#### 変更点

- `babel-plugin-inline-import` プラグインの追加
- SQL ファイル（.sql）の拡張子を指定
- マイグレーションファイルをバンドルに直接埋め込む設定

### 2. metro.config.js の更新

#### 現在の設定確認

```bash
cat metro.config.js
```

#### 更新後の設定

```javascript
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql"); // SQLファイルの解決

module.exports = config;
```

#### 変更点

- `sourceExts` に "sql" 拡張子を追加
- Metro バンドラーが SQL ファイルを認識できるように設定

## 実装手順

1. **現在の設定ファイルのバックアップ**

   ```bash
   cp babel.config.js babel.config.js.backup
   cp metro.config.js metro.config.js.backup
   ```

2. **babel.config.js の更新**

   - 上記の設定内容でファイルを更新

3. **metro.config.js の更新**

   - 上記の設定内容でファイルを更新

4. **設定ファイルの構文チェック**

   ```bash
   # babel設定の確認
   node -e "console.log(require('./babel.config.js'))"

   # metro設定の確認
   node -e "console.log(require('./metro.config.js'))"
   ```

5. **Expo プロジェクトの再起動**
   ```bash
   # 開発サーバーを停止して再起動
   bun start --clear
   ```

## 設定の説明

### babel-plugin-inline-import

- SQL ファイルを JavaScript の文字列として直接バンドルに埋め込む
- ランタイムでのファイル読み込みを不要にする
- Expo アプリでのマイグレーション実行に必要

### Metro sourceExts

- Metro バンドラーが解決するファイル拡張子のリスト
- SQL ファイルをモジュールとして認識させる
- インポート文で SQL ファイルを参照可能にする

## 完了条件

- [ ] babel.config.js の更新完了
- [ ] metro.config.js の更新完了
- [ ] 設定ファイルの構文チェック完了
- [ ] Expo プロジェクトの再起動完了
- [ ] エラーなく開発サーバーが起動することを確認

## 次のタスク

- **T1-1-3**: ディレクトリ構造とファイル作成
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **Babel 設定エラー**: 構文エラーがないか確認
2. **Metro 設定エラー**: sourceExts の配列形式を確認
3. **開発サーバー起動エラー**: キャッシュクリアを実行

### 解決方法

```bash
# キャッシュクリア
bun start --clear

# node_modules の再インストール（必要に応じて）
rm -rf node_modules
bun install
```

## 備考

- 設定ファイルの変更は開発サーバーの再起動が必要
- バックアップファイルを作成して安全に作業
- 構文チェックで設定の正確性を確認

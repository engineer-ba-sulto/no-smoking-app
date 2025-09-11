# T5-2-2: expo-dev-client のセットアップ

## 概要

`react-native-purchases` のようなネイティブコードを含むライブラリを Expo プロジェクトで利用するため、`expo-dev-client` を導入し、開発ビルド環境を構築します。

## 目的

- カスタムネイティブコードを含むアプリをシミュレータ/実機で実行できるようにする。
- EAS (Expo Application Services) を利用した開発フローを確立する。

## 依存関係

- **依存タスク**: `T5-2-1`
- **担当領域**: 環境構築, ビルド設定

## 実装詳細

### 1. 必要なグローバルツールのインストール

- **EAS CLI** (未インストールの場合は、ターミナルでグローバルにインストールします):
  ```bash
  npm install -g eas-cli
  ```

### 2. 開発クライアントのインストール

- プロジェクトに `expo-dev-client` を追加します。
  ```bash
  bun add expo-dev-client
  ```

### 3. EAS プロジェクトの設定

- `app.json` または `app.config.js` に `plugins` を追加して、`expo-dev-client` を有効化します。

```json
// app.json
{
  "expo": {
    // ... other settings
    "plugins": ["expo-dev-client"]
  }
}
```

- プロジェクトのビルド設定ファイル `eas.json` を生成・設定します。
  ```bash
  eas build:configure
  ```

## 実装手順

1.  **`expo-dev-client` をインストールする**
    ```bash
    bun add expo-dev-client
    ```
2.  **`app.json` を更新する**
    - 上記の通り、`plugins` 配列に `"expo-dev-client"` を追加します。
3.  **EAS Build を設定する**
    - `eas build:configure` を実行し、指示に従って `eas.json` を生成・設定します。
4.  **開発ビルドを作成する**

    - シミュレータ用 (iOS) またはエミュレータ用 (Android) の開発ビルドを作成します。

    ```bash
    # iOS Simulator
    eas build --profile development --platform ios

    # Android Emulator
    eas build --profile development --platform android
    ```

5.  **開発ビルドをインストールして起動する**
    - ビルド完了後、生成された QR コードやリンク経由でシミュレータ/実機にアプリをインストールします。
    - `bun start --dev-client` コマンドで開発サーバーを起動します。

## 完了条件

- [ ] `expo-dev-client` が `package.json` に追加されている。
- [ ] `app.json` に `expo-dev-client` プラグインが追加されている。
- [ ] `eas.json` がプロジェクトルートに作成されている。
- [ ] 開発ビルドが正常に作成できる。
- [ ] 開発ビルドをシミュレータ/実機で起動できる。

## 次のタスク

- **T5-2-3**: RevenueCat と各アプリストアの設定

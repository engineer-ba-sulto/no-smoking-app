# T5-2-1: RevenueCat SDK のインストール

## 概要

アプリ内課金を管理するための RevenueCat SDK (`react-native-purchases`) をプロジェクトにインストールします。

## 目的

- RevenueCat の機能をアプリから利用できるようにする。
- アプリ内課金処理の基盤を導入する。

## 依存関係

- **依存タスク**: `T5-2-0`
- **担当領域**: パッケージ管理

## 実装詳細

### 1. インストールコマンド

```bash
bun add react-native-purchases
```

### 2. iOS の設定

- インストール後、iOS の依存関係を更新します。

```bash
npx pod-install
```

## 実装手順

1.  **ライブラリをインストールする**
    ```bash
    bun add react-native-purchases
    ```
2.  **iOS の依存関係を更新する**
    ```bash
    npx pod-install
    ```
3.  **`package.json` を確認する**
    - `dependencies` に `react-native-purchases` が追加されていることを確認します。

## 完了条件

- [ ] `react-native-purchases` が `package.json` に追加されている。
- [ ] `npx pod-install` がエラーなく完了する。
- [ ] `bun.lock` が更新されている。

## 次のタスク

- **T5-2-2**: expo-dev-client のセットアップ

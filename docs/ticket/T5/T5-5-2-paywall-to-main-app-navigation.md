# T5-5-2: ワンタイムオファーからメインアプリへの遷移

## 概要

ワンタイムオファー画面 (`/one-time-offer`) でユーザーが「閉じる」ボタンを押した時に、メインアプリのホーム画面 (`/(tabs)`) へ遷移するロジックを実装します。

## 目的

- 全てのオファーをスキップしたユーザーを、アプリのメイン機能へスムーズに誘導する。
- `replace` を使うことで、ユーザーがオファー画面に戻れないようにする。

## 依存関係

- **依存タスク**: `T5-1-5`
- **担当領域**: ナビゲーション

## 実装詳細

- **ファイル**: `src/app/one-time-offer.tsx`
- **変更点**: 「閉じる」ボタンに `onPress` ハンドラを追加し、`router.replace('/(tabs)')` を呼び出すようにします。

```tsx
// src/app/one-time-offer.tsx
import { router } from "expo-router";
```

## 実装手順

1. `one-time-offer.tsx` を開き、`expo-router` の `router` をインポートします。
2. `OneTimeOfferScreen` コンポーネントに `handleClose` 関数を定義し、その中で `router.replace('/(tabs)')` を呼び出します。
3. 「閉じる」ボタンの `TouchableOpacity` に `onPress={handleClose}` を追加します。

## 完了条件

- [ ] `/one-time-offer` 画面で「閉じる」ボタンを押すと、`/(tabs)` 画面へ遷移する。
- [ ] 遷移後に戻る操作をしてもオファー画面に戻らない。

## 次のタスク

- なし (全実装完了)

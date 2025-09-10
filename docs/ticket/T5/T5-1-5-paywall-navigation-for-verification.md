# T5-1-5: 確認用ペイウォール画面遷移の実装

## 概要

UI 実装フェーズ (`T5-1`) の中で `/one-time-offer` 画面の表示をすぐに確認できるよう、初回ペイウォール画面 (`/paywall`) の「閉じる」ボタンに、ワンタイムオファー画面 (`/one-time-offer`) へ遷移する機能を実装します。

## 目的

- UI 実装段階で、作成した画面への遷移を実際に動作させて確認できるようにする。
- 開発のフィードバックサイクルを早める。

## 依存関係

- **依存タスク**: `T5-1-3`, `T5-1-4`
- **担当領域**: ナビゲーション, UI 開発

## 実装詳細

- **ファイル**: `src/app/paywall.tsx`
- **変更点**: 「閉じる」ボタンを押した際に `router.replace('/one-time-offer')` を呼び出すようにします。

### 1. `useRouter` のインポートと使用

```tsx
// src/app/paywall.tsx
import { router } from "expo-router";
// ... 他のインポート
```

### 2. `handleClose` 関数の実装と適用

```tsx
// src/app/paywall.tsx

export default function PaywallScreen() {
  // ... 既存のコード

  const handleClose = () => {
    router.replace("/one-time-offer");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* ... StatusBarなど */}

      {/* 閉じるボタンに onPress を追加 */}
      <View style={styles.closeButton}>
        <TouchableOpacity onPress={handleClose} className="p-1">
          <X size={24} className="text-gray-400" />
        </TouchableOpacity>
      </View>

      {/* ... ScrollViewなど */}
    </SafeAreaView>
  );
}

// ... styles
```

## 実装手順

1. `paywall.tsx` を開き、`expo-router` から `router` をインポートします。
2. `PaywallScreen` コンポーネント内に `handleClose` 関数を定義し、その中で `router.replace('/one-time-offer')` を呼び出します。
3. `T5-1-3` で作成した「閉じる」ボタンの `TouchableOpacity` に `onPress={handleClose}` を追加します。

## 完了条件

- [ ] `/paywall` 画面で「閉じる」ボタンを押すと、`/one-time-offer` 画面へ遷移することを確認する。
- [ ] 画面遷移後、戻る操作をしても `/paywall` 画面に戻らないことを確認する。

## 次のタスク

- **T5-2-1**: RevenueCat SDK のインストール

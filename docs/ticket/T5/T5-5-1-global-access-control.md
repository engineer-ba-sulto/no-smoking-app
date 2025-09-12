# T5-5-1: 購入状態に基づくグローバルなアクセス制御の実装

## 概要

アプリのルートレイアウト (`src/app/_layout.tsx`) に、ユーザーの購入状態 (`isProMember`) を監視するロジックを実装します。これにより、未購入ユーザーと購入済みユーザーのそれぞれに対して、適切な画面へ自動的に振り分けるアクセス制御を実現します。

## 目的

- `PurchaseProvider` をアプリの最上位で適用する。
- `useEffect` を使用して、購入状態の変更を検知し、リダイレクト処理を実行する。
- 堅牢でシンプルなナビゲーション制御を単一のファイルで実現する。

## 依存関係

- **依存タスク**: `T5-5-0`
- **担当領域**: ナビゲーション, 状態管理

## 実装詳細

### 1. `src/app/_layout.tsx` の更新

アプリの最上位レイアウトである `_layout.tsx` を以下の内容で更新し、購入状態の監視とリダイレクト処理を一元管理します。

```tsx
import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { PurchaseProvider, usePurchases } from "@/contexts/PurchaseProvider";
import { View } from "react-native"; // SplashScreenの代わり

// PurchaseProviderでアプリ全体をラップする
export default function RootLayout() {
  return (
    <PurchaseProvider>
      <MainLayout />
    </PurchaseProvider>
  );
}

function MainLayout() {
  const { isProMember, isLoading } = usePurchases();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; // ローディング中はなにもしない
    }

    const inTabsGroup = segments[0] === "(tabs)";

    // プレミアム会員ではなく、かつメインのタブ画面グループにいる場合
    if (!isProMember && inTabsGroup) {
      router.replace("/paywall"); // ペイウォール画面にリダイレクト
    }
    // プレミアム会員で、かつメインのタブ画面グループにいない場合 (例: ペイウォール画面にいる)
    else if (isProMember && !inTabsGroup) {
      router.replace("/(tabs)"); // メイン画面にリダイレクト
    }
  }, [isLoading, isProMember, segments, router]);

  // ローディングが完了するまでスプラッシュスクリーン（または何も表示しない）
  if (isLoading) {
    return <View style={{ flex: 1 }} />; // 簡単なスプラッシュスクリーンの例
  }

  // ローディング完了後に実際の中身を表示
  return <Slot />;
}
```

### 2. コードのポイント

- **`MainLayout` コンポーネント**: `usePurchases` フックは `PurchaseProvider` のコンテキスト内でしか呼び出せないため、ロジックを別のコンポーネントに分離しています。
- **`useEffect` 内のロジック**: `isLoading` が `false` になった後、`isProMember` と現在の画面 (`segments`) を元に一度だけリダイレクト判定を行います。
  - **`!isProMember && inTabsGroup`**: 未購入ユーザーが保護された領域 (`(tabs)`) にいる場合に `/paywall` へ送ります。
  - **`isProMember && !inTabsGroup`**: 購入済みユーザーがペイウォール画面などにいる場合に `/(tabs)` へ送り返します。

## 完了条件

- [ ] `src/app/_layout.tsx` が上記コードで更新されている。
- [ ] アプリ起動時、未購入ユーザーは最終的に `/paywall` にリダイレクトされる（オンボーディングなど他の画面を経由した後）。
- [ ] 購入済みユーザー（または購入に成功したユーザー）は、常に `/(tabs)` 内の画面にアクセスできる。

## 次のタスク

- なし（課金実装のコア機能完了）

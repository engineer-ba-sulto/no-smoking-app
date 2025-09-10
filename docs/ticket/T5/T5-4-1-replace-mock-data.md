# T5-4-1: モックデータの置き換え

## 概要

`src/app/paywall.tsx` で使用している料金プランのモックデータを、`PurchaseProvider` から取得する実際のデータ (`offerings`) に置き換えます。

## 目的

- RevenueCat で設定した最新の料金プランを動的に表示する。
- データ読み込み中のローディングインジケータを表示する。

## 依存関係

- **依存タスク**: `T5-4-0`
- **担当領域**: UI 開発

## 実装詳細

- **ファイル**: `src/app/paywall.tsx`

### 1. `usePurchases` フックの利用

```tsx
import { usePurchases } from "@/contexts/PurchaseProvider";
import { ActivityIndicator, Text } from "react-native";

export default function PaywallScreen() {
  const { offerings, isLoading } = usePurchases();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!offerings) {
    return <Text>No products available.</Text>;
  }
  // ...
}
```

### 2. プラン選択エリアの動的描画

- `MOCK_PLANS` を使用していた部分を、`offerings.availablePackages` を `map` するように変更します。
- `PurchasesPackage` オブジェクトから価格 (`product.priceString`) やプラン名 (`product.title`) を表示します。

```tsx
// 変更前
// MOCK_PLANS.map(plan => ... )

// 変更後
offerings.availablePackages.map((pkg) => (
  <TouchableOpacity
    key={pkg.identifier}
    onPress={() => setSelectedPackage(pkg)}
    // ...
  >
    <Text>{pkg.product.title}</Text>
    <Text>{pkg.product.priceString}</Text>
  </TouchableOpacity>
));
```

## 実装手順

1.  `paywall.tsx` で `usePurchases` フックをインポートして呼び出します。
2.  `isLoading` の状態をハンドリングし、ローディング中は `ActivityIndicator` などを表示します。
3.  `offerings` が存在しない場合のフォールバック UI (例: "利用可能なプランがありません") を実装します。
4.  プラン選択エリアの `MOCK_PLANS.map(...)` を `offerings.availablePackages.map(...)` に置き換えます。
5.  各プランの表示内容を、`PurchasesPackage` オブジェクトのプロパティ (`product.title`, `product.priceString` など) を使うように修正します。

## 完了条件

- [ ] ローディング中はインジケータが表示される。
- [ ] RevenueCat から取得した料金プランが正しく表示される。
- [ ] モックデータ (`MOCK_PLANS`) の定義が `paywall.tsx` から削除されている。

## 次のタスク

- **T5-4-2**: 購入・復元ボタンの接続

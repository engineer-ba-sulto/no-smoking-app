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

### 1. `usePurchases` フックの利用

`paywall.tsx` 内で `usePurchases` フックを呼び出し、`offerings` と `isLoading` を取得します。

```tsx
import { usePurchases } from "@/contexts/PurchaseProvider";
import { ActivityIndicator, View, Text } from "react-native";

// ...

const { offerings, isLoading } = usePurchases();

if (isLoading) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}

if (!offerings) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>利用可能なプランがありません。</Text>
    </View>
  );
}
// ...
```

### 2. プラン表示エリアの動的描画

`MOCK_PLANS` を使用していた部分を、`offerings.availablePackages` を元に動的に描画するように変更します。`FlatList` を使うと効率的です。

```tsx
// ...
import { FlatList, TouchableOpacity } from "react-native";
import { PurchasesPackage } from "react-native-purchases";

// ...

const handleSelectPackage = (pkg: PurchasesPackage) => {
  // T5-4-2 で実装
  console.log("Selected:", pkg.product.identifier);
};

// ...

{
  offerings && (
    <FlatList
      data={offerings.availablePackages}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleSelectPackage(item)}
        >
          <Text style={styles.optionText}>
            {item.product.title} - {item.product.priceString}
          </Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.identifier}
    />
  );
}
```

## 完了条件

- [ ] ローディング中はインジケータが表示される。
- [ ] RevenueCat から取得した料金プランが正しく表示される。
- [ ] モックデータ (`MOCK_PLANS`) の定義が `paywall.tsx` から削除されている。

## 次のタスク

- **T5-4-2**: 購入・復元ボタンの接続

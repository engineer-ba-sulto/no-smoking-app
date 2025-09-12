# T5-4-2: 購入・復元ボタンの接続

## 概要

`paywall.tsx` のプラン選択ボタンと購入復元ボタンに、`PurchaseProvider` から取得した `purchasePackage` および `restorePermissions` 関数を接続します。

## 目的

- ユーザーがプランを選択してタップした際に、RevenueCat の購入フローを開始する。
- 「購入を復元」をタップした際に、購入情報の復元処理を実行し、結果をユーザーにフィードバックする。

## 依存関係

- **依存タスク**: `T5-4-1`
- **担当領域**: 課金ロジック

## 実装詳細

### 1. `usePurchases` から関数を取得

`paywall.tsx` の `usePurchases` フックから、`purchasePackage` と `restorePermissions` を追加で取得します。

```tsx
// ...
const { offerings, isLoading, purchasePackage, restorePermissions } =
  usePurchases();
// ...
```

### 2. 購入処理の実装

`T5-4-1` で作成した `handleSelectPackage` を `handlePurchase` にリネームし、`purchasePackage` を呼び出すように変更します。

```tsx
// ...
import { Alert } from "react-native";
import { PurchasesPackage } from "react-native-purchases";

// ...

const handlePurchase = async (pkg: PurchasesPackage) => {
  try {
    await purchasePackage(pkg);
    // 購入成功後の画面遷移は T5-3-2 の PurchaseProvider 内で処理される
  } catch (e) {
    // purchasePackage 内でエラーアラートが表示されるため、ここでは何もしない
  }
};

// FlatList内の onPress を更新
// onPress={() => handlePurchase(item)}
// ...
```

### 3. 復元処理の実装

購入復元ボタンのための `handleRestore` 関数を実装し、`restorePermissions` を呼び出します。
処理結果に応じてユーザーに `Alert` でフィードバックします。

```tsx
// ...
import { useRouter } from "expo-router";

// ...
const router = useRouter();

// ...

const handleRestore = async () => {
  try {
    const customerInfo = await restorePermissions();
    if (customerInfo.entitlements.active["premium"]) {
      Alert.alert("成功", "購入情報が復元されました。");
      // 復元成功後も Provider 内のリスナーが検知して自動で画面遷移する
    } else {
      Alert.alert("情報", "有効な購入情報が見つかりませんでした。");
    }
  } catch (e) {
    Alert.alert("エラー", "復元処理中にエラーが発生しました。");
  }
};

// ...

// <TouchableOpacity onPress={handleRestore}>
//   <Text style={styles.restoreText}>購入を復元</Text>
// </TouchableOpacity>
```

## 完了条件

- [ ] いずれかのプランボタンをタップすると、OS の購入画面（App Store / Google Play）が表示される。
- [ ] 「購入を復元」ボタンをタップすると、復元処理が実行され、成功・失敗に応じたアラートが表示される。
- [ ] 購入または復元に成功すると、自動的にメイン画面 (`/(tabs)`) に遷移する。

## 次のタスク

- **T5-5-0**: 画面遷移ロジックの更新

# T5-4-2: 購入・復元ボタンの接続

## 概要

`src/app/paywall.tsx` の購入ボタンと復元リンクに、`PurchaseProvider` が提供する `purchasePackage` および `restorePermissions` 関数を接続します。

## 目的

- ユーザーが選択したプランの購入処理を実行できるようにする。
- ユーザーが過去の購入情報を復元できるようにする。
- 処理中に適切な UI フィードバックを提供する。

## 依存関係

- **依存タスク**: `T5-4-1`
- **担当領域**: UI 開発

## 実装詳細

- **ファイル**: `src/app/paywall.tsx`

### 1. `usePurchases` フックから関数を取得

```tsx
// ...
export default function PaywallScreen() {
  const { purchasePackage, restorePermissions } = usePurchases();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  // ...
}
```

### 2. 購入ボタンの `onPress` ハンドラ

```tsx
const handlePurchase = async () => {
  if (!selectedPackage) return;

  setIsPurchasing(true);
  try {
    await purchasePackage(selectedPackage);
    // 成功後の画面遷移は T5-5-2 で実装
  } catch (e) {
    // エラーハンドリング
  } finally {
    setIsPurchasing(false);
  }
};

// ... in JSX
<TouchableOpacity onPress={handlePurchase} disabled={isPurchasing}>
  {/* ... */}
</TouchableOpacity>;
```

### 3. 復元リンクの `onPress` ハンドラ

```tsx
const handleRestore = async () => {
  try {
    await restorePermissions();
    alert("Permissions restored successfully!");
  } catch (e) {
    alert("Could not restore permissions.");
  }
};

// ... in JSX
<TouchableOpacity onPress={handleRestore}>
  <Text>Restore Purchases</Text>
</TouchableOpacity>;
```

## 実装手順

1.  `paywall.tsx` で `usePurchases` から `purchasePackage` と `restorePermissions` を取得します。
2.  購入処理中の状態を管理する `isPurchasing` の `useState` を追加します。
3.  購入ボタンの `onPress` で `handlePurchase` を呼び出します。この関数は以下を実装します。
    - 処理開始時に `setIsPurchasing(true)` を設定します。
    - `try...catch...finally` ブロックで `await purchasePackage(selectedPackage)` を呼び出します。
    - `try` ブロック（成功時）: Toast 通知で「購入が完了しました！」などのメッセージを表示します。
    - `catch` ブロック（失敗時）: エラーオブジェクトを判定し、「購入がキャンセルされました」または「エラーが発生しました」のように、原因に応じたメッセージを Toast 通知で表示します。
    - `finally` ブロック: `setIsPurchasing(false)` を設定します。
4.  購入ボタンに `disabled={isPurchasing}` を設定し、処理中の多重タップを防ぎます。
5.  復元リンクの `onPress` で `restorePermissions` を呼び出す `handleRestore` を実装し、成功・失敗を Toast 通知でユーザーに伝えます。

## 完了条件

- [ ] 購入ボタンを押すと、選択したプランの購入フローが開始される。
- [ ] 購入処理中はボタンが無効化される。
- [ ] 復元リンクを押すと、購入の復元処理が実行される。

## 次のタスク

- **T5-4-3**: ペイウォール画面のレスポンシブ対応

# T5-5-1: オンボーディングからペイウォールへの遷移

## 概要

オンボーディング完了後、ホーム画面 (`/(tabs)`) ではなくペイウォール画面 (`/paywall`) に遷移するようにナビゲーションを修正します。

## 目的

- 新規ユーザーに、アプリのメイン機能を利用する前に有料プランを提示する。

## 依存関係

- **依存タスク**: `T5-5-0`
- **担当領域**: ナビゲーション

## 実装詳細

- **ファイル**: `src/app/onboarding.tsx`
- **対象関数**: `completeOnboarding`

### 変更前のコード

```tsx
const completeOnboarding = async () => {
  // ... (データ保存処理)
  router.replace("/(tabs)");
};
```

### 変更後のコード

```tsx
const completeOnboarding = async () => {
  // ... (データ保存処理)
  router.replace("/paywall"); // 遷移先を変更
};
```

## 実装手順

1.  `src/app/onboarding.tsx` ファイルを開きます。
2.  `completeOnboarding` 関数を見つけます。
3.  `router.replace("/(tabs)");` の行を `router.replace("/paywall");` に変更します。

## 完了条件

- [ ] `completeOnboarding` 関数内の `router.replace` の遷移先が `/paywall` に変更されている。
- [ ] オンボーディングの最終ステップを完了すると、ペイウォール画面に遷移することを確認する。

## 次のタスク

- **T5-5-2**: ペイウォールからメインアプリへの遷移

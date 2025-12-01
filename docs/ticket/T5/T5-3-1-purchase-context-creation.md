# T5-3-1: 購入情報 Context の作成

## 概要

ユーザーの購入状態をアプリ全体で管理するための React Context (`PurchaseContext`) と、それを提供する `PurchaseProvider` コンポーネント、および Context を利用するためのカスタムフック `usePurchases` の雛形を作成します。

## 目的

- 購入状態管理の基本的な構造をセットアップする。
- アプリ全体を `PurchaseProvider` でラップし、Context が利用可能な状態にする。

## 依存関係

- **依存タスク**: `T5-3-0`
- **担当領域**: 状態管理

## 実装詳細

### 1. 作成するファイル

- **パス**: `src/contexts/PurchaseProvider.tsx`

### 2. ファイルの初期コンテンツ

```tsx
import React, { createContext, useContext, ReactNode } from "react";

// Contextで提供する値の型定義
interface PurchaseContextType {
  isProMember: boolean;
  // 他のプロパティ（offerings, purchasePackageなど）は T5-3-2 で追加
}

// Contextの作成
const PurchaseContext = createContext<PurchaseContextType | undefined>(
  undefined
);

// Providerコンポーネント
export const PurchaseProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    isProMember: false, // 初期値
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
};

// カスタムフック
export const usePurchases = () => {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error("usePurchases must be used within a PurchaseProvider");
  }
  return context;
};
```

### 3. `_layout.tsx` の更新

- アプリのルートレイアウトで `PurchaseProvider` を適用します。

- **パス**: `src/app/_layout.tsx`
- **変更箇所**: ルートコンポーネントを `PurchaseProvider` でラップします。

```tsx
// src/app/_layout.tsx

// ... (他のimport)
import { PurchaseProvider } from "@/contexts/PurchaseProvider";

export default function RootLayout() {
  // ...

  return (
    <PurchaseProvider>
      {/* ... 既存のProviderやSlotなど ... */}
    </PurchaseProvider>
  );
}
```

## 実装手順

1.  `src/contexts` ディレクトリを作成します (存在しない場合)。
2.  `src/contexts/PurchaseProvider.tsx` を作成し、上記の初期コンテンツを記述します。
3.  `src/app/_layout.tsx` を開き、ルートコンポーネントを `PurchaseProvider` でラップします。

## 完了条件

- [ ] `src/contexts/PurchaseProvider.tsx` が作成され、雛形が記述されている。
- [ ] `src/app/_layout.tsx` で `PurchaseProvider` が適用されている。
- [ ] アプリがエラーなく起動する。

## 次のタスク

- **T5-3-2**: PurchaseProvider の実装

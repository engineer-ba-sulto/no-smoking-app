import React, { createContext, ReactNode, useContext } from "react";

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

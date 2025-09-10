# T5-3-2: PurchaseProvider の実装

## 概要

`PurchaseProvider` 内に、RevenueCat SDK と連携し、購入情報を管理するための具体的なロジックを実装します。

## 目的

- アプリ起動時に RevenueCat SDK を初期化する。
- ユーザーの購入状態をリアルタイムで取得・監視し、Context の値を更新する。
- 購入処理や復元処理を実行する関数を実装し、Context を通じて提供する。

## 依存関係

- **依存タスク**: `T5-3-1`
- **担当領域**: 状態管理, 課金ロジック

## 実装詳細

### 1. `src/contexts/PurchaseProvider.tsx` の完全なコード

- `T5-3-1` で作成した `PurchaseProvider.tsx` を、以下の完全なコードで置き換えてください。
- `EXPO_PUBLIC_REVENUECAT_API_KEY` は、ご自身の RevenueCat の Public API Key に置き換えるか、`.env` ファイルに設定してください。

```tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";
import { Platform } from "react-native";
import { router } from "expo-router";

// .envファイルを作成し、キーを設定してください
// EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=...
// EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=...
const API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS,
  android: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID,
};

interface PurchaseContextType {
  isProMember: boolean;
  offerings: PurchasesOffering | null;
  isLoading: boolean;
  purchasePackage: (pkg: PurchasesPackage) => Promise<void>;
  restorePermissions: () => Promise<CustomerInfo>;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(
  undefined
);

export const PurchaseProvider = ({ children }: { children: ReactNode }) => {
  const [isProMember, setProMember] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setup = async () => {
      const apiKey = Platform.OS === "ios" ? API_KEYS.ios : API_KEYS.android;
      if (!apiKey) {
        console.error("RevenueCat API key not found!");
        setIsLoading(false);
        return;
      }

      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      Purchases.configure({ apiKey });

      const handleCustomerInfoUpdate = (customerInfo: CustomerInfo) => {
        console.log("Customer info updated:", customerInfo);
        const isPro = customerInfo.entitlements.active["premium"] !== undefined;
        setProMember(isPro);

        // T5-5-2: 購入成功後に自動で遷移するロジック
        if (isPro) {
          router.replace("/(tabs)");
        }
      };

      Purchases.addCustomerInfoUpdateListener(handleCustomerInfoUpdate);

      try {
        const offerings = await Purchases.getOfferings();
        setOfferings(offerings.current);

        const customerInfo = await Purchases.getCustomerInfo();
        handleCustomerInfoUpdate(customerInfo);
      } catch (error) {
        console.error("Error setting up RevenueCat:", error);
      } finally {
        setIsLoading(false);
      }
    };
    setup();
  }, []);

  const purchasePackage = async (pkg: PurchasesPackage) => {
    try {
      await Purchases.purchasePackage(pkg);
    } catch (e: any) {
      if (!e.userCancelled) {
        console.error("Purchase error:", e);
        alert("購入処理中にエラーが発生しました。");
      }
    }
  };

  const restorePermissions = async () => {
    return await Purchases.restorePurchases();
  };

  const value = {
    isProMember,
    offerings,
    isLoading,
    purchasePackage,
    restorePermissions,
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchases = () => {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error("usePurchases must be used within a PurchaseProvider");
  }
  return context;
};
```

## 実装手順

1.  `.env` ファイルをプロジェクトルートに作成し、RevenueCat から取得した iOS と Android の Public API Key を設定します。
2.  `src/contexts/PurchaseProvider.tsx` の内容を、上記のコードで完全に置き換えます。
3.  アプリを再起動し、デバッグログに RevenueCat の初期化メッセージや顧客情報が表示されることを確認します。

## 完了条件

- [ ] アプリ起動時に RevenueCat SDK が初期化される。
- [ ] `offerings` が RevenueCat から取得され、Context で提供される。
- [ ] ユーザーの購入状態 (`isProMember`) が正しく判定され、Context で提供される。
- [ ] 購入・復元を実行するための関数が実装されている。
- [ ] 購入に成功すると、自動的にメイン画面 (`/(tabs)`) に遷移する。

## 次のタスク

- **T5-4-0**: ペイウォール画面と購入ロジックの連携

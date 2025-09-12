import { router } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";

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
      try {
        // 開発環境での条件分岐
        if (__DEV__) {
          console.log("Development mode: RevenueCat setup skipped");
          setIsLoading(false);
          return;
        }

        const apiKey = Platform.OS === "ios" ? API_KEYS.ios : API_KEYS.android;
        if (!apiKey) {
          console.warn(
            `RevenueCat API key not found for platform: ${Platform.OS}`
          );
          setIsLoading(false);
          return;
        }

        console.log(`Initializing RevenueCat for platform: ${Platform.OS}`);

        // RevenueCatの初期化処理を安全に実行
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        await Purchases.configure({ apiKey });

        const handleCustomerInfoUpdate = (customerInfo: CustomerInfo) => {
          console.log("Customer info updated:", customerInfo);
          const isPro =
            customerInfo.entitlements.active["premium"] !== undefined;
          setProMember(isPro);

          // T5-5-2: 購入成功後に自動で遷移するロジック
          if (isPro) {
            router.replace("/(tabs)");
          }
        };

        Purchases.addCustomerInfoUpdateListener(handleCustomerInfoUpdate);

        // オファリングとカスタマー情報の取得
        const offerings = await Purchases.getOfferings();
        setOfferings(offerings.current);

        const customerInfo = await Purchases.getCustomerInfo();
        handleCustomerInfoUpdate(customerInfo);

        console.log("RevenueCat setup completed successfully");
      } catch (error) {
        console.error("Error setting up RevenueCat:", error);
        // エラーが発生してもアプリは継続動作
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

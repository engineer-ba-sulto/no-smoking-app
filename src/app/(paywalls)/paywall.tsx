import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Purchases, {
  PurchasesError,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";
import { SafeAreaView } from "react-native-safe-area-context";
import PackageCard from "../../components/PackageCard";
import PaywallFooterLinks from "../../components/PaywallFooterLinks";
import PurchaseButton from "../../components/PurchaseButton";
import { purchasePackageSafely } from "../../utils/revenuecat";
import { checkSubscriptionStatus } from "../../utils/subscription-check";

// 表示するパッケージIDのリスト（順序通りに表示される）
const PACKAGE_IDS = ["$rc_annual", "$rc_trial", "$rc_weekly"];

export default function PaywallScreen() {
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);
  useEffect(() => {
    checkSubscriptionStatus(getOfferings);
  }, []);

  async function getOfferings() {
    try {
      setIsLoading(true);
      setError(null);
      setLoadingMessage("RevenueCatからプラン情報を取得中...");
      const offerings = await Purchases.getOfferings();
      setLoadingMessage("プランパッケージを読み込み中...");
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        setOfferings(offerings);
        // 年額プラン（$rc_annual）を初期選択状態にする
        const annualPackage = offerings.current.availablePackages.find(
          (pkg) => pkg.identifier === "$rc_annual"
        );
        if (annualPackage) {
          setSelectedPackage(annualPackage);
        }
      } else {
        setError(
          new Error(
            "利用可能なプランが見つかりませんでした。RevenueCatの設定を確認してください。"
          )
        );
      }
    } catch (err) {
      let errorDetails = "プランの読み込み中にエラーが発生しました。";

      if (err instanceof Error) {
        errorDetails = err.message;

        // PurchasesErrorの場合は詳細情報を追加
        if ("code" in err && "message" in err) {
          const purchasesErr = err as unknown as PurchasesError;
          errorDetails = `エラーコード: ${purchasesErr.code}\nメッセージ: ${
            purchasesErr.message
          }\n詳細: ${JSON.stringify(purchasesErr, null, 2)}`;
        }
      }

      setError(new Error(errorDetails));
      console.error("プラン取得エラー:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    router.dismissAll();
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      return;
    }

    setIsPurchasing(true);

    try {
      const result = await purchasePackageSafely(selectedPackage);

      // キャンセル時は何もしない
      if (!result) {
        return;
      }

      // 購入成功時の処理
      console.log("購入成功:", result.customerInfo);
      router.replace("/(tabs)");
    } catch (error) {
      // その他のエラー
      console.error("購入エラー:", error);
      alert("購入処理中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setIsPurchasing(false);
    }
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar style="dark" />
        <View className="flex-1 justify-center items-center px-6">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-600 mt-4 text-center font-semibold">
            プランを読み込み中...
          </Text>
          {loadingMessage && (
            <Text className="text-gray-500 mt-2 text-sm text-center">
              {loadingMessage}
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // エラー表示
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar style="dark" />
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-red-500 text-xl font-bold mb-4 text-center">
            エラーが発生しました
          </Text>
          <ScrollView className="w-full max-h-96">
            <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <Text className="text-red-800 font-semibold mb-2">
                エラーメッセージ:
              </Text>
              <Text className="text-red-700 text-sm mb-4">{error.message}</Text>
              {error.stack && (
                <>
                  <Text className="text-red-800 font-semibold mb-2">
                    スタックトレース:
                  </Text>
                  <Text className="text-red-600 text-xs font-mono">
                    {error.stack}
                  </Text>
                </>
              )}
            </View>
          </ScrollView>
          <View className="flex-row space-x-4 mt-4">
            <TouchableOpacity
              onPress={() => {
                setError(null);
                getOfferings();
              }}
              className="bg-emerald-500 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-bold">再試行</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleClose}
              className="bg-gray-500 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-bold">閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // オファリングが利用できない場合の表示
  if (!offerings) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar style="dark" />
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-gray-600 text-center">
            利用可能なプランがありません。
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            className="mt-4 bg-emerald-500 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">閉じる</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="p-6 items-center">
          <Text className="text-3xl font-extrabold text-gray-800">
            全ての機能へ
          </Text>
          <Text className="text-3xl font-extrabold text-emerald-500">
            プレミアムプラン
          </Text>
        </View>

        <View className="px-6">
          {offerings.current?.availablePackages
            .filter((pkg) => PACKAGE_IDS.includes(pkg.identifier))
            .map((pkg) => (
              <PackageCard
                key={pkg.identifier}
                pkg={pkg}
                isSelected={selectedPackage?.identifier === pkg.identifier}
                onSelect={(selectedPkg) => {
                  setSelectedPackage(selectedPkg);
                }}
              />
            ))}
        </View>
      </ScrollView>

      <View
        className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${
          Platform.OS === "ios" ? "pb-8" : "pb-4"
        }`}
      >
        {/* 自動更新についての説明 */}
        {selectedPackage?.identifier === "$rc_trial" && (
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <Text className="text-blue-900 font-bold text-sm mb-2 text-center">
              自動更新について
            </Text>
            <Text className="text-blue-800 text-xs text-center leading-5">
              7日間の無料トライアル終了後、自動的に年額プラン（
              {selectedPackage.product.priceString}
              ）が請求されます。トライアル期間中にキャンセルしない限り、自動的に課金されます。
            </Text>
          </View>
        )}
        {selectedPackage?.identifier === "$rc_annual" && (
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <Text className="text-blue-900 font-bold text-sm mb-2 text-center">
              自動更新について
            </Text>
            <Text className="text-blue-800 text-xs text-center leading-5">
              このサブスクリプションは自動的に更新されます。期間終了前にキャンセルしない限り、自動的に次の期間分の料金が請求されます。
            </Text>
          </View>
        )}
        {selectedPackage?.identifier === "$rc_weekly" && (
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <Text className="text-blue-900 font-bold text-sm mb-2 text-center">
              自動更新について
            </Text>
            <Text className="text-blue-800 text-xs text-center leading-5">
              このサブスクリプションは自動的に更新されます。期間終了前にキャンセルしない限り、自動的に次の期間分の料金が請求されます。
            </Text>
          </View>
        )}

        <PurchaseButton
          onPress={handlePurchase}
          isLoading={isPurchasing}
          disabled={!selectedPackage}
          text={
            selectedPackage?.identifier === "$rc_trial"
              ? "7日間の無料トライアルを開始"
              : selectedPackage?.identifier === "$rc_annual"
              ? "最安値でゲットする"
              : "開始"
          }
        />

        <PaywallFooterLinks />
      </View>
    </SafeAreaView>
  );
}

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Purchases, { PurchasesPackage } from "react-native-purchases";
import { SafeAreaView } from "react-native-safe-area-context";
import { purchasePackageSafely } from "../../lib/revenuecat";

export default function OneTimeOfferScreen() {
  const [annualPackage, setAnnualPackage] = useState<PurchasesPackage | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    getOfferings();
  }, []);

  async function getOfferings() {
    try {
      const offerings = await Purchases.getOfferings();
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        // $rc_annualパッケージのみを取得
        const annual = offerings.current.availablePackages.find(
          (pkg) => pkg.identifier === "$rc_annual"
        );
        if (annual) {
          setAnnualPackage(annual);
        }
      }
    } catch (error) {
      console.error("オファリング取得エラー:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    router.dismissAll();
  };

  const handlePurchase = async () => {
    if (!annualPackage) {
      return;
    }

    setIsPurchasing(true);

    try {
      const result = await purchasePackageSafely(annualPackage);

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
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-600 mt-4">プランを読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // パッケージが利用できない場合の表示
  if (!annualPackage) {
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
    <SafeAreaView className="flex-1 bg-gray-50 text-white">
      <StatusBar style="dark" />

      {/* 閉じるボタン */}
      <View style={styles.closeButton}>
        <TouchableOpacity onPress={handleClose} className="p-1">
          <X size={24} className="text-gray-400" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center p-6">
        <View className="bg-emerald-500 px-4 py-1 rounded-full mb-4">
          <Text className="text-white font-bold text-sm">
            一度きりのオファー
          </Text>
        </View>

        <Text className="text-gray-800 text-3xl font-extrabold text-center mb-2">
          お見逃しなく！
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          このオファーは二度と表示されません。
        </Text>

        <View className="w-full bg-white rounded-2xl p-8 items-center border border-emerald-500 shadow-lg shadow-emerald-200">
          <Text className="text-gray-800 text-lg font-semibold">
            {annualPackage.product.title}
          </Text>
          <View className="flex-row items-baseline my-4">
            <Text className="text-gray-800 text-5xl font-extrabold">
              {annualPackage.product.priceString}
            </Text>
          </View>
          <Text className="text-gray-600 font-medium mb-6">
            {annualPackage.product.description || "年額プラン"}
          </Text>

          <View className="bg-emerald-500 px-4 py-1 rounded-full">
            <Text className="text-white font-bold text-sm">70%割引</Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-emerald-500 w-full rounded-xl py-4 items-center mt-8 shadow-lg shadow-emerald-200"
          onPress={handlePurchase}
          disabled={isPurchasing}
          style={{ opacity: isPurchasing ? 0.6 : 1 }}
        >
          {isPurchasing ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white text-lg font-bold">
              最安値でゲットする
            </Text>
          )}
        </TouchableOpacity>

        <Text className="text-gray-500 text-xs text-center mt-4">
          縛りなし、いつでもキャンセル可能です。
        </Text>
      </View>

      <View
        className={`px-6 ${
          Platform.OS === "ios" ? "pb-8" : "pb-4"
        } items-center`}
      >
        <Text className="text-xs text-gray-500">史上最安値。</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 20 : 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CheckCircle2, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Purchases, {
  PURCHASES_ERROR_CODE,
  PurchasesError,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_FEATURES = [
  "全ての機能への無制限アクセス",
  "広告の非表示",
  "専門家によるサポート",
  "限定コンテンツの利用",
];

// 表示するパッケージIDのリスト
const PACKAGE_IDS = ["$rc_trial", "$rc_weekly"];

export default function PaywallScreen() {
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);

  useEffect(() => {
    getOfferings();
  }, []);

  async function getOfferings() {
    const offerings = await Purchases.getOfferings();
    if (
      offerings.current !== null &&
      offerings.current.availablePackages.length !== 0
    ) {
      setOfferings(offerings);
      // 年額プランを初期選択状態にする
      const annualPackage = offerings.current.availablePackages.find(
        (pkg) => pkg.identifier === "$rc_trial"
      );
      if (annualPackage) {
        setSelectedPackage(annualPackage);
      }
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    router.push("/one-time-offer");
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      return;
    }

    setIsPurchasing(true);

    try {
      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);

      // 購入成功時の処理
      console.log("購入成功:", customerInfo);

      // 購入完了後、メインアプリに遷移
      router.replace("/(tabs)");
    } catch (error) {
      const purchasesError = error as PurchasesError;

      // ユーザーがキャンセルした場合はエラーを表示しない
      if (
        purchasesError.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
      ) {
        console.log("購入がキャンセルされました");
        return;
      }

      // その他のエラー
      console.error("購入エラー:", purchasesError);
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

  const PackageOption = ({
    pkg,
    isSelected,
    onSelect,
  }: {
    pkg: PurchasesPackage;
    isSelected: boolean;
    onSelect: (pkg: PurchasesPackage) => void;
  }) => (
    <TouchableOpacity
      onPress={() => onSelect(pkg)}
      className={`border-2 rounded-xl p-4 mb-4 flex-row justify-between items-center relative ${
        isSelected
          ? "border-emerald-500 bg-emerald-50"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* 年間プランの場合はバッジを表示 */}
      {pkg.identifier === "$rc_trial" && (
        <View className="absolute -top-3 right-4 bg-emerald-500 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">70% OFF!</Text>
        </View>
      )}
      <View>
        <Text className="text-lg font-bold text-gray-800">
          {pkg.product.title}
        </Text>
        <Text className="text-sm text-gray-500">
          {pkg.identifier === "$rc_trial"
            ? "最初の7日間は無料"
            : "いつでもキャンセル可能"}
        </Text>
      </View>
      <Text className="text-lg font-bold text-gray-800">
        {pkg.product.priceString}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* 閉じるボタンを追加 */}
      <View style={styles.closeButton}>
        <TouchableOpacity onPress={handleClose} className="p-1">
          <X size={24} className="text-gray-400" />
        </TouchableOpacity>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="p-6 pt-16 items-center">
          <Text className="text-3xl font-extrabold text-gray-800">
            全ての機能へ
          </Text>
          <Text className="text-3xl font-extrabold text-emerald-500">
            無制限アクセス
          </Text>
        </View>

        <View className="px-6 space-y-3 mb-8">
          {MOCK_FEATURES.map((feature, index) => (
            <View key={index} className="flex-row items-center">
              <CheckCircle2 size={22} className="text-emerald-500" />
              <Text className="text-base text-gray-700 ml-3">{feature}</Text>
            </View>
          ))}
        </View>

        <View className="px-6">
          {offerings.current?.availablePackages
            .filter((pkg) => PACKAGE_IDS.includes(pkg.identifier))
            .map((pkg) => (
              <PackageOption
                key={pkg.identifier}
                pkg={pkg}
                isSelected={selectedPackage?.identifier === pkg.identifier}
                onSelect={() => {
                  setSelectedPackage(pkg);
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
        <TouchableOpacity
          className="bg-emerald-500 rounded-xl py-4 items-center shadow-lg shadow-emerald-200"
          onPress={handlePurchase}
          disabled={isPurchasing || !selectedPackage}
          style={{ opacity: isPurchasing || !selectedPackage ? 0.6 : 1 }}
        >
          {isPurchasing ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white text-lg font-bold">
              {selectedPackage?.identifier === "$rc_trial"
                ? "7日間の無料トライアルを開始"
                : "開始"}
            </Text>
          )}
        </TouchableOpacity>
        <Text className="text-xs text-gray-500 text-center mt-3 font-medium">
          今すぐのお支払いは不要です。いつでもキャンセル可能です。
        </Text>
        <View className="flex-row justify-center space-x-4 mt-3">
          <Text className="text-xs text-gray-500">利用規約</Text>
          <Text className="text-xs text-gray-500">プライバシーポリシー</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text className="text-xs text-gray-500">復元</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// StyleSheetを追加
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

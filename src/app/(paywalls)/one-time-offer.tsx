import CloseButton from "@/components/CloseButton";
import PackageCard from "@/components/PackageCard";
import PaywallFooterLinks from "@/components/PaywallFooterLinks";
import PurchaseButton from "@/components/PurchaseButton";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Purchases, { PurchasesPackage } from "react-native-purchases";
import { SafeAreaView } from "react-native-safe-area-context";
import { markOneTimeOfferAsDismissed } from "../../utils/one-time-offer-storage";
import { purchasePackageSafely } from "../../utils/revenuecat";
import { checkSubscriptionStatus } from "../../utils/subscription-check";

export default function OneTimeOfferScreen() {
  const [annualPackage, setAnnualPackage] = useState<PurchasesPackage | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    checkSubscriptionStatus(getOfferings);
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
    Alert.alert(
      "このオファーを閉じますか？",
      "このオファーは一度閉じると、もう開くことができません。本当に閉じますか？",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "閉じる",
          style: "destructive",
          onPress: async () => {
            // 閉じたことを記録
            await markOneTimeOfferAsDismissed();
            router.dismissAll();
          },
        },
      ]
    );
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
      // 購入成功時も、ワンタイムオファーを閉じたことを記録
      // （次回以降表示されないようにする）
      await markOneTimeOfferAsDismissed();
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
      <CloseButton onPress={handleClose} />

      <View className="flex-1 justify-center items-center p-6">
        <View className="bg-emerald-500 px-4 py-1 rounded-full mb-4">
          <Text className="text-white font-bold text-lg">
            一度きりのオファー
          </Text>
        </View>

        <Text className="text-gray-800 text-3xl font-extrabold text-center mb-8">
          閉じたら、もう表示されません！
        </Text>

        <PackageCard pkg={annualPackage} isSelected={true} />

        <PurchaseButton
          onPress={handlePurchase}
          isLoading={isPurchasing}
          text="最安値でゲットする"
          className="w-full mt-8"
        />

        <PaywallFooterLinks />
      </View>
    </SafeAreaView>
  );
}

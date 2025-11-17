import { usePurchases } from "@/contexts/PurchaseProvider";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CheckCircle2, X } from "lucide-react-native";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PurchasesPackage } from "react-native-purchases";
import { SafeAreaView } from "react-native-safe-area-context";

const SIMPLIFIED_FEATURES = [
  "広告の非表示",
  "より快適な禁煙体験",
  "追加のサポート機能",
];

export default function PaywallSimplifiedScreen() {
  const { offerings, isLoading, purchasePackage, restorePermissions } =
    usePurchases();
  const { forceShow } = useLocalSearchParams<{ forceShow?: string }>();

  // ペイフォールの表示制御
  // forceShowパラメータがある場合は強制的に表示
  // それ以外は省略版オンボーディング用として表示
  const showPaywall = forceShow === "true" || true; // 省略版用なので常に表示

  const handleClose = () => {
    // 省略版ペイウォールは直接メイン画面に遷移
    router.replace("/(tabs)");
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    try {
      await purchasePackage(pkg);
      // 購入成功後の画面遷移は T5-3-2 の PurchaseProvider 内で処理される
    } catch (e) {
      // purchasePackage 内でエラーアラートが表示されるため、ここでは何もしない
    }
  };

  const handleRestore = async () => {
    try {
      const customerInfo = await restorePermissions();
      if (customerInfo.entitlements.active["premium"]) {
        Alert.alert("成功", "購入情報が復元されました。");
        // 復元成功後も Provider 内のリスナーが検知して自動で画面遷移する
      } else {
        Alert.alert("情報", "有効な購入情報が見つかりませんでした。");
      }
    } catch (e) {
      Alert.alert("エラー", "復元処理中にエラーが発生しました。");
    }
  };

  // ペイフォールが非表示の場合は直接メイン画面に遷移
  useEffect(() => {
    if (!showPaywall) {
      router.replace("/(tabs)");
    }
  }, [showPaywall]);

  // ペイフォールが非表示の場合は何も表示しない
  if (!showPaywall) {
    return null;
  }

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

  // 最初の利用可能なパッケージを自動選択
  const selectedPackage = offerings?.availablePackages[0] || null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* 閉じるボタン */}
      <View style={styles.closeButton}>
        <TouchableOpacity onPress={handleClose} className="p-1">
          <X size={24} className="text-gray-400" />
        </TouchableOpacity>
      </View>

      {/* メインコンテンツ */}
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-8">
          <Text className="text-3xl font-extrabold text-gray-800 text-center">
            広告を非表示に
          </Text>
          <Text className="text-3xl font-extrabold text-emerald-500 text-center">
            して快適に
          </Text>
        </View>

        {/* 機能一覧 */}
        <View className="space-y-4 mb-8">
          {SIMPLIFIED_FEATURES.map((feature, index) => (
            <View key={index} className="flex-row items-center">
              <CheckCircle2 size={22} className="text-emerald-500" />
              <Text className="text-base text-gray-700 ml-3">{feature}</Text>
            </View>
          ))}
        </View>

        {/* 価格表示 */}
        {selectedPackage && (
          <View className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
            <Text className="text-lg font-bold text-gray-800 text-center mb-2">
              {selectedPackage.product.title}
            </Text>
            <Text className="text-3xl font-bold text-emerald-500 text-center">
              {selectedPackage.product.priceString}
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-2">
              {selectedPackage.packageType === "ANNUAL"
                ? "最初の7日間は無料"
                : "いつでもキャンセル可能"}
            </Text>
          </View>
        )}
      </View>

      {/* ボタンエリア */}
      <View
        className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${
          Platform.OS === "ios" ? "pb-8" : "pb-4"
        }`}
      >
        <TouchableOpacity
          className="bg-emerald-500 rounded-xl py-4 items-center shadow-lg shadow-emerald-200 mb-3"
          onPress={() => selectedPackage && handlePurchase(selectedPackage)}
        >
          <Text className="text-white text-lg font-bold">
            7日間の無料トライアルを開始
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-200 rounded-xl py-3 items-center mb-3"
          onPress={handleClose}
        >
          <Text className="text-gray-700 text-base font-medium">
            今はスキップ
          </Text>
        </TouchableOpacity>

        <Text className="text-xs text-gray-500 text-center mb-3 font-medium">
          今すぐのお支払いは不要です。いつでもキャンセル可能です。
        </Text>

        <View className="flex-row justify-center space-x-4">
          <Text className="text-xs text-gray-500">利用規約</Text>
          <Text className="text-xs text-gray-500">プライバシーポリシー</Text>
          <TouchableOpacity onPress={handleRestore}>
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

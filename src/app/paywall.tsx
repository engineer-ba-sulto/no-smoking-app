import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CheckCircle2, X } from "lucide-react-native";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_FEATURES = [
  "全ての機能への無制限アクセス",
  "広告の非表示",
  "専門家によるサポート",
  "限定コンテンツの利用",
];

const MOCK_PLANS = [
  {
    id: "annual",
    name: "年間プラン",
    price: "¥96/週",
    description: "最初の7日間は無料",
    badge: "88% OFF!",
    isBest: true,
  },
  {
    id: "weekly",
    name: "週額プラン",
    price: "¥800/週",
    description: "いつでもキャンセル可能",
    badge: null,
    isBest: false,
  },
];

type Plan = (typeof MOCK_PLANS)[0];

export default function PaywallScreen() {
  // 年間プランをデフォルトで選択状態にする
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(MOCK_PLANS[0]);

  const handleClose = () => {
    router.push("/one-time-offer");
  };

  const PlanOption = ({
    plan,
    isSelected,
    onSelect,
  }: {
    plan: Plan;
    isSelected: boolean;
    onSelect: (plan: Plan) => void;
  }) => (
    <TouchableOpacity
      onPress={() => onSelect(plan)}
      className={`border-2 rounded-xl p-4 mb-4 flex-row justify-between items-center relative ${
        isSelected
          ? "border-emerald-500 bg-emerald-50"
          : "border-gray-200 bg-white"
      }`}
    >
      {plan.badge && (
        <View className="absolute -top-3 right-4 bg-emerald-500 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">{plan.badge}</Text>
        </View>
      )}
      <View>
        <Text className="text-lg font-bold text-gray-800">{plan.name}</Text>
        <Text className="text-sm text-gray-500">{plan.description}</Text>
      </View>
      <Text className="text-lg font-bold text-gray-800">{plan.price}</Text>
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
          {MOCK_PLANS.map((plan) => (
            <PlanOption
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan?.id === plan.id}
              onSelect={setSelectedPlan}
            />
          ))}
        </View>
      </ScrollView>

      <View
        className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${
          Platform.OS === "ios" ? "pb-8" : "pb-4"
        }`}
      >
        <TouchableOpacity className="bg-emerald-500 rounded-xl py-4 items-center shadow-lg shadow-emerald-200">
          <Text className="text-white text-lg font-bold">
            7日間の無料トライアルを開始
          </Text>
        </TouchableOpacity>
        <Text className="text-xs text-gray-500 text-center mt-3 font-medium">
          今すぐのお支払いは不要です。いつでもキャンセル可能です。
        </Text>
        <View className="flex-row justify-center space-x-4 mt-3">
          <Text className="text-xs text-gray-500">利用規約</Text>
          <Text className="text-xs text-gray-500">プライバシーポリシー</Text>
          <Text className="text-xs text-gray-500">復元</Text>
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

# T5-1-2: UI コンポーネントの実装

## 概要

`src/app/paywall.tsx` に、新しいオファー戦略に基づいた UI コンポーネントを実装します。表示するデータはモックデータを使用します。

## 目的

- 新しいオファー戦略（価格アンカリング、無料トライアル）を反映した静的な UI を完成させる。
- ユーザーに年額プランのお得感を視覚的に伝え、トライアル開始を促す。

## 依存関係

- **依存タスク**: `T5-1-1`
- **担当領域**: UI 開発

## 実装詳細

### 1. `paywall.tsx` の完全なコード

- 以下のコードを `src/app/paywall.tsx` にコピー＆ペーストしてください。
- このコードは、週額プランを「おとり」として年額プランを魅力的に見せる「価格アンカリング」戦略を反映しています。

```tsx
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { CheckCircle2 } from "lucide-react-native";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

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
          ? "border-orange-500 bg-orange-50"
          : "border-gray-200 bg-white"
      }`}
    >
      {plan.badge && (
        <View className="absolute -top-3 right-4 bg-orange-500 px-3 py-1 rounded-full">
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
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="p-6 pt-16 items-center">
          <Text className="text-3xl font-extrabold text-gray-800">
            全ての機能へ
          </Text>
          <Text className="text-3xl font-extrabold text-orange-500">
            無制限アクセス
          </Text>
        </View>

        <View className="px-6 space-y-3 mb-8">
          {MOCK_FEATURES.map((feature, index) => (
            <View key={index} className="flex-row items-center">
              <CheckCircle2 size={22} className="text-orange-500" />
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
        <TouchableOpacity className="bg-orange-500 rounded-xl py-4 items-center shadow-lg shadow-orange-200">
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
```

## 実装手順

1. `src/app/paywall.tsx` の内容を、上記のコードで完全に置き換えます。
2. `bun start --dev-client` で開発サーバーを起動し、シミュレータや実機でペイウォール画面が表示されることを確認します。
3. 年間プランがデフォルトで選択されており、「88% OFF!」のバッジが表示されていることを確認します。
4. 週額プランをタップして、選択状態が切り替わることを確認します。
5. ボタンとフッターの文言が戦略通りになっていることを確認します。

## 完了条件

- [ ] 年間プランと週額プランが表示され、価格アンカリングが反映されている。
- [ ] 年間プランに「88% OFF!」バッジが表示されている。
- [ ] デフォルトで年間プランが選択されている。
- [ ] ボタンのテキストが「7 日間の無料トライアルを開始」となっている。
- [ ] フッターに「今すぐのお支払いは不要です」の記載がある。

## 次のタスク

- **T5-1-3**: 閉じるボタンの実装

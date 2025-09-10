# T5-1-2: UI コンポーネントの実装

## 概要

`src/app/paywall.tsx` に、計画書と参考画像に基づいた UI コンポーネントを実装します。この時点では、表示するデータはすべてモックデータ（ハードコードされた値）を使用します。

## 目的

- ペイウォール画面の静的な UI を完成させる。
- デザイン仕様に沿ったコンポーネントの配置とスタイリングを行う。

## 依存関係

- **依存タスク**: `T5-1-1`
- **担当領域**: UI 開発

## 実装詳細

### 1. `paywall.tsx` の完全なコード

- 以下のコードを `src/app/paywall.tsx` にコピー＆ペーストしてください。
- `lucide-react-native` から `CheckCircle2` アイコンを使用します。

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
    id: "trial",
    name: "3日間無料トライアル",
    price: "無料",
    description: "その後 ¥980/週",
    popular: false,
    best: false,
  },
  {
    id: "annual",
    name: "年間プラン",
    price: "¥5,800",
    description: "初年度50% OFF",
    popular: false,
    best: true,
  },
  {
    id: "monthly",
    name: "月間プラン",
    price: "¥580",
    description: "初月72% OFF",
    popular: true,
    best: false,
  },
];

type Plan = (typeof MOCK_PLANS)[0];

export default function PaywallScreen() {
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
      className={`border-2 rounded-xl p-4 mb-4 flex-row justify-between items-center ${
        isSelected
          ? "border-orange-500 bg-orange-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <View>
        <View className="flex-row items-center">
          <Text className="text-lg font-bold text-gray-800">{plan.name}</Text>
          {plan.best && (
            <Text className="text-xs font-bold text-white bg-orange-500 px-2 py-1 rounded-full ml-2">
              BEST OFFER
            </Text>
          )}
          {plan.popular && (
            <Text className="text-xs font-bold text-white bg-blue-500 px-2 py-1 rounded-full ml-2">
              MOST POPULAR
            </Text>
          )}
        </View>
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
        <View className="p-6 pt-12 items-center">
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
        <TouchableOpacity className="bg-orange-500 rounded-xl py-4 items-center">
          <Text className="text-white text-lg font-bold">
            {selectedPlan?.id === "trial" ? "無料トライアルを開始" : "登録する"}
          </Text>
        </TouchableOpacity>
        <Text className="text-xs text-gray-400 text-center mt-4">
          お支払いはいつでもキャンセルできます。
        </Text>
        <View className="flex-row justify-center space-x-4 mt-2">
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
3. 各プランをタップして、選択状態のスタイルが変更されることを確認します。

## 完了条件

- [ ] ヘッダーが表示されている。
- [ ] 機能リストがモックデータに基づいて表示されている。
- [ ] 料金プラン選択エリアがモックデータに基づいて表示され、プランを選択できる。
- [ ] 購入ボタンが表示されている。
- [ ] フッターが表示されている。
- [ ] 全体的なスタイリングが適用されている。

## 次のタスク

- **T5-1-3**: 閉じるボタンの遅延表示

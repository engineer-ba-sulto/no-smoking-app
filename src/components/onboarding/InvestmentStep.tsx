import { LinearGradient } from "expo-linear-gradient";
import { TrendingUp } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface InvestmentStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const InvestmentStep = ({
  onNext,
  animatedStyle,
}: InvestmentStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <View className="mb-8">
      <LinearGradient
        colors={["#10B981", "#059669"]}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TrendingUp size={40} color="#ffffff" strokeWidth={2} />
      </LinearGradient>
    </View>
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      投資・資産形成
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      そのお金でできる投資・資産形成
    </Text>
    <View className="w-full mb-4">
      <View className="bg-green-50 rounded-xl p-2 mb-2 border border-green-200">
        <Text className="text-sm font-semibold text-green-800 mb-1">
          📈 投資信託
        </Text>
        <Text className="text-xs text-green-700">
          年間219,000円の積立投資・10年で約300万円・20年で約700万円
        </Text>
      </View>
      <View className="bg-green-50 rounded-xl p-2 mb-2 border border-green-200">
        <Text className="text-sm font-semibold text-green-800 mb-1">
          🏦 定期預金
        </Text>
        <Text className="text-xs text-green-700">
          年間219,000円の定期預金・10年で約220万円・安全な資産形成
        </Text>
      </View>
      <View className="bg-green-50 rounded-xl p-2 mb-2 border border-green-200">
        <Text className="text-sm font-semibold text-green-800 mb-1">
          💰 将来のための貯蓄
        </Text>
        <Text className="text-xs text-green-700">
          老後資金の準備・子供の教育費・住宅購入資金
        </Text>
      </View>
      <View className="bg-green-50 rounded-xl p-2 border border-green-200">
        <Text className="text-sm font-semibold text-green-800 mb-1">
          🎯 複利効果
        </Text>
        <Text className="text-xs text-green-700">
          時間を味方につける・雪だるま式に資産増加・将来の経済的自由
        </Text>
      </View>
    </View>
    <Text className="text-lg font-semibold text-gray-800 text-center">
      そのお金でできる投資・資産形成 📈
    </Text>
  </OnboardingStepWrapper>
);

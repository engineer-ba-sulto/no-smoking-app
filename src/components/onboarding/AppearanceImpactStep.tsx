import { LinearGradient } from "expo-linear-gradient";
import { Smile } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface AppearanceImpactStepProps {
  onNext: () => void;
  animatedStyle: any;
}

export const AppearanceImpactStep = ({
  onNext,
  animatedStyle,
}: AppearanceImpactStepProps) => (
  <OnboardingStepWrapper
    onNext={onNext}
    animatedStyle={animatedStyle}
    buttonTitle="詳しく知る"
  >
    <View className="mb-8">
      <LinearGradient
        colors={["#F59E0B", "#D97706"]}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Smile size={40} color="#ffffff" strokeWidth={2} />
      </LinearGradient>
    </View>
    <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
      臭い・見た目の影響
    </Text>
    <Text className="text-base text-gray-600 text-center leading-6 mb-6">
      清潔感と美しさを取り戻しましょう
    </Text>
    <View className="w-full mb-4">
      <View className="bg-orange-50 rounded-xl p-2 mb-2 border border-orange-200">
        <Text className="text-sm font-semibold text-orange-800 mb-1">
          😷 口臭・体臭
        </Text>
        <Text className="text-xs text-orange-700">
          タバコの独特な臭い・口臭悪化・髪や服に染み付く
        </Text>
      </View>
      <View className="bg-orange-50 rounded-xl p-2 mb-2 border border-orange-200">
        <Text className="text-sm font-semibold text-orange-800 mb-1">
          🦷 歯の黄ばみ
        </Text>
        <Text className="text-xs text-orange-700">
          歯の着色・黄ばみ・歯周病リスク・口元の印象悪化
        </Text>
      </View>
      <View className="bg-orange-50 rounded-xl p-2 mb-2 border border-orange-200">
        <Text className="text-sm font-semibold text-orange-800 mb-1">
          👤 肌の老化
        </Text>
        <Text className="text-xs text-orange-700">
          肌の乾燥・くすみ・シワの増加・弾力性の低下
        </Text>
      </View>
      <View className="bg-orange-50 rounded-xl p-2 border border-orange-200">
        <Text className="text-sm font-semibold text-orange-800 mb-1">
          👔 服装への影響
        </Text>
        <Text className="text-xs text-orange-700">
          服に染み付く臭い・ヤニのシミ・清潔感の欠如
        </Text>
      </View>
    </View>
    <Text className="text-lg font-semibold text-gray-800 text-center">
      清潔感と美しさを取り戻しましょう ✨
    </Text>
  </OnboardingStepWrapper>
);

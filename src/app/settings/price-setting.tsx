import { NumberStepper } from "@/components/NumberStepper";
import { useSmokerData } from "@/hooks/useSmokerData";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft, DollarSign, Save } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PriceSettingScreen() {
  const { smokerData, updateSmokerData } = useSmokerData();
  const [pricePerPack, setPricePerPack] = useState<number>(600);
  const [isSaving, setIsSaving] = useState(false);

  // smokerDataが変更された時にpricePerPackを更新
  useEffect(() => {
    if (smokerData?.pricePerPack !== undefined) {
      setPricePerPack(smokerData.pricePerPack);
    }
  }, [smokerData?.pricePerPack]);

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await updateSmokerData({ pricePerPack });
      Alert.alert("保存完了", "タバコの価格を更新しました", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("エラー", "保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (pricePerPack !== smokerData?.pricePerPack) {
      Alert.alert(
        "変更を破棄",
        "変更内容が保存されていません。本当に戻りますか？",
        [
          { text: "キャンセル", style: "cancel" },
          { text: "戻る", style: "destructive", onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  // 月額・年額の計算
  const monthlyCost =
    (pricePerPack * (smokerData?.cigarettesPerDay || 20) * 30) /
    (smokerData?.cigarettesPerPack || 20);
  const yearlyCost = monthlyCost * 12;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={["#10B981", "#059669"]}
        style={{
          paddingTop: 60,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="white" strokeWidth={2} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">タバコ価格設定</Text>
          <TouchableOpacity
            onPress={handleSave}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            activeOpacity={0.7}
            disabled={isSaving}
          >
            <Save size={20} color="white" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-5 pt-8"
        showsVerticalScrollIndicator={false}
      >
        {/* 説明セクション */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <DollarSign size={24} color="#10B981" strokeWidth={2} />
            <Text className="text-lg font-semibold text-gray-800 ml-3">
              タバコの価格
            </Text>
          </View>
          <Text className="text-gray-600 leading-6">
            1箱あたりのタバコの価格を設定してください。この情報は、禁煙による経済的効果の計算に使用されます。
          </Text>
        </View>

        {/* 価格設定セクション */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-base font-medium text-gray-800 mb-6 text-center">
            1箱あたりの価格を選択
          </Text>

          <NumberStepper
            value={pricePerPack}
            onChange={setPricePerPack}
            min={100}
            max={2000}
            step={50}
            suffix="円"
          />

          <View className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
            <Text className="text-sm text-green-800 text-center">
              設定値: <Text className="font-bold">{pricePerPack}円</Text>
            </Text>
          </View>
        </View>

        {/* 経済効果の計算セクション */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-base font-semibold text-gray-800 mb-4 text-center">
            💰 禁煙による経済効果
          </Text>

          <View className="space-y-4">
            <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <Text className="text-sm text-blue-800 text-center">
                月額節約:{" "}
                <Text className="font-bold text-lg">
                  {Math.round(monthlyCost).toLocaleString()}円
                </Text>
              </Text>
            </View>

            <View className="bg-green-50 rounded-lg p-4 border border-green-200">
              <Text className="text-sm text-green-800 text-center">
                年額節約:{" "}
                <Text className="font-bold text-lg">
                  {Math.round(yearlyCost).toLocaleString()}円
                </Text>
              </Text>
            </View>
          </View>

          <Text className="text-xs text-gray-500 text-center mt-3">
            ※ 1日{smokerData?.cigarettesPerDay || 20}本、1箱
            {smokerData?.cigarettesPerPack || 20}本で計算
          </Text>
        </View>

        {/* 参考情報セクション */}
        <View className="bg-yellow-50 rounded-xl p-6 mb-6 border border-yellow-200">
          <Text className="text-base font-semibold text-yellow-800 mb-3">
            💡 価格の参考情報
          </Text>
          <View className="space-y-2">
            <Text className="text-sm text-yellow-700">
              • 一般的なタバコ: 500-700円/箱
            </Text>
            <Text className="text-sm text-yellow-700">
              • プレミアムタバコ: 800-1200円/箱
            </Text>
            <Text className="text-sm text-yellow-700">
              • 1本あたり約25-60円のコスト
            </Text>
          </View>
        </View>

        {/* 保存ボタン */}
        <TouchableOpacity
          onPress={handleSave}
          className={`rounded-xl py-4 mb-8 shadow-sm ${
            isSaving ? "bg-gray-400" : "bg-green-500"
          }`}
          activeOpacity={0.8}
          disabled={isSaving}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {isSaving ? "保存中..." : "設定を保存"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

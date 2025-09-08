import { NumberStepper } from "@/components/NumberStepper";
import { userProfileRepository } from "@/drizzle/repositories/user-profile-repository";
import { useSmokerData } from "@/hooks/useSmokerData";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft, DollarSign, Save } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PriceSettingScreen() {
  const { smokerData, loadData } = useSmokerData();
  const [pricePerPack, setPricePerPack] = useState<number>(600);
  const [cigarettesPerPackage, setCigarettesPerPackage] = useState<number>(20);
  const [isSaving, setIsSaving] = useState(false);

  // smokerDataが変更された時にpricePerPackとcigarettesPerPackageを更新
  useEffect(() => {
    if (smokerData?.pricePerPack !== undefined) {
      setPricePerPack(smokerData.pricePerPack);
    }
    if (smokerData?.cigarettesPerPack !== undefined) {
      setCigarettesPerPackage(smokerData.cigarettesPerPack);
    }
  }, [smokerData?.pricePerPack, smokerData?.cigarettesPerPack]);

  const handleSave = async () => {
    if (isSaving) return;

    if (pricePerPack < 0) {
      Alert.alert("エラー", "有効な価格を入力してください。");
      return;
    }
    if (cigarettesPerPackage <= 0) {
      Alert.alert("エラー", "本数は1以上の有効な数値を入力してください。");
      return;
    }

    setIsSaving(true);
    try {
      // 価格と本数を同時に更新
      const result = await userProfileRepository.updatePackageSettings(
        pricePerPack,
        cigarettesPerPackage
      );

      if (result.success) {
        // データを再読み込みしてから画面を閉じる
        await loadData();
        Alert.alert("成功", "設定を更新しました。", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("エラー", result.message || "更新に失敗しました。");
      }
    } catch (e) {
      console.error("設定更新エラー:", e);
      Alert.alert("エラー", "予期せぬエラーが発生しました。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (
      pricePerPack !== smokerData?.pricePerPack ||
      cigarettesPerPackage !== smokerData?.cigarettesPerPack
    ) {
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
    cigarettesPerPackage;
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
              タバコの設定
            </Text>
          </View>
          <Text className="text-gray-600 leading-6">
            1箱あたりのタバコの価格と本数を設定してください。これらの情報は、禁煙による経済的効果の計算に使用されます。
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
            step={10}
            suffix="円"
          />
        </View>

        {/* 本数設定セクション */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-base font-medium text-gray-800 mb-6 text-center">
            1箱あたりの本数を選択
          </Text>

          <NumberStepper
            value={cigarettesPerPackage}
            onChange={setCigarettesPerPackage}
            min={1}
            max={50}
            step={1}
            suffix="本"
          />
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
            {cigarettesPerPackage}本で計算
          </Text>
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

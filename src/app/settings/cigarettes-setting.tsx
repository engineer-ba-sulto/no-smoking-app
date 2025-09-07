import { NumberStepper } from "@/components/NumberStepper";
import { useSmokerData } from "@/hooks/useSmokerData";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft, Cigarette, Save } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function CigarettesSettingScreen() {
  const { smokerData, updateSmokerData } = useSmokerData();
  const [cigarettesPerDay, setCigarettesPerDay] = useState<number>(20);
  const [isSaving, setIsSaving] = useState(false);

  // smokerDataが変更された時にcigarettesPerDayを更新
  useEffect(() => {
    if (smokerData?.cigarettesPerDay !== undefined) {
      setCigarettesPerDay(smokerData.cigarettesPerDay);
    }
  }, [smokerData?.cigarettesPerDay]);

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await updateSmokerData({ cigarettesPerDay });
      Alert.alert("保存完了", "1日の喫煙本数を更新しました", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("エラー", "保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (cigarettesPerDay !== smokerData?.cigarettesPerDay) {
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
          <Text className="text-xl font-bold text-white">喫煙本数設定</Text>
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
            <Cigarette size={24} color="#10B981" strokeWidth={2} />
            <Text className="text-lg font-semibold text-gray-800 ml-3">
              1日の喫煙本数
            </Text>
          </View>
          <Text className="text-gray-600 leading-6">
            禁煙前の1日の喫煙本数を設定してください。この情報は、禁煙による経済的効果や健康改善の計算に使用されます。
          </Text>
        </View>

        {/* 数値設定セクション */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-base font-medium text-gray-800 mb-6 text-center">
            1日の喫煙本数を選択
          </Text>

          <NumberStepper
            value={cigarettesPerDay}
            onChange={setCigarettesPerDay}
            min={1}
            max={100}
            step={1}
            suffix="本"
          />

          <View className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
            <Text className="text-sm text-green-800 text-center">
              設定値: <Text className="font-bold">{cigarettesPerDay}本</Text>
            </Text>
          </View>
        </View>

        {/* 参考情報セクション */}
        <View className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
          <Text className="text-base font-semibold text-blue-800 mb-3">
            💡 参考情報
          </Text>
          <View className="space-y-2">
            <Text className="text-sm text-blue-700">
              • 一般的な喫煙者は1日20-30本程度
            </Text>
            <Text className="text-sm text-blue-700">
              • 1本あたり約3-5分の喫煙時間
            </Text>
            <Text className="text-sm text-blue-700">
              • 1日20本の場合、月額約18,000円の支出
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

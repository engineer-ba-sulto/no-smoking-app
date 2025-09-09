import { SaveButton } from "@/components/SaveButton";
import { useSmokerData } from "@/hooks/useSmokerData";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft, Save, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NameSettingScreen() {
  const { smokerData, updateSmokerData } = useSmokerData();
  const [userName, setUserName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // smokerDataが変更された時にuserNameを更新
  useEffect(() => {
    if (smokerData?.userName !== undefined) {
      setUserName(smokerData.userName);
    }
  }, [smokerData?.userName]);

  const handleNameChange = (text: string) => {
    setUserName(text);

    // バリデーション
    if (text.trim().length === 0) {
      setError("名前を入力してください");
    } else if (text.trim().length > 50) {
      setError("名前は50文字以内で入力してください");
    } else {
      setError("");
    }
  };

  const isValid = userName.trim().length > 0 && userName.trim().length <= 50;

  const handleSave = async () => {
    if (isSaving || !isValid) return;

    // 保存開始時の軽い振動
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setIsSaving(true);
    try {
      await updateSmokerData({ userName: userName.trim() });
      // 保存成功時の成功フィードバック
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("保存完了", "お名前を更新しました", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      // 保存エラー時のエラーフィードバック
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("エラー", "保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (userName !== smokerData?.userName) {
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
            className="bg-white/20 rounded-full p-2"
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#ffffff" strokeWidth={2} />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-white">お名前の変更</Text>

          <TouchableOpacity
            onPress={handleSave}
            className={`rounded-full p-2 ${
              isValid && !isSaving ? "bg-white/20" : "bg-white/10"
            }`}
            activeOpacity={0.7}
            disabled={!isValid || isSaving}
          >
            <Save
              size={20}
              color={isValid && !isSaving ? "#ffffff" : "#ffffff80"}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-5 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-xl shadow-sm p-6">
          <View className="flex-row items-center mb-4">
            <User size={24} color="#10B981" strokeWidth={2} />
            <Text className="text-lg font-semibold text-gray-800 ml-3">
              お名前
            </Text>
          </View>

          <Text className="text-sm text-gray-600 mb-4">
            アプリ内で表示されるお名前を変更できます
          </Text>

          <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <TextInput
              value={userName}
              onChangeText={handleNameChange}
              placeholder="お名前を入力してください"
              placeholderTextColor="#9CA3AF"
              className="text-lg text-gray-800 font-medium"
              maxLength={50}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={() => {
                if (isValid) {
                  handleSave();
                }
              }}
            />
          </View>

          {error ? (
            <Text className="text-red-500 text-sm mt-2">{error}</Text>
          ) : (
            <Text className="text-gray-400 text-xs mt-2">
              {userName.length}/50文字
            </Text>
          )}
        </View>

        {/* ヒント */}
        <View className="bg-blue-50 rounded-xl p-4 mt-4 border border-blue-200">
          <Text className="text-sm text-blue-800 font-medium mb-2">
            💡 ヒント
          </Text>
          <Text className="text-sm text-blue-700 leading-5">
            お名前は禁煙の進捗表示や応援メッセージで使用されます。
            ニックネームでも構いません。
          </Text>
        </View>

        {/* 保存ボタン */}
        <SaveButton
          onSave={handleSave}
          isValid={isValid}
          isSaving={isSaving}
          buttonText="設定を保存"
          savingText="保存中..."
        />
      </ScrollView>
    </View>
  );
}

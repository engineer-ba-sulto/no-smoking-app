import { DatabaseManager } from "@/utils/database-manager";
import { Code, Eye, Play, RotateCcw, Trash2 } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DatabaseManagerProps {
  onDataChange?: () => void;
}

export const DatabaseManagerComponent = ({
  onDataChange,
}: DatabaseManagerProps) => {
  const [loading, setLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState("");
  const [queryResult, setQueryResult] = useState<string>("");

  const handleAction = async (
    action: () => Promise<any>,
    title: string,
    message: string
  ) => {
    setLoading(true);
    try {
      const result = await action();

      if (result.success) {
        Alert.alert("✅ 成功", result.message, [
          {
            text: "OK",
            onPress: () => {
              onDataChange?.();
              setQueryResult(JSON.stringify(result.data, null, 2));
            },
          },
        ]);
      } else {
        Alert.alert("❌ エラー", result.error || "不明なエラーが発生しました");
      }
    } catch (error) {
      Alert.alert("❌ エラー", "操作中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = () => {
    Alert.alert("テストデータ投入", "テストデータを投入しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "投入",
        onPress: () =>
          handleAction(
            DatabaseManager.seedTestData,
            "テストデータ投入",
            "テストデータの投入が完了しました"
          ),
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      "データ削除",
      "すべてのデータを削除しますか？この操作は取り消せません。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: () =>
            handleAction(
              DatabaseManager.clearAllData,
              "データ削除",
              "データの削除が完了しました"
            ),
        },
      ]
    );
  };

  const handleResetDatabase = () => {
    Alert.alert(
      "データベースリセット",
      "データベースを完全にリセットしますか？この操作は取り消せません。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "リセット",
          style: "destructive",
          onPress: () =>
            handleAction(
              DatabaseManager.resetDatabase,
              "データベースリセット",
              "データベースのリセットが完了しました"
            ),
        },
      ]
    );
  };

  const handleGetStatus = () => {
    handleAction(
      DatabaseManager.getDatabaseStatus,
      "データベース状態",
      "データベースの状態を取得しました"
    );
  };

  const handleCustomQuery = () => {
    if (!customQuery.trim()) {
      Alert.alert("エラー", "クエリを入力してください");
      return;
    }

    Alert.alert(
      "カスタムクエリ実行",
      `以下のクエリを実行しますか？\n\n${customQuery}`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "実行",
          onPress: () =>
            handleAction(
              () => DatabaseManager.executeCustomQuery(customQuery),
              "カスタムクエリ実行",
              "クエリが実行されました"
            ),
        },
      ]
    );
  };

  const actionButtons = [
    {
      icon: <Play size={20} color="#10B981" strokeWidth={2} />,
      label: "テストデータ投入",
      onPress: handleSeedData,
      color: "bg-green-50 border-green-200",
    },
    {
      icon: <Trash2 size={20} color="#EF4444" strokeWidth={2} />,
      label: "データ削除",
      onPress: handleClearData,
      color: "bg-red-50 border-red-200",
    },
    {
      icon: <RotateCcw size={20} color="#F59E0B" strokeWidth={2} />,
      label: "DB完全リセット",
      onPress: handleResetDatabase,
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      icon: <Eye size={20} color="#3B82F6" strokeWidth={2} />,
      label: "状態確認",
      onPress: handleGetStatus,
      color: "bg-blue-50 border-blue-200",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* アクションボタン */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-3">
            ▼ データベース操作
          </Text>
          <View className="space-y-2">
            {actionButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center justify-between p-4 rounded-lg border ${
                  button.color
                } ${loading ? "opacity-50" : ""}`}
                onPress={button.onPress}
                disabled={loading}
              >
                <View className="flex-row items-center">
                  {button.icon}
                  <Text className="text-sm font-medium text-gray-800 ml-3">
                    {button.label}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500">タップ</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* カスタムクエリ */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              ▼ カスタムSQLクエリ
            </Text>
          </View>

          <TextInput
            className="bg-white border border-gray-200 rounded-lg p-3 mb-3 text-sm"
            placeholder="SELECT * FROM user_profile;"
            value={customQuery}
            onChangeText={setCustomQuery}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <TouchableOpacity
            className={`flex-row items-center justify-center p-3 rounded-lg border border-gray-300 ${
              loading ? "opacity-50" : "bg-white"
            }`}
            onPress={handleCustomQuery}
            disabled={loading}
          >
            <Code size={16} color="#6B7280" strokeWidth={2} />
            <Text className="text-sm font-medium text-gray-800 ml-2">
              クエリ実行
            </Text>
          </TouchableOpacity>
        </View>

        {/* 結果表示 */}
        {queryResult && (
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              実行結果
            </Text>
            <View className="bg-gray-900 rounded-lg p-3">
              <Text className="text-xs text-green-400 font-mono">
                {queryResult}
              </Text>
            </View>
          </View>
        )}

        {/* 注意事項 */}
        <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <Text className="text-xs text-yellow-800 font-medium mb-2">
            ⚠️ 注意事項
          </Text>
          <Text className="text-xs text-yellow-700 leading-4">
            • データ削除・リセット操作は取り消せません{"\n"}•
            本番環境では使用しないでください{"\n"}•
            カスタムクエリは慎重に実行してください
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

import { db } from "@/drizzle";
import { MainSeeder } from "@/drizzle/seeders/main-seeder";
import {
  initialStartupPatterns,
  TestDataPattern,
  testDataPatterns,
} from "@/drizzle/seeders/test-data-sets";
import {
  AlertTriangle,
  Database,
  Play,
  RefreshCw,
  Smartphone,
  Trash2,
  Trophy,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface DatabaseManagerProps {
  onDataChange?: () => void;
}

export const DatabaseManagerComponent = ({
  onDataChange,
}: DatabaseManagerProps) => {
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState<boolean>(false);
  const [mainSeeder] = useState(() => new MainSeeder());

  // コンポーネントのマウント時にデータ存在状況を取得
  useEffect(() => {
    fetchDataStatus();
  }, []);

  const fetchDataStatus = async () => {
    try {
      const dataExists = await mainSeeder.hasData();
      setHasData(dataExists);
    } catch (error) {
      console.error("データ存在確認に失敗しました:", error);
    }
  };

  const handleAction = async (
    action: () => Promise<void>,
    successMessage: string,
    errorMessage: string
  ) => {
    setLoading(true);
    try {
      await action();
      Alert.alert("✅ 成功", successMessage);
      // 操作後にデータ存在状況を再取得
      await fetchDataStatus();
      onDataChange?.();
    } catch (error) {
      console.error("Database operation error:", error);
      const errorDetails =
        error instanceof Error ? error.message : String(error);
      Alert.alert("❌ エラー", `${errorMessage}\n\n詳細: ${errorDetails}`);
    } finally {
      setLoading(false);
    }
  };

  const runMigrations = async () => {
    try {
      // テーブル作成（存在しない場合）
      await db.run(`
        CREATE TABLE IF NOT EXISTS user_profile (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          smoking_start_date TEXT NOT NULL,
          cigs_per_day INTEGER NOT NULL,
          price_per_pack REAL NOT NULL,
          cigs_per_pack INTEGER NOT NULL,
          motivations TEXT NOT NULL DEFAULT '[]',
          has_completed_onboarding INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log("テーブル作成が完了しました");
    } catch (error) {
      console.error("マイグレーションエラー:", error);
      throw error;
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      "全データ削除",
      "すべてのデータを削除しますか？この操作は取り消せません。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: () =>
            handleAction(
              () => mainSeeder.clearAllData(),
              "全データの削除が完了しました",
              "データ削除中にエラーが発生しました"
            ),
        },
      ]
    );
  };

  const handleSeedPattern = (pattern: TestDataPattern) => {
    Alert.alert(
      "データパターン投入",
      `「${pattern.name}」を投入しますか？\n\n${pattern.description}`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "投入",
          onPress: () =>
            handleAction(
              () => mainSeeder.seedSinglePattern(pattern.data),
              `${pattern.name}の投入が完了しました`,
              `${pattern.name}の投入中にエラーが発生しました`
            ),
        },
      ]
    );
  };

  const handleSeedInitialStartupDefault = () => {
    Alert.alert(
      "初回起動データ投入",
      "スマホを初ダウンロードして使う時点のテストデータを投入しますか？\n\n（禁煙開始時刻は現在時刻に設定されます）",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "投入",
          onPress: () =>
            handleAction(
              () => mainSeeder.seedInitialStartupDefault(),
              "初回起動データの投入が完了しました",
              "初回起動データの投入中にエラーが発生しました"
            ),
        },
      ]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basic":
        return <Play size={16} color="#10B981" strokeWidth={2} />;
      case "edgeCase":
        return <AlertTriangle size={16} color="#F59E0B" strokeWidth={2} />;
      case "achievement":
        return <Trophy size={16} color="#8B5CF6" strokeWidth={2} />;
      case "initial":
        return <Smartphone size={16} color="#3B82F6" strokeWidth={2} />;
      default:
        return <Database size={16} color="#6B7280" strokeWidth={2} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basic":
        return "bg-green-50 border-green-200";
      case "edgeCase":
        return "bg-yellow-50 border-yellow-200";
      case "achievement":
        return "bg-purple-50 border-purple-200";
      case "initial":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "basic":
        return "基本パターン";
      case "edgeCase":
        return "境界値テスト";
      case "achievement":
        return "アチーブメントテスト";
      case "initial":
        return "初回起動パターン";
      default:
        return "その他";
    }
  };

  // カテゴリごとにパターンをグループ化（初回起動パターンも含める）
  const allPatterns = [...initialStartupPatterns, ...testDataPatterns];
  const groupedPatterns = allPatterns.reduce((acc, pattern) => {
    if (!acc[pattern.category]) {
      acc[pattern.category] = [];
    }
    acc[pattern.category].push(pattern);
    return acc;
  }, {} as Record<string, TestDataPattern[]>);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* 全データ削除ボタン */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-3">
            ▼ データベース操作
          </Text>
          <View className="space-y-2">
            <TouchableOpacity
              className={`flex-row items-center justify-between p-4 rounded-lg border ${
                hasData
                  ? "bg-red-50 border-red-200"
                  : "bg-gray-100 border-gray-300"
              } ${loading ? "opacity-50" : ""}`}
              onPress={handleClearAllData}
              disabled={loading || !hasData}
            >
              <View className="flex-row items-center">
                <Trash2
                  size={20}
                  color={hasData ? "#EF4444" : "#9CA3AF"}
                  strokeWidth={2}
                />
                <Text
                  className={`text-sm font-medium ml-3 ${
                    hasData ? "text-gray-800" : "text-gray-500"
                  }`}
                >
                  全データ削除 (Clean)
                </Text>
              </View>
              <Text
                className={`text-xs ${
                  hasData ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {hasData ? "タップ" : "データなし"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-row items-center justify-between p-4 rounded-lg border bg-blue-50 border-blue-200 ${
                loading ? "opacity-50" : ""
              }`}
              onPress={() =>
                handleAction(
                  runMigrations,
                  "データベーステーブルが作成されました",
                  "テーブル作成中にエラーが発生しました"
                )
              }
              disabled={loading}
            >
              <View className="flex-row items-center">
                <RefreshCw size={20} color="#3B82F6" strokeWidth={2} />
                <Text className="text-sm font-medium ml-3 text-gray-800">
                  データベーステーブル作成
                </Text>
              </View>
              <Text className="text-xs text-gray-500">タップ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* データパターン選択 */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-3">
            ▼ テストデータパターン選択
          </Text>
          <Text className="text-sm text-gray-600 mb-4">
            各パターンを個別に選択して登録できます。現在のデータは削除されてから新しいパターンが登録されます。
          </Text>

          {Object.entries(groupedPatterns).map(([category, patterns]) => (
            <View key={category} className="mb-4">
              <View className="flex-row items-center mb-2">
                {getCategoryIcon(category)}
                <Text className="text-sm font-medium text-gray-700 ml-2">
                  {getCategoryLabel(category)} ({patterns.length}件)
                </Text>
              </View>

              <View className="space-y-2">
                {patterns.map((pattern) => (
                  <TouchableOpacity
                    key={pattern.id}
                    className={`p-3 rounded-lg border ${getCategoryColor(
                      category
                    )} ${loading ? "opacity-50" : ""}`}
                    onPress={() => handleSeedPattern(pattern)}
                    disabled={loading}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-gray-800 mb-1">
                          {pattern.name}
                        </Text>
                        <Text className="text-xs text-gray-600 leading-4">
                          {pattern.description}
                        </Text>
                        <View className="mt-2">
                          <Text className="text-xs text-gray-500">
                            喫煙本数: {pattern.data.cigsPerDay}本/日 |
                            タバコ価格: {pattern.data.pricePerPack}円/箱 |
                            禁煙開始:{" "}
                            {new Date(
                              pattern.data.smokingStartDate
                            ).toLocaleDateString("ja-JP")}
                          </Text>
                        </View>
                      </View>
                      <View className="ml-2">
                        <Text className="text-xs text-gray-400">タップ</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* 注意事項 */}
        <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <Text className="text-xs text-yellow-800 font-medium mb-2">
            ⚠️ 注意事項
          </Text>
          <Text className="text-xs text-yellow-700 leading-4">
            • データ削除操作は取り消せません{"\n"}•
            本番環境では使用しないでください{"\n"}•
            各操作の実行中は処理中であることが表示されます{"\n"}•
            パターン投入時は既存データが削除されます
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

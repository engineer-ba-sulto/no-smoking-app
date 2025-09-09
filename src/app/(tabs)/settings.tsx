import { useSmokerData } from "@/hooks/useSmokerData";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import {
  ChevronRight,
  Cigarette,
  Database,
  DollarSign,
  Play,
  User,
} from "lucide-react-native";
import { useCallback } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

// 設定項目の型定義
interface SettingItem {
  icon: React.ReactElement;
  label: string;
  value?: string | boolean;
  toggle?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function SettingsScreen() {
  const { smokerData, updateSmokerData, loadData } = useSmokerData();

  // 画面がフォーカスされた時にデータを再読み込み
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // 設定項目がタップされた時のハンドラー
  const handleSettingPress = (onPress?: () => void) => {
    // 選択フィードバック
    Haptics.selectionAsync();
    if (onPress) {
      onPress();
    }
  };

  const settingSections: SettingSection[] = [
    {
      title: "あなたの情報",
      items: [
        {
          icon: <User size={20} color="#6B7280" strokeWidth={2} />,
          label: "お名前",
          value: smokerData?.userName || "未設定",
          onPress: () => router.push("/settings/name-setting"),
        },
        {
          icon: <Cigarette size={20} color="#6B7280" strokeWidth={2} />,
          label: "1日の喫煙本数",
          value: `${smokerData?.cigarettesPerDay || 20}本`,
          onPress: () => router.push("/settings/cigarettes-setting"),
        },
        {
          icon: <DollarSign size={20} color="#6B7280" strokeWidth={2} />,
          label: "タバコの設定",
          value: `${smokerData?.pricePerPack || 600}円 / ${
            smokerData?.cigarettesPerPack || 20
          }本`,
          onPress: () => router.push("/settings/price-setting"),
        },
      ],
    },
    // TODO 通知設定については今後実装する = コメントを外す
    // {
    //   title: "通知設定",
    //   items: [
    //     {
    //       icon: <Bell size={20} color="#6B7280" strokeWidth={2} />,
    //       label: "応援メッセージを受け取る",
    //       toggle: true,
    //       value: smokerData?.motivationNotifications ?? true,
    //       onToggle: (value: boolean) =>
    //         updateSmokerData({ motivationNotifications: value }),
    //     },
    //     {
    //       icon: <Bell size={20} color="#6B7280" strokeWidth={2} />,
    //       label: "目標達成の通知を受け取る",
    //       toggle: true,
    //       value: smokerData?.achievementNotifications ?? true,
    //       onToggle: (value: boolean) =>
    //         updateSmokerData({ achievementNotifications: value }),
    //     },
    //   ],
    // },
    // TODO アプリについては今後実装する = コメントを外す
    // {
    //   title: "アプリについて",
    //   items: [
    //     {
    //       icon: <FileText size={20} color="#6B7280" strokeWidth={2} />,
    //       label: "利用規約",
    //       onPress: () => console.log("Open terms"),
    //     },
    //     {
    //       icon: <Shield size={20} color="#6B7280" strokeWidth={2} />,
    //       label: "プライバシーポリシー",
    //       onPress: () => console.log("Open privacy policy"),
    //     },
    //   ],
    // },
  ];

  // 開発環境でのみ表示するセクション
  const devSections: SettingSection[] = __DEV__
    ? [
        {
          title: "開発者向け",
          items: [
            {
              icon: <Play size={20} color="#EF4444" strokeWidth={2} />,
              label: "オンボーディングを確認",
              onPress: () => router.push("/onboarding"),
            },
            {
              icon: <Database size={20} color="#8B5CF6" strokeWidth={2} />,
              label: "データベース管理",
              onPress: () => router.push("/database-manager"),
            },
          ],
        },
      ]
    : [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={["#10B981", "#059669"]}
        style={{
          paddingTop: 60,
          paddingBottom: 10,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <Text className="text-2xl font-bold text-white text-center">設定</Text>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-5 pt-5"
        showsVerticalScrollIndicator={false}
      >
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              ▼ {section.title}
            </Text>
            <View className="bg-white rounded-xl shadow-sm">
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  className={`flex-row items-center justify-between px-4 py-4 ${
                    itemIndex === section.items.length - 1
                      ? ""
                      : "border-b border-gray-100"
                  }`}
                  onPress={() => handleSettingPress(item.onPress)}
                  disabled={item.toggle}
                >
                  <View className="flex-row items-center flex-1">
                    {item.icon}
                    <Text className="text-sm font-medium text-gray-800 ml-3">
                      {item.label}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    {item.toggle ? (
                      <Switch
                        value={item.value as boolean}
                        onValueChange={item.onToggle}
                        thumbColor="#ffffff"
                        trackColor={{ false: "#d1d5db", true: "#10B981" }}
                      />
                    ) : (
                      <>
                        <Text className="text-sm text-gray-600 mr-2">
                          {item.value}
                        </Text>
                        <ChevronRight
                          size={16}
                          color="#9CA3AF"
                          strokeWidth={2}
                        />
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* 開発環境でのみ表示されるセクション */}
        {devSections.map((section, sectionIndex) => (
          <View key={`dev-${sectionIndex}`} className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              ▼ {section.title}
            </Text>
            <View className="bg-white rounded-xl shadow-sm border-2 border-red-100">
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  className={`flex-row items-center justify-between px-4 py-4 ${
                    itemIndex === section.items.length - 1
                      ? ""
                      : "border-b border-gray-100"
                  }`}
                  onPress={() => handleSettingPress(item.onPress)}
                >
                  <View className="flex-row items-center flex-1">
                    {item.icon}
                    <Text className="text-sm font-medium text-gray-800 ml-3">
                      {item.label}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-xs text-red-500 mr-2 font-medium">
                      DEV
                    </Text>
                    <ChevronRight size={16} color="#9CA3AF" strokeWidth={2} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

import { useSmokerData } from "@/hooks/useSmokerData";
import {
  getDevelopmentInfo,
  shouldShowDeveloperFeatures,
} from "@/utils/dev-environment";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import {
  ChevronRight,
  Cigarette,
  CreditCard,
  Database,
  DollarSign,
  Info,
  Play,
  ToggleLeft,
  ToggleRight,
  User,
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [showDevInfo, setShowDevInfo] = useState(false);
  const [useSimplifiedOnboarding, setUseSimplifiedOnboarding] = useState(false);

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

  // 開発環境情報を表示するハンドラー
  const handleShowDevInfo = useCallback(() => {
    const devInfo = getDevelopmentInfo();
    const infoText = Object.entries(devInfo)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join("\n");

    Alert.alert("開発環境情報", infoText, [{ text: "OK" }]);
  }, []);

  // オンボーディング切り替えハンドラー
  const handleOnboardingToggle = useCallback(() => {
    setUseSimplifiedOnboarding((prev) => !prev);
    Haptics.selectionAsync();
  }, []);

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
  const devSections: SettingSection[] = useMemo(() => {
    if (!shouldShowDeveloperFeatures()) return [];

    return [
      {
        title: "開発者向け設定",
        items: [
          {
            icon: useSimplifiedOnboarding ? (
              <ToggleRight size={20} color="#10B981" strokeWidth={2} />
            ) : (
              <ToggleLeft size={20} color="#6B7280" strokeWidth={2} />
            ),
            label: useSimplifiedOnboarding
              ? "省略版オンボーディングを使用(9ステップ)"
              : "完全版オンボーディングを使用(23ステップ)",
            toggle: true,
            value: useSimplifiedOnboarding,
            onToggle: handleOnboardingToggle,
          },
        ],
      },
      {
        title: "開発者向け",
        items: [
          {
            icon: <Play size={20} color="#10B981" strokeWidth={2} />,
            label: "省略版オンボーディングを確認",
            onPress: () => router.push("/onboarding-simplified"),
          },
          {
            icon: <Play size={20} color="#EF4444" strokeWidth={2} />,
            label: "完全版オンボーディングを確認",
            onPress: () => router.push("/onboarding"),
          },
          {
            icon: <CreditCard size={20} color="#F59E0B" strokeWidth={2} />,
            label: "完全版ペイウォール画面",
            onPress: () => router.push("/paywall?forceShow=true"),
          },
          // {
          //   icon: <CreditCard size={20} color="#10B981" strokeWidth={2} />,
          //   label: "省略版ペイウォール画面",
          //   onPress: () => router.push("/paywall-simplified?forceShow=true"),
          // },
          {
            icon: <Database size={20} color="#8B5CF6" strokeWidth={2} />,
            label: "データベース管理",
            onPress: () => router.push("/settings/database-manager"),
          },
          {
            icon: <Info size={20} color="#3B82F6" strokeWidth={2} />,
            label: "開発環境情報",
            onPress: handleShowDevInfo,
          },
        ],
      },
    ];
  }, [useSimplifiedOnboarding]);

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
              {section.items.map((item, itemIndex) =>
                item.toggle ? (
                  <View
                    key={itemIndex}
                    className={`flex-row items-center justify-between px-4 py-4 ${
                      itemIndex === section.items.length - 1
                        ? ""
                        : "border-b border-gray-100"
                    }`}
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
                      <Switch
                        value={item.value as boolean}
                        onValueChange={item.onToggle}
                        thumbColor="#ffffff"
                        trackColor={{ false: "#d1d5db", true: "#10B981" }}
                      />
                    </View>
                  </View>
                ) : (
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
                )
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

import { useSmokerData } from "@/hooks/useSmokerData";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Bell,
  ChevronRight,
  Cigarette,
  DollarSign,
  FileText,
  Shield,
} from "lucide-react-native";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const { smokerData, updateSmokerData } = useSmokerData();

  const settingSections = [
    {
      title: "あなたの禁煙情報",
      items: [
        {
          icon: <Cigarette size={20} color="#6B7280" strokeWidth={2} />,
          label: "1日の喫煙本数",
          value: `${smokerData?.cigarettesPerDay || 20}本`,
          onPress: () => router.push("/"),
        },
        {
          icon: <DollarSign size={20} color="#6B7280" strokeWidth={2} />,
          label: "タバコの価格",
          value: `${smokerData?.pricePerPack || 600}円`,
          onPress: () => router.push("/"),
        },
      ],
    },
    {
      title: "通知設定",
      items: [
        {
          icon: <Bell size={20} color="#6B7280" strokeWidth={2} />,
          label: "応援メッセージを受け取る",
          toggle: true,
          value: smokerData?.motivationNotifications ?? true,
          onToggle: (value: boolean) =>
            updateSmokerData({ motivationNotifications: value }),
        },
        {
          icon: <Bell size={20} color="#6B7280" strokeWidth={2} />,
          label: "目標達成の通知を受け取る",
          toggle: true,
          value: smokerData?.achievementNotifications ?? true,
          onToggle: (value: boolean) =>
            updateSmokerData({ achievementNotifications: value }),
        },
      ],
    },
    {
      title: "アプリについて",
      items: [
        {
          icon: <FileText size={20} color="#6B7280" strokeWidth={2} />,
          label: "利用規約",
          onPress: () => console.log("Open terms"),
        },
        {
          icon: <Shield size={20} color="#6B7280" strokeWidth={2} />,
          label: "プライバシーポリシー",
          onPress: () => console.log("Open privacy policy"),
        },
      ],
    },
  ];

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
                  onPress={item.onPress}
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
      </ScrollView>
    </View>
  );
}

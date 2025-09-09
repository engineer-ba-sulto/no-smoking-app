import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import { Award, Home, Settings } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  // タブボタンのカスタムハンドラー
  const TabBarButton = ({ children, onPress, ...props }: any) => (
    <TouchableOpacity
      {...props}
      onPress={(e) => {
        // 選択フィードバック
        Haptics.selectionAsync();
        onPress?.(e);
      }}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6",
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#10B981",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarButton: TabBarButton,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ホーム",
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: "成果",
          tabBarIcon: ({ size, color }) => (
            <Award size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "設定",
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

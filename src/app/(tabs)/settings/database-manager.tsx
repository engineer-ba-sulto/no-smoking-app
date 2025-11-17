import { DatabaseManagerComponent } from "@/components/DatabaseManager";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function DatabaseManagerScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={["#8B5CF6", "#7C3AED"]}
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
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="white" strokeWidth={2} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">データベース管理</Text>
          <View className="w-10 h-10" />
        </View>
      </LinearGradient>

      {/* Database Manager Component */}
      <DatabaseManagerComponent />
    </View>
  );
}

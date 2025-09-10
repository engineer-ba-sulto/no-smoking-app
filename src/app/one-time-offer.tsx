import { StatusBar } from "expo-status-bar";
import { X } from "lucide-react-native";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OneTimeOfferScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900 text-white">
      <StatusBar style="light" />

      {/* 閉じるボタン */}
      <View style={styles.closeButton}>
        <TouchableOpacity className="p-1">
          <X size={24} className="text-gray-400" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center p-6">
        <View className="bg-orange-500 px-4 py-1 rounded-full mb-4">
          <Text className="text-white font-bold text-sm">
            一度きりのオファー
          </Text>
        </View>

        <Text className="text-white text-3xl font-extrabold text-center mb-2">
          お見逃しなく！
        </Text>
        <Text className="text-gray-400 text-center mb-8">
          このオファーは二度と表示されません。
        </Text>

        <View className="w-full bg-gray-800 rounded-2xl p-8 items-center border border-orange-500 shadow-lg shadow-orange-900/50">
          <Text className="text-white text-lg font-semibold">年間プラン</Text>
          <View className="flex-row items-baseline my-4">
            <Text className="text-white text-5xl font-extrabold">¥125</Text>
            <Text className="text-gray-400 text-2xl font-semibold">/mo</Text>
          </View>
          <Text className="text-gray-400 font-medium mb-6">
            年額 ¥1,500 の一括払い
          </Text>

          <View className="bg-green-500 px-4 py-1 rounded-full">
            <Text className="text-white font-bold text-sm">70%割引</Text>
          </View>
        </View>

        <TouchableOpacity className="bg-orange-500 w-full rounded-xl py-4 items-center mt-8 shadow-lg shadow-orange-400/30">
          <Text className="text-white text-lg font-bold">
            最安値でゲットする
          </Text>
        </TouchableOpacity>

        <Text className="text-gray-500 text-xs text-center mt-4">
          縛りなし、いつでもキャンセル可能です。
        </Text>
      </View>

      <View
        className={`px-6 ${
          Platform.OS === "ios" ? "pb-8" : "pb-4"
        } items-center`}
      >
        <Text className="text-xs text-gray-500">史上最安値。</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 20 : 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 999,
  },
});

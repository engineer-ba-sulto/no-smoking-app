import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { X } from "lucide-react-native";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OneTimeOfferScreen() {
  const handleClose = () => {
    router.dismissAll();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 text-white">
      <StatusBar style="dark" />

      {/* 閉じるボタン */}
      <View style={styles.closeButton}>
        <TouchableOpacity onPress={handleClose} className="p-1">
          <X size={24} className="text-gray-400" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center p-6">
        <View className="bg-emerald-500 px-4 py-1 rounded-full mb-4">
          <Text className="text-white font-bold text-sm">
            一度きりのオファー
          </Text>
        </View>

        <Text className="text-gray-800 text-3xl font-extrabold text-center mb-2">
          お見逃しなく！
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          このオファーは二度と表示されません。
        </Text>

        <View className="w-full bg-white rounded-2xl p-8 items-center border border-emerald-500 shadow-lg shadow-emerald-200">
          <Text className="text-gray-800 text-lg font-semibold">
            年間プラン
          </Text>
          <View className="flex-row items-baseline my-4">
            <Text className="text-gray-800 text-5xl font-extrabold">¥125</Text>
            <Text className="text-gray-600 text-2xl font-semibold">/mo</Text>
          </View>
          <Text className="text-gray-600 font-medium mb-6">
            年額 ¥1,500 の一括払い
          </Text>

          <View className="bg-emerald-500 px-4 py-1 rounded-full">
            <Text className="text-white font-bold text-sm">70%割引</Text>
          </View>
        </View>

        <TouchableOpacity className="bg-emerald-500 w-full rounded-xl py-4 items-center mt-8 shadow-lg shadow-emerald-200">
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
    backgroundColor: "white",
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

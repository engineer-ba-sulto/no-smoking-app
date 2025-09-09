import { AppHeader } from "@/components/AppHeader";
import { BreathingTimer } from "@/components/BreathingTimer";
import { StatsCard } from "@/components/home/ui/StatsCard";
import { DEFAULT_BACKGROUND } from "@/constants/backgrounds";
import { useQuitTimer } from "@/hooks/useQuitTimer";
import { useSmokerData } from "@/hooks/useSmokerData";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import {
  CircleAlert as AlertCircle,
  Clock,
  DollarSign,
  Heart,
  Target,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ImageBackground,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [showBreathingTimer, setShowBreathingTimer] = useState(false);
  const { smokerData, loadData } = useSmokerData();
  const { quitStats } = useQuitTimer(
    smokerData?.quitDate,
    smokerData?.cigarettesPerDay,
    smokerData?.pricePerPack,
    smokerData?.cigarettesPerPack
  );

  const userName = smokerData?.name || "あなた";

  // 画面がフォーカスされた時にデータを再読み込み
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  return (
    <ImageBackground
      source={DEFAULT_BACKGROUND.source}
      className="flex-1"
      resizeMode="cover"
    >
      {/* 半透明のオーバーレイ */}
      <View className="absolute inset-0 bg-white/80" />

      {/* Header */}
      <AppHeader
        title={`こんにちは、${userName}さん！`}
        healthStatus={{
          icon: <Heart size={16} color="#065f46" strokeWidth={2} />,
          text: "血圧が正常値に近づいています",
        }}
      />

      {/* Main content */}
      <View className="flex-1 px-5 pt-8 relative z-10">
        <Text className="text-base text-gray-600 text-center mb-5 font-medium">
          あなたが禁煙をはじめてから...
        </Text>

        {/* Main timer display */}
        <View
          className="mb-8 rounded-2xl overflow-hidden"
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <BlurView
            intensity={20}
            tint="light"
            className="p-8 items-center"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
          >
            <Text className="text-2xl font-bold text-gray-800 text-center leading-8">
              {quitStats.days}日 {quitStats.hours}時間 {quitStats.minutes}分{" "}
              {quitStats.seconds}秒
            </Text>
          </BlurView>
        </View>

        {/* Stats grid */}
        <View className="flex-row flex-wrap justify-between">
          <StatsCard
            icon={<DollarSign size={20} color="#10B981" strokeWidth={2} />}
            label="節約できた金額"
            value={`¥ ${quitStats.moneySaved.toLocaleString()}`}
            color="#10B981"
          />
          <StatsCard
            icon={<Target size={20} color="#059669" strokeWidth={2} />}
            label="吸わなかった本数"
            value={`${quitStats.cigarettesNotSmoked}本`}
            color="#059669"
          />
          <StatsCard
            icon={<Heart size={20} color="#EF4444" strokeWidth={2} />}
            label="延びた寿命"
            value={quitStats.lifeExtended}
            color="#EF4444"
          />
          <StatsCard
            icon={<Clock size={20} color="#F97316" strokeWidth={2} />}
            label="次の目標まで"
            value={quitStats.nextMilestone}
            color="#F97316"
          />
        </View>
      </View>

      {/* SOS FAB */}
      <TouchableOpacity
        className="absolute bottom-5 right-5 w-15 h-15 rounded-full shadow-lg z-20"
        onPress={() => setShowBreathingTimer(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#EF4444", "#DC2626"]}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AlertCircle size={24} color="#ffffff" strokeWidth={2} />
          <Text className="text-xs font-bold text-white mt-0.5">SOS</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Breathing Timer Modal */}
      <Modal
        visible={showBreathingTimer}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setShowBreathingTimer(false)}
      >
        <BreathingTimer
          onClose={() => setShowBreathingTimer(false)}
          onComplete={() => setShowBreathingTimer(false)}
        />
      </Modal>
    </ImageBackground>
  );
}

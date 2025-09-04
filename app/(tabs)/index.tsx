import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, DollarSign, Clock, Target, CircleAlert as AlertCircle } from 'lucide-react-native';
import { SOSScreen } from '@/components/SOSScreen';
import { StatsCard } from '@/components/StatsCard';
import { useSmokerData } from '@/hooks/useSmokerData';
import { useQuitTimer } from '@/hooks/useQuitTimer';

export default function HomeScreen() {
  const [showSOS, setShowSOS] = useState(false);
  const { smokerData } = useSmokerData();
  const { quitStats } = useQuitTimer(
    smokerData?.quitDate,
    smokerData?.cigarettesPerDay,
    smokerData?.pricePerPack,
    smokerData?.cigarettesPerPack
  );

  const userName = smokerData?.name || 'あなた';

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with gradient */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        className="pt-15 ios:pt-15 android:pt-10 px-5 pb-5 rounded-b-2xl"
      >
        <Text className="text-lg font-semibold text-white mb-2">こんにちは、{userName}さん！</Text>
        <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-xl self-start">
          <Heart size={16} color="#ffffff" strokeWidth={2} />
          <Text className="text-xs text-white ml-1.5 font-medium">血圧が正常値に近づいています</Text>
        </View>
      </LinearGradient>

      {/* Main content */}
      <View className="flex-1 px-5 pt-8">
        <Text className="text-base text-gray-600 text-center mb-5 font-medium">あなたが禁煙をはじめてから...</Text>
        
        {/* Main timer display */}
        <View className="bg-white rounded-2xl p-8 mb-8 items-center shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 text-center leading-8">
            {quitStats.days}日 {quitStats.hours}時間 {quitStats.minutes}分 {quitStats.seconds}秒
          </Text>
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
        className="absolute bottom-25 right-5 w-15 h-15 rounded-full shadow-lg"
        onPress={() => setShowSOS(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#EF4444', '#DC2626']}
          className="w-15 h-15 rounded-full items-center justify-center"
        >
          <AlertCircle size={24} color="#ffffff" strokeWidth={2} />
          <Text className="text-xs font-bold text-white mt-0.5">SOS</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* SOS Modal */}
      <Modal
        visible={showSOS}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setShowSOS(false)}
      >
        <SOSScreen onClose={() => setShowSOS(false)} />
      </Modal>
    </View>
  );
}
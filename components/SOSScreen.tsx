import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Play, Droplet, Zap, Music, Users } from 'lucide-react-native';
import { BreathingTimer } from './BreathingTimer';

interface Props {
  onClose: () => void;
}

export function SOSScreen({ onClose }: Props) {
  const [showBreathingTimer, setShowBreathingTimer] = useState(false);

  const copingStrategies = [
    {
      icon: <Play size={24} color="#10B981" strokeWidth={2} />,
      title: '3分間、深呼吸に集中する',
      onPress: () => setShowBreathingTimer(true),
    },
    {
      icon: <Droplet size={24} color="#3B82F6" strokeWidth={2} />,
      title: '冷たい水を一杯飲む',
      onPress: () => console.log('Water reminder'),
    },
    {
      icon: <Zap size={24} color="#F97316" strokeWidth={2} />,
      title: '軽いストレッチをする',
      onPress: () => console.log('Stretch reminder'),
    },
    {
      icon: <Music size={24} color="#8B5CF6" strokeWidth={2} />,
      title: '好きな音楽を1曲きく',
      onPress: () => console.log('Music suggestion'),
    },
  ];

  if (showBreathingTimer) {
    return (
      <BreathingTimer
        onClose={() => setShowBreathingTimer(false)}
        onComplete={() => {
          setShowBreathingTimer(false);
          onClose();
        }}
      />
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-end px-5 pt-12 pb-2">
        <TouchableOpacity className="p-2" onPress={onClose}>
          <X size={24} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Calming message */}
        <View className="items-center py-8">
          <Text className="text-xl font-semibold text-gray-800 text-center mb-2 leading-7">
            大丈夫、深呼吸しましょう。
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6">
            この衝動は数分で必ずおさまります。
          </Text>
        </View>

        {/* Coping strategies */}
        <View className="mb-8">
          <Text className="text-base font-semibold text-gray-800 mb-4">▼ 今すぐできること</Text>
          
          {copingStrategies.map((strategy, index) => (
            <TouchableOpacity
              key={index}
              className="bg-gray-50 rounded-xl mb-3 border-2 border-gray-200"
              onPress={strategy.onPress}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center p-4">
                <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-4 shadow-sm">
                  {strategy.icon}
                </View>
                <Text className="text-base font-medium text-gray-800 flex-1">{strategy.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Community support button */}
        <TouchableOpacity className="rounded-xl mb-10 shadow-lg" activeOpacity={0.8}>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            className="flex-row items-center justify-center py-4 px-6 rounded-xl"
          >
            <Users size={20} color="#ffffff" strokeWidth={2} />
            <Text className="text-base font-semibold text-white ml-2">みんなの応援を見る</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
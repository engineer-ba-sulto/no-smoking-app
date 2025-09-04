import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, TrendingUp, Heart } from 'lucide-react-native';
import { AchievementBadge } from '@/components/AchievementBadge';
import { HealthTimeline } from '@/components/HealthTimeline';
import { ProgressChart } from '@/components/ProgressChart';
import { useSmokerData } from '@/hooks/useSmokerData';
import { useQuitTimer } from '@/hooks/useQuitTimer';

type TabType = 'badges' | 'graphs' | 'health';

export default function AchievementsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('badges');
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'money' | 'cigarettes'>('money');
  
  const { smokerData } = useSmokerData();
  const { quitStats } = useQuitTimer(
    smokerData?.quitDate,
    smokerData?.cigarettesPerDay,
    smokerData?.pricePerPack,
    smokerData?.cigarettesPerPack
  );

  const achievements = [
    {
      id: 'first-24h',
      title: '禁煙24時間 達成！',
      description: '最初の24時間を乗り越えました',
      achieved: quitStats.days >= 1,
      tier: 'bronze' as const,
      targetValue: 1,
      currentValue: quitStats.days,
      unit: '日',
    },
    {
      id: 'week-milestone',
      title: '禁煙1週間 達成！',
      description: '7日間の継続、素晴らしいです',
      achieved: quitStats.days >= 7,
      tier: 'silver' as const,
      targetValue: 7,
      currentValue: quitStats.days,
      unit: '日',
    },
    {
      id: 'hundred-cigarettes',
      title: '我慢100本 達成！',
      description: '健康への大きな投資',
      achieved: quitStats.cigarettesNotSmoked >= 100,
      tier: 'silver' as const,
      targetValue: 100,
      currentValue: quitStats.cigarettesNotSmoked,
      unit: '本',
    },
    {
      id: 'money-10k',
      title: '節約額1万円突破',
      description: '経済的メリットを実感',
      achieved: quitStats.moneySaved >= 10000,
      tier: 'gold' as const,
      targetValue: 10000,
      currentValue: quitStats.moneySaved,
      unit: '円',
    },
    {
      id: 'month-milestone',
      title: '禁煙30日 達成！',
      description: '1ヶ月の大きな節目です',
      achieved: quitStats.days >= 30,
      tier: 'gold' as const,
      targetValue: 30,
      currentValue: quitStats.days,
      unit: '日',
    },
    {
      id: 'hundred-days',
      title: '禁煙100日 達成！',
      description: '習慣が完全に変わりました',
      achieved: quitStats.days >= 100,
      tier: 'platinum' as const,
      targetValue: 100,
      currentValue: quitStats.days,
      unit: '日',
    },
  ];

  const tabs = [
    { key: 'badges' as TabType, label: 'バッジ', icon: Award },
    { key: 'graphs' as TabType, label: 'グラフ', icon: TrendingUp },
    { key: 'health' as TabType, label: '健康', icon: Heart },
  ];

  const chartPeriods = [
    { key: 'week' as const, label: '週' },
    { key: 'month' as const, label: '月' },
    { key: 'year' as const, label: '年' },
  ];

  const chartTypes = [
    { key: 'money' as const, label: '節約金額' },
    { key: 'cigarettes' as const, label: '我慢した本数' },
  ];

  const getChartSummary = () => {
    const period = chartPeriod === 'week' ? '今週' : chartPeriod === 'month' ? '今月' : '今年';
    const moneyValue = Math.floor(quitStats.moneySaved * (chartPeriod === 'week' ? 0.25 : chartPeriod === 'month' ? 1 : 12));
    const cigaretteValue = Math.floor(quitStats.cigarettesNotSmoked * (chartPeriod === 'week' ? 0.25 : chartPeriod === 'month' ? 1 : 12));
    
    return {
      money: `${period}の合計節約額: ¥${moneyValue.toLocaleString()}`,
      cigarettes: `${period}の合計我慢本数: ${cigaretteValue}本`,
    };
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        className="pt-15 ios:pt-15 android:pt-10 px-5 pb-5 rounded-b-2xl"
      >
        <Text className="text-2xl font-bold text-white text-center">あなたのせいか</Text>
      </LinearGradient>

      {/* Tab navigation */}
      <View className="bg-white mx-5 mt-4 rounded-xl p-1 shadow-sm">
        <View className="flex-row">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TouchableOpacity
                key={tab.key}
                className={`flex-1 flex-row items-center justify-center py-3 px-2 rounded-lg ${
                  activeTab === tab.key ? 'bg-primary-50' : ''
                }`}
                onPress={() => setActiveTab(tab.key)}
              >
                <IconComponent
                  size={18}
                  color={activeTab === tab.key ? '#10B981' : '#9CA3AF'}
                  strokeWidth={2}
                />
                <Text
                  className={`text-sm ml-1.5 font-medium ${
                    activeTab === tab.key ? 'text-primary-500 font-semibold' : 'text-gray-400'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
        {activeTab === 'badges' && (
          <View className="pb-5">
            <Text className="text-lg font-semibold text-gray-800 mb-4">■ 獲得したバッジ一覧</Text>
            <View className="flex-row flex-wrap justify-between">
              {achievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </View>
          </View>
        )}

        {activeTab === 'graphs' && (
          <View className="pb-5">
            <Text className="text-lg font-semibold text-gray-800 mb-4">■ あなたの成長グラフ</Text>
            
            {/* Chart controls */}
            <View className="mb-5">
              <View className="bg-white rounded-lg p-1 mb-3 shadow-sm">
                <View className="flex-row">
                  {chartPeriods.map((period) => (
                    <TouchableOpacity
                      key={period.key}
                      className={`flex-1 py-2 items-center rounded-md ${
                        chartPeriod === period.key ? 'bg-primary-50' : ''
                      }`}
                      onPress={() => setChartPeriod(period.key)}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          chartPeriod === period.key ? 'text-primary-500 font-semibold' : 'text-gray-400'
                        }`}
                      >
                        {period.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View className="flex-row justify-end">
                {chartTypes.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    className={`px-3 py-1.5 rounded-md ml-2 ${
                      chartType === type.key ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                    onPress={() => setChartType(type.key)}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        chartType === type.key ? 'text-white font-semibold' : 'text-gray-600'
                      }`}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Chart display */}
            <View className="bg-white rounded-xl p-5 mb-4 shadow-sm">
              <Text className="text-base font-semibold text-gray-800 mb-4 text-center">
                {chartPeriods.find(p => p.key === chartPeriod)?.label}間・
                {chartTypes.find(t => t.key === chartType)?.label}の推移
              </Text>
              <ProgressChart
                period={chartPeriod}
                type={chartType}
                quitStats={quitStats}
              />
            </View>

            {/* Summary */}
            <View className="bg-white rounded-xl p-5 shadow-sm">
              <Text className="text-base font-semibold text-gray-800 mb-3">▼ サマリー</Text>
              <Text className="text-sm text-gray-600 mb-2 font-medium">
                {getChartSummary().money}
              </Text>
              <Text className="text-sm text-gray-600 font-medium">
                {getChartSummary().cigarettes}
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'health' && (
          <View className="pb-5">
            <Text className="text-lg font-semibold text-gray-800 mb-4">■ あなたの体の変化（タイムライン）</Text>
            <HealthTimeline quitStats={quitStats} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
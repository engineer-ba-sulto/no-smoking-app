import React from 'react';
import { View, Text } from 'react-native';
import { CircleCheck as CheckCircle, Clock, Heart, Zap, Shield } from 'lucide-react-native';

interface QuitStats {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  moneySaved: number;
  cigarettesNotSmoked: number;
  lifeExtended: string;
  nextMilestone: string;
}

interface Props {
  quitStats: QuitStats;
}

interface HealthMilestone {
  timeframe: string;
  title: string;
  description: string;
  hoursRequired: number;
  icon: React.ReactNode;
  achieved: boolean;
}

export function HealthTimeline({ quitStats }: Props) {
  const totalHours = quitStats.days * 24 + quitStats.hours;

  const healthMilestones: HealthMilestone[] = [
    {
      timeframe: '20分後',
      title: '血圧と脈拍が正常値に',
      description: '血圧と脈拍が正常値に近づきます。',
      hoursRequired: 0.33, // 20 minutes
      icon: <Heart size={20} color="#EF4444" strokeWidth={2} />,
      achieved: totalHours >= 0.33,
    },
    {
      timeframe: '8時間後',
      title: '血中酸素濃度が正常に',
      description: '血中の酸素濃度が正常レベルに戻ります。',
      hoursRequired: 8,
      icon: <Zap size={20} color="#F97316" strokeWidth={2} />,
      achieved: totalHours >= 8,
    },
    {
      timeframe: '24時間後',
      title: '心臓発作リスクが低下',
      description: '心臓発作のリスクが低下し始めます。',
      hoursRequired: 24,
      icon: <Heart size={20} color="#EF4444" strokeWidth={2} />,
      achieved: totalHours >= 24,
    },
    {
      timeframe: '48時間後',
      title: '味覚と嗅覚が改善',
      description: '味覚と嗅覚が改善し始めます。',
      hoursRequired: 48,
      icon: <Zap size={20} color="#8B5CF6" strokeWidth={2} />,
      achieved: totalHours >= 48,
    },
    {
      timeframe: '72時間後',
      title: '呼吸が楽になる',
      description: '気管支が緩み、呼吸が楽になります。',
      hoursRequired: 72,
      icon: <Zap size={20} color="#3B82F6" strokeWidth={2} />,
      achieved: totalHours >= 72,
    },
    {
      timeframe: '2週間後',
      title: '血液循環が改善',
      description: '血液循環が改善し、歩行が楽になります。',
      hoursRequired: 336, // 2 weeks
      icon: <Heart size={20} color="#10B981" strokeWidth={2} />,
      achieved: totalHours >= 336,
    },
    {
      timeframe: '1ヶ月後',
      title: '肺機能が向上',
      description: '肺の繊毛が再生し、感染症リスクが低下します。',
      hoursRequired: 720, // 30 days
      icon: <Shield size={20} color="#059669" strokeWidth={2} />,
      achieved: totalHours >= 720,
    },
    {
      timeframe: '1年後',
      title: '心疾患リスクが半減',
      description: '冠動脈疾患のリスクが喫煙者の半分になります。',
      hoursRequired: 8760, // 1 year
      icon: <Shield size={20} color="#7C3AED" strokeWidth={2} />,
      achieved: totalHours >= 8760,
    },
  ];

  return (
    <View className="py-2">
      {healthMilestones.map((milestone, index) => (
        <View key={index} className="flex-row mb-5">
          <View className="items-center mr-4">
            <View className={`w-8 h-8 rounded-full items-center justify-center border-2 ${
              milestone.achieved 
                ? 'bg-primary-50 border-primary-500' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              {milestone.achieved ? (
                <CheckCircle size={20} color="#10B981" strokeWidth={2} />
              ) : (
                <Clock size={20} color="#9CA3AF" strokeWidth={2} />
              )}
            </View>
            {index < healthMilestones.length - 1 && (
              <View className={`w-0.5 flex-1 mt-2 ${
                milestone.achieved ? 'bg-primary-500' : 'bg-gray-200'
              }`} />
            )}
          </View>
          
          <View className="flex-1 pt-1">
            <View className="flex-row items-center justify-between mb-1">
              <Text className={`text-sm font-semibold ${
                milestone.achieved ? 'text-primary-500' : 'text-gray-400'
              }`}>
                {milestone.achieved ? '✔ ' : '⚪ '}{milestone.timeframe}
              </Text>
              <View className="opacity-70">
                {milestone.icon}
              </View>
            </View>
            
            <Text className={`text-base font-semibold mb-1 ${
              milestone.achieved ? 'text-gray-800' : 'text-gray-400'
            }`}>
              {milestone.title}
            </Text>
            
            <Text className={`text-sm leading-5 ${
              milestone.achieved ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {milestone.description}
            </Text>
          </View>
        </View>
      ))}
      
      <View className="mt-5 pt-4 border-t border-gray-200 items-center">
        <Text className="text-xs text-gray-400 italic">
          ※ WHO（世界保健機関）の研究データに基づく
        </Text>
      </View>
    </View>
  );
}
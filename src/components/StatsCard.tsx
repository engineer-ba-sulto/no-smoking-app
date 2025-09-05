import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

export function StatsCard({ icon, label, value, color }: Props) {
  return (
    <View className="bg-white rounded-xl p-4 w-[48%] mb-4 items-center shadow-sm">
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </View>
      <Text className="text-xs text-gray-600 text-center mb-1 font-medium">{label}</Text>
      <Text 
        className="text-base font-bold text-center"
        style={{ color }}
      >
        {value}
      </Text>
    </View>
  );
}
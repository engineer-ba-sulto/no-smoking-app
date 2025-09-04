import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Heart, DollarSign, Users, Plus } from 'lucide-react-native';

interface Props {
  selectedMotivations: string[];
  onSelectionChange: (motivations: string[]) => void;
}

const motivationOptions = [
  {
    id: 'health',
    label: '健康のため',
    icon: <Heart size={20} color="#EF4444" strokeWidth={2} />,
  },
  {
    id: 'money',
    label: 'お金を節約するため',
    icon: <DollarSign size={20} color="#10B981" strokeWidth={2} />,
  },
  {
    id: 'family',
    label: '家族や大切な人のため',
    icon: <Users size={20} color="#3B82F6" strokeWidth={2} />,
  },
  {
    id: 'other',
    label: 'その他...',
    icon: <Plus size={20} color="#6B7280" strokeWidth={2} />,
  },
];

export function MotivationSelector({ selectedMotivations, onSelectionChange }: Props) {
  const toggleMotivation = (motivationId: string) => {
    const isSelected = selectedMotivations.includes(motivationId);
    let newSelections;
    
    if (isSelected) {
      newSelections = selectedMotivations.filter(id => id !== motivationId);
    } else {
      newSelections = [...selectedMotivations, motivationId];
    }
    
    onSelectionChange(newSelections);
  };

  return (
    <View className="w-full">
      {motivationOptions.map((option) => {
        const isSelected = selectedMotivations.includes(option.id);
        
        return (
          <TouchableOpacity
            key={option.id}
            className={`rounded-xl mb-3 border-2 ${
              isSelected 
                ? 'bg-primary-50 border-primary-500' 
                : 'bg-gray-50 border-gray-200'
            }`}
            onPress={() => toggleMotivation(option.id)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center p-4">
              <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-4 shadow-sm">
                {option.icon}
              </View>
              <Text className={`text-base flex-1 ${
                isSelected ? 'text-gray-800 font-semibold' : 'text-gray-600 font-medium'
              }`}>
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
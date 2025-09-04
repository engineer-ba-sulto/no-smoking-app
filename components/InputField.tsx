import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  label: string;
  suffix?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export function InputField({ label, suffix, value, onChangeText, ...props }: Props) {
  return (
    <View className="mb-5">
      <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>
      <View className="flex-row items-center bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3">
        <TextInput
          className="flex-1 text-base text-gray-800 font-medium"
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
        {suffix && <Text className="text-base text-gray-600 font-medium ml-2">{suffix}</Text>}
      </View>
    </View>
  );
}
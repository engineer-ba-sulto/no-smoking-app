import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { OnboardingStepWrapper } from "./OnboardingStepWrapper";

interface NameStepProps {
  onNext: () => void;
  animatedStyle: any;
  userName: string;
  onNameChange: (name: string) => void;
}

export const NameStep = ({
  onNext,
  animatedStyle,
  userName,
  onNameChange,
}: NameStepProps) => {
  const [name, setName] = useState(userName);
  const [error, setError] = useState("");

  const handleNameChange = (text: string) => {
    setName(text);
    onNameChange(text);

    // バリデーション
    if (text.trim().length === 0) {
      setError("名前を入力してください");
    } else if (text.trim().length > 50) {
      setError("名前は50文字以内で入力してください");
    } else {
      setError("");
    }
  };

  const isValid = name.trim().length > 0 && name.trim().length <= 50;

  return (
    <OnboardingStepWrapper
      onNext={onNext}
      animatedStyle={animatedStyle}
      disabled={!isValid}
      title="お名前を教えてください"
    >
      <View className="w-full mb-6">
        <Text className="text-sm text-gray-500 text-center mb-4">
          あなたの禁煙の旅を、より個人的なものにするために
        </Text>

        <View className="bg-white/60 rounded-xl p-4 border border-white/30">
          <TextInput
            value={name}
            onChangeText={handleNameChange}
            placeholder="お名前を入力してください"
            placeholderTextColor="#9CA3AF"
            className="text-lg text-gray-800 text-center font-medium"
            maxLength={50}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => {
              if (isValid) {
                onNext();
              }
            }}
          />
        </View>

        {error ? (
          <Text className="text-red-500 text-sm text-center mt-2">{error}</Text>
        ) : (
          <Text className="text-gray-400 text-xs text-center mt-2">
            {name.length}/50文字
          </Text>
        )}
      </View>
    </OnboardingStepWrapper>
  );
};

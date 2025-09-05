import { InputField } from "@/components/InputField";
import { MotivationSelector } from "@/components/MotivationSelector";
import { NumberStepper } from "@/components/NumberStepper";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { StepButton } from "@/components/StepButton";
import { useSmokerData } from "@/hooks/useSmokerData";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Heart, Sparkles } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([]);
  const [cigarettesPerDay, setCigarettesPerDay] = useState(20);
  const [pricePerPack, setPricePerPack] = useState("600");
  const [cigarettesPerPack, setCigarettesPerPack] = useState("20");
  const [startTime, setStartTime] = useState<"now" | "later">("now");

  const { updateSmokerData } = useSmokerData();

  const fadeAnim = useSharedValue(1);
  const slideAnim = useSharedValue(0);

  useEffect(() => {
    // Slide in animation for new step
    slideAnim.value = 50;
    fadeAnim.value = 0;

    slideAnim.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
    });
    fadeAnim.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });
  }, [currentStep]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    }
  };

  const canProceedFromStep = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return selectedMotivations.length > 0;
      case 3:
        return cigarettesPerDay > 0;
      case 4:
        return pricePerPack && cigarettesPerPack;
      case 5:
        return true;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const completeOnboarding = async () => {
    const quitDate =
      startTime === "now" ? new Date().toISOString() : new Date().toISOString(); // For now, both use current time

    await updateSmokerData({
      motivations: selectedMotivations,
      cigarettesPerDay,
      pricePerPack: parseInt(pricePerPack),
      cigarettesPerPack: parseInt(cigarettesPerPack),
      quitDate,
      hasCompletedOnboarding: true,
    });

    router.replace("/(tabs)");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Animated.View
            style={animatedStyle}
            className="items-center justify-center min-h-[500px] px-5"
          >
            <View className="mb-8">
              <LinearGradient
                colors={["#10B981", "#059669"]}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={40} color="#ffffff" strokeWidth={2} />
              </LinearGradient>
            </View>
            <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
              ようこそ！
            </Text>
            <Text className="text-base text-gray-600 text-center leading-6 mb-10">
              人生を変える、大きな一歩を{"\n"}踏み出してくださり嬉しいです。
            </Text>
            <StepButton
              title="一緒にがんばる"
              onPress={nextStep}
              className="w-full mt-5"
            />
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View
            style={animatedStyle}
            className="items-center justify-center min-h-[500px] px-5"
          >
            <Text className="text-2xl font-semibold text-gray-800 text-center mb-4 leading-8">
              あなたが禁煙を決意した、{"\n"}一番の理由は何ですか？
            </Text>
            <Text className="text-sm text-gray-400 text-center mb-8">
              (複数選択可)
            </Text>
            <MotivationSelector
              selectedMotivations={selectedMotivations}
              onSelectionChange={setSelectedMotivations}
            />
            <StepButton
              title="次へ >"
              onPress={nextStep}
              disabled={!canProceedFromStep()}
              className="w-full mt-5"
            />
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View
            style={animatedStyle}
            className="items-center justify-center min-h-[500px] px-5"
          >
            <Text className="text-2xl font-semibold text-gray-800 text-center mb-4 leading-8">
              1日に、およそ何本くらい{"\n"}吸っていましたか？
            </Text>
            <View className="my-10">
              <NumberStepper
                value={cigarettesPerDay}
                onChange={setCigarettesPerDay}
                min={1}
                max={80}
                suffix="本"
              />
            </View>
            <StepButton
              title="次へ >"
              onPress={nextStep}
              className="w-full mt-5"
            />
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View
            style={animatedStyle}
            className="items-center justify-center min-h-[500px] px-5"
          >
            <Text className="text-2xl font-semibold text-gray-800 text-center mb-4 leading-8">
              いつも吸っていたタバコについて{"\n"}教えてください。
            </Text>
            <View className="w-full my-5">
              <InputField
                label="▼ タバコ1箱の価格は？"
                suffix="円"
                value={pricePerPack}
                onChangeText={setPricePerPack}
                keyboardType="numeric"
                placeholder="600"
              />
              <InputField
                label="▼ 1箱の本数は？"
                suffix="本"
                value={cigarettesPerPack}
                onChangeText={setCigarettesPerPack}
                keyboardType="numeric"
                placeholder="20"
              />
            </View>
            <StepButton
              title="次へ >"
              onPress={nextStep}
              disabled={!canProceedFromStep()}
              className="w-full mt-5"
            />
          </Animated.View>
        );

      case 5:
        return (
          <Animated.View
            style={animatedStyle}
            className="items-center justify-center min-h-[500px] px-5"
          >
            <Text className="text-2xl font-semibold text-gray-800 text-center mb-4 leading-8">
              準備は整いました。{"\n\n"}あなたの新しい人生は、{"\n"}
              いつから始まりますか？
            </Text>
            <View className="w-full my-8">
              <TouchableOpacity
                className={`rounded-xl mb-5 ${
                  startTime === "now" ? "shadow-lg" : ""
                }`}
                onPress={() => setStartTime("now")}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  style={{
                    paddingVertical: 20,
                    paddingHorizontal: 32,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text className="text-base font-semibold text-white">
                    今、この瞬間から始める
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <StepButton
                title="未来の日時を設定する"
                onPress={() => setStartTime("later")}
                variant="secondary"
              />
            </View>
            <StepButton
              title="次へ >"
              onPress={nextStep}
              className="w-full mt-5"
            />
          </Animated.View>
        );

      case 6:
        return (
          <Animated.View
            style={animatedStyle}
            className="items-center justify-center min-h-[500px] px-5"
          >
            <View className="mb-8">
              <LinearGradient
                colors={["#8B5CF6", "#7C3AED"]}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Heart size={40} color="#ffffff" strokeWidth={2} />
              </LinearGradient>
            </View>
            <Text className="text-2xl font-semibold text-gray-800 text-center mb-4 leading-8">
              私たちが24時間{"\n"}あなたに寄り添います。
            </Text>
            <Text className="text-base text-gray-600 text-center leading-6 mb-10">
              大切な節目をお祝いするために、{"\n"}
              応援メッセージを受け取ってください。
            </Text>
            <StepButton
              title="最高のサポートを受け取る"
              onPress={completeOnboarding}
              className="w-full mt-5"
            />
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white pt-12 android:pt-8">
      <OnboardingProgress currentStep={currentStep} totalSteps={6} />

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>
    </View>
  );
}

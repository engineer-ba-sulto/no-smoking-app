import {
  CigarettesStep,
  MotivationStep,
  NameStep,
  OnboardingProgress,
  PackSizeStep,
  PriceStep,
  QuestionnaireStep,
  ReadyStep,
  SupportStep,
  WelcomeStep,
} from "@/components/onboarding";
import { DEFAULT_BACKGROUND } from "@/constants/backgrounds";
import {
  ONBOARDING_SIMPLIFIED_CONFIG,
  OnboardingSimplifiedStep,
} from "@/constants/onboarding-simplified";
import { useSmokerData } from "@/hooks/useSmokerData";
import { router } from "expo-router";
import { ArrowLeft, Settings } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function OnboardingSimplifiedScreen() {
  const [currentStep, setCurrentStep] = useState<OnboardingSimplifiedStep>(
    ONBOARDING_SIMPLIFIED_CONFIG.STEPS.WELCOME
  );
  const [userName, setUserName] = useState("");
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([]);
  const [cigarettesPerDay, setCigarettesPerDay] = useState(20);
  const [pricePerPack, setPricePerPack] = useState(600);
  const [cigarettesPerPack, setCigarettesPerPack] = useState(20);

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
    if (currentStep < ONBOARDING_SIMPLIFIED_CONFIG.TOTAL_STEPS) {
      setCurrentStep((prev) => (prev + 1) as OnboardingSimplifiedStep);
    }
  };

  const prevStep = () => {
    if (currentStep > ONBOARDING_SIMPLIFIED_CONFIG.STEPS.WELCOME) {
      setCurrentStep((prev) => (prev - 1) as OnboardingSimplifiedStep);
    }
  };

  const completeOnboarding = async () => {
    try {
      const quitDate = new Date().toISOString();

      await updateSmokerData({
        userName: userName,
        motivations: selectedMotivations,
        cigarettesPerDay,
        pricePerPack,
        cigarettesPerPack,
        quitDate,
        hasCompletedOnboarding: true,
      });

      router.replace("/paywall-simplified");
    } catch (error) {
      console.error("オンボーディング完了エラー:", error);
      // エラーハンドリング - ユーザーにエラーメッセージを表示
      alert("データの保存に失敗しました。もう一度お試しください。");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case ONBOARDING_SIMPLIFIED_CONFIG.STEPS.WELCOME:
        return <WelcomeStep onNext={nextStep} animatedStyle={animatedStyle} />;

      case ONBOARDING_SIMPLIFIED_CONFIG.STEPS.NAME:
        return (
          <NameStep
            onNext={nextStep}
            animatedStyle={animatedStyle}
            userName={userName}
            onNameChange={setUserName}
          />
        );

      case ONBOARDING_SIMPLIFIED_CONFIG.STEPS.QUESTIONNAIRE:
        return (
          <QuestionnaireStep onNext={nextStep} animatedStyle={animatedStyle} />
        );

      case ONBOARDING_SIMPLIFIED_CONFIG.STEPS.MOTIVATION:
        return (
          <MotivationStep
            onNext={nextStep}
            animatedStyle={animatedStyle}
            selectedMotivations={selectedMotivations}
            onSelectionChange={setSelectedMotivations}
          />
        );

      case ONBOARDING_SIMPLIFIED_CONFIG.STEPS.CIGARETTES:
        return (
          <CigarettesStep
            onNext={nextStep}
            animatedStyle={animatedStyle}
            cigarettesPerDay={cigarettesPerDay}
            onCigarettesChange={setCigarettesPerDay}
          />
        );

      case ONBOARDING_SIMPLIFIED_CONFIG.STEPS.PRICE:
        return (
          <PriceStep
            onNext={nextStep}
            animatedStyle={animatedStyle}
            pricePerPack={pricePerPack}
            onPriceChange={setPricePerPack}
          />
        );

      case ONBOARDING_SIMPLIFIED_CONFIG.STEPS.PACK_SIZE:
        return (
          <PackSizeStep
            onNext={nextStep}
            animatedStyle={animatedStyle}
            cigarettesPerPack={cigarettesPerPack}
            onCigarettesPerPackChange={setCigarettesPerPack}
          />
        );

      case ONBOARDING_SIMPLIFIED_CONFIG.STEPS.READY:
        return <ReadyStep onNext={nextStep} animatedStyle={animatedStyle} />;

      case ONBOARDING_SIMPLIFIED_CONFIG.STEPS.SUPPORT:
        return (
          <SupportStep
            onComplete={completeOnboarding}
            animatedStyle={animatedStyle}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ImageBackground
      source={DEFAULT_BACKGROUND.source}
      className="flex-1 pt-14 android:pt-8"
      resizeMode="cover"
    >
      {/* 半透明のオーバーレイ */}
      <View className="absolute inset-0 bg-white/80" />

      {/* 戻るボタン */}
      {currentStep > ONBOARDING_SIMPLIFIED_CONFIG.STEPS.WELCOME && (
        <TouchableOpacity
          onPress={prevStep}
          className="absolute top-12 left-4 z-50 bg-white/90 rounded-full p-2 android:top-8 shadow-sm"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#374151" strokeWidth={2} />
        </TouchableOpacity>
      )}

      {/* 開発用設定ショートカットボタン */}
      {__DEV__ && (
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/settings")}
          className="absolute top-12 right-4 z-50 bg-white/90 rounded-full p-2 android:top-8 shadow-sm border-2 border-red-200"
          activeOpacity={0.7}
        >
          <Settings size={20} color="#EF4444" strokeWidth={2} />
        </TouchableOpacity>
      )}

      {/* コンテンツ */}
      <View className="flex-1 relative z-10">
        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={ONBOARDING_SIMPLIFIED_CONFIG.TOTAL_STEPS}
        />
        <View className="flex-1 px-5 justify-center">
          {renderStepContent()}
        </View>
      </View>
    </ImageBackground>
  );
}

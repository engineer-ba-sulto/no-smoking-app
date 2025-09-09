import {
  AnnualCostNewStep,
  AppearanceImpactStep,
  CigarettesStep,
  DailyCostStep,
  FamilyStep,
  HeartRiskStep,
  InvestmentStep,
  LungRiskStep,
  MotivationStep,
  NameStep,
  OnboardingProgress,
  OtherRiskStep,
  PackSizeStep,
  PassiveSmokingStep,
  PriceStep,
  QuestionnaireStep,
  ReadyStep,
  SocialConstraintsStep,
  SupportStep,
  TenYearCostStep,
  TravelExperienceStep,
  TwentyYearCostStep,
  WantsHobbiesStep,
  WelcomeStep,
} from "@/components/onboarding";
import { DEFAULT_BACKGROUND } from "@/constants/backgrounds";
import { ONBOARDING_CONFIG, OnboardingStep } from "@/constants/onboarding";
import { useSmokerData } from "@/hooks/useSmokerData";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    ONBOARDING_CONFIG.STEPS.WELCOME
  );
  const [userName, setUserName] = useState("");
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([]);
  const [cigarettesPerDay, setCigarettesPerDay] = useState(20);
  const [pricePerPack, setPricePerPack] = useState(600);
  const [cigarettesPerPack, setCigarettesPerPack] = useState(20);
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
    if (currentStep < ONBOARDING_CONFIG.TOTAL_STEPS) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    }
  };

  const prevStep = () => {
    if (currentStep > ONBOARDING_CONFIG.STEPS.WELCOME) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStep);
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

      router.replace("/(tabs)");
    } catch (error) {
      console.error("オンボーディング完了エラー:", error);
      // エラーハンドリング - ユーザーにエラーメッセージを表示
      alert("データの保存に失敗しました。もう一度お試しください。");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case ONBOARDING_CONFIG.STEPS.WELCOME:
        return <WelcomeStep onNext={nextStep} animatedStyle={animatedStyle} />;

      case ONBOARDING_CONFIG.STEPS.NAME:
        return (
          <NameStep
            onNext={nextStep}
            animatedStyle={animatedStyle}
            userName={userName}
            onNameChange={setUserName}
          />
        );

      case ONBOARDING_CONFIG.STEPS.HEART_RISK:
        return (
          <HeartRiskStep onNext={nextStep} animatedStyle={animatedStyle} />
        );

      case ONBOARDING_CONFIG.STEPS.LUNG_RISK:
        return <LungRiskStep onNext={nextStep} animatedStyle={animatedStyle} />;

      case ONBOARDING_CONFIG.STEPS.OTHER_RISK:
        return (
          <OtherRiskStep onNext={nextStep} animatedStyle={animatedStyle} />
        );

      case ONBOARDING_CONFIG.STEPS.DAILY_COST:
        return (
          <DailyCostStep onNext={nextStep} animatedStyle={animatedStyle} />
        );

      case ONBOARDING_CONFIG.STEPS.ANNUAL_COST:
        return (
          <AnnualCostNewStep onNext={nextStep} animatedStyle={animatedStyle} />
        );

      case ONBOARDING_CONFIG.STEPS.TEN_YEAR_COST:
        return (
          <TenYearCostStep onNext={nextStep} animatedStyle={animatedStyle} />
        );

      case ONBOARDING_CONFIG.STEPS.TWENTY_YEAR_COST:
        return (
          <TwentyYearCostStep onNext={nextStep} animatedStyle={animatedStyle} />
        );

      case ONBOARDING_CONFIG.STEPS.TRAVEL_EXPERIENCE:
        return (
          <TravelExperienceStep
            onNext={nextStep}
            animatedStyle={animatedStyle}
          />
        );

      case ONBOARDING_CONFIG.STEPS.WANTS_HOBBIES:
        return (
          <WantsHobbiesStep onNext={nextStep} animatedStyle={animatedStyle} />
        );

      case ONBOARDING_CONFIG.STEPS.INVESTMENT:
        return (
          <InvestmentStep onNext={nextStep} animatedStyle={animatedStyle} />
        );

      case ONBOARDING_CONFIG.STEPS.FAMILY:
        return <FamilyStep onNext={nextStep} animatedStyle={animatedStyle} />;

      case ONBOARDING_CONFIG.STEPS.PASSIVE_SMOKING:
        return (
          <PassiveSmokingStep onNext={nextStep} animatedStyle={animatedStyle} />
        );

      case ONBOARDING_CONFIG.STEPS.APPEARANCE_IMPACT:
        return (
          <AppearanceImpactStep
            onNext={nextStep}
            animatedStyle={animatedStyle}
          />
        );

      case ONBOARDING_CONFIG.STEPS.SOCIAL_CONSTRAINTS:
        return (
          <SocialConstraintsStep
            onNext={nextStep}
            animatedStyle={animatedStyle}
          />
        );

      case ONBOARDING_CONFIG.STEPS.QUESTIONNAIRE:
        return (
          <QuestionnaireStep onNext={nextStep} animatedStyle={animatedStyle} />
        );

      case ONBOARDING_CONFIG.STEPS.MOTIVATION:
        return (
          <MotivationStep
            onNext={nextStep}
            animatedStyle={animatedStyle}
            selectedMotivations={selectedMotivations}
            onSelectionChange={setSelectedMotivations}
          />
        );

      case ONBOARDING_CONFIG.STEPS.CIGARETTES:
        return (
          <CigarettesStep
            onNext={nextStep}
            animatedStyle={animatedStyle}
            cigarettesPerDay={cigarettesPerDay}
            onCigarettesChange={setCigarettesPerDay}
          />
        );

      case ONBOARDING_CONFIG.STEPS.PRICE:
        return (
          <PriceStep
            onNext={nextStep}
            animatedStyle={animatedStyle}
            pricePerPack={pricePerPack}
            onPriceChange={setPricePerPack}
          />
        );

      case ONBOARDING_CONFIG.STEPS.PACK_SIZE:
        return (
          <PackSizeStep
            onNext={nextStep}
            animatedStyle={animatedStyle}
            cigarettesPerPack={cigarettesPerPack}
            onCigarettesPerPackChange={setCigarettesPerPack}
          />
        );

      case ONBOARDING_CONFIG.STEPS.READY:
        return <ReadyStep onNext={nextStep} animatedStyle={animatedStyle} />;

      case ONBOARDING_CONFIG.STEPS.SUPPORT:
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
      {currentStep > ONBOARDING_CONFIG.STEPS.WELCOME && (
        <TouchableOpacity
          onPress={prevStep}
          className="absolute top-12 left-4 z-50 bg-white/90 rounded-full p-2 android:top-8 shadow-sm"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#374151" strokeWidth={2} />
        </TouchableOpacity>
      )}

      {/* コンテンツ */}
      <View className="flex-1 relative z-10">
        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={ONBOARDING_CONFIG.TOTAL_STEPS}
        />
        <View className="flex-1 px-5 justify-center">
          {renderStepContent()}
        </View>
      </View>
    </ImageBackground>
  );
}

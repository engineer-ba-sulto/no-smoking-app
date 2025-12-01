import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Pause, Play, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  onClose: () => void;
  onComplete: () => void;
}

export function BreathingTimer({ onClose, onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);
  const breathingIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // メインタイマーの管理
  useEffect(() => {
    if (isActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            // タイマー終了
            onComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      // 停止時はタイマーをクリア
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isActive]);

  // 呼吸サイクルの管理
  useEffect(() => {
    if (isActive) {
      const breathingCycle = () => {
        // Inhale phase (4 seconds)
        setPhase("inhale");
        scale.value = withTiming(1.3, {
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
        });
        opacity.value = withTiming(0.8, {
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
        });

        setTimeout(() => {
          // Hold phase (4 seconds)
          setPhase("hold");
        }, 4000);

        setTimeout(() => {
          // Exhale phase (4 seconds)
          setPhase("exhale");
          scale.value = withTiming(1, {
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
          });
          opacity.value = withTiming(0.3, {
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
          });
        }, 8000);
      };

      // 最初のサイクルを開始
      breathingCycle();

      // 12秒ごとにサイクルを繰り返し
      breathingIntervalRef.current = setInterval(breathingCycle, 12000);
    } else {
      // 停止時はリセット
      setPhase("inhale");
      scale.value = withTiming(1, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(0.3, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });

      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
        breathingIntervalRef.current = null;
      }
    }

    return () => {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
        breathingIntervalRef.current = null;
      }
    };
  }, [isActive, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "息を吸って...";
      case "hold":
        return "息を止めて...";
      case "exhale":
        return "息を吐いて...";
      default:
        return "";
    }
  };

  // 開始/停止ボタンのハンドラー
  const handleToggleTimer = () => {
    if (isActive) {
      // 停止時：軽い振動
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      // 開始時：中程度の振動
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsActive(!isActive);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-end px-5 pt-12 pb-2">
        <TouchableOpacity className="p-2" onPress={onClose}>
          <X size={24} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Main content - centered */}
      <View className="flex-1 items-center justify-center px-5">
        {/* Timer display */}
        <View className="items-center mb-8">
          <Text className="text-6xl font-bold text-gray-800 mb-3">
            {formatTime(timeLeft)}
          </Text>
        </View>

        {/* Breathing circle */}
        <View className="items-center justify-center mb-12">
          <Animated.View
            style={[
              { width: 300, height: 300, borderRadius: 150 },
              animatedStyle,
            ]}
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 150,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text className="text-3xl font-bold text-white text-center">
                {isActive ? getPhaseText() : "深呼吸を始めましょう"}
              </Text>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Control button */}
        <TouchableOpacity
          className="rounded-xl shadow-lg mb-6"
          onPress={handleToggleTimer}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 18,
              paddingHorizontal: 40,
              borderRadius: 12,
            }}
          >
            {isActive ? (
              <Pause size={28} color="#ffffff" strokeWidth={2} />
            ) : (
              <Play size={28} color="#ffffff" strokeWidth={2} />
            )}
            <Text className="text-lg font-semibold text-white ml-3">
              {isActive ? "一時停止" : "開始"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Instructions */}
        <View className="px-5">
          <Text className="text-base text-gray-600 text-center leading-6">
            ゆっくりと深く呼吸し、心を落ち着けてください。
          </Text>
        </View>
      </View>
    </View>
  );
}

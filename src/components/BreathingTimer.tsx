import { LinearGradient } from "expo-linear-gradient";
import { Pause, Play, X } from "lucide-react-native";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  useEffect(() => {
    if (isActive) {
      // Breathing animation cycle: 4 seconds in, 4 seconds hold, 4 seconds out
      const breathingCycle = () => {
        // Inhale
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
          // Hold
          setPhase("hold");
        }, 4000);

        setTimeout(() => {
          // Exhale
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

      breathingCycle();
      const cycleInterval = setInterval(breathingCycle, 12000);

      return () => clearInterval(cycleInterval);
    }
  }, [isActive]);

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

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-end px-5 pt-12 pb-2">
        <TouchableOpacity className="p-2" onPress={onClose}>
          <X size={24} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-between px-5 pb-10">
        {/* Timer display */}
        <View className="items-center mt-5">
          <Text className="text-4xl font-bold text-gray-800 mb-2">
            {formatTime(timeLeft)}
          </Text>
          <Text className="text-lg text-gray-600 font-medium">
            {isActive ? getPhaseText() : "深呼吸を始めましょう"}
          </Text>
        </View>

        {/* Breathing circle */}
        <View className="items-center justify-center flex-1">
          <Animated.View
            style={[
              { width: 200, height: 200, borderRadius: 100 },
              animatedStyle,
            ]}
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 100,
              }}
            />
          </Animated.View>
        </View>

        {/* Control button */}
        <TouchableOpacity
          className="rounded-xl shadow-lg"
          onPress={() => setIsActive(!isActive)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 12,
            }}
          >
            {isActive ? (
              <Pause size={24} color="#ffffff" strokeWidth={2} />
            ) : (
              <Play size={24} color="#ffffff" strokeWidth={2} />
            )}
            <Text className="text-base font-semibold text-white ml-2">
              {isActive ? "一時停止" : "開始"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Instructions */}
        <View className="px-5 mt-5">
          <Text className="text-sm text-gray-600 text-center leading-5">
            ゆっくりと深く呼吸し、心を落ち着けてください。
          </Text>
        </View>
      </View>
    </View>
  );
}

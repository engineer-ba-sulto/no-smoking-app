import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { useSmokerData } from "@/hooks/useSmokerData";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "../global.css";

export default function RootLayout() {
  useFrameworkReady();
  const { smokerData, loading } = useSmokerData();

  useEffect(() => {
    if (!loading && smokerData) {
      if (!smokerData.hasCompletedOnboarding) {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [loading, smokerData]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

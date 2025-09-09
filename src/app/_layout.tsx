import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { useSmokerData } from "@/hooks/useSmokerData";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../drizzle";
import migrations from "../drizzle/migrations";
import "../global.css";

export default function RootLayout() {
  useFrameworkReady();
  const { smokerData, loading } = useSmokerData();
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (!loading && smokerData) {
      if (!smokerData.hasCompletedOnboarding) {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [loading, smokerData]);

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Migration error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  if (!success) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text>Migration is in progress...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings/cigarettes-setting" />
        <Stack.Screen name="settings/price-setting" />
        <Stack.Screen name="database-manager" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

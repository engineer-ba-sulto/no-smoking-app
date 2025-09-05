import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { useSmokerData } from "@/hooks/useSmokerData";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Text, View } from "react-native";
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
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
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

import { PurchaseProvider } from "@/contexts/PurchaseProvider";
import { shouldShowDeveloperFeatures } from "@/utils/dev-environment";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../drizzle";
import migrations from "../drizzle/migrations";
import "../global.css";

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [dbInitError, setDbInitError] = useState<Error | null>(null);
  const [hasUserData, setHasUserData] = useState<boolean | null>(null);

  // DB初期化処理
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log("Starting database initialization...");

        // データベース接続の確認（テーブルが作成されているかチェック）
        await db.query.userProfile.findFirst();

        // ユーザーデータの存在確認
        const profiles = await db.query.userProfile.findMany();
        setHasUserData(profiles.length > 0);

        setIsDbInitialized(true);
        console.log("Database initialization completed - tables are ready");
      } catch (err) {
        console.error("Database initialization error:", err);
        setDbInitError(
          err instanceof Error ? err : new Error("Unknown initialization error")
        );
      }
    };

    // マイグレーションが成功した場合のみDB初期化を実行
    if (success) {
      initializeDatabase();
    }
  }, [success]);

  // ルーティング処理
  useEffect(() => {
    // テーブルが作成され、データの存在確認が完了した場合のみルーティング
    if (isDbInitialized && hasUserData !== null) {
      if (hasUserData === false) {
        // テーブルは作成されているがデータがない場合 → オンボーディング
        console.log("No user data found, redirecting to onboarding");
        // 開発環境では省略版オンボーディングを使用
        if (shouldShowDeveloperFeatures()) {
          router.replace("/onboarding-simplified");
        } else {
          router.replace("/onboarding");
        }
      } else {
        // データが存在する場合 → メインアプリ
        console.log("User data found, redirecting to main app");
        router.replace("/(tabs)");
      }
    }
  }, [isDbInitialized, hasUserData]);

  // エラーハンドリング
  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Migration error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  if (dbInitError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Database initialization error: {dbInitError.message}</Text>
      </SafeAreaView>
    );
  }

  // 初期化中の表示
  if (!success || !isDbInitialized || hasUserData === null) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text>Initializing database...</Text>
      </SafeAreaView>
    );
  }

  return (
    <PurchaseProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="onboarding-simplified" />
        <Stack.Screen name="paywall" />
        <Stack.Screen name="paywall-simplified" />
        <Stack.Screen
          name="one-time-offer"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings/cigarettes-setting" />
        <Stack.Screen name="settings/price-setting" />
        <Stack.Screen name="settings/name-setting" />
        <Stack.Screen name="database-manager" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </PurchaseProvider>
  );
}

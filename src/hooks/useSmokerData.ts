import AsyncStorage from "@react-native-async-storage/async-storage";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { db } from "../drizzle";
import { userProfile } from "../drizzle/schema";

export interface SmokerData {
  name?: string;
  motivations: string[];
  cigarettesPerDay: number;
  pricePerPack: number;
  cigarettesPerPack: number;
  quitDate: string;
  motivationNotifications: boolean;
  achievementNotifications: boolean;
  hasCompletedOnboarding: boolean;
}

export function useSmokerData() {
  const [smokerData, setSmokerData] = useState<SmokerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // データベースからユーザープロフィールを取得
      const profiles = await db.select().from(userProfile);

      if (profiles.length > 0) {
        const profile = profiles[0];
        const smokerData: SmokerData = {
          name: "あなた",
          motivations: [],
          cigarettesPerDay: profile.cigsPerDay,
          pricePerPack: profile.pricePerPack,
          cigarettesPerPack: profile.cigsPerPack,
          quitDate: profile.smokingStartDate,
          motivationNotifications: true,
          achievementNotifications: true,
          hasCompletedOnboarding: true,
        };
        setSmokerData(smokerData);
      } else {
        // データベースにデータがない場合はAsyncStorageから読み込み
        const stored = await AsyncStorage.getItem("smokerData");
        if (stored) {
          setSmokerData(JSON.parse(stored));
        } else {
          // データがない場合はnullを設定（表示しない）
          setSmokerData(null);
        }
      }
    } catch (error) {
      console.error("Error loading smoker data:", error);
      setSmokerData(null);
    } finally {
      setLoading(false);
    }
  };

  const updateSmokerData = async (updates: Partial<SmokerData>) => {
    try {
      const updatedData = { ...smokerData, ...updates } as SmokerData;

      // データベースにプロフィールが存在する場合は更新
      const profiles = await db.select().from(userProfile);
      if (profiles.length > 0) {
        await db
          .update(userProfile)
          .set({
            cigsPerDay: updatedData.cigarettesPerDay,
            pricePerPack: updatedData.pricePerPack,
            cigsPerPack: updatedData.cigarettesPerPack,
            smokingStartDate: updatedData.quitDate,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(userProfile.id, profiles[0].id));
      }

      // AsyncStorageの更新は削除
      setSmokerData(updatedData);
    } catch (error) {
      console.error("Error updating smoker data:", error);
    }
  };

  return {
    smokerData,
    loading,
    updateSmokerData,
  };
}

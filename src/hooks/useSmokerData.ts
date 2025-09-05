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

const defaultData: SmokerData = {
  name: "あなた",
  motivations: [],
  cigarettesPerDay: 20,
  pricePerPack: 600,
  cigarettesPerPack: 20,
  quitDate: new Date().toISOString(),
  motivationNotifications: true,
  achievementNotifications: true,
  hasCompletedOnboarding: false,
};

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
          setSmokerData(defaultData);
        }
      }
    } catch (error) {
      console.error("Error loading smoker data:", error);
      setSmokerData(defaultData);
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

      // AsyncStorageも更新（フォールバック用）
      await AsyncStorage.setItem("smokerData", JSON.stringify(updatedData));
      setSmokerData(updatedData);
    } catch (error) {
      console.error("Error updating smoker data:", error);
    }
  };

  const resetData = async () => {
    try {
      await AsyncStorage.removeItem("smokerData");
      setSmokerData(defaultData);
    } catch (error) {
      console.error("Error resetting data:", error);
    }
  };

  return {
    smokerData,
    loading,
    updateSmokerData,
    resetData,
  };
}

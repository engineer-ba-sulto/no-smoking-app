import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { userProfileRepository } from "../drizzle/repositories/user-profile-repository";

export interface SmokerData {
  userName: string;
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

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // データベースからユーザープロフィールを取得
      const profiles = await userProfileRepository.findAll();

      if (profiles.length > 0) {
        const profile = profiles[0];
        const newSmokerData: SmokerData = {
          userName: profile.userName,
          motivations: profile.motivations
            ? JSON.parse(profile.motivations)
            : [],
          cigarettesPerDay: profile.cigsPerDay,
          pricePerPack: profile.pricePerPack,
          cigarettesPerPack: profile.cigsPerPack,
          quitDate: profile.smokingStartDate,
          motivationNotifications: true,
          achievementNotifications: true,
          hasCompletedOnboarding: profile.hasCompletedOnboarding,
        };
        setSmokerData(newSmokerData);
      } else {
        // データベースにデータがない場合はAsyncStorageから読み込み
        const stored = await AsyncStorage.getItem("smokerData");
        if (stored) {
          const parsedData = JSON.parse(stored);
          setSmokerData(parsedData);
        } else {
          setSmokerData(null);
        }
      }
    } catch (error) {
      console.error("Error loading smoker data:", error);
      setSmokerData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const updateSmokerData = useCallback(
    async (updates: Partial<SmokerData>) => {
      try {
        const updatedData = { ...smokerData, ...updates } as SmokerData;

        // データベースにプロフィールが存在する場合は更新
        const profiles = await userProfileRepository.findAll();

        if (profiles.length > 0) {
					await userProfileRepository.update(profiles[0].id, {
						userName: updatedData.userName,
            cigsPerDay: updatedData.cigarettesPerDay,
            pricePerPack: updatedData.pricePerPack,
            cigsPerPack: updatedData.cigarettesPerPack,
            smokingStartDate: updatedData.quitDate,
            motivations: JSON.stringify(updatedData.motivations),
            hasCompletedOnboarding: updatedData.hasCompletedOnboarding,
          });

          // データベース更新後にローカル状態を更新
          setSmokerData(updatedData);
        } else {
					// プロフィールがない場合は新規作成
          if (updatedData.hasCompletedOnboarding) {
						await userProfileRepository.create({
							userName: updatedData.userName,
              smokingStartDate: updatedData.quitDate,
              cigsPerDay: updatedData.cigarettesPerDay,
              pricePerPack: updatedData.pricePerPack,
              cigsPerPack: updatedData.cigarettesPerPack,
              motivations: JSON.stringify(updatedData.motivations),
              hasCompletedOnboarding: updatedData.hasCompletedOnboarding,
            });
          }

          // ローカル状態を更新
          setSmokerData(updatedData);
        }
      } catch (error) {
        console.error("Error updating smoker data:", error);
        throw error;
      }
    },
    [smokerData]
  );

  return {
    smokerData,
    loading,
    updateSmokerData,
    loadData,
  };
}

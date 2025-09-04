import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  name: 'あなた',
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
      const stored = await AsyncStorage.getItem('smokerData');
      if (stored) {
        setSmokerData(JSON.parse(stored));
      } else {
        setSmokerData(defaultData);
      }
    } catch (error) {
      console.error('Error loading smoker data:', error);
      setSmokerData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  const updateSmokerData = async (updates: Partial<SmokerData>) => {
    try {
      const updatedData = { ...smokerData, ...updates } as SmokerData;
      await AsyncStorage.setItem('smokerData', JSON.stringify(updatedData));
      setSmokerData(updatedData);
    } catch (error) {
      console.error('Error updating smoker data:', error);
    }
  };

  const resetData = async () => {
    try {
      await AsyncStorage.removeItem('smokerData');
      setSmokerData(defaultData);
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  return {
    smokerData,
    loading,
    updateSmokerData,
    resetData,
  };
}
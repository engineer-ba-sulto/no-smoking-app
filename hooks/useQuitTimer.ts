import { useState, useEffect } from 'react';

interface QuitStats {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  moneySaved: number;
  cigarettesNotSmoked: number;
  lifeExtended: string;
  nextMilestone: string;
}

export function useQuitTimer(quitDate?: string, cigarettesPerDay = 20, pricePerPack = 600, cigarettesPerPack = 20) {
  const [quitStats, setQuitStats] = useState<QuitStats>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    moneySaved: 0,
    cigarettesNotSmoked: 0,
    lifeExtended: '0分',
    nextMilestone: '1日',
  });

  useEffect(() => {
    if (!quitDate) return;

    const calculateStats = () => {
      const quitTime = new Date(quitDate);
      const now = new Date();
      const diffInMs = now.getTime() - quitTime.getTime();
      
      if (diffInMs < 0) {
        return;
      }

      const totalSeconds = Math.floor(diffInMs / 1000);
      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const pricePerCigarette = pricePerPack / cigarettesPerPack;
      
      const daysElapsed = totalSeconds / (24 * 3600);
      const cigarettesNotSmoked = Math.floor(daysElapsed * cigarettesPerDay);
      const moneySaved = Math.floor(cigarettesNotSmoked * pricePerCigarette);
      
      // Life extension calculation (11 minutes per cigarette)
      const lifeExtendedMinutes = cigarettesNotSmoked * 11;
      const lifeExtendedHours = Math.floor(lifeExtendedMinutes / 60);
      const lifeExtendedDays = Math.floor(lifeExtendedHours / 24);
      
      let lifeExtended = '';
      if (lifeExtendedDays > 0) {
        lifeExtended = `${lifeExtendedDays}日と${lifeExtendedHours % 24}時間`;
      } else if (lifeExtendedHours > 0) {
        lifeExtended = `${lifeExtendedHours}時間${lifeExtendedMinutes % 60}分`;
      } else {
        lifeExtended = `${lifeExtendedMinutes}分`;
      }

      // Next milestone calculation
      let nextMilestone = '';
      if (days < 1) {
        nextMilestone = `あと ${24 - hours}時間`;
      } else if (days < 7) {
        nextMilestone = `あと ${7 - days}日`;
      } else if (days < 30) {
        nextMilestone = `あと ${30 - days}日`;
      } else if (days < 100) {
        nextMilestone = `あと ${100 - days}日`;
      } else {
        nextMilestone = '大きな目標達成済み！';
      }

      setQuitStats({
        days,
        hours,
        minutes,
        seconds,
        totalSeconds,
        moneySaved,
        cigarettesNotSmoked,
        lifeExtended,
        nextMilestone,
      });
    };

    calculateStats();
    const interval = setInterval(calculateStats, 1000);

    return () => clearInterval(interval);
  }, [quitDate, cigarettesPerDay, pricePerPack, cigarettesPerPack]);

  return { quitStats };
}
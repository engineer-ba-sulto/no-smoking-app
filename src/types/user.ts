export interface UserProfile {
  smokingHabit: {
    cigarettesPerDay: number; // 1日の喫煙本数
    pricePerPack: number; // 1箱あたりの価格
    cigarettesPerPack: number; // 1箱あたりの本数
  };
  quitDate: Date; // 禁煙開始日時
  // その他、計算に必要なプロパティ
}

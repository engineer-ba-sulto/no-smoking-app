// オンボーディング背景画像の設定
export const ONBOARDING_BACKGROUNDS = {
  BG01: {
    source: require("@/assets/images/bg01.png"),
    name: "bg01",
    description: "推奨背景 - 落ち着いたトーン",
  },
  BG02: {
    source: require("@/assets/images/bg02.png"),
    name: "bg02",
    description: "代替背景2",
  },
  BG03: {
    source: require("@/assets/images/bg03.png"),
    name: "bg03",
    description: "代替背景3",
  },
} as const;

// 背景画像の選択（ここを変更して背景を切り替え可能）
// BG01, BG02, BG03 から選択
const SELECTED_BACKGROUND = "BG02";

// デフォルトの背景画像
export const DEFAULT_BACKGROUND = ONBOARDING_BACKGROUNDS[SELECTED_BACKGROUND];

// 背景画像のオーバーレイ設定
export const BACKGROUND_OVERLAY = {
  opacity: 0.8, // 80%の白いオーバーレイ
  // color: "white",
} as const;

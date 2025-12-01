require("dotenv").config();

// app.config.js
// 既存のapp.jsonを読み込んで、環境変数をextraセクションに追加
const baseConfig = require("./app.json");

module.exports = {
  ...baseConfig.expo,
  extra: {
    ...baseConfig.expo.extra,
    // RevenueCat API Keysを環境変数から読み込んでextraに追加
    // 本番環境ではConstants.expoConfig.extra.revenueCatから取得可能
    revenueCat: {
      // 本番用APIキー（本番環境用）
      iosApiKey: process.env.EXPO_PUBLIC_RC_APIKEY_IOS,
      androidApiKey: process.env.EXPO_PUBLIC_RC_APIKEY_ANDROID,
    },
  },
};

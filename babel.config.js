module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // プラグインの順序を変更
      ["inline-import", { extensions: [".sql"] }], // SQLファイルのインライン化
      "react-native-worklets/plugin", // ReanimatedのWorkletsサポート（最後に配置）
    ],
  };
};

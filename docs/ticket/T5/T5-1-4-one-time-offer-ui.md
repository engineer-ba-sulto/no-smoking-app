# T5-1-4: ワンタイムオファー画面 UI 実装

## 概要

初回オファー画面を閉じたユーザーに対して表示する、「ワンタイムオファー」専用の画面を `src/app/one-time-offer.tsx` として作成し、UI を実装します。

## 目的

- 緊急性と希少性を演出し、初回オファーで購入しなかったユーザーのコンバージョンを促す。
- 大幅な割引を提示することで、ユーザーの購入意欲を最大化する。

## 依存関係

- **依存タスク**: `T5-1-2`
- **担当領域**: UI 開発

## 実装詳細

### 1. 新規ファイル作成

- `src/app/one-time-offer.tsx` という名前で新しいファイルを作成します。

### 2. `one-time-offer.tsx` の完全なコード

- 以下のコードを `src/app/one-time-offer.tsx` にコピー＆ペーストしてください。
- この UI は、「二度と表示されない」という緊急性と、月額換算での価格の安さを強調するデザインになっています。

```tsx
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { X } from "lucide-react-native";

export default function OneTimeOfferScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900 text-white">
      <StatusBar style="light" />

      {/* 閉じるボタン */}
      <View style={styles.closeButton}>
        <TouchableOpacity className="p-1">
          <X size={24} className="text-gray-400" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center p-6">
        <View className="bg-orange-500 px-4 py-1 rounded-full mb-4">
          <Text className="text-white font-bold text-sm">一度きりのオファー</Text>
        </View>

        <Text className="text-white text-3xl font-extrabold text-center mb-2">
          お見逃しなく！
        </Text>
        <Text className="text-gray-400 text-center mb-8">
          このオファーは二度と表示されません。
        </Text>

        <View className="w-full bg-gray-800 rounded-2xl p-8 items-center border border-orange-500 shadow-lg shadow-orange-900/50">
          <Text className="text-white text-lg font-semibold">年間プラン</Text>
          <View className="flex-row items-baseline my-4">
            <Text className="text-white text-5xl font-extrabold">¥125</Text>
            <Text className="text-gray-400 text-2xl font-semibold">/mo</Text>
          </View>
          <Text className="text-gray-400 font-medium mb-6">
            年額 ¥1,500 の一括払い
          </Text>

          <View className="bg-green-500 px-4 py-1 rounded-full">
            <Text className="text-white font-bold text-sm">
              70%割引
            </Text>
          </View>
        </View>

        <TouchableOpacity className="bg-orange-500 w-full rounded-xl py-4 items-center mt-8 shadow-lg shadow-orange-400/30">
          <Text className="text-white text-lg font-bold">
            最安値でゲットする
          </Text>
        </TouchableOpacity>

        <Text className="text-gray-500 text-xs text-center mt-4">
          縛りなし、いつでもキャンセル可能です。
        </Text>
      </View>

      <View
        className={`px-6 ${
          Platform.OS === "ios" ? "pb-8" : "pb-4"
        } items-center`}
      >
        <Text className="text-xs text-gray-500">史上最安値。</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 20 : 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 999,
  },
});

## 実装手順

1. `src/app` ディレクトリに `one-time-offer.tsx` ファイルを新規作成します。
2. 上記のコードをファイルにコピー＆ペーストします。
3. アプリのナビゲーションを一時的に変更するか、直接この画面を開くなどして、UI が正しく表示されることを確認します。（正式なナビゲーションは `T5-5` フェーズで実装）
4. デザインが戦略（緊急性、割引率の強調）を反映していることを確認します。

## 完了条件

- [ ] `src/app/one-time-offer.tsx` ファイルが作成され、UI コードが実装されている。
- [ ] 「一度きりのオファー」バッジ、価格、割引率などが正しく表示される。
- [ ] 画面全体のスタイリングが適用されている。

## 次のタスク

- **T5-1-5**: 確認用ペイウォール画面遷移の実装
```

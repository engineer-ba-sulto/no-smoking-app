# T5-1-1: paywall.tsx ファイル作成

## 概要

ペイウォール画面を表示するための新しいファイル `src/app/paywall.tsx` を作成します。

## 目的

- ペイウォール画面用のコンポーネントを配置する基盤を作成する。
- Expo Router のファイルベースルーティングに新しい画面を追加する。

## 依存関係

- **依存タスク**: `T5-1-0`
- **担当領域**: ファイル構成

## 実装詳細

### 1. 作成するファイル

- **パス**: `src/app/paywall.tsx`

### 2. ファイルの初期コンテンツ

```tsx
import { Text, View } from "react-native";

export default function PaywallScreen() {
  return (
    <View>
      <Text>Paywall Screen</Text>
    </View>
  );
}
```

## 実装手順

1.  **`src/app/` ディレクトリに `paywall.tsx` を作成する**

    ```bash
    touch src/app/paywall.tsx
    ```

2.  **初期コンテンツをファイルに記述する**

    - 上記の「ファイルの初期コンテンツ」をコピーして `src/app/paywall.tsx` に貼り付けます。

3.  **Expo Router の設定を更新する**

    - `src/app/_layout.tsx` の `Stack.Screen` に `<Stack.Screen name="paywall" />` を追加する
    - これにより `/paywall` ルートが正しく認識されるようになります

4.  **動作確認**
    - 開発サーバーを起動し、ブラウザまたはシミュレータで `/paywall` にアクセスして "Paywall Screen" と表示されることを確認します。

## 完了条件

- [ ] `src/app/paywall.tsx` ファイルが作成されている。
- [ ] ファイルに初期コンテンツが記述されている。
- [ ] `src/app/_layout.tsx` に `paywall` スクリーンが登録されている。
- [ ] `/paywall` ルートにアクセスして画面が表示される。

## 追加実装（開発時の利便性向上）

### 開発者向けナビゲーション追加

開発中の動作確認を容易にするため、設定画面の開発者向けセクションにペイウォール画面へのナビゲーションボタンを追加しました。

**実装内容:**

- `src/app/(tabs)/settings.tsx` の開発者向けセクションに「ペイウォール画面」ボタンを追加
- CreditCard アイコンを使用（オレンジ色）
- タップ時に `/paywall` にナビゲート

**実装手順:**

1. `lucide-react-native` から `CreditCard` アイコンをインポート
2. 開発者向けセクションの `items` 配列に新しいアイテムを追加
3. `onPress: () => router.push("/paywall")` でナビゲーション設定

## 次のタスク

- **T5-1-2**: UI コンポーネントの実装

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

3.  **動作確認**
    - 開発サーバーを起動し、ブラウザまたはシミュレータで `/paywall` にアクセスして "Paywall Screen" と表示されることを確認します。

## 完了条件

- [ ] `src/app/paywall.tsx` ファイルが作成されている。
- [ ] ファイルに初期コンテンツが記述されている。
- [ ] `/paywall` ルートにアクセスして画面が表示される。

## 次のタスク

- **T5-1-2**: UI コンポーネントの実装

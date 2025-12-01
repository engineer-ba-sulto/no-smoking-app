# T5-1-3: 閉じるボタンの実装

## 概要

ペイウォール画面のヘッダーに、画面を閉じることができる「閉じる」ボタンを実装します。

## 目的

- ユーザーがペイウォール画面をスキップし、後のタイミングで再検討できるようにする。
- アプリの操作性を向上させる。

## 依存関係

- **依存タスク**: `T5-1-2`
- **担当領域**: UI/UX 開発

## 実装詳細

`T5-1-2` で作成した `src/app/paywall.tsx` のコードに、以下の変更を加えます。

### 1. 必要なモジュールのインポート

- `lucide-react-native` から `X` アイコンをインポートします。
- `react-native` から `StyleSheet`, `Platform`, `TouchableOpacity`, `View` をインポートします。

```tsx
// src/app/paywall.tsx

import {
  // ...
  StyleSheet,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { CheckCircle2, X } from "lucide-react-native";
// ...
```

### 2. UI の追加

- `SafeAreaView` の直下に、「閉じる」ボタンを配置します。ボタンは常に表示されます。

```tsx
// src/app/paywall.tsx

// ...
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* 閉じるボタンを追加 */}
      <View style={styles.closeButton}>
        <TouchableOpacity className="p-1">
          <X size={24} className="text-gray-400" />
        </TouchableOpacity>
      </View>

      <ScrollView
        // ...
      >
      {/* ... */}
      </ScrollView>
      {/* ... */}
    </SafeAreaView>
  );
}

// StyleSheetを追加
const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
```

## 実装手順

1.  **インポート文を更新する**: `X` アイコン、`StyleSheet` などをインポートします。
2.  **UI を追加する**: `SafeAreaView` の直下に、閉じるボタンを追加します。
3.  **StyleSheet を追加する**: ファイルの末尾に `styles` を定義します。
4.  **動作確認**: 画面表示後、常に左上に「×」ボタンが表示されることを確認します。

## 完了条件

- [ ] 画面表示直後から「閉じる」ボタンが表示される。

## 次のタスク

- **T5-1-4**: ワンタイムオファー画面 UI 実装

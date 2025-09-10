# T5-1-3: 閉じるボタンの遅延表示

## 概要

ペイウォール画面のヘッダーに配置する「閉じる」ボタンを、画面表示から 5 秒後にフェードインで表示させるロジックを実装します。

## 目的

- ユーザーに一度料金プランを見てもらう機会を確保する。
- UI に時間差でのインタラクション要素を追加する。

## 依存関係

- **依存タスク**: `T5-1-2`
- **担当領域**: UI/UX 開発

## 実装詳細

`T5-1-2` で作成した `src/app/paywall.tsx` のコードに、以下の変更を加えます。

### 1. 必要なモジュールのインポート

- `react` から `useEffect` をインポートします。
- `lucide-react-native` から `X` アイコンをインポートします。
- `react-native-reanimated` を利用してアニメーションを実装します。

```tsx
// src/app/paywall.tsx

// ...
import {
  // ...
  StyleSheet, // 追加
} from "react-native";
import { CheckCircle2, X } from "lucide-react-native"; // Xを追加
import { useState, useEffect } from "react"; // useEffectを追加
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
// ...
```

### 2. ロジックの追加

- `PaywallScreen` コンポーネント内に、表示状態を管理する `state` とアニメーションの値、`useEffect` を追加します。

```tsx
// src/app/paywall.tsx

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(MOCK_PLANS[0]);
  const [isCloseButtonVisible, setCloseButtonVisible] = useState(false); // 追加

  const opacity = useSharedValue(0); // 追加

  const animatedStyle = useAnimatedStyle(() => {
    // 追加
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    // 追加
    const timer = setTimeout(() => {
      setCloseButtonVisible(true);
      opacity.value = withTiming(1, { duration: 500 });
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  // ... (PlanOptionコンポーネント)
  // ...
}
```

### 3. UI の追加

- `SafeAreaView` の直下に、「閉じる」ボタンを配置します。

```tsx
// src/app/paywall.tsx

// ...
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* 閉じるボタンを追加 */}
      {isCloseButtonVisible && (
        <Animated.View style={[styles.closeButton, animatedStyle]}>
          <TouchableOpacity className="p-1">
            <X size={24} className="text-gray-400" />
          </TouchableOpacity>
        </Animated.View>
      )}

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

1.  **インポート文を更新する**: `useEffect`, `X`, `StyleSheet`, `react-native-reanimated` 関連をインポートします。
2.  **State とアニメーションのロジックを追加する**: `PaywallScreen` コンポーネントの先頭に、`isCloseButtonVisible`, `opacity`, `animatedStyle`, `useEffect` のコードを追加します。
3.  **UI を追加する**: `SafeAreaView` の直下に、`<Animated.View>` でラップした閉じるボタンを追加します。
4.  **StyleSheet を追加する**: ファイルの末尾に `styles` を定義します。
5.  **動作確認**: 画面表示後、5 秒経ってから左上に「×」ボタンがフェードインで表示されることを確認します。

## 完了条件

- [ ] 画面表示直後は「閉じる」ボタンが表示されない。
- [ ] 画面表示から 5 秒後に「閉じる」ボタンがフェードインで表示される。
- [ ] コンポーネントがアンマウントされる際にタイマーがクリーンアップされる。

## 次のタスク

- **T5-2-0**: 環境構築とライブラリ導入 (次のフェーズ)

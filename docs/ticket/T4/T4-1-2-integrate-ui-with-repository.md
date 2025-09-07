# T4-1-2: UI とリポジトリの連携

## 概要

`cigarettes-setting.tsx`で実装された UI コンポーネントと、`useSmokerData`フックの`updateSmokerData`メソッドを連携させます。ユーザーが入力した新しい喫煙本数をデータベースに保存し、UI に即座に反映させるまでの一連の流れを完成させます。

## 目的

- ユーザーによる UI 操作が、実際にデータベースに反映されるようにする。
- フロントエンドとバックエンドの処理を結合し、一連の機能として完成させる。
- `useSmokerData`フックを利用して、データ更新後の UI への反映を効率的に行う。
- ユーザーに対して、処理中・成功・失敗のフィードバックを明確に提示する。

## 依存関係

- **依存タスク**: `T4-1-1`
- **担当領域**: フロントエンド

## 実装詳細

### 1. 対象ファイル

- `src/app/settings/cigarettes-setting.tsx`
- `src/hooks/useSmokerData.ts`

### 2. UI からのデータ更新フロー

`cigarettes-setting.tsx`内の「保存」ボタンが押された際の処理を実装します。

#### 具体的な実装コード:

```tsx
// src/app/settings/cigarettes-setting.tsx

import { NumberStepper } from "@/components/NumberStepper";
import { useSmokerData } from "@/hooks/useSmokerData";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft, Cigarette, Save } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function CigarettesSettingScreen() {
  const { smokerData, updateSmokerData } = useSmokerData();
  const [cigarettesPerDay, setCigarettesPerDay] = useState<number>(20);
  const [isSaving, setIsSaving] = useState(false);

  // smokerDataが変更された時にcigarettesPerDayを更新
  useEffect(() => {
    if (smokerData?.cigarettesPerDay !== undefined) {
      setCigarettesPerDay(smokerData.cigarettesPerDay);
    }
  }, [smokerData?.cigarettesPerDay]);

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await updateSmokerData({ cigarettesPerDay });
      Alert.alert("保存完了", "1日の喫煙本数を更新しました", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("エラー", "保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  // ... UIコンポーネントの実装
}
```

### 3. 主要な実装ポイント

- **状態管理**:
  - `useState`で入力値(`cigarettesPerDay`)と保存中の状態(`isSaving`)を管理します。
  - `useEffect`を使い、`useSmokerData`から取得した初期値を`cigarettesPerDay` state に設定します。
- **データ同期**:
  - `useEffect`で`smokerData`の変更を監視し、`cigarettesPerDay`を更新します。
- **フック呼び出し**:
  - `handleSave`関数内で`useSmokerData`の`updateSmokerData`を呼び出します。
- **UI フィードバック**:
  - 保存中はボタンを無効化し、ラベルを「保存中...」に変更します。
  - `Alert.alert`を使用して、処理の成功・失敗をユーザーに通知します。
- **データ更新**:
  - `updateSmokerData`が内部で SWR の`mutate`を呼び出し、UI を最新の状態に保ちます。

## 実装手順

1. **ファイルを開く**: `src/app/settings/cigarettes-setting.tsx`を開きます。
2. **State の追加**: `cigarettesPerDay`と`isSaving`のための`useState`フックを追加します。
3. **初期値設定**: `useEffect`フックを追加し、`useSmokerData`から取得したデータを`cigarettesPerDay` state に設定します。
4. **ハンドラ作成**: `handleSave`非同期関数を実装します。`isSaving`の切り替え、`updateSmokerData`の呼び出し、結果に応じたアラート表示を含みます。
5. **UI の修正**: ヘッダーと下部の保存ボタンに`disabled={isSaving}`を追加し、保存中の状態表示を実装します。

## 完了条件

- [x] 設定画面で数値を入力し「保存」ボタンを押すと、`updateSmokerData`メソッドが呼び出される。
- [x] 更新処理中は「保存」ボタンが無効化される。
- [x] 更新が成功すると「保存完了」アラートが表示される。
- [x] データベース更新後、アプリの他の画面（ホーム画面など）の関連データも正しく更新される。
- [x] `useEffect`で`smokerData`の変更を監視し、UI が適切に同期される。

## トラブルシューティング

- **データ更新後も UI の表示が変わらない**:
  - `updateSmokerData`が正常に呼び出されているか確認する。
  - `useSmokerData`フックが使用されている他のコンポーネントで、SWR のキーが一致しているか確認する。
- **保存処理が失敗する**:
  - `useSmokerData`フックの`updateSmokerData`メソッドが正しく実装されているか確認する。
  - データベース接続が正常に動作しているか確認する。

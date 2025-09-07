# T4-2-2: UI とリポジトリの連携

## 概要

`price-setting.tsx` UI コンポーネントと、`user-profile-repository.ts`の`updatePackagePrice`メソッドを連携させます。ユーザーが入力した新しいタバコ価格をデータベースに保存し、UI に即座に反映させます。

## 目的

- ユーザーによる価格変更操作を、実際にデータベースに反映させる。
- SWR を利用して、データ更新後の UI への反映を効率的に行う。
- ユーザーに対して、処理中・成功・失敗のフィードバックを明確に提示する。

## 依存関係

- **依存タスク**: `T4-2-1`
- **担当領域**: フロントエンド

## 実装詳細

### 1. 対象ファイル

- `src/app/settings/price-setting.tsx`

### 2. UI からのデータ更新フロー

`price-setting.tsx`内の「保存」ボタンが押された際の処理を実装します。基本的なロジックは`T4-1-2`の`cigarettes-setting.tsx`と共通です。

#### 具体的な実装コード:

```tsx
// src/app/settings/price-setting.tsx

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useSmokerData } from "src/hooks/useSmokerData";
import { userProfileRepository } from "src/drizzle/repositories/user-profile-repository";
import { db } from "src/drizzle/db";

export default function PriceSettingScreen() {
  const { smokerData, isLoading, error, mutate } = useSmokerData();
  const [price, setPrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (smokerData) {
      setPrice(smokerData.packagePrice.toString());
    }
  }, [smokerData]);

  const handleSave = async () => {
    const newPrice = parseInt(price, 10);
    if (isNaN(newPrice) || newPrice < 0) {
      Alert.alert("エラー", "有効な価格を入力してください。");
      return;
    }

    setIsSaving(true);
    try {
      const result = await userProfileRepository.updatePackagePrice(
        db,
        newPrice
      );
      if (result.success) {
        Alert.alert("成功", "価格を更新しました。");
        mutate(); // SWRのキャッシュを更新
      } else {
        Alert.alert("エラー", result.message || "更新に失敗しました。");
      }
    } catch (e) {
      Alert.alert("エラー", "予期せぬエラーが発生しました。");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading data.</Text>;

  return (
    <View>
      <Text>タバコ一箱の価格</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        keyboardType="number-pad"
        placeholder="例: 600"
      />
      <Button
        title={isSaving ? "保存中..." : "保存"}
        onPress={handleSave}
        disabled={isSaving}
      />
    </View>
  );
}
```

### 3. 主要な実装ポイント

- **状態管理**:
  - `useState`で価格の入力値(`price`)と保存中の状態(`isSaving`)を管理します。
- **リポジトリ呼び出し**:
  - `handleSave`関数内で`userProfileRepository.updatePackagePrice`を呼び出します。
- **UI フィードバック**:
  - 保存中はボタンを無効化し、ラベルを「保存中...」に変更します。
  - `Alert.alert`を使用して、処理の成功・失敗をユーザーに通知します。
- **SWR との連携**:
  - 更新が成功したら`mutate()`を呼び出し、`useSmokerData`フックのデータを再検証させ、UI を最新の状態に保ちます。

## 実装手順

1. **ファイルを開く**: `src/app/settings/price-setting.tsx`を開きます。
2. **State の追加**: `price`と`isSaving`のための`useState`フックを追加します。
3. **初期値設定**: `useEffect`フックを追加し、SWR から取得したデータを`price` state に設定します。
4. **ハンドラ作成**: `handleSave`非同期関数を実装します。入力値のバリデーション、`isSaving`の切り替え、リポジトリの呼び出し、結果に応じたアラート表示、`mutate`の呼び出しを含みます。
5. **コンポーネントの修正**: `TextInput`と`Button`コンポーネントを、state とハンドラに接続します。

## 完了条件

- [ ] 設定画面で価格を入力し「保存」ボタンを押すと、`updatePackagePrice`メソッドが呼び出される。
- [ ] 更新処理中は「保存」ボタンが無効化される。
- [ ] 更新が成功すると「成功」アラートが表示される。
- [ ] データベース更新後、ホーム画面などの節約金額の計算が正しく更新される。
- [ ] 無効な値（文字列や負の数）を入力すると「エラー」アラートが表示される。

## 次のタスク

- **T4-3**: 設定：1 箱の本数の編集機能
- **依存関係**: 本タスクの完了。

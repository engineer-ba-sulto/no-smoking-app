# T4-3-1: 1 箱の本数編集 UI の実装と連携

## 概要

`price-setting.tsx`画面を拡張し、ユーザーがタバコ一箱あたりの「価格」と「本数」の両方を同時に編集・保存できるようにします。UI の追加からリポジトリとの連携までをこのチケットで担当します。

## 目的

- 既存の価格設定画面を拡張し、本数も編集できるようにする。
- 複数の設定項目を一度の操作でアトミックに更新する UI を提供する。
- SWR を利用して、データ更新後の UI への反映を効率的に行う。

## 依存関係

- **依存タスク**: `T4-2-2`, `T4-3-2`
- **担当領域**: フロントエンド

## 実装詳細

### 1. 対象ファイル

- `src/app/settings/price-setting.tsx`

### 2. UI の拡張とデータ更新フロー

`price-setting.tsx`に「1 箱あたりの本数」を入力する UI を追加し、「保存」ボタンの処理を拡張して価格と本数の両方を更新できるようにします。

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
  const [cigarettesPerPackage, setCigarettesPerPackage] = useState(""); // 本数を管理するStateを追加
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (smokerData) {
      setPrice(smokerData.packagePrice.toString());
      setCigarettesPerPackage(smokerData.cigarettesPerPackage.toString()); // 初期値を設定
    }
  }, [smokerData]);

  const handleSave = async () => {
    const newPrice = parseInt(price, 10);
    const newCount = parseInt(cigarettesPerPackage, 10);

    if (isNaN(newPrice) || newPrice < 0) {
      Alert.alert("エラー", "有効な価格を入力してください。");
      return;
    }
    if (isNaN(newCount) || newCount <= 0) {
      Alert.alert("エラー", "本数は1以上の有効な数値を入力してください。");
      return;
    }

    setIsSaving(true);
    try {
      // 2つの更新処理を並行して実行
      const [priceResult, countResult] = await Promise.all([
        userProfileRepository.updatePackagePrice(db, newPrice),
        userProfileRepository.updateCigarettesPerPackage(db, newCount),
      ]);

      if (priceResult.success && countResult.success) {
        Alert.alert("成功", "設定を更新しました。");
        mutate(); // SWRのキャッシュを更新
      } else {
        // エラーメッセージを連結して表示
        const errorMessage = [priceResult.message, countResult.message]
          .filter(Boolean)
          .join("\n");
        Alert.alert("エラー", errorMessage || "更新に失敗しました。");
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

      {/* 1箱の本数を編集するUIを追加 */}
      <Text>1箱あたりの本数</Text>
      <TextInput
        value={cigarettesPerPackage}
        onChangeText={setCigarettesPerPackage}
        keyboardType="number-pad"
        placeholder="例: 20"
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
  - `useState`で価格(`price`)と本数(`cigarettesPerPackage`)の両方の入力値を管理します。
- **UI 追加**:
  - `TextInput`を`price-setting.tsx`に追加し、本数を入力できるようにします。
- **並行更新**:
  - `handleSave`関数内で、`Promise.all`を使い`updatePackagePrice`と`updateCigarettesPerPackage`を並行して呼び出します。これにより、両方の処理が完了するのを待ってから UI にフィードバックを返します。
- **エラーハンドリング**:
  - 両方の更新処理の結果をチェックし、片方または両方でエラーが発生した場合は、内容をまとめてユーザーに通知します。

## 実装手順

1. **ファイルを開く**: `src/app/settings/price-setting.tsx`を開きます。
2. **State の追加**: `cigarettesPerPackage`を管理するための`useState`フックを追加します。
3. **UI 要素の追加**: 「1 箱あたりの本数」の`Text`と`TextInput`を JSX に追加します。
4. **ハンドラの修正**: `handleSave`関数を修正し、本数のバリデーションと更新処理を追加します。`Promise.all`を使って 2 つのリポジトリメソッドを呼び出すように変更します。
5. **初期値設定の修正**: `useEffect`内で`cigarettesPerPackage`の初期値も設定するようにします。

## 完了条件

- [ ] `price-setting.tsx`画面に、1 箱の本数を編集する UI が追加されている。
- [ ] 画面に現在の価格と本数がそれぞれ表示される。
- [ ] 「保存」ボタンを押すと、`updatePackagePrice`と`updateCigarettesPerPackage`の両メソッドが呼び出される。
- [ ] 更新成功後、ホーム画面などの関連計算が正しく更新される。
- [ ] 価格または本数に無効な値を入力すると、適切なエラーアラートが表示される。

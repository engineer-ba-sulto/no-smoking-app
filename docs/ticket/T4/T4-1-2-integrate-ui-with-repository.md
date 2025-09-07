# T4-1-2: UI とリポジトリの連携

## 概要

`cigarettes-setting.tsx`で実装された UI コンポーネントと、`user-profile-repository.ts`の`updateCigarettesPerDay`メソッドを連携させます。ユーザーが入力した新しい喫煙本数をデータベースに保存し、UI に即座に反映させるまでの一連の流れを完成させます。

## 目的

- ユーザーによる UI 操作が、実際にデータベースに反映されるようにする。
- フロントエンドとバックエンドの処理を結合し、一連の機能として完成させる。
- SWR を利用して、データ更新後の UI への反映を効率的に行う。
- ユーザーに対して、処理中・成功・失敗のフィードバックを明確に提示する。

## 依存関係

- **依存タスク**: `T4-1-1`
- **担当領域**: フロントエンド

## 実装詳細

### 1. 対象ファイル

- `src/app/settings/cigarettes-setting.tsx`
- `src/hooks/useSmokerData.ts`
- `src/drizzle/repositories/user-profile-repository.ts`

### 2. UI からのデータ更新フロー

`cigarettes-setting.tsx`内の「保存」ボタンが押された際の処理を実装します。

#### 具体的な実装コード:

```tsx
// src/app/settings/cigarettes-setting.tsx

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useSmokerData } from "src/hooks/useSmokerData";
import { userProfileRepository } from "src/drizzle/repositories/user-profile-repository";
import { db } from "src/drizzle/db";

export default function CigarettesSettingScreen() {
  const { smokerData, isLoading, error, mutate } = useSmokerData();
  const [cigarettesPerDay, setCigarettesPerDay] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (smokerData) {
      setCigarettesPerDay(smokerData.cigarettesPerDay.toString());
    }
  }, [smokerData]);

  const handleSave = async () => {
    const newCount = parseInt(cigarettesPerDay, 10);
    if (isNaN(newCount) || newCount < 0) {
      Alert.alert("エラー", "有効な数値を入力してください。");
      return;
    }

    setIsSaving(true);
    try {
      const result = await userProfileRepository.updateCigarettesPerDay(
        db,
        newCount
      );
      if (result.success) {
        Alert.alert("成功", "喫煙本数を更新しました。");
        // SWRのキャッシュを更新してUIに即時反映
        mutate();
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
      <Text>1日の喫煙本数</Text>
      <TextInput
        value={cigarettesPerDay}
        onChangeText={setCigarettesPerDay}
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
  - `useState`で入力値(`cigarettesPerDay`)と保存中の状態(`isSaving`)を管理します。
  - `useEffect`を使い、`useSmokerData`から取得した初期値を`TextInput`に設定します。
- **リポジトリ呼び出し**:
  - `handleSave`関数内で`userProfileRepository.updateCigarettesPerDay`を呼び出します。
  - `db`インスタンスをリポジトリメソッドに渡します。
- **UI フィードバック**:
  - 保存中はボタンを無効化し、ラベルを「保存中...」に変更します。
  - `Alert.alert`を使用して、処理の成功・失敗をユーザーに通知します。
- **SWR との連携**:
  - 更新が成功したら`mutate()`を呼び出します。これにより、`useSmokerData`フックがデータを再取得し、関連するすべてのコンポーネントの表示が自動的に更新されます。

## 実装手順

1. **ファイルを開く**: `src/app/settings/cigarettes-setting.tsx`を開きます。
2. **State の追加**: `cigarettesPerDay`と`isSaving`のための`useState`フックを追加します。
3. **初期値設定**: `useEffect`フックを追加し、SWR から取得したデータを`cigarettesPerDay` state に設定します。
4. **ハンドラ作成**: `handleSave`非同期関数を実装します。入力値のバリデーション、`isSaving`の切り替え、リポジトリの呼び出し、結果に応じたアラート表示、`mutate`の呼び出しを含みます。
5. **コンポーネントの修正**: `TextInput`と`Button`コンポーネントを、state とハンドラに接続します。

## 完了条件

- [ ] 設定画面で数値を入力し「保存」ボタンを押すと、`updateCigarettesPerDay`メソッドが呼び出される。
- [ ] 更新処理中は「保存」ボタンが無効化される。
- [ ] 更新が成功すると「成功」アラートが表示され、UI 上の表示（`TextInput`の値）が維持される。
- [ ] データベース更新後、アプリの他の画面（ホーム画面など）の関連データも正しく更新される。
- [ ] 無効な値（文字列や負の数）を入力して保存しようとすると、「エラー」アラートが表示される。

## トラブルシューティング

- **データ更新後も UI の表示が変わらない**:
  - `mutate()`が呼び出されているか確認する。
  - `useSmokerData`フックが使用されている他のコンポーネントで、SWR のキーが一致しているか確認する。
- **`db`インスタンスが渡せない**:
  - `src/drizzle/db.ts`から`db`が正しくエクスポートされ、`cigarettes-setting.tsx`でインポートされているか確認する。

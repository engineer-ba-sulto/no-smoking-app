# T4-3-1: 1 箱の本数編集 UI の実装と連携

## 概要

`price-setting.tsx`画面を拡張し、ユーザーがタバコ一箱あたりの「価格」と「本数」の両方を同時に編集・保存できるようにします。また、設定画面（`settings.tsx`）に「タバコの設定」項目を追加し、価格と本数を統合表示します。UI の追加からリポジトリとの連携までをこのチケットで担当します。

## 目的

- 既存の価格設定画面を拡張し、本数も編集できるようにする。
- 複数の設定項目を一度の操作でアトミックに更新する UI を提供する。
- 設定画面で価格と本数を統合表示し、ユーザビリティを向上させる。
- データ更新後の UI への反映を効率的に行う。

## 依存関係

- **依存タスク**: `T4-2-2`, `T4-3-2`
- **担当領域**: フロントエンド

## 実装詳細

### 1. 対象ファイル

- `src/app/settings/price-setting.tsx`
- `src/app/(tabs)/settings.tsx`

### 2. UI の拡張とデータ更新フロー

#### 2.1 設定画面の統合表示

`settings.tsx`で「タバコの価格」と「1 箱あたりの本数」を 1 つの項目「タバコの設定」に統合し、価格と本数を同時に表示します。

#### 2.2 価格設定画面の拡張

`price-setting.tsx`に「1 箱あたりの本数」を入力する UI を追加し、「保存」ボタンの処理を拡張して価格と本数の両方を更新できるようにします。

#### 2.3 設定画面の実装コード

```tsx
// src/app/(tabs)/settings.tsx の設定項目部分

{
  icon: <DollarSign size={20} color="#6B7280" strokeWidth={2} />,
  label: "タバコの設定",
  value: `${smokerData?.pricePerPack || 600}円 / ${smokerData?.cigarettesPerPack || 20}本`,
  onPress: () => router.push("/settings/price-setting"),
},
```

#### 2.4 価格設定画面の実装コード

```tsx
// src/app/settings/price-setting.tsx の主要部分

export default function PriceSettingScreen() {
  const { smokerData, loadData } = useSmokerData();
  const [pricePerPack, setPricePerPack] = useState<number>(600);
  const [cigarettesPerPackage, setCigarettesPerPackage] = useState<number>(20);
  const [isSaving, setIsSaving] = useState(false);

  // smokerDataが変更された時にpricePerPackとcigarettesPerPackageを更新
  useEffect(() => {
    if (smokerData?.pricePerPack !== undefined) {
      setPricePerPack(smokerData.pricePerPack);
    }
    if (smokerData?.cigarettesPerPack !== undefined) {
      setCigarettesPerPackage(smokerData.cigarettesPerPack);
    }
  }, [smokerData?.pricePerPack, smokerData?.cigarettesPerPack]);

  const handleSave = async () => {
    if (isSaving) return;

    if (pricePerPack < 0) {
      Alert.alert("エラー", "有効な価格を入力してください。");
      return;
    }
    if (cigarettesPerPackage <= 0) {
      Alert.alert("エラー", "本数は1以上の有効な数値を入力してください。");
      return;
    }

    setIsSaving(true);
    try {
      // 価格の更新
      const priceResult = await userProfileRepository.updatePackagePrice(
        pricePerPack
      );

      if (priceResult.success) {
        // 本数の更新（既存のupdateメソッドを使用）
        await userProfileRepository.update(1, {
          cigsPerPack: cigarettesPerPackage,
          smokingStartDate: smokerData?.quitDate || new Date().toISOString(),
          cigsPerDay: smokerData?.cigarettesPerDay || 20,
          pricePerPack: pricePerPack,
        });

        Alert.alert("成功", "設定を更新しました。", [
          { text: "OK", onPress: () => router.back() },
        ]);
        loadData(); // データを再読み込み
      } else {
        Alert.alert("エラー", priceResult.message || "更新に失敗しました。");
      }
    } catch (e) {
      Alert.alert("エラー", "予期せぬエラーが発生しました。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* 価格設定セクション */}
      <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <Text className="text-base font-medium text-gray-800 mb-6 text-center">
          1箱あたりの価格を選択
        </Text>
        <NumberStepper
          value={pricePerPack}
          onChange={setPricePerPack}
          min={100}
          max={2000}
          step={10}
          suffix="円"
        />
        <View className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
          <Text className="text-sm text-green-800 text-center">
            設定値: <Text className="font-bold">{pricePerPack}円</Text>
          </Text>
        </View>
      </View>

      {/* 本数設定セクション */}
      <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <Text className="text-base font-medium text-gray-800 mb-6 text-center">
          1箱あたりの本数を選択
        </Text>
        <NumberStepper
          value={cigarettesPerPackage}
          onChange={setCigarettesPerPackage}
          min={1}
          max={50}
          step={1}
          suffix="本"
        />
        <View className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <Text className="text-sm text-blue-800 text-center">
            設定値: <Text className="font-bold">{cigarettesPerPackage}本</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
```

### 3. 主要な実装ポイント

- **設定画面の統合表示**:
  - `settings.tsx`で「タバコの価格」と「1 箱あたりの本数」を 1 つの項目「タバコの設定」に統合
  - 表示形式: `600円 / 20本` のように価格と本数を同時表示
- **状態管理**:
  - `useState`で価格(`pricePerPack`)と本数(`cigarettesPerPackage`)の両方の入力値を管理
- **UI 追加**:
  - `NumberStepper`コンポーネントを使用して価格と本数の両方を編集可能
  - 各設定値の現在値を視覚的に表示
- **データ更新**:
  - `handleSave`関数内で、価格更新と本数更新を順次実行
  - 価格更新成功後に本数更新を実行する安全な処理
- **エラーハンドリング**:
  - 価格と本数のバリデーション機能を実装
  - 更新処理の結果をチェックし、適切なエラーメッセージを表示

## 実装手順

1. **設定画面の修正**: `src/app/(tabs)/settings.tsx`を開き、「タバコの価格」と「1 箱あたりの本数」を 1 つの項目「タバコの設定」に統合します。
2. **価格設定画面の修正**: `src/app/settings/price-setting.tsx`を開きます。
3. **State の追加**: `cigarettesPerPackage`を管理するための`useState`フックを追加します。
4. **UI 要素の追加**: 「1 箱あたりの本数」の`NumberStepper`コンポーネントを追加します。
5. **ハンドラの修正**: `handleSave`関数を修正し、本数のバリデーションと更新処理を追加します。価格更新成功後に本数更新を実行するように変更します。
6. **初期値設定の修正**: `useEffect`内で`cigarettesPerPackage`の初期値も設定するようにします。
7. **設定値表示の追加**: 各設定項目の現在値を視覚的に表示する UI を追加します。

## 完了条件

- [x] `settings.tsx`で「タバコの価格」と「1 箱あたりの本数」が 1 つの項目「タバコの設定」に統合されている。
- [x] 設定画面で価格と本数が「600 円 / 20 本」の形式で表示される。
- [x] `price-setting.tsx`画面に、1 箱の本数を編集する UI が追加されている。
- [x] 画面に現在の価格と本数がそれぞれ表示される。
- [x] 「保存」ボタンを押すと、`updatePackagePrice`と`update`メソッドが呼び出される。
- [x] 更新成功後、ホーム画面などの関連計算が正しく更新される。
- [x] 価格または本数に無効な値を入力すると、適切なエラーアラートが表示される。

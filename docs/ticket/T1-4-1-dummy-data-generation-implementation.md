# T1-4-1: ダミーデータ生成ロジックの実装

## 概要

開発用データのシーディング（投入）に必要な、多様なシナリオを想定したダミーデータを生成するためのロジックを実装する。このタスクでは、データベースにデータを書き込む処理は含めず、純粋なデータ生成関数群を作成することに注力する。

## 目的

- `user_profile` テーブルのスキーマ（`CreateUserProfileInput` 型）に準拠したダミーデータを生成する。
- ランダムなデータだけでなく、特定のテストシナリオに基づいた静的なデータセットも定義する。
- データ生成ロジックをシーディングスクリプトや将来の自動テストから再利用可能な形でモジュール化する。

## 依存関係

- **親タスク**: T1-4-0 (開発用データのシーディング)
- **依存タスク**: T1-3 (データ操作用リポジトリ層の実装)
- **担当領域**: 開発効率

## 実装詳細

### 1. ダミーデータ生成クラスの作成

`src/drizzle/seeders/dummy-data-generator.ts` というファイルを作成し、ダミーデータを生成するためのクラスまたは関数群を実装する。

#### `DummyDataGenerator` クラス

- **`createRandomUserProfile(): CreateUserProfileInput`**

  - ランダムな値を持つユーザープロファイルを生成する。
  - **喫煙開始日 (`smokingStartDate`)**: `date-fns` などのライブラリを使用し、過去 1 年以内のランダムな ISO 8601 文字列を生成する。
  - **1 日の喫煙本数 (`cigsPerDay`)**: 5〜40 の範囲でランダムな整数を生成する。
  - **タバコ 1 箱の価格 (`pricePerPack`)**: 500〜800 の範囲でランダムな整数を生成する。
  - **1 箱の本数 (`cigsPerPack`)**: `[10, 20, 25]` の配列からランダムに 1 つを選択する。

- **`createSpecificUserProfile(scenario: 'beginner' | 'intermediate' | 'advanced' | 'heavySmoker'): CreateUserProfileInput`**
  - 特定のシナリオに基づいたプロファイルを生成する。
  - **`beginner`**: 禁煙開始からちょうど 1 日経過したデータ。
  - **`intermediate`**: 禁煙開始からちょうど 1 週間経過したデータ。
  - **`advanced`**: 禁煙開始からちょうど 1 ヶ月経過したデータ。
  - **`heavySmoker`**: `cigsPerDay` が 40 本以上など、喫煙量が多いユーザーデータ。

### 2. 静的テストデータセットの定義

`src/drizzle/seeders/test-data-sets.ts` というファイルを作成し、再利用可能な静的データセットを定義する。

#### `testDataSets` オブジェクト

- **`basicSet: CreateUserProfileInput[]`**
  - UI の基本的な表示確認に使う、2〜3 件の典型的なユーザーデータ。
- **`edgeCaseSet: CreateUserProfileInput[]`**
  - 計算ロジックの境界値テストに使用するデータ。
    - 禁煙開始が 1 分前
    - 禁煙開始がちょうど 1 年前
    - `cigsPerDay` が 0 のユーザー
    - `pricePerPack` が 0 のユーザー
- **`achievementTestSet: CreateUserProfileInput[]`**
  - アチーブメント機能のテストを容易にするためのデータセット。
    - 禁煙 23 時間後のユーザー（もうすぐ 1 日達成）
    - 禁煙 6 日と 23 時間後のユーザー（もうすぐ 1 週間達成）

## 実装手順

1. `date-fns` が未インストールの場合は、`bun add date-fns` でプロジェクトに追加する。
2. `src/drizzle/seeders/` ディレクトリを作成する。
3. `src/drizzle/seeders/dummy-data-generator.ts` を作成し、`DummyDataGenerator` クラスと関連メソッドを実装する。
4. `src/drizzle/seeders/test-data-sets.ts` を作成し、`testDataSets` オブジェクトを定義する。
5. 各関数が `CreateUserProfileInput` 型に準拠したデータを返すことを TypeScript の型チェックで確認する。

## 完了条件

- [ ] `src/drizzle/seeders/dummy-data-generator.ts` が作成され、ランダムおよびシナリオベースのデータ生成ロジックが実装されている。
- [ ] `src/drizzle/seeders/test-data-sets.ts` が作成され、静的なテストデータセットが定義されている。
- [ ] すべてのデータ生成ロジックは副作用を持たない純粋な関数として実装されている。
- [ ] TypeScript の型エラーが発生しない。

## 次のタスク

- **T1-4-2**: シーディングスクリプトの実装

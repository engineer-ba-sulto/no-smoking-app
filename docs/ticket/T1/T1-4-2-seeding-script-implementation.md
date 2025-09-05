# T1-4-2: シーディングスクリプトの実装

## 概要

`T1-4-1` で作成したダミーデータ生成ロジックと、`T1-3` で実装したリポジトリ層を組み合わせて、実際にデータベースへデータを投入（シーディング）するためのスクリプトを実装する。このスクリプトは、コマンドラインから簡単に実行できるようにする。

## 目的

- データベースの既存データをクリアする機能を提供する。
- `T1-4-1` で定義した各種データセット（基本、境界値、アチーブメントテスト用など）をデータベースに投入する機能を提供する。
- コマンドライン引数を使って、実行するシーディングの種類を指定できるようにする。
- `package.json` にスクリプトを登録し、`bun run db:seed` のような簡単なコマンドで実行可能にする。

## 依存関係

- **親タスク**: T1-4-0 (開発用データのシーディング)
- **依存タスク**: T1-4-1 (ダミーデータ生成ロジックの実装)
- **担当領域**: 開発効率

## 実装詳細

### 1. メインシーダークラスの作成

`src/drizzle/seeders/main-seeder.ts` ファイルを作成し、シーディングの主要なロジックをクラスとして実装する。

#### `MainSeeder` クラス

- **Constructor**

  - `userProfileRepository` を受け取り、インスタンス変数として保持する。

- **`clearAllData(): Promise<void>`**

  - `user_profile` テーブルの全レコードを削除する。
  - `db.delete(userProfile)` を使用する。

- **`seedFromDataSet(dataSet: CreateUserProfileInput[]): Promise<void>`**

  - 受け取ったデータセットを `userProfileRepository.create` を使って順番に投入する。

- **`seedRandomData(count: number): Promise<void>`**

  - `DummyDataGenerator.createRandomUserProfile` を指定された回数呼び出し、ランダムなデータを投入する。

- **`verify(): Promise<void>`**
  - 現在データベースに格納されている `user_profile` の件数をコンソールに出力する。

### 2. 実行スクリプトの作成

`src/drizzle/seeders/run-seeder.ts` ファイルを作成し、コマンドラインからの入力を処理して `MainSeeder` を実行するロジックを実装する。

- Node.js の `process.argv` を使ってコマンドライン引数を読み取る。
- 引数に応じて `MainSeeder` の適切なメソッドを呼び出す。
  - `clean`: `clearAllData` を実行。
  - `basic`: `clearAllData` 後、`testDataSets.basicSet` を投入。
  - `edge`: `clearAllData` 後、`testDataSets.edgeCaseSet` を投入。
  - `achievement`: `clearAllData` 後、`testDataSets.achievementTestSet` を投入。
  - `random <count>`: `clearAllData` 後、指定された件数のランダムデータを投入。
  - `all` (または引数なし): `clearAllData` 後、すべての静的データセットを投入。
  - `verify`: `verify` を実行。
- 実行前後に「Seeding started...」「Seeding completed successfully!」のようなログを出力し、進捗がわかるようにする。

### 3. `package.json` へのスクリプト登録

`package.json` の `scripts` セクションに、シーディングスクリプトを簡単に実行するためのコマンドを追加する。`tsx` を用いて TypeScript ファイルを直接実行する。

```json
"scripts": {
  "db:seed": "tsx src/drizzle/seeders/run-seeder.ts",
  "db:seed:all": "tsx src/drizzle/seeders/run-seeder.ts all",
  "db:seed:clean": "tsx src/drizzle/seeders/run-seeder.ts clean",
  "db:seed:basic": "tsx src/drizzle/seeders/run-seeder.ts basic",
  "db:seed:verify": "tsx src/drizzle/seeders/run-seeder.ts verify"
}
```

## 実装手順

1. `tsx` が未インストールの場合は `bun add -d tsx` でプロジェクトに追加する。
2. `src/drizzle/seeders/main-seeder.ts` を作成し、`MainSeeder` クラスと関連メソッドを実装する。
3. `src/drizzle/seeders/run-seeder.ts` を作成し、コマンドライン引数を解釈して `MainSeeder` を実行するロジックを実装する。
4. `package.json` ファイルを開き、`scripts` セクションに上記のコマンド定義を追加する。

## 完了条件

- [ ] `src/drizzle/seeders/main-seeder.ts` が作成され、データベースのクリア、データ投入、投入結果の確認を行うロジックが実装されている。
- [ ] `src/drizzle/seeders/run-seeder.ts` が作成され、コマンドラインからシーディング処理を制御できる。
- [ ] `package.json` にシーディング関連の npm スクリプトが追加されている。
- [ ] TypeScript の型エラーが発生しない。

## 次のタスク

- **T1-4-3**: テストデータの投入と動作確認

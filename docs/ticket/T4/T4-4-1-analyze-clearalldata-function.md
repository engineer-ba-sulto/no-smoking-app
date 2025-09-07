# T4-4-1: `clearAllData`関数の問題分析

## 概要

`drizzle/seeders/main-seeder.ts`に実装されている`clearAllData`関数が意図通りに動作しない原因を特定します。

## 目的

- バグの根本原因を正確に把握する。
- 修正方針を決定するための情報を収集する。

## 依存関係

- **依存タスク**: T4-4-0
- **担当領域**: 開発効率

## 実装詳細

### 1. コードレビュー
`clearAllData`関数の現在の実装を確認します。

```typescript
// 現在の実装（推測）
export const clearAllData = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  console.log('Clearing all data...');
  try {
    // この部分に問題がある可能性が高い
    await db.delete(schema.userProfiles);
    await db.delete(schema.achievements); 
    // ... 他のテーブル
    console.log('All data cleared successfully.');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
```
`db.delete(tableName)`のように`where`句なしで呼び出した場合、Drizzle ORM for SQLite (drizzle-kit/expo-sqlite) がどのような挙動をするかドキュメントや実際の動作で確認します。

### 2. 再現テスト
実際にこの関数を実行し、コンソールに出力されるエラーメッセージや、データベースの状態を確認して、データが削除されていないことを確認します。

## 実装手順

1. **ファイルを開く**: `src/drizzle/seeders/main-seeder.ts`を開きます。
2. **該当箇所を確認**: `clearAllData`関数の実装を読み解きます。
3. **実行とログ確認**: Seederを実行するスクリプト（例：`bun run seed`）を実行し、コンソールのログを確認します。エラーが出ていればその内容を記録します。
4. **原因の特定**: ログとDrizzleの仕様から、なぜデータが削除されないのかを結論付けます。

## 完了条件

- [ ] `clearAllData`が動作しない根本原因が特定されている。
- [ ] 原因と修正方針がドキュメント化されている。

## 次のタスク

- **T4-4-2**: データベース全件削除ロジックの修正
- **依存関係**: このタスクの完了が前提となる。

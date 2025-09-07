# T4-4-1: `clearAllData`関数の問題分析

## 概要

`drizzle/seeders/main-seeder.ts`に実装されている`clearAllData`関数が、テーブルのデータを完全に削除できていない問題の原因を特定します。

## 目的

- バグの根本原因を正確に把握する。
- Drizzle ORM の `delete` 操作の正しい仕様を理解する。
- `T4-4-2`での修正作業のインプットとなる、明確な修正方針を決定する。

## 依存関係

- **依存タスク**: `T4-4-0`
- **担当領域**: バックエンド (データベース / 開発ツール)

## 分析詳細

### 1. 問題の仮説

Drizzle ORM for Expo SQLite において、`db.delete(tableName)`のように `where` 句なしで `delete` を呼び出した場合、**全件削除ではなく、何も実行しない（No-Op）** という仕様になっている可能性が高い。これは、誤って全データを削除してしまうのを防ぐための安全機構であると推測されます。

### 2. 分析対象コード

- `src/drizzle/seeders/main-seeder.ts` の `clearAllData` 関数

```typescript
// 現在の実装
export const clearAllData = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  console.log("🧹 Clearing all data...");
  try {
    // 仮説：以下の delete 操作が where 句なしでは機能していない
    await db.delete(schema.smokingCessationAchievements);
    await db.delete(schema.appSettings);
    await db.delete(schema.userProfiles);
    // ... 他のテーブルも同様

    console.log("✅ All data cleared successfully.");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
  }
};
```

### 3. 分析手順

1.  **Drizzle ORM ドキュメントの確認**:

    - Drizzle ORM の公式ドキュメントで、`delete` 操作のセクションを参照する。
    - `where` 句を省略した場合の挙動について、特に SQLite 방언 (dialect) での仕様を確認する。
    - `TRUNCATE` に相当する操作が Drizzle ORM で提供されているか調査する。

2.  **再現テストとデバッグ**:

    - `bun run seed` を実行し、`clearAllData` が呼び出されることを確認する。
    - コンソールに "❌ Error clearing data:" が表示されないにも関わらず、データが削除されていないことを確認する。
    - `clearAllData` 関数内に `console.log` を追加し、各 `delete` 操作の返り値（もしあれば）を確認する。

3.  **解決策の実験**:
    - `db.delete(schema.userProfiles).where(...)` のように、意図的に全件にマッチする `where` 句（例: `where(isNotNull(schema.userProfiles.id))`）を追加して実行し、データが削除されるか確認する。
    - もしくは、より直接的な `db.run(sql`...`)` のような raw SQL 実行が可能か調査し、`DELETE FROM user_profiles;` を直接実行するテストを行う。

### 4. 期待される分析結果

- Drizzle ORM では `where` 句なしの `delete` は安全のために許可されていない、という仕様上の結論。
- 修正方針として、「Raw SQL (`DELETE FROM ...`) を実行する」または「全件にマッチする `where` 句を追加する」のいずれかが有効であるという結論。

## 完了条件

- [ ] `clearAllData`が動作しない根本原因が、「`where`句なしの`delete`は実行されない」という Drizzle ORM の仕様であることが特定されている。
- [ ] 修正方針として、Raw SQL を用いた `DELETE FROM` 文の実行が最も確実で適切であると結論付けられている。

## 次のタスク

- **T4-4-2**: データベース全件削除ロジックの修正
- **依存関係**: 本タスクの完了。

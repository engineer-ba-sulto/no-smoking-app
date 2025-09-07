# T4-4-2: データベース全件削除ロ-ジックの修正

## 概要

分析結果に基づき、`clearAllData`関数を修正し、データベースの全テーブルから全データを正しく削除できるようにします。

## 目的

- 開発用のDBリセット機能を完全に動作させる。

## 依存関係

- **依存タスク**: T4-4-1
- **担当領域**: 開発効率

## 実装詳細

### 1. 修正方針
Drizzle ORMでは、テーブルの全レコードを削除する場合でも、`db.delete(table)`のように明示的にテーブルオブジェクトを渡す必要があります。`where`句を省略すれば全件削除となります。
`schema.ts`からインポートしたスキーマオブジェクトをループ処理し、全てのテーブルに対して`delete`操作を実行するように修正します。

```typescript
// 修正後の実装イメージ
import * as schema from '../schema'; // スキーマ全体をインポート

export const clearAllData = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  console.log('Clearing all data...');
  try {
    for (const table of Object.values(schema)) {
      // 'table'がdrizzleのテーブルオブジェクトか確認する必要がある
      if (table) {
        await db.delete(table);
      }
    }
    console.log('All data cleared successfully.');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
```

## 実装手順

1. **ファイルを開く**: `src/drizzle/seeders/main-seeder.ts`を開きます。
2. **スキーマのインポート**: `import * as schema from '../schema';` のように、すべてのスキーマ定義をインポートします。
3. **`clearAllData`関数の修正**: ループを使って、`schema`オブジェクト内の各テーブルに対して`db.delete()`を実行するロジックに書き換えます。
4. **コードの整形**: コードがクリーンで読みやすい状態であることを確認します。

## 完了条件

- [ ] `clearAllData`関数が、スキーマ内の全テーブルを対象に削除処理を行うように修正されている。
- [ ] 修正後のコードに文法エラーなどがない。

## 次のタスク

- **T4-4-3**: 修正後のリセット機能のテスト
- **依存関係**: このタスクの完了が前提となる。

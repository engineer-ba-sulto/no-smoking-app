# T4-4-2: データベース全件削除ロジックの修正

## 概要

`T4-4-1`の分析結果に基づき、`clearAllData`関数を修正します。Drizzle ORM の `delete` の代わりに Raw SQL (`DELETE FROM ...`) を使用し、データベースの全テーブルから確実に全データを削除できるようにします。

## 目的

- 開発用の DB リセット機能を完全に動作させる。
- 意図しない挙動を防ぐため、安全かつ明示的な方法でデータ削除を実装する。

## 依存関係

- **依存タスク**: `T4-4-1`
- **担当領域**: バックエンド (データベース / 開発ツール)

## 実装詳細

### 1. 修正方針

`T4-4-1`の分析で、`where`句なしの`db.delete()`は意図的に機能しない仕様であることが判明しました。最も確実な全件削除方法は、Raw SQL の `DELETE FROM` 文を各テーブルに対して実行することです。

`expo-sqlite/next`の`db.runAsync()`（または同等のメソッド）と、`drizzle-orm/expo-sqlite`の`sql`テンプレートリテラルを組み合わせて、型安全性を維持しつつ Raw SQL を実行します。

### 2. 対象ファイル

- `src/drizzle/seeders/main-seeder.ts`
- `src/drizzle/schema.ts` (テーブル名を取得するため参照)

### 3. 具体的な実装コード

`schema.ts` からテーブル定義をインポートし、それらのテーブル名に対してループで `DELETE FROM` 文を実行します。

```typescript
// src/drizzle/seeders/main-seeder.ts

import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { sql } from "drizzle-orm";
import * as schema from "../schema";

// schemaオブジェクトからテーブル定義のみをフィルタリング
const tableSchemas = Object.values(schema).filter(
  (s) => "table" in s && s.table instanceof Object
);

export const clearAllData = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  console.log("🧹 Clearing all data...");
  try {
    for (const table of tableSchemas) {
      // Drizzleのスキーマ情報から実際のテーブル名を取得
      const tableName = table.table.name;
      console.log(`  - Clearing table: ${tableName}`);
      // sqlテンプレートリテラルを使い、安全にRaw SQLを実行
      await db.run(sql.raw(`DELETE FROM ${tableName};`));
      // SQLiteのシーケンス（AUTOINCREMENTの値）をリセット
      await db.run(
        sql.raw(`DELETE FROM sqlite_sequence WHERE name = '${tableName}';`)
      );
    }
    console.log("✅ All data cleared successfully.");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
    // エラーが発生した場合、トランザクションがサポートされていればロールバックが望ましい
    // ここではエラーを再スローして、呼び出し元に処理を委ねる
    throw error;
  }
};
```

### 4. 主要な実装ポイント

- **テーブル一覧の動的取得**: `schema.ts`からインポートした`schema`オブジェクトを`Object.values`で配列化し、将来テーブルが追加された場合でも自動で対応できるようにします。
- **Raw SQL の実行**: `db.run(sql.raw(...))` を使用して、SQL インジェクションのリスクなく `DELETE` 文を実行します。
- **AUTOINCREMENT のリセット**: `DELETE FROM` は `AUTOINCREMENT` カウンタをリセットしません。開発用シーダーとしては、ID が常に 1 から始まる方が挙動を予測しやすいため、`sqlite_sequence` テーブルから該当テーブルのエントリを削除する処理も追加します。

## 実装手順

1. **ファイルを開く**: `src/drizzle/seeders/main-seeder.ts`を開きます。
2. **インポートの追加/修正**: `drizzle-orm`から`sql`をインポートします。
3. **`clearAllData`関数の書き換え**: 上記の実装コードを参考に、`clearAllData`関数を全面的に書き換えます。
4. **テスト実行**: `bun run seed` を実行し、すべてのテーブルがクリアされ、再度シーディングした際に ID が 1 から始まることを確認します。

## 完了条件

- [ ] `clearAllData`関数が、Raw SQL を用いてスキーマ内の全テーブルを対象に`DELETE`処理を行うように修正されている。
- [ ] `sqlite_sequence`をリセットし、`AUTOINCREMENT`で採番される ID が初期化されるようになっている。
- [ ] `bun run seed`を実行すると、エラーなくデータベースがクリーンな状態になる。

## 次のタスク

- 開発サイクル内での動作確認。
- （もしあれば）T5 以降のタスクに着手。

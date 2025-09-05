# T1-3-2: ユーザープロファイル取得機能の実装

## 概要

T1-3-1 でセットアップしたデータベース接続とクエリビルダーを利用して、`user_profile` テーブルからユーザープロファイルを取得するためのリポジトリ関数を実装する。ID に基づく単一プロファイルの取得と、全プロファイルの取得機能を提供する。

## 目的

- `drizzle-orm` を使用して、型安全なデータベースクエリを実装する
- ID を指定して特定のユーザープロファイルを取得する関数 `findById` を実装する
- すべてのユーザープロファイルを取得する関数 `findAll` を実装する
- ユーザープロファイルが存在しない場合に `null` または空配列を返す、予測可能な API を設計する

## 依存関係

- **親タスク**: T1-3-0 (データ操作用リポジトリ層の実装)
- **依存タスク**: T1-3-1 (データベース接続とクエリビルダーの設定)
- **担当領域**: バックエンド

## 実装詳細

### 1. リポジトリ層のディレクトリ構造

ユーザープロファイル関連のリポジトリ関数を格納するために、以下のファイルを作成する。

- `src/drizzle/repositories/user-profile.repository.ts`

### 2. `findById` 関数の実装

ID を引数に取り、`user_profile` テーブルから該当するレコードを 1 件取得する。レコードが見つからない場合は `null` を返す。

```typescript
// src/drizzle/repositories/user-profile.repository.ts
import { eq } from "drizzle-orm";
import { db, userProfile } from "@/drizzle";

export const userProfileRepository = {
  /**
   * ID に基づいてユーザープロファイルを 1 件取得する
   * @param id - ユーザープロファイルの ID
   * @returns ユーザープロファイルオブジェクト、または null
   */
  async findById(id: number) {
    const result = await db.query.userProfile.findFirst({
      where: eq(userProfile.id, id),
    });
    return result || null;
  },

  // ...他の関数は後続のタスクで実装
};
```

### 3. `findAll` 関数の実装

`user_profile` テーブルに存在するすべてのレコードを取得する。レコードが存在しない場合は空の配列 `[]` を返す。

```typescript
// src/drizzle/repositories/user-profile.repository.ts
import { eq } from "drizzle-orm";
import { db, userProfile } from "@/drizzle";

export const userProfileRepository = {
  /**
   * ID に基づいてユーザープロファイルを 1 件取得する
   * (中略)
   */
  async findById(id: number) {
    // ...
  },

  /**
   * すべてのユーザープロファイルを取得する
   * @returns ユーザープロファイルの配列
   */
  async findAll() {
    const result = await db.query.userProfile.findMany();
    return result;
  },
};
```

### 4. 型定義のインポート

`T1-3-0` で定義された `UserProfile` 型をリポジトリの戻り値の型として利用する。将来的には、`@/drizzle/schema.ts` から Drizzle が自動生成する型 `SelectUserProfile` を利用することも検討する。

## 実装手順

1. `src/drizzle/repositories/` ディレクトリを作成する。
2. `src/drizzle/repositories/user-profile.repository.ts` ファイルを作成する。
3. `findById` 関数を実装し、`db.query.userProfile.findFirst` を使用してデータを取得するロジックを記述する。
4. `findAll` 関数を実装し、`db.query.userProfile.findMany` を使用して全データを取得するロジックを記述する。
5. 関数の戻り値が、データが存在しない場合にそれぞれ `null` と `[]` を返すことを確認する。

## 完了条件

- [ ] `src/drizzle/repositories/user-profile.repository.ts` が作成されている。
- [ ] `findById(id: number)` 関数が実装され、正しく動作する。
- [ ] `findAll()` 関数が実装され、正しく動作する。
- [ ] `findById` は、ユーザーが存在しない場合に `null` を返す。
- [ ] `findAll` は、ユーザーが一人もいない場合に空の配列 `[]` を返す。
- [ ] Drizzle のクエリ API が正しく使用されており、型安全性が確保されている。

## 次のタスク

- **T1-3-3**: ユーザープロファイル更新機能の実装

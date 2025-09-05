# T1-3-4: ユーザープロファイル作成機能の実装

## 概要

`user_profile` テーブルに新しいレコードを追加するためのリポジトリ関数 `create` を実装する。この関数は、新規ユーザープロファイルのデータを受け取り、作成されたレコードをオブジェクトとして返す。

## 目的

- `drizzle-orm` を使用して、新しいユーザープロファイルをデータベースに挿入する機能を実装する
- `createdAt` と `updatedAt` タイムスタンプを自動的に設定する
- 挿入されたデータを、型安全なオブジェクトとして返す

## 依存関係

- **親タスク**: T1-3-0 (データ操作用リポジトリ層の実装)
- **依存タスク**: T1-3-3 (ユーザープロファイル更新機能の実装)
- **担当領域**: バックエンド

## 実装詳細

### 1. `create` 関数の実装

`user-profile.repository.ts` に `create` 関数を追加する。この関数は、新規作成データ (`CreateUserProfileInput`) を受け取る。

```typescript
// src/drizzle/repositories/user-profile.repository.ts
import { db, userProfile } from "@/drizzle";
import { CreateUserProfileInput } from "@/drizzle/schema"; // 型定義をインポート

export const userProfileRepository = {
  // ... findById, findAll, update は実装済み

  /**
   * 新規ユーザープロファイルを作成する
   * @param input - 作成データ
   * @returns 作成されたユーザープロファイルオブジェクト
   */
  async create(input: CreateUserProfileInput) {
    const now = new Date().toISOString();

    const [newUserProfile] = await db
      .insert(userProfile)
      .values({
        ...input,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return newUserProfile;
  },
};
```

### 2. 作成用型定義の利用

`T1-3-0` で `zod` を使って設計した `CreateUserProfileInput` 型を利用する。これは `userProfileInputSchema` から生成され、`id`, `createdAt`, `updatedAt` を除くすべての必須プロパティを含む。

```typescript
// src/drizzle/schema.ts での定義を想定
import { z } from "zod";

export const userProfileInputSchema = z.object({
  smokingStartDate: z.string().datetime(),
  cigsPerDay: z.number().int().min(0),
  pricePerPack: z.number().int().min(0),
  cigsPerPack: z.number().int().min(0),
});

// 新規作成用の型定義
export type CreateUserProfileInput = z.infer<typeof userProfileInputSchema>;
```

_Note: 上記の型定義は `T1-3-5` で正式に実装されるが、ここではその存在を前提とする。_

### 3. `createdAt` および `updatedAt` の自動設定

`create` 操作を行う際に、`createdAt` と `updatedAt` フィールドの両方を現在の ISO 8601 文字列で自動的に設定する。

### 4. `returning` 句の使用

Drizzle ORM の `.returning()` メソッドを使用することで、`INSERT` 操作の直後に、データベースによって生成された `id` を含む完全なレコードを取得できる。これにより、再度 `SELECT` クエリを発行する必要がなくなり、効率的。

## 実装手順

1. `src/drizzle/repositories/user-profile.repository.ts` を開く。
2. `create` という名前の非同期関数を `userProfileRepository` オブジェクト内に追加する。
3. 関数の引数として `input: CreateUserProfileInput` を定義する。
4. `db.insert()` メソッドを使用して、`user_profile` テーブルに新しいレコードを挿入するロジックを実装する。
5. `values` メソッドに `...input` と `createdAt`, `updatedAt` タイムスタンプを渡す。
6. `.returning()` を呼び出して、挿入されたレコード全体を取得する。
7. Drizzle は `returning` の結果を配列で返すため、分割代入 `const [newUserProfile] = ...` を使って最初の要素を取得し、それを関数の戻り値とする。

## 完了条件

- [ ] `userProfileRepository` に `create` 関数が実装されている。
- [ ] `create` 関数は、新しいユーザープロファイルを正しくデータベースに挿入する。
- [ ] レコード作成時に `createdAt` と `updatedAt` が自動的に設定される。
- [ ] 作成されたユーザープロファイル（`id` を含む）が正しく返される。
- [ ] `CreateUserProfileInput` 型が引数として使用されている。
- [ ] Drizzle の `insert` API と `returning` 句が正しく使用されている。

## 次のタスク

- **T1-3-5**: エラーハンドリングとバリデーション機能の実装

# T1-3-3: ユーザープロファイル更新機能の実装

## 概要

`user_profile` テーブルの既存レコードを更新するためのリポジトリ関数 `update` を実装する。この関数は、更新対象の ID と更新内容のオブジェクトを受け取り、更新後のユーザープロファイルを返す。

## 目的

- `drizzle-orm` を使用して、特定のユーザープロファイルを更新する機能を実装する
- 更新対象が見つからない場合に適切に処理（`null` を返す）する
- 部分更新（一部のフィールドのみ更新）をサポートする
- 更新日 (`updatedAt`) を自動的に更新する仕組みを組み込む

## 依存関係

- **親タスク**: T1-3-0 (データ操作用リポジトリ層の実装)
- **依存タスク**: T1-3-2 (ユーザープロファイル取得機能の実装)
- **担当領域**: バックエンド

## 実装詳細

### 1. `update` 関数の実装

`user-profile.repository.ts` に `update` 関数を追加する。この関数は、ID と更新データ (`UpdateUserProfileInput`) を受け取る。

```typescript
// src/drizzle/repositories/user-profile.repository.ts
import { eq } from "drizzle-orm";
import { db, userProfile } from "@/drizzle";
import { UpdateUserProfileInput } from "@/drizzle/schema"; // 型定義をインポート

export const userProfileRepository = {
  // ... findById, findAll は実装済み

  /**
   * ユーザープロファイルを更新する
   * @param id - 更新対象のユーザープロファイル ID
   * @param input - 更新データ
   * @returns 更新後のユーザープロファイルオブジェクト、または null
   */
  async update(id: number, input: UpdateUserProfileInput) {
    // 最初にユーザーが存在するか確認
    const existingProfile = await this.findById(id);
    if (!existingProfile) {
      return null;
    }

    // データの更新
    await db
      .update(userProfile)
      .set({
        ...input,
        updatedAt: new Date().toISOString(), // updatedAt を現在時刻で更新
      })
      .where(eq(userProfile.id, id));

    // 更新後のデータを再取得して返す
    const updatedProfile = await this.findById(id);
    return updatedProfile;
  },
};
```

### 2. 更新用型定義の利用

`T1-3-0` で `zod` を使って設計した `UpdateUserProfileInput` 型を利用する。これは `userProfileInputSchema.partial()` から生成され、すべてのプロパティがオプショナルになっているため、部分更新に適している。

```typescript
// src/drizzle/schema.ts での定義を想定
import { z } from "zod";

export const userProfileInputSchema = z.object({
  smokingStartDate: z.string().datetime(),
  cigsPerDay: z.number().int().min(0),
  pricePerPack: z.number().int().min(0),
  cigsPerPack: z.number().int().min(0),
});

// 更新用の型定義
export type UpdateUserProfileInput = z.infer<
  typeof userProfileInputSchema.partial()
>;
```

_Note: 上記の型定義は `T1-3-5` で正式に実装されるが、ここではその存在を前提とする。_

### 3. `updatedAt` の自動更新

`update` 操作を行う際に、`updatedAt` フィールドを現在の ISO 8601 文字列で自動的に更新する。これにより、レコードが最後にいつ変更されたかを追跡できる。

## 実装手順

1. `src/drizzle/repositories/user-profile.repository.ts` を開く。
2. `update` という名前の非同期関数を `userProfileRepository` オブジェクト内に追加する。
3. 関数の引数として `id: number` と `input: UpdateUserProfileInput` を定義する。
4. `db.update()` メソッドを使用して、`user_profile` テーブルのレコードを更新するロジックを実装する。
5. `set` メソッドに `...input` と `updatedAt: new Date().toISOString()` を渡す。
6. `where` 句で `eq(userProfile.id, id)` を指定し、更新対象のレコードを特定する。
7. 更新処理の前に `findById` を呼び出して対象レコードの存在確認を行い、なければ `null` を返す。
8. 更新処理後に再度 `findById` を呼び出し、最新のデータを取得して返す。

## 完了条件

- [ ] `userProfileRepository` に `update` 関数が実装されている。
- [ ] `update` 関数は、指定された ID のユーザープロファイルを正しく更新する。
- [ ] 更新時に `updatedAt` フィールドが自動的に更新される。
- [ ] 更新対象の ID が存在しない場合、`null` が返される。
- [ ] `UpdateUserProfileInput` 型が引数として使用され、部分更新が可能である。
- [ ] Drizzle の `update` API が正しく使用されている。

## 次のタスク

- **T1-3-4**: ユーザープロファイル作成機能の実装

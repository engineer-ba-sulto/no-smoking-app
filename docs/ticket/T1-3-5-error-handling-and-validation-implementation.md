# T1-3-5: エラーハンドリングとバリデーション機能の実装

## 概要

リポジトリ層の堅牢性を高めるため、入力データのバリデーション機能と、データベース操作中に発生しうるエラーをハンドリングする仕組みを実装する。`zod` を用いてスキーマベースのバリデーションを行い、カスタムエラークラスを定義して、エラーの種類を明確に識別できるようにする。

## 目的

- `zod` を使用して、ユーザープロファイルの入力データ用スキーマと型を定義する
- `create` および `update` 操作の前に、入力データをバリデーションする関数を実装する
- データベース関連のエラーを捕捉し、アプリケーション層で扱いやすいカスタムエラーに変換する
- `findById` で対象が見つからない場合に、専用の `UserProfileNotFoundError` をスローするようにリポジトリを修正する

## 依存関係

- **親タスク**: T1-3-0 (データ操作用リポジトリ層の実装)
- **依存タスク**: T1-3-4 (ユーザープロファイル作成機能の実装)
- **担当領域**: バックエンド

## 実装詳細

### 1. `zod` を用いたスキーマと型の定義

`src/drizzle/schema.ts` に、`userProfile` テーブルとは別に、バリデーション用の `zod` スキーマを定義する。

```typescript
// src/drizzle/schema.ts
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { z } from "zod";

// ... (既存の userProfile テーブル定義)

// zod を使用して入力データ用のスキーマを定義
export const userProfileInputSchema = z.object({
  smokingStartDate: z
    .string()
    .datetime({ message: "有効なISO形式の日付文字列である必要があります" }),
  cigsPerDay: z
    .number()
    .int()
    .min(0, { message: "0以上の数値を入力してください" }),
  pricePerPack: z
    .number()
    .int()
    .min(0, { message: "0以上の数値を入力してください" }),
  cigsPerPack: z
    .number()
    .int()
    .min(0, { message: "0以上の数値を入力してください" }),
});

// 新規作成用の型定義
export type CreateUserProfileInput = z.infer<typeof userProfileInputSchema>;

// 更新用の型定義 (全プロパティをオプショナルに)
export type UpdateUserProfileInput = z.infer<
  typeof userProfileInputSchema.partial()
>;
```

### 2. カスタムエラークラスの定義

アプリケーション全体で利用可能なカスタムエラーを `src/drizzle/errors.ts` に定義する。

```typescript
// src/drizzle/errors.ts
export class UserProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserProfileError";
  }
}

export class UserProfileNotFoundError extends UserProfileError {
  constructor(id: number) {
    super(`User profile with id ${id} not found`);
    this.name = "UserProfileNotFoundError";
  }
}

export class UserProfileValidationError extends UserProfileError {
  constructor(public issues: z.ZodIssue[]) {
    const message = issues.map((i) => i.message).join(", ");
    super(message);
    this.name = "UserProfileValidationError";
  }
}
```

### 3. バリデーション関数の実装

リポジトリ内で使用するバリデーションロジックを実装する。ここではシンプルにするため、各リポジトリ関数内で直接 `safeParse` を呼び出す。

### 4. リポジトリ関数の修正

作成したバリデーションとエラーハンドリングを既存のリポジトリ関数に組み込む。

#### `create` 関数の修正

```typescript
// src/drizzle/repositories/user-profile.repository.ts
// ... (imports)
import { UserProfileValidationError } from "@/drizzle/errors";

// ...
async create(input: CreateUserProfileInput) {
  const validationResult = userProfileInputSchema.safeParse(input);
  if (!validationResult.success) {
    throw new UserProfileValidationError(validationResult.error.issues);
  }

  // ... (既存の作成ロジック)
},
```

#### `update` 関数の修正

```typescript
// src/drizzle/repositories/user-profile.repository.ts
// ...
async update(id: number, input: UpdateUserProfileInput) {
  const validationResult = userProfileInputSchema.partial().safeParse(input);
  if (!validationResult.success) {
    throw new UserProfileValidationError(validationResult.error.issues);
  }

  // ... (既存の更新ロジック)
},
```

#### `findById` 関数の修正

`null` を返す代わりに `UserProfileNotFoundError` をスローする。

```typescript
// src/drizzle/repositories/user-profile.repository.ts
import { UserProfileNotFoundError } from "@/drizzle/errors";
// ...
async findById(id: number) {
  const result = await db.query.userProfile.findFirst({
    where: eq(userProfile.id, id),
  });
  if (!result) {
    throw new UserProfileNotFoundError(id);
  }
  return result;
},
```

_Note: この変更は呼び出し元に影響を与えるため、ドキュメント化とチーム内での周知が重要。_

## 実装手順

1. `src/drizzle/schema.ts` に `zod` を用いた `userProfileInputSchema` と関連する型 `CreateUserProfileInput`, `UpdateUserProfileInput` を定義する。
2. `src/drizzle/errors.ts` ファイルを作成し、`UserProfileError`, `UserProfileNotFoundError`, `UserProfileValidationError` の 3 つのカスタムエラークラスを定義する。
3. `user-profile.repository.ts` の `create` 関数を修正し、処理の先頭で `userProfileInputSchema.safeParse` を用いたバリデーションを追加する。
4. `update` 関数を修正し、`userProfileInputSchema.partial().safeParse` を用いたバリデーションを追加する。
5. `findById` 関数を修正し、結果が見つからない場合に `null` を返す代わりに `UserProfileNotFoundError` をスローするように変更する。
6. 他の関数 (`findAll` など) は、必要に応じて try-catch ブロックを追加し、予期せぬデータベースエラーを捕捉して `UserProfileError` として再スローすることを検討する（このタスクでは必須としない）。

## 完了条件

- [ ] `src/drizzle/schema.ts` に `zod` を用いたバリデーションスキーマと型が定義されている。
- [ ] `src/drizzle/errors.ts` にカスタムエラークラスが定義されている。
- [ ] `create` リポジトリ関数にバリデーションが組み込まれている。
- [ ] `update` リポジトリ関数にバリデーションが組み込まれている。
- [ ] `findById` リポジトリ関数が、見つからない場合に `UserProfileNotFoundError` をスローする。
- [ ] バリデーション失敗時に `UserProfileValidationError` がスローされ、エラー情報が含まれている。

## 次のタスク

- **T1-4**: 開発用データのシーディング

# T1-3-4: ユーザープロファイル作成機能の実装

## 概要

T1-3-3 で実装した更新機能を基に、ユーザープロファイルの作成機能を実装する。新規作成、一括作成、条件付き作成などの作成操作を実装し、データの整合性と型安全性を保ちながら、シンプルで使いやすい API を提供する。

## 目的

- ユーザープロファイルの基本的な作成操作を実装する
- データの整合性と型安全性を保証する
- エラーハンドリングとバリデーション機能を組み込む
- オンボーディング機能で使用される作成操作を実装する

## 依存関係

- **依存タスク**: T1-3-3（ユーザープロファイル更新機能の実装）
- **担当領域**: バックエンド

## 実装詳細

### 1. 基本的な作成機能の実装

#### 作成用の型定義

```typescript
// src/drizzle/types.ts (作成用の型定義を追加)
export interface CreateUserProfileInput {
  smokingStartDate: string;
  cigsPerDay: number;
  pricePerPack: number;
  cigsPerPack: number;
}

export interface CreateUserProfileResult {
  success: boolean;
  createdProfile?: UserProfile;
  error?: string;
}

export interface BulkCreateUserProfileInput {
  profiles: CreateUserProfileInput[];
}

export interface BulkCreateUserProfileResult {
  success: boolean;
  createdCount: number;
  createdProfiles: UserProfile[];
  errors: string[];
}
```

#### 基本的な作成関数の実装

```typescript
// src/drizzle/repositories/user-profile-create-repository.ts
import { db } from "../connection";
import { userProfile } from "../schema";
import {
  UserProfile,
  CreateUserProfileInput,
  CreateUserProfileResult,
} from "../types";
import { handleDatabaseError } from "../error-handler";
import { validateCreateInput } from "../validators/user-profile-create-validator";

export const userProfileCreateRepository = {
  // 単一ユーザープロファイルの作成
  create: async (
    input: CreateUserProfileInput
  ): Promise<CreateUserProfileResult> => {
    try {
      // 入力バリデーション
      validateCreateInput(input);

      // 作成データの準備
      const createData = {
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // データベース挿入
      const createdProfiles = await db
        .insert(userProfile)
        .values(createData)
        .returning();

      return {
        success: true,
        createdProfile: createdProfiles[0],
      };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Validation errors")
      ) {
        return {
          success: false,
          error: error.message,
        };
      }
      throw handleDatabaseError(error);
    }
  },

  // 複数ユーザープロファイルの一括作成
  createMultiple: async (
    inputs: CreateUserProfileInput[]
  ): Promise<BulkCreateUserProfileResult> => {
    try {
      const errors: string[] = [];
      const createdProfiles: UserProfile[] = [];
      let createdCount = 0;

      for (const input of inputs) {
        try {
          const result = await userProfileCreateRepository.create(input);
          if (result.success && result.createdProfile) {
            createdProfiles.push(result.createdProfile);
            createdCount++;
          } else {
            errors.push(result.error || "Unknown error");
          }
        } catch (error) {
          errors.push(`Failed to create profile: ${error.message}`);
        }
      }

      return {
        success: errors.length === 0,
        createdCount,
        createdProfiles,
        errors,
      };
    } catch (error) {
      throw handleDatabaseError(error);
    }
  },

  // 条件付き作成（重複チェック付き）
  createIfNotExists: async (
    input: CreateUserProfileInput,
    checkFields: (keyof CreateUserProfileInput)[]
  ): Promise<CreateUserProfileResult> => {
    try {
      // 重複チェック
      const existingProfiles = await db
        .select()
        .from(userProfile)
        .where(
          checkFields.reduce((conditions, field) => {
            return { ...conditions, [field]: input[field] };
          }, {})
        );

      if (existingProfiles.length > 0) {
        return {
          success: false,
          error: "User profile with the same data already exists",
        };
      }

      // 作成実行
      return await userProfileCreateRepository.create(input);
    } catch (error) {
      throw handleDatabaseError(error);
    }
  },
};
```

### 2. 高度な作成機能の実装

#### バッチ作成機能

```typescript
// src/drizzle/repositories/user-profile-batch-create-repository.ts
import { db } from "../connection";
import { userProfile } from "../schema";
import {
  UserProfile,
  CreateUserProfileInput,
  BulkCreateUserProfileResult,
} from "../types";
import { handleDatabaseError } from "../error-handler";

export const userProfileBatchCreateRepository = {
  // バッチ作成（トランザクション使用）
  batchCreate: async (
    inputs: CreateUserProfileInput[]
  ): Promise<BulkCreateUserProfileResult> => {
    try {
      const errors: string[] = [];
      let createdCount = 0;

      // トランザクション開始
      const result = await db.transaction(async (tx) => {
        const createdProfiles: UserProfile[] = [];

        for (const input of inputs) {
          try {
            const createData = {
              ...input,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            const created = await tx
              .insert(userProfile)
              .values(createData)
              .returning();

            createdProfiles.push(created[0]);
            createdCount++;
          } catch (error) {
            errors.push(`Failed to create profile: ${error.message}`);
          }
        }

        return createdProfiles;
      });

      return {
        success: errors.length === 0,
        createdCount,
        createdProfiles: result,
        errors,
      };
    } catch (error) {
      throw handleDatabaseError(error);
    }
  },

  // 条件付きバッチ作成
  batchCreateWithConditions: async (
    inputs: CreateUserProfileInput[],
    conditions: {
      skipDuplicates?: boolean;
      validateUnique?: boolean;
    } = {}
  ): Promise<BulkCreateUserProfileResult> => {
    try {
      const errors: string[] = [];
      const createdProfiles: UserProfile[] = [];
      let createdCount = 0;

      for (const input of inputs) {
        try {
          // 重複チェック（条件付き）
          if (conditions.validateUnique) {
            const existing = await db.select().from(userProfile).where({
              smokingStartDate: input.smokingStartDate,
              cigsPerDay: input.cigsPerDay,
              pricePerPack: input.pricePerPack,
              cigsPerPack: input.cigsPerPack,
            });

            if (existing.length > 0) {
              if (conditions.skipDuplicates) {
                continue; // スキップ
              } else {
                errors.push(
                  `Duplicate profile found for input: ${JSON.stringify(input)}`
                );
                continue;
              }
            }
          }

          // 作成実行
          const createData = {
            ...input,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const created = await db
            .insert(userProfile)
            .values(createData)
            .returning();

          createdProfiles.push(created[0]);
          createdCount++;
        } catch (error) {
          errors.push(`Failed to create profile: ${error.message}`);
        }
      }

      return {
        success: errors.length === 0,
        createdCount,
        createdProfiles,
        errors,
      };
    } catch (error) {
      throw handleDatabaseError(error);
    }
  },
};
```

#### テンプレート作成機能

```typescript
// src/drizzle/repositories/user-profile-template-create-repository.ts
import { userProfileCreateRepository } from "./user-profile-create-repository";
import { CreateUserProfileInput } from "../types";

export const userProfileTemplateCreateRepository = {
  // デフォルトテンプレートでの作成
  createWithDefaultTemplate: async (): Promise<CreateUserProfileResult> => {
    const defaultTemplate: CreateUserProfileInput = {
      smokingStartDate: new Date().toISOString(),
      cigsPerDay: 20,
      pricePerPack: 500.0,
      cigsPerPack: 20,
    };

    return await userProfileCreateRepository.create(defaultTemplate);
  },

  // カスタムテンプレートでの作成
  createWithTemplate: async (
    template: Partial<CreateUserProfileInput>
  ): Promise<CreateUserProfileResult> => {
    const templateData: CreateUserProfileInput = {
      smokingStartDate: template.smokingStartDate || new Date().toISOString(),
      cigsPerDay: template.cigsPerDay || 20,
      pricePerPack: template.pricePerPack || 500.0,
      cigsPerPack: template.cigsPerPack || 20,
    };

    return await userProfileCreateRepository.create(templateData);
  },

  // 複数テンプレートでの一括作成
  createMultipleWithTemplates: async (
    templates: Partial<CreateUserProfileInput>[]
  ): Promise<BulkCreateUserProfileResult> => {
    const inputs: CreateUserProfileInput[] = templates.map((template) => ({
      smokingStartDate: template.smokingStartDate || new Date().toISOString(),
      cigsPerDay: template.cigsPerDay || 20,
      pricePerPack: template.pricePerPack || 500.0,
      cigsPerPack: template.cigsPerPack || 20,
    }));

    return await userProfileCreateRepository.createMultiple(inputs);
  },
};
```

### 3. バリデーションとエラーハンドリング

#### 作成用バリデーション

```typescript
// src/drizzle/validators/user-profile-create-validator.ts
import { CreateUserProfileInput } from "../types";

export const validateCreateInput = (input: CreateUserProfileInput): void => {
  const errors: string[] = [];

  // 必須フィールドのチェック
  if (!input.smokingStartDate) {
    errors.push("smokingStartDate is required");
  } else if (!isValidISODate(input.smokingStartDate)) {
    errors.push("smokingStartDate must be a valid ISO date string");
  }

  if (input.cigsPerDay === undefined || input.cigsPerDay === null) {
    errors.push("cigsPerDay is required");
  } else if (
    !Number.isInteger(input.cigsPerDay) ||
    input.cigsPerDay < 0 ||
    input.cigsPerDay > 100
  ) {
    errors.push("cigsPerDay must be an integer between 0 and 100");
  }

  if (input.pricePerPack === undefined || input.pricePerPack === null) {
    errors.push("pricePerPack is required");
  } else if (
    typeof input.pricePerPack !== "number" ||
    input.pricePerPack < 0 ||
    input.pricePerPack > 10000
  ) {
    errors.push("pricePerPack must be a number between 0 and 10000");
  }

  if (input.cigsPerPack === undefined || input.cigsPerPack === null) {
    errors.push("cigsPerPack is required");
  } else if (
    !Number.isInteger(input.cigsPerPack) ||
    input.cigsPerPack < 0 ||
    input.cigsPerPack > 50
  ) {
    errors.push("cigsPerPack must be an integer between 0 and 50");
  }

  // 論理的な整合性チェック
  if (input.cigsPerDay > 0 && input.cigsPerPack === 0) {
    errors.push("cigsPerPack cannot be 0 when cigsPerDay is greater than 0");
  }

  if (input.pricePerPack > 0 && input.cigsPerPack === 0) {
    errors.push("cigsPerPack cannot be 0 when pricePerPack is greater than 0");
  }

  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join(", ")}`);
  }
};

const isValidISODate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return (
    date instanceof Date &&
    !isNaN(date.getTime()) &&
    dateString === date.toISOString()
  );
};
```

#### エラーハンドリングの強化

```typescript
// src/drizzle/repositories/user-profile-create-repository.ts (エラーハンドリング部分)
export const userProfileCreateRepository = {
  // エラーハンドリング付きの作成関数
  create: async (
    input: CreateUserProfileInput
  ): Promise<CreateUserProfileResult> => {
    try {
      // 入力バリデーション
      validateCreateInput(input);

      // 作成データの準備
      const createData = {
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // データベース挿入
      const createdProfiles = await db
        .insert(userProfile)
        .values(createData)
        .returning();

      return {
        success: true,
        createdProfile: createdProfiles[0],
      };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Validation errors")
      ) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (
        error instanceof Error &&
        error.message.includes("UNIQUE constraint failed")
      ) {
        return {
          success: false,
          error: "User profile with the same data already exists",
        };
      }

      throw handleDatabaseError(error);
    }
  },
};
```

## 実装手順

1. **作成用の型定義の追加**

   ```typescript
   // src/drizzle/types.ts に作成用の型定義を追加
   export interface CreateUserProfileInput {
     smokingStartDate: string;
     cigsPerDay: number;
     pricePerPack: number;
     cigsPerPack: number;
   }
   ```

2. **基本的な作成機能の実装**

   ```bash
   # 作成リポジトリファイルを作成
   touch src/drizzle/repositories/user-profile-create-repository.ts
   ```

3. **高度な作成機能の実装**

   ```bash
   # バッチ作成リポジトリを作成
   touch src/drizzle/repositories/user-profile-batch-create-repository.ts
   touch src/drizzle/repositories/user-profile-template-create-repository.ts
   ```

4. **バリデーション機能の実装**

   ```bash
   # 作成用バリデーションファイルを作成
   touch src/drizzle/validators/user-profile-create-validator.ts
   ```

5. **テストの実装**

   ```bash
   # テストファイルを作成
   touch src/drizzle/repositories/__tests__/user-profile-create-repository.test.ts
   ```

6. **動作確認**

   ```bash
   # TypeScriptの型チェック
   npx tsc --noEmit src/drizzle/repositories/user-profile-create-repository.ts

   # テストの実行
   npm test src/drizzle/repositories/__tests__/user-profile-create-repository.test.ts
   ```

## 完了条件

- [ ] 基本的な作成機能（create, createMultiple, createIfNotExists）が実装されている
- [ ] バッチ作成機能が実装されている
- [ ] テンプレート作成機能が実装されている
- [ ] 入力バリデーション機能が実装されている
- [ ] エラーハンドリング機能が実装されている
- [ ] 各関数の単体テストが実装されている
- [ ] TypeScript の型チェックが通る
- [ ] オンボーディング機能で使用される作成操作が利用可能である

## 次のタスク

- **T1-3-5**: エラーハンドリングとバリデーション機能の実装
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **作成データのバリデーションエラー**

   ```bash
   # バリデーション関数のテスト
   npx tsx test-create-validator.ts
   ```

2. **データベース挿入エラー**

   ```bash
   # スキーマの確認
   cat src/drizzle/schema.ts

   # マイグレーションの確認
   npx drizzle-kit introspect
   ```

3. **重複データエラー**

   ```bash
   # 既存データの確認
   sqlite3 no_smoking_app.db "SELECT * FROM user_profile;"
   ```

4. **型定義エラー**
   ```bash
   # 型定義の確認
   npx tsc --noEmit src/drizzle/types.ts
   ```

## 備考

- 作成機能はデータの整合性を保ちながら、シンプルで使いやすい API を提供する
- エラーハンドリングは適切なエラーメッセージとエラーコードを提供する
- バッチ作成はトランザクションを使用してデータの整合性を保証する
- テンプレート作成機能は開発効率を向上させる

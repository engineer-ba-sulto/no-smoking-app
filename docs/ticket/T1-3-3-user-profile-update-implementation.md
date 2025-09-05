# T1-3-3: ユーザープロファイル更新機能の実装

## 概要

T1-3-2 で実装した取得機能を基に、ユーザープロファイルの更新機能を実装する。部分更新、全件更新、条件付き更新などの更新操作を実装し、データの整合性と型安全性を保ちながら、シンプルで使いやすい API を提供する。

## 目的

- ユーザープロファイルの基本的な更新操作を実装する
- データの整合性と型安全性を保証する
- エラーハンドリングとバリデーション機能を組み込む
- 機能要件 F01 で使用される更新操作を実装する

## 依存関係

- **依存タスク**: T1-3-2（ユーザープロファイル取得機能の実装）
- **担当領域**: バックエンド

## 実装詳細

### 1. 基本的な更新機能の実装

#### 更新用の型定義

```typescript
// src/drizzle/types.ts (更新用の型定義を追加)
export interface UpdateUserProfileInput {
  smokingStartDate?: string;
  cigsPerDay?: number;
  pricePerPack?: number;
  cigsPerPack?: number;
}

export interface UpdateUserProfileResult {
  success: boolean;
  updatedProfile?: UserProfile;
  error?: string;
}
```

#### 基本的な更新関数の実装

```typescript
// src/drizzle/repositories/user-profile-update-repository.ts
import { db } from "../connection";
import { userProfile } from "../schema";
import { eq } from "drizzle-orm";
import {
  UserProfile,
  UpdateUserProfileInput,
  UpdateUserProfileResult,
} from "../types";
import { handleDatabaseError } from "../error-handler";
import { validateUpdateInput } from "../validators/user-profile-update-validator";

export const userProfileUpdateRepository = {
  // IDによる単一ユーザープロファイルの更新
  updateById: async (
    id: number,
    input: UpdateUserProfileInput
  ): Promise<UpdateUserProfileResult> => {
    try {
      // 入力バリデーション
      validateUpdateInput(input);

      // 更新対象の存在確認
      const existingProfile = await db
        .select()
        .from(userProfile)
        .where(eq(userProfile.id, id))
        .limit(1);

      if (existingProfile.length === 0) {
        return {
          success: false,
          error: `User profile with id ${id} not found`,
        };
      }

      // 更新データの準備
      const updateData = {
        ...input,
        updatedAt: new Date().toISOString(),
      };

      // データベース更新
      const updatedProfiles = await db
        .update(userProfile)
        .set(updateData)
        .where(eq(userProfile.id, id))
        .returning();

      return {
        success: true,
        updatedProfile: updatedProfiles[0],
      };
    } catch (error) {
      throw handleDatabaseError(error);
    }
  },

  // 複数ユーザープロファイルの一括更新
  updateMultiple: async (
    updates: Array<{ id: number; input: UpdateUserProfileInput }>
  ): Promise<UpdateUserProfileResult[]> => {
    try {
      const results: UpdateUserProfileResult[] = [];

      for (const { id, input } of updates) {
        const result = await userProfileUpdateRepository.updateById(id, input);
        results.push(result);
      }

      return results;
    } catch (error) {
      throw handleDatabaseError(error);
    }
  },

  // 条件付き更新
  updateWhere: async (
    conditions: any,
    input: UpdateUserProfileInput
  ): Promise<UpdateUserProfileResult[]> => {
    try {
      validateUpdateInput(input);

      const updateData = {
        ...input,
        updatedAt: new Date().toISOString(),
      };

      const updatedProfiles = await db
        .update(userProfile)
        .set(updateData)
        .where(conditions)
        .returning();

      return updatedProfiles.map((profile) => ({
        success: true,
        updatedProfile: profile,
      }));
    } catch (error) {
      throw handleDatabaseError(error);
    }
  },
};
```

### 2. 高度な更新機能の実装

#### 統計情報の再計算機能

```typescript
// src/drizzle/repositories/user-profile-stats-update-repository.ts
import { userProfileUpdateRepository } from "./user-profile-update-repository";
import { userProfileRepository } from "./user-profile-repository";
import { UserProfile, UpdateUserProfileInput } from "../types";
import { calculateUserStats } from "../utils/stats-calculator";

export const userProfileStatsUpdateRepository = {
  // 統計情報を考慮した更新
  updateWithStatsRecalculation: async (
    id: number,
    input: UpdateUserProfileInput
  ): Promise<{
    success: boolean;
    updatedProfile?: UserProfile;
    recalculatedStats?: any;
    error?: string;
  }> => {
    try {
      // 更新前のプロファイル取得
      const beforeProfile = await userProfileRepository.findById(id);
      if (!beforeProfile) {
        return {
          success: false,
          error: `User profile with id ${id} not found`,
        };
      }

      // 更新実行
      const updateResult = await userProfileUpdateRepository.updateById(
        id,
        input
      );
      if (!updateResult.success) {
        return updateResult;
      }

      // 更新後の統計情報再計算
      const recalculatedStats = calculateUserStats(
        updateResult.updatedProfile!
      );

      return {
        success: true,
        updatedProfile: updateResult.updatedProfile,
        recalculatedStats,
      };
    } catch (error) {
      throw error;
    }
  },

  // 特定フィールドの一括更新
  updateField: async (
    field: keyof UpdateUserProfileInput,
    value: any,
    userIds?: number[]
  ): Promise<UpdateUserProfileResult[]> => {
    try {
      const updateInput = { [field]: value } as UpdateUserProfileInput;

      if (userIds && userIds.length > 0) {
        // 特定ユーザーのみ更新
        const updates = userIds.map((id) => ({ id, input: updateInput }));
        return await userProfileUpdateRepository.updateMultiple(updates);
      } else {
        // 全ユーザー更新
        return await userProfileUpdateRepository.updateWhere({}, updateInput);
      }
    } catch (error) {
      throw error;
    }
  },
};
```

#### バッチ更新機能

```typescript
// src/drizzle/repositories/user-profile-batch-update-repository.ts
import { db } from "../connection";
import { userProfile } from "../schema";
import { eq, inArray } from "drizzle-orm";
import { UserProfile, UpdateUserProfileInput } from "../types";
import { handleDatabaseError } from "../error-handler";

export const userProfileBatchUpdateRepository = {
  // バッチ更新（トランザクション使用）
  batchUpdate: async (
    updates: Array<{ id: number; input: UpdateUserProfileInput }>
  ): Promise<{
    success: boolean;
    updatedCount: number;
    errors: string[];
  }> => {
    try {
      const errors: string[] = [];
      let updatedCount = 0;

      // トランザクション開始
      await db.transaction(async (tx) => {
        for (const { id, input } of updates) {
          try {
            const updateData = {
              ...input,
              updatedAt: new Date().toISOString(),
            };

            const result = await tx
              .update(userProfile)
              .set(updateData)
              .where(eq(userProfile.id, id))
              .returning();

            if (result.length > 0) {
              updatedCount++;
            } else {
              errors.push(`User profile with id ${id} not found`);
            }
          } catch (error) {
            errors.push(
              `Failed to update user profile with id ${id}: ${error.message}`
            );
          }
        }
      });

      return {
        success: errors.length === 0,
        updatedCount,
        errors,
      };
    } catch (error) {
      throw handleDatabaseError(error);
    }
  },

  // 条件付きバッチ更新
  batchUpdateWhere: async (
    conditions: any,
    input: UpdateUserProfileInput
  ): Promise<{
    success: boolean;
    updatedCount: number;
    updatedProfiles: UserProfile[];
  }> => {
    try {
      const updateData = {
        ...input,
        updatedAt: new Date().toISOString(),
      };

      const updatedProfiles = await db
        .update(userProfile)
        .set(updateData)
        .where(conditions)
        .returning();

      return {
        success: true,
        updatedCount: updatedProfiles.length,
        updatedProfiles,
      };
    } catch (error) {
      throw handleDatabaseError(error);
    }
  },
};
```

### 3. バリデーションとエラーハンドリング

#### 更新用バリデーション

```typescript
// src/drizzle/validators/user-profile-update-validator.ts
import { UpdateUserProfileInput } from "../types";

export const validateUpdateInput = (input: UpdateUserProfileInput): void => {
  const errors: string[] = [];

  if (input.smokingStartDate !== undefined) {
    if (!isValidISODate(input.smokingStartDate)) {
      errors.push("smokingStartDate must be a valid ISO date string");
    }
  }

  if (input.cigsPerDay !== undefined) {
    if (
      !Number.isInteger(input.cigsPerDay) ||
      input.cigsPerDay < 0 ||
      input.cigsPerDay > 100
    ) {
      errors.push("cigsPerDay must be an integer between 0 and 100");
    }
  }

  if (input.pricePerPack !== undefined) {
    if (
      typeof input.pricePerPack !== "number" ||
      input.pricePerPack < 0 ||
      input.pricePerPack > 10000
    ) {
      errors.push("pricePerPack must be a number between 0 and 10000");
    }
  }

  if (input.cigsPerPack !== undefined) {
    if (
      !Number.isInteger(input.cigsPerPack) ||
      input.cigsPerPack < 0 ||
      input.cigsPerPack > 50
    ) {
      errors.push("cigsPerPack must be an integer between 0 and 50");
    }
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
// src/drizzle/repositories/user-profile-update-repository.ts (エラーハンドリング部分)
export const userProfileUpdateRepository = {
  // エラーハンドリング付きの更新関数
  updateById: async (
    id: number,
    input: UpdateUserProfileInput
  ): Promise<UpdateUserProfileResult> => {
    try {
      // 入力バリデーション
      validateUpdateInput(input);

      // 更新対象の存在確認
      const existingProfile = await db
        .select()
        .from(userProfile)
        .where(eq(userProfile.id, id))
        .limit(1);

      if (existingProfile.length === 0) {
        return {
          success: false,
          error: `User profile with id ${id} not found`,
        };
      }

      // 更新データの準備
      const updateData = {
        ...input,
        updatedAt: new Date().toISOString(),
      };

      // データベース更新
      const updatedProfiles = await db
        .update(userProfile)
        .set(updateData)
        .where(eq(userProfile.id, id))
        .returning();

      return {
        success: true,
        updatedProfile: updatedProfiles[0],
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
};
```

## 実装手順

1. **更新用の型定義の追加**

   ```typescript
   // src/drizzle/types.ts に更新用の型定義を追加
   export interface UpdateUserProfileInput {
     smokingStartDate?: string;
     cigsPerDay?: number;
     pricePerPack?: number;
     cigsPerPack?: number;
   }
   ```

2. **基本的な更新機能の実装**

   ```bash
   # 更新リポジトリファイルを作成
   touch src/drizzle/repositories/user-profile-update-repository.ts
   ```

3. **高度な更新機能の実装**

   ```bash
   # 統計情報更新リポジトリを作成
   touch src/drizzle/repositories/user-profile-stats-update-repository.ts
   touch src/drizzle/repositories/user-profile-batch-update-repository.ts
   ```

4. **バリデーション機能の実装**

   ```bash
   # 更新用バリデーションファイルを作成
   touch src/drizzle/validators/user-profile-update-validator.ts
   ```

5. **テストの実装**

   ```bash
   # テストファイルを作成
   touch src/drizzle/repositories/__tests__/user-profile-update-repository.test.ts
   ```

6. **動作確認**

   ```bash
   # TypeScriptの型チェック
   npx tsc --noEmit src/drizzle/repositories/user-profile-update-repository.ts

   # テストの実行
   npm test src/drizzle/repositories/__tests__/user-profile-update-repository.test.ts
   ```

## 完了条件

- [ ] 基本的な更新機能（updateById, updateMultiple, updateWhere）が実装されている
- [ ] 統計情報の再計算機能が実装されている
- [ ] バッチ更新機能が実装されている
- [ ] 入力バリデーション機能が実装されている
- [ ] エラーハンドリング機能が実装されている
- [ ] 各関数の単体テストが実装されている
- [ ] TypeScript の型チェックが通る
- [ ] 機能要件 F01 で使用される更新操作が利用可能である

## 次のタスク

- **T1-3-4**: ユーザープロファイル作成機能の実装
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **更新データのバリデーションエラー**

   ```bash
   # バリデーション関数のテスト
   npx tsx test-update-validator.ts
   ```

2. **データベース更新エラー**

   ```bash
   # スキーマの確認
   cat src/drizzle/schema.ts

   # マイグレーションの確認
   npx drizzle-kit introspect
   ```

3. **トランザクションエラー**

   ```bash
   # データベースの整合性確認
   sqlite3 no_smoking_app.db "PRAGMA integrity_check;"
   ```

4. **型定義エラー**
   ```bash
   # 型定義の確認
   npx tsc --noEmit src/drizzle/types.ts
   ```

## 備考

- 更新機能はデータの整合性を保ちながら、シンプルで使いやすい API を提供する
- エラーハンドリングは適切なエラーメッセージとエラーコードを提供する
- バッチ更新はトランザクションを使用してデータの整合性を保証する
- 統計情報の再計算は更新後に自動で実行される

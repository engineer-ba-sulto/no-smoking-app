# T1-3-2: ユーザープロファイル取得機能の実装

## 概要

T1-3-1 で設定したデータベース接続とクエリビルダーを基に、ユーザープロファイルの取得機能を実装する。ID による単一取得、全件取得、条件付き取得などの基本的な取得操作を実装し、型安全性とエラーハンドリングを組み込む。

## 目的

- ユーザープロファイルの基本的な取得操作を実装する
- 型安全性を保ちながら、シンプルで使いやすい API を提供する
- エラーハンドリングとバリデーション機能を組み込む
- 機能要件 F01, F03 で使用される取得操作を実装する

## 依存関係

- **依存タスク**: T1-3-1（データベース接続とクエリビルダーの設定）
- **担当領域**: バックエンド

## 実装詳細

### 1. 基本的な取得機能の実装

#### ユーザープロファイルの型定義

```typescript
// src/drizzle/types.ts
export interface UserProfile {
  id: number;
  smokingStartDate: string; // ISO文字列
  cigsPerDay: number;
  pricePerPack: number;
  cigsPerPack: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileWithStats extends UserProfile {
  // 計算された統計情報
  daysSinceQuit: number;
  totalCigsAvoided: number;
  totalMoneySaved: number;
}
```

#### 基本的な取得関数の実装

```typescript
// src/drizzle/repositories/user-profile-repository.ts
import { db } from "../connection";
import { userProfile } from "../schema";
import { eq, desc, asc } from "drizzle-orm";
import { UserProfile, UserProfileWithStats } from "../types";
import { DatabaseError, handleDatabaseError } from "../error-handler";

export const userProfileRepository = {
  // 全ユーザープロファイルの取得
  findAll: async (): Promise<UserProfile[]> => {
    try {
      const profiles = await db.select().from(userProfile);
      return profiles;
    } catch (error) {
      throw handleDatabaseError(error);
    }
  },

  // IDによる単一ユーザープロファイルの取得
  findById: async (id: number): Promise<UserProfile | null> => {
    try {
      const result = await db
        .select()
        .from(userProfile)
        .where(eq(userProfile.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw handleDatabaseError(error);
    }
  },

  // 最新のユーザープロファイル取得
  findLatest: async (limit: number = 10): Promise<UserProfile[]> => {
    try {
      const profiles = await db
        .select()
        .from(userProfile)
        .orderBy(desc(userProfile.createdAt))
        .limit(limit);

      return profiles;
    } catch (error) {
      throw handleDatabaseError(error);
    }
  },

  // 禁煙開始日による検索
  findBySmokingStartDate: async (startDate: string): Promise<UserProfile[]> => {
    try {
      const profiles = await db
        .select()
        .from(userProfile)
        .where(eq(userProfile.smokingStartDate, startDate));

      return profiles;
    } catch (error) {
      throw handleDatabaseError(error);
    }
  },
};
```

### 2. 高度な取得機能の実装

#### 統計情報付きの取得機能

```typescript
// src/drizzle/repositories/user-profile-stats-repository.ts
import { userProfileRepository } from "./user-profile-repository";
import { UserProfile, UserProfileWithStats } from "../types";
import { differenceInDays, differenceInHours } from "date-fns";

export const userProfileStatsRepository = {
  // 統計情報付きのユーザープロファイル取得
  findByIdWithStats: async (
    id: number
  ): Promise<UserProfileWithStats | null> => {
    try {
      const profile = await userProfileRepository.findById(id);
      if (!profile) {
        return null;
      }

      const stats = calculateUserStats(profile);
      return { ...profile, ...stats };
    } catch (error) {
      throw error;
    }
  },

  // 全ユーザーの統計情報付き取得
  findAllWithStats: async (): Promise<UserProfileWithStats[]> => {
    try {
      const profiles = await userProfileRepository.findAll();
      return profiles.map((profile) => ({
        ...profile,
        ...calculateUserStats(profile),
      }));
    } catch (error) {
      throw error;
    }
  },
};

// 統計情報の計算関数
const calculateUserStats = (profile: UserProfile) => {
  const now = new Date();
  const quitDate = new Date(profile.smokingStartDate);

  const daysSinceQuit = differenceInDays(now, quitDate);
  const totalCigsAvoided = profile.cigsPerDay * daysSinceQuit;
  const pricePerCig = profile.pricePerPack / profile.cigsPerPack;
  const totalMoneySaved = totalCigsAvoided * pricePerCig;

  return {
    daysSinceQuit,
    totalCigsAvoided,
    totalMoneySaved: Math.round(totalMoneySaved),
  };
};
```

#### 条件付き検索機能

```typescript
// src/drizzle/repositories/user-profile-search-repository.ts
import { db } from "../connection";
import { userProfile } from "../schema";
import { and, or, gte, lte, eq } from "drizzle-orm";
import { UserProfile } from "../types";
import { handleDatabaseError } from "../error-handler";

export interface UserProfileSearchConditions {
  minCigsPerDay?: number;
  maxCigsPerDay?: number;
  minPricePerPack?: number;
  maxPricePerPack?: number;
  minCigsPerPack?: number;
  maxCigsPerPack?: number;
  startDateFrom?: string;
  startDateTo?: string;
}

export const userProfileSearchRepository = {
  // 条件付き検索
  search: async (
    conditions: UserProfileSearchConditions
  ): Promise<UserProfile[]> => {
    try {
      let query = db.select().from(userProfile);
      const whereConditions = [];

      if (conditions.minCigsPerDay !== undefined) {
        whereConditions.push(
          gte(userProfile.cigsPerDay, conditions.minCigsPerDay)
        );
      }

      if (conditions.maxCigsPerDay !== undefined) {
        whereConditions.push(
          lte(userProfile.cigsPerDay, conditions.maxCigsPerDay)
        );
      }

      if (conditions.minPricePerPack !== undefined) {
        whereConditions.push(
          gte(userProfile.pricePerPack, conditions.minPricePerPack)
        );
      }

      if (conditions.maxPricePerPack !== undefined) {
        whereConditions.push(
          lte(userProfile.pricePerPack, conditions.maxPricePerPack)
        );
      }

      if (conditions.minCigsPerPack !== undefined) {
        whereConditions.push(
          gte(userProfile.cigsPerPack, conditions.minCigsPerPack)
        );
      }

      if (conditions.maxCigsPerPack !== undefined) {
        whereConditions.push(
          lte(userProfile.cigsPerPack, conditions.maxCigsPerPack)
        );
      }

      if (conditions.startDateFrom !== undefined) {
        whereConditions.push(
          gte(userProfile.smokingStartDate, conditions.startDateFrom)
        );
      }

      if (conditions.startDateTo !== undefined) {
        whereConditions.push(
          lte(userProfile.smokingStartDate, conditions.startDateTo)
        );
      }

      if (whereConditions.length > 0) {
        query = query.where(and(...whereConditions));
      }

      const profiles = await query;
      return profiles;
    } catch (error) {
      throw handleDatabaseError(error);
    }
  },

  // 統計情報による検索
  searchByStats: async (conditions: {
    minDaysSinceQuit?: number;
    maxDaysSinceQuit?: number;
    minTotalCigsAvoided?: number;
    maxTotalCigsAvoided?: number;
    minTotalMoneySaved?: number;
    maxTotalMoneySaved?: number;
  }): Promise<UserProfile[]> => {
    try {
      // 全ユーザーを取得して統計情報でフィルタリング
      const allProfiles = await userProfileRepository.findAll();
      const filteredProfiles = allProfiles.filter((profile) => {
        const stats = calculateUserStats(profile);

        if (
          conditions.minDaysSinceQuit !== undefined &&
          stats.daysSinceQuit < conditions.minDaysSinceQuit
        ) {
          return false;
        }

        if (
          conditions.maxDaysSinceQuit !== undefined &&
          stats.daysSinceQuit > conditions.maxDaysSinceQuit
        ) {
          return false;
        }

        if (
          conditions.minTotalCigsAvoided !== undefined &&
          stats.totalCigsAvoided < conditions.minTotalCigsAvoided
        ) {
          return false;
        }

        if (
          conditions.maxTotalCigsAvoided !== undefined &&
          stats.totalCigsAvoided > conditions.maxTotalCigsAvoided
        ) {
          return false;
        }

        if (
          conditions.minTotalMoneySaved !== undefined &&
          stats.totalMoneySaved < conditions.minTotalMoneySaved
        ) {
          return false;
        }

        if (
          conditions.maxTotalMoneySaved !== undefined &&
          stats.totalMoneySaved > conditions.maxTotalMoneySaved
        ) {
          return false;
        }

        return true;
      });

      return filteredProfiles;
    } catch (error) {
      throw error;
    }
  },
};
```

### 3. エラーハンドリングとバリデーション

#### 入力バリデーション

```typescript
// src/drizzle/validators/user-profile-validator.ts
export const validateUserId = (id: number): void => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID must be a positive integer");
  }
};

export const validateSearchConditions = (
  conditions: UserProfileSearchConditions
): void => {
  if (conditions.minCigsPerDay !== undefined && conditions.minCigsPerDay < 0) {
    throw new Error("minCigsPerDay must be non-negative");
  }

  if (conditions.maxCigsPerDay !== undefined && conditions.maxCigsPerDay < 0) {
    throw new Error("maxCigsPerDay must be non-negative");
  }

  if (
    conditions.minPricePerPack !== undefined &&
    conditions.minPricePerPack < 0
  ) {
    throw new Error("minPricePerPack must be non-negative");
  }

  if (
    conditions.maxPricePerPack !== undefined &&
    conditions.maxPricePerPack < 0
  ) {
    throw new Error("maxPricePerPack must be non-negative");
  }

  if (
    conditions.minCigsPerPack !== undefined &&
    conditions.minCigsPerPack < 0
  ) {
    throw new Error("minCigsPerPack must be non-negative");
  }

  if (
    conditions.maxCigsPerPack !== undefined &&
    conditions.maxCigsPerPack < 0
  ) {
    throw new Error("maxCigsPerPack must be non-negative");
  }
};
```

#### エラーハンドリングの強化

```typescript
// src/drizzle/repositories/user-profile-repository.ts (エラーハンドリング部分)
export const userProfileRepository = {
  // エラーハンドリング付きの取得関数
  findById: async (id: number): Promise<UserProfile | null> => {
    try {
      validateUserId(id);

      const result = await db
        .select()
        .from(userProfile)
        .where(eq(userProfile.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      if (error instanceof Error && error.message.includes("ID must be")) {
        throw new Error(`Invalid user ID: ${error.message}`);
      }
      throw handleDatabaseError(error);
    }
  },

  // 検索条件のバリデーション付き検索
  search: async (
    conditions: UserProfileSearchConditions
  ): Promise<UserProfile[]> => {
    try {
      validateSearchConditions(conditions);

      // 検索ロジック...
    } catch (error) {
      if (error instanceof Error && error.message.includes("must be")) {
        throw new Error(`Invalid search conditions: ${error.message}`);
      }
      throw handleDatabaseError(error);
    }
  },
};
```

## 実装手順

1. **型定義ファイルの作成**

   ```bash
   # 型定義ファイルを作成
   touch src/drizzle/types.ts
   ```

2. **基本的な取得機能の実装**

   ```bash
   # リポジトリファイルを作成
   mkdir -p src/drizzle/repositories
   touch src/drizzle/repositories/user-profile-repository.ts
   ```

3. **高度な取得機能の実装**

   ```bash
   # 統計情報付きリポジトリを作成
   touch src/drizzle/repositories/user-profile-stats-repository.ts
   touch src/drizzle/repositories/user-profile-search-repository.ts
   ```

4. **バリデーション機能の実装**

   ```bash
   # バリデーションファイルを作成
   mkdir -p src/drizzle/validators
   touch src/drizzle/validators/user-profile-validator.ts
   ```

5. **テストの実装**

   ```bash
   # テストファイルを作成
   touch src/drizzle/repositories/__tests__/user-profile-repository.test.ts
   ```

6. **動作確認**

   ```bash
   # TypeScriptの型チェック
   npx tsc --noEmit src/drizzle/repositories/user-profile-repository.ts

   # テストの実行
   npm test src/drizzle/repositories/__tests__/user-profile-repository.test.ts
   ```

## 完了条件

- [ ] 基本的な取得機能（findAll, findById, findLatest）が実装されている
- [ ] 統計情報付きの取得機能が実装されている
- [ ] 条件付き検索機能が実装されている
- [ ] 入力バリデーション機能が実装されている
- [ ] エラーハンドリング機能が実装されている
- [ ] 各関数の単体テストが実装されている
- [ ] TypeScript の型チェックが通る
- [ ] 機能要件 F01, F03 で使用される取得操作が利用可能である

## 次のタスク

- **T1-3-3**: ユーザープロファイル更新機能の実装
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **型定義エラー**

   ```bash
   # 型定義の確認
   npx tsc --noEmit src/drizzle/types.ts

   # 型定義の再生成
   npx drizzle-kit generate
   ```

2. **データベースクエリエラー**

   ```bash
   # スキーマの確認
   cat src/drizzle/schema.ts

   # マイグレーションの確認
   npx drizzle-kit introspect
   ```

3. **統計情報計算エラー**

   ```bash
   # date-fnsの依存関係確認
   npm list date-fns

   # 依存関係の再インストール
   npm install date-fns
   ```

4. **バリデーションエラー**
   ```bash
   # バリデーション関数のテスト
   npx tsx test-validator.ts
   ```

## 備考

- 取得機能は型安全性を保ちながら、シンプルで使いやすい API を提供する
- エラーハンドリングは適切なエラーメッセージとエラーコードを提供する
- 統計情報の計算はリアルタイムで行い、データベースに保存しない
- 検索機能は柔軟で拡張可能な設計にする

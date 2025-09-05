# T1-3-5: エラーハンドリングとバリデーション機能の実装

## 概要

T1-3-4 で実装した作成機能を基に、リポジトリ層全体のエラーハンドリングとバリデーション機能を統合・強化する。カスタムエラークラス、バリデーション関数、エラーログ機能などを実装し、アプリケーション全体で一貫したエラー処理を提供する。

## 目的

- リポジトリ層全体のエラーハンドリングを統合・強化する
- バリデーション機能を統合・最適化する
- カスタムエラークラスとエラーログ機能を実装する
- アプリケーション全体で一貫したエラー処理を提供する

## 依存関係

- **依存タスク**: T1-3-4（ユーザープロファイル作成機能の実装）
- **担当領域**: バックエンド

## 実装詳細

### 1. カスタムエラークラスの実装

#### 基本エラークラス

```typescript
// src/drizzle/errors/base-errors.ts
export abstract class BaseError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string, public readonly context?: any) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
      stack: this.stack,
    };
  }
}

export class ValidationError extends BaseError {
  readonly code = "VALIDATION_ERROR";
  readonly statusCode = 400;

  constructor(message: string, public readonly field?: string, context?: any) {
    super(message, context);
  }
}

export class DatabaseError extends BaseError {
  readonly code = "DATABASE_ERROR";
  readonly statusCode = 500;

  constructor(
    message: string,
    public readonly originalError?: any,
    context?: any
  ) {
    super(message, context);
  }
}

export class NotFoundError extends BaseError {
  readonly code = "NOT_FOUND";
  readonly statusCode = 404;

  constructor(resource: string, identifier: any, context?: any) {
    super(`${resource} with identifier ${identifier} not found`, context);
  }
}

export class ConflictError extends BaseError {
  readonly code = "CONFLICT";
  readonly statusCode = 409;

  constructor(message: string, context?: any) {
    super(message, context);
  }
}
```

#### ユーザープロファイル専用エラークラス

```typescript
// src/drizzle/errors/user-profile-errors.ts
import {
  BaseError,
  ValidationError,
  NotFoundError,
  ConflictError,
} from "./base-errors";

export class UserProfileError extends BaseError {
  readonly code = "USER_PROFILE_ERROR";
  readonly statusCode = 500;
}

export class UserProfileValidationError extends ValidationError {
  readonly code = "USER_PROFILE_VALIDATION_ERROR";

  constructor(message: string, field?: string, context?: any) {
    super(message, field, context);
  }
}

export class UserProfileNotFoundError extends NotFoundError {
  readonly code = "USER_PROFILE_NOT_FOUND";

  constructor(id: number, context?: any) {
    super("User profile", id, context);
  }
}

export class UserProfileConflictError extends ConflictError {
  readonly code = "USER_PROFILE_CONFLICT";

  constructor(message: string, context?: any) {
    super(message, context);
  }
}

export class UserProfileDuplicateError extends ConflictError {
  readonly code = "USER_PROFILE_DUPLICATE";

  constructor(context?: any) {
    super("User profile with the same data already exists", context);
  }
}
```

### 2. 統合バリデーション機能の実装

#### バリデーション関数の統合

```typescript
// src/drizzle/validators/user-profile-validator.ts
import { CreateUserProfileInput, UpdateUserProfileInput } from "../types";
import { UserProfileValidationError } from "../errors/user-profile-errors";

export const validateUserProfileInput = {
  // 作成用バリデーション
  create: (input: CreateUserProfileInput): void => {
    const errors: ValidationError[] = [];

    // 必須フィールドのチェック
    if (!input.smokingStartDate) {
      errors.push(
        new ValidationError("smokingStartDate is required", "smokingStartDate")
      );
    } else if (!isValidISODate(input.smokingStartDate)) {
      errors.push(
        new ValidationError(
          "smokingStartDate must be a valid ISO date string",
          "smokingStartDate"
        )
      );
    }

    if (input.cigsPerDay === undefined || input.cigsPerDay === null) {
      errors.push(new ValidationError("cigsPerDay is required", "cigsPerDay"));
    } else if (
      !Number.isInteger(input.cigsPerDay) ||
      input.cigsPerDay < 0 ||
      input.cigsPerDay > 100
    ) {
      errors.push(
        new ValidationError(
          "cigsPerDay must be an integer between 0 and 100",
          "cigsPerDay"
        )
      );
    }

    if (input.pricePerPack === undefined || input.pricePerPack === null) {
      errors.push(
        new ValidationError("pricePerPack is required", "pricePerPack")
      );
    } else if (
      typeof input.pricePerPack !== "number" ||
      input.pricePerPack < 0 ||
      input.pricePerPack > 10000
    ) {
      errors.push(
        new ValidationError(
          "pricePerPack must be a number between 0 and 10000",
          "pricePerPack"
        )
      );
    }

    if (input.cigsPerPack === undefined || input.cigsPerPack === null) {
      errors.push(
        new ValidationError("cigsPerPack is required", "cigsPerPack")
      );
    } else if (
      !Number.isInteger(input.cigsPerPack) ||
      input.cigsPerPack < 0 ||
      input.cigsPerPack > 50
    ) {
      errors.push(
        new ValidationError(
          "cigsPerPack must be an integer between 0 and 50",
          "cigsPerPack"
        )
      );
    }

    // 論理的な整合性チェック
    if (input.cigsPerDay > 0 && input.cigsPerPack === 0) {
      errors.push(
        new ValidationError(
          "cigsPerPack cannot be 0 when cigsPerDay is greater than 0",
          "cigsPerPack"
        )
      );
    }

    if (input.pricePerPack > 0 && input.cigsPerPack === 0) {
      errors.push(
        new ValidationError(
          "cigsPerPack cannot be 0 when pricePerPack is greater than 0",
          "cigsPerPack"
        )
      );
    }

    if (errors.length > 0) {
      throw new UserProfileValidationError(
        `Validation failed: ${errors.map((e) => e.message).join(", ")}`,
        undefined,
        { errors: errors.map((e) => ({ field: e.field, message: e.message })) }
      );
    }
  },

  // 更新用バリデーション
  update: (input: UpdateUserProfileInput): void => {
    const errors: ValidationError[] = [];

    if (input.smokingStartDate !== undefined) {
      if (!isValidISODate(input.smokingStartDate)) {
        errors.push(
          new ValidationError(
            "smokingStartDate must be a valid ISO date string",
            "smokingStartDate"
          )
        );
      }
    }

    if (input.cigsPerDay !== undefined) {
      if (
        !Number.isInteger(input.cigsPerDay) ||
        input.cigsPerDay < 0 ||
        input.cigsPerDay > 100
      ) {
        errors.push(
          new ValidationError(
            "cigsPerDay must be an integer between 0 and 100",
            "cigsPerDay"
          )
        );
      }
    }

    if (input.pricePerPack !== undefined) {
      if (
        typeof input.pricePerPack !== "number" ||
        input.pricePerPack < 0 ||
        input.pricePerPack > 10000
      ) {
        errors.push(
          new ValidationError(
            "pricePerPack must be a number between 0 and 10000",
            "pricePerPack"
          )
        );
      }
    }

    if (input.cigsPerPack !== undefined) {
      if (
        !Number.isInteger(input.cigsPerPack) ||
        input.cigsPerPack < 0 ||
        input.cigsPerPack > 50
      ) {
        errors.push(
          new ValidationError(
            "cigsPerPack must be an integer between 0 and 50",
            "cigsPerPack"
          )
        );
      }
    }

    if (errors.length > 0) {
      throw new UserProfileValidationError(
        `Validation failed: ${errors.map((e) => e.message).join(", ")}`,
        undefined,
        { errors: errors.map((e) => ({ field: e.field, message: e.message })) }
      );
    }
  },

  // IDバリデーション
  id: (id: number): void => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new UserProfileValidationError(
        "ID must be a positive integer",
        "id"
      );
    }
  },
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

### 3. エラーハンドリングの統合

#### エラーハンドラーの実装

```typescript
// src/drizzle/error-handlers/error-handler.ts
import {
  BaseError,
  DatabaseError,
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../errors/base-errors";
import {
  UserProfileError,
  UserProfileValidationError,
  UserProfileNotFoundError,
  UserProfileConflictError,
} from "../errors/user-profile-errors";

export class ErrorHandler {
  // エラーの分類と処理
  static handle(error: any): BaseError {
    // 既にカスタムエラーの場合
    if (error instanceof BaseError) {
      return error;
    }

    // データベースエラーの場合
    if (error.code && error.code.startsWith("SQLITE_")) {
      return this.handleDatabaseError(error);
    }

    // バリデーションエラーの場合
    if (error.message && error.message.includes("Validation")) {
      return new UserProfileValidationError(error.message);
    }

    // その他のエラー
    return new UserProfileError(error.message || "Unknown error", {
      originalError: error,
    });
  }

  // データベースエラーの処理
  private static handleDatabaseError(error: any): DatabaseError {
    switch (error.code) {
      case "SQLITE_CONSTRAINT":
        return new UserProfileConflictError("Database constraint violation", {
          originalError: error,
        });
      case "SQLITE_BUSY":
        return new DatabaseError("Database is busy", error);
      case "SQLITE_LOCKED":
        return new DatabaseError("Database is locked", error);
      default:
        return new DatabaseError("Database error", error);
    }
  }

  // エラーログの出力
  static logError(error: BaseError, context?: any): void {
    const logData = {
      timestamp: new Date().toISOString(),
      error: error.toJSON(),
      context,
    };

    console.error("Error occurred:", JSON.stringify(logData, null, 2));

    // 本番環境では外部ログサービスに送信
    if (process.env.NODE_ENV === "production") {
      this.sendToLogService(logData);
    }
  }

  // 外部ログサービスへの送信（実装例）
  private static sendToLogService(logData: any): void {
    // 実装例: Sentry, LogRocket, など
    // 実際の実装は使用するログサービスに応じて変更
    console.log("Sending to log service:", logData);
  }
}
```

#### リポジトリ層でのエラーハンドリング統合

```typescript
// src/drizzle/repositories/user-profile-repository.ts (統合版)
import { db } from "../connection";
import { userProfile } from "../schema";
import { eq } from "drizzle-orm";
import {
  UserProfile,
  CreateUserProfileInput,
  UpdateUserProfileInput,
} from "../types";
import { ErrorHandler } from "../error-handlers/error-handler";
import { validateUserProfileInput } from "../validators/user-profile-validator";
import {
  UserProfileNotFoundError,
  UserProfileDuplicateError,
} from "../errors/user-profile-errors";

export const userProfileRepository = {
  // 取得機能
  findById: async (id: number): Promise<UserProfile> => {
    try {
      validateUserProfileInput.id(id);

      const result = await db
        .select()
        .from(userProfile)
        .where(eq(userProfile.id, id))
        .limit(1);

      if (result.length === 0) {
        throw new UserProfileNotFoundError(id);
      }

      return result[0];
    } catch (error) {
      const handledError = ErrorHandler.handle(error);
      ErrorHandler.logError(handledError, { operation: "findById", id });
      throw handledError;
    }
  },

  // 作成機能
  create: async (input: CreateUserProfileInput): Promise<UserProfile> => {
    try {
      validateUserProfileInput.create(input);

      const createData = {
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await db
        .insert(userProfile)
        .values(createData)
        .returning();

      return result[0];
    } catch (error) {
      const handledError = ErrorHandler.handle(error);
      ErrorHandler.logError(handledError, { operation: "create", input });
      throw handledError;
    }
  },

  // 更新機能
  update: async (
    id: number,
    input: UpdateUserProfileInput
  ): Promise<UserProfile> => {
    try {
      validateUserProfileInput.id(id);
      validateUserProfileInput.update(input);

      const updateData = {
        ...input,
        updatedAt: new Date().toISOString(),
      };

      const result = await db
        .update(userProfile)
        .set(updateData)
        .where(eq(userProfile.id, id))
        .returning();

      if (result.length === 0) {
        throw new UserProfileNotFoundError(id);
      }

      return result[0];
    } catch (error) {
      const handledError = ErrorHandler.handle(error);
      ErrorHandler.logError(handledError, { operation: "update", id, input });
      throw handledError;
    }
  },

  // 削除機能
  delete: async (id: number): Promise<boolean> => {
    try {
      validateUserProfileInput.id(id);

      const result = await db
        .delete(userProfile)
        .where(eq(userProfile.id, id))
        .returning();

      return result.length > 0;
    } catch (error) {
      const handledError = ErrorHandler.handle(error);
      ErrorHandler.logError(handledError, { operation: "delete", id });
      throw handledError;
    }
  },
};
```

### 4. エラーログとモニタリング機能

#### ログ設定

```typescript
// src/drizzle/logging/logger.ts
export class Logger {
  private static instance: Logger;
  private logLevel: "debug" | "info" | "warn" | "error" = "info";

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: "debug" | "info" | "warn" | "error"): void {
    this.logLevel = level;
  }

  debug(message: string, context?: any): void {
    if (this.shouldLog("debug")) {
      console.debug(`[DEBUG] ${message}`, context);
    }
  }

  info(message: string, context?: any): void {
    if (this.shouldLog("info")) {
      console.info(`[INFO] ${message}`, context);
    }
  }

  warn(message: string, context?: any): void {
    if (this.shouldLog("warn")) {
      console.warn(`[WARN] ${message}`, context);
    }
  }

  error(message: string, context?: any): void {
    if (this.shouldLog("error")) {
      console.error(`[ERROR] ${message}`, context);
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ["debug", "info", "warn", "error"];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }
}
```

## 実装手順

1. **カスタムエラークラスの実装**

   ```bash
   # エラークラスファイルを作成
   mkdir -p src/drizzle/errors
   touch src/drizzle/errors/base-errors.ts
   touch src/drizzle/errors/user-profile-errors.ts
   ```

2. **統合バリデーション機能の実装**

   ```bash
   # 統合バリデーションファイルを作成
   touch src/drizzle/validators/user-profile-validator.ts
   ```

3. **エラーハンドラーの実装**

   ```bash
   # エラーハンドラーファイルを作成
   mkdir -p src/drizzle/error-handlers
   touch src/drizzle/error-handlers/error-handler.ts
   ```

4. **ログ機能の実装**

   ```bash
   # ログファイルを作成
   mkdir -p src/drizzle/logging
   touch src/drizzle/logging/logger.ts
   ```

5. **リポジトリ層の統合**

   ```bash
   # 統合リポジトリファイルを作成
   touch src/drizzle/repositories/user-profile-repository.ts
   ```

6. **テストの実装**

   ```bash
   # テストファイルを作成
   touch src/drizzle/errors/__tests__/base-errors.test.ts
   touch src/drizzle/validators/__tests__/user-profile-validator.test.ts
   ```

7. **動作確認**

   ```bash
   # TypeScriptの型チェック
   npx tsc --noEmit src/drizzle/errors/base-errors.ts

   # テストの実行
   npm test src/drizzle/errors/__tests__/base-errors.test.ts
   ```

## 完了条件

- [ ] カスタムエラークラスが実装されている
- [ ] 統合バリデーション機能が実装されている
- [ ] エラーハンドラーが実装されている
- [ ] ログ機能が実装されている
- [ ] リポジトリ層が統合されている
- [ ] 各機能の単体テストが実装されている
- [ ] TypeScript の型チェックが通る
- [ ] エラーログが適切に出力される

## 次のタスク

- **T1-4**: 開発用データのシーディング
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **エラークラスの継承エラー**

   ```bash
   # 型定義の確認
   npx tsc --noEmit src/drizzle/errors/base-errors.ts
   ```

2. **バリデーション関数のエラー**

   ```bash
   # バリデーション関数のテスト
   npx tsx test-validator.ts
   ```

3. **エラーハンドラーのエラー**

   ```bash
   # エラーハンドラーのテスト
   npx tsx test-error-handler.ts
   ```

4. **ログ機能のエラー**
   ```bash
   # ログ機能のテスト
   npx tsx test-logger.ts
   ```

## 備考

- エラーハンドリングは一貫性があり、適切なエラーメッセージとエラーコードを提供する
- バリデーション機能は入力データの整合性を保証する
- ログ機能は開発・本番環境に応じて適切に設定する
- エラーモニタリングは本番環境での問題発見に役立つ

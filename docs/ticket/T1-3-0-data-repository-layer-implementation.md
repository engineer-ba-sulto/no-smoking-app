# T1-3-0: データ操作用リポジトリ層の実装

## 概要

T1-2 で定義した`user_profile`テーブルのスキーマを基に、ユーザープロファイルの取得・更新・作成を行うためのリポジトリ層を実装する。Drizzle ORM を使用してデータベース操作を抽象化し、アプリケーションの他の層から簡単に利用できるインターフェースを提供する。

## 目的

- ユーザープロファイルの基本的な CRUD 操作を実装する
- データベース操作を抽象化し、再利用可能な関数群を提供する
- 型安全性を保ちながら、シンプルで使いやすい API を設計する
- エラーハンドリングとバリデーション機能を組み込む

## 依存関係

- **依存タスク**: T1-2（user_profile テーブルのスキーマ定義）
- **担当領域**: バックエンド

## サブチケット

- **T1-3-1**: データベース接続とクエリビルダーの設定
- **T1-3-2**: ユーザープロファイル取得機能の実装
- **T1-3-3**: ユーザープロファイル更新機能の実装
- **T1-3-4**: ユーザープロファイル作成機能の実装
- **T1-3-5**: エラーハンドリングとバリデーション機能の実装

## 実装詳細

### 1. リポジトリ層の設計

#### 基本的な CRUD 操作

```typescript
// ユーザープロファイルの型定義
export interface UserProfile {
  id: number;
  smokingStartDate: string; // ISO文字列
  cigsPerDay: number;
  pricePerPack: number;
  cigsPerPack: number;
  createdAt: string;
  updatedAt: string;
}

// 新規作成用の型定義
export interface CreateUserProfileInput {
  smokingStartDate: string;
  cigsPerDay: number;
  pricePerPack: number;
  cigsPerPack: number;
}

// 更新用の型定義
export interface UpdateUserProfileInput {
  smokingStartDate?: string;
  cigsPerDay?: number;
  pricePerPack?: number;
  cigsPerPack?: number;
}
```

#### リポジトリ関数の設計

```typescript
// 基本的なCRUD操作
export const userProfileRepository = {
  // 全ユーザープロファイルの取得
  findAll: () => Promise<UserProfile[]>,

  // IDによる単一ユーザープロファイルの取得
  findById: (id: number) => Promise<UserProfile | null>,

  // 新規ユーザープロファイルの作成
  create: (input: CreateUserProfileInput) => Promise<UserProfile>,

  // ユーザープロファイルの更新
  update: (id: number, input: UpdateUserProfileInput) =>
    Promise<UserProfile | null>,

  // ユーザープロファイルの削除
  delete: (id: number) => Promise<boolean>,

  // ユーザープロファイルの存在確認
  exists: (id: number) => Promise<boolean>,
};
```

### 2. 機能要件との対応関係

#### F01（見える化機能）で使用される操作

- `findById`: ホーム画面でのユーザーデータ取得
- `update`: ユーザー設定の変更

#### F03（アチーブメント機能）で使用される操作

- `findById`: アチーブメント判定用のユーザーデータ取得

#### オンボーディング機能で使用される操作

- `create`: 新規ユーザーのプロファイル作成

### 3. エラーハンドリング設計

#### カスタムエラークラス

```typescript
export class UserProfileError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "UserProfileError";
  }
}

export class UserProfileNotFoundError extends UserProfileError {
  constructor(id: number) {
    super(`User profile with id ${id} not found`, "USER_PROFILE_NOT_FOUND");
  }
}

export class UserProfileValidationError extends UserProfileError {
  constructor(message: string) {
    super(message, "USER_PROFILE_VALIDATION_ERROR");
  }
}
```

#### バリデーション機能

```typescript
export const validateUserProfileInput = (
  input: CreateUserProfileInput | UpdateUserProfileInput
) => {
  const errors: string[] = [];

  if (input.smokingStartDate && !isValidISODate(input.smokingStartDate)) {
    errors.push("smokingStartDate must be a valid ISO date string");
  }

  if (input.cigsPerDay && (input.cigsPerDay < 0 || input.cigsPerDay > 100)) {
    errors.push("cigsPerDay must be between 0 and 100");
  }

  if (
    input.pricePerPack &&
    (input.pricePerPack < 0 || input.pricePerPack > 10000)
  ) {
    errors.push("pricePerPack must be between 0 and 10000");
  }

  if (input.cigsPerPack && (input.cigsPerPack < 0 || input.cigsPerPack > 50)) {
    errors.push("cigsPerPack must be between 0 and 50");
  }

  if (errors.length > 0) {
    throw new UserProfileValidationError(errors.join(", "));
  }
};
```

## 実装手順

1. **データベース接続の設定**

   - Drizzle ORM のデータベース接続を設定
   - クエリビルダーの初期化

2. **基本的な CRUD 操作の実装**

   - ユーザープロファイルの取得機能
   - ユーザープロファイルの作成機能
   - ユーザープロファイルの更新機能

3. **エラーハンドリングの実装**

   - カスタムエラークラスの定義
   - バリデーション機能の実装

4. **テストの実装**

   - 各関数の単体テスト
   - エラーケースのテスト

5. **ドキュメントの作成**
   - API 仕様書の作成
   - 使用例の作成

## 完了条件

- [ ] ユーザープロファイルの基本的な CRUD 操作が実装されている
- [ ] 型安全性が保たれたインターフェースが提供されている
- [ ] エラーハンドリングとバリデーション機能が実装されている
- [ ] 各関数の単体テストが実装されている
- [ ] API 仕様書と使用例が作成されている
- [ ] 機能要件 F01, F03 で使用される操作が利用可能である
- [ ] オンボーディング機能で使用される操作が利用可能である

## 次のタスク

- **T1-4**: 開発用データのシーディング
- **依存関係**: このタスクの完了後に実行可能

## 参考資料

- [Drizzle ORM 公式ドキュメント](https://orm.drizzle.team/)
- [SQLite データ型リファレンス](https://www.sqlite.org/datatype3.html)
- [TypeScript 型定義ガイド](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

## 備考

- リポジトリ層はアプリケーションの他の層から独立してテスト可能な設計にする
- エラーハンドリングは適切なエラーメッセージとエラーコードを提供する
- バリデーション機能は入力データの整合性を保証する
- 将来的な機能拡張に対応できる柔軟な設計を行う

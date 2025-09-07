# T4-3-2: リポジトリ層における本数更新ロジックの実装

## 概要

`user-profile-repository.ts`に、ユーザーのタバコ一箱あたりの本数（`cigarettesPerPackage`）を更新するためのメソッドを実装します。

## 目的

- データベースの一箱あたりの本数情報を更新するための、再利用可能で型安全なメソッドを提供する。
- 関連する他の更新ロジックと実装の対称性を保つ。

## 依存関係

- **依存タスク**: `T4-3-0`
- **担当領域**: バックエンド (データベース)

## 実装詳細

### 1. 対象ファイル

- `src/drizzle/repositories/user-profile-repository.ts`

### 2. メソッドの設計

`userProfileRepository`オブジェクトに、`updateCigarettesPerPackage`という新しい非同期メソッドを追加します。

#### メソッドシグネチャ:

```typescript
async updateCigarettesPerPackage(
  db: DrizzleDB,
  newCount: number
): Promise<{ success: boolean; message?: string }>
```

- **引数**:
  - `db: DrizzleDB`: データベースインスタンス。
  - `newCount: number`: UI から受け取る新しい一箱あたりの本数。
- **戻り値**:
  - `Promise<{ success: boolean; message?: string }>`: 処理の成功/失敗を示すオブジェクト。

### 3. 更新ロジックの実装

Drizzle ORM の`update`メソッドを使用し、`user_profiles`テーブルの`cigarettesPerPackage`カラムを更新します。ユーザーは 1 人のため、`id: 1`を対象にします。

#### 具体的な実装コード:

```typescript
// src/drizzle/repositories/user-profile-repository.ts
import { eq } from "drizzle-orm";
import { userProfiles } from "src/drizzle/schema";
import { DrizzleDB } from "src/drizzle/db";

export const userProfileRepository = {
  // ... 既存のメソッド ...

  async updateCigarettesPerPackage(db: DrizzleDB, newCount: number) {
    try {
      if (typeof newCount !== "number" || newCount <= 0) {
        throw new Error("本数は 1 以上の数値を入力してください。");
      }

      await db
        .update(userProfiles)
        .set({ cigarettesPerPackage: newCount, updatedAt: new Date() })
        .where(eq(userProfiles.id, 1)); // ユーザーは1人の想定

      return { success: true };
    } catch (error) {
      console.error("一箱あたりの本数の更新に失敗しました:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "不明なエラーが発生しました。",
      };
    }
  },
};
```

### 4. エラーハンドリング

- **バリデーション**: `newCount`が 1 未満の場合や数値でない場合はエラーをスローします（0 本はありえないため）。
- **データベースエラー**: `try...catch`ブロックで Drizzle の操作を囲み、エラー発生時には失敗を示すオブジェクトを返します。

## 実装手順

1. **ファイルを開く**: `src/drizzle/repositories/user-profile-repository.ts` を開きます。
2. **メソッド追加**: 上記の`updateCigarettesPerPackage`メソッドを`userProfileRepository`オブジェクト内に実装します。

## 完了条件

- [ ] `userProfileRepository`に`updateCigarettesPerPackage`メソッドが実装されている。
- [ ] `newCount`が 1 未満の場合、エラーメッセージが返される。
- [ ] メソッドを正常に呼び出すと、データベースの`cigarettesPerPackage`カラムが更新される。
- [ ] `updatedAt`カラムが現在の日時で更新される。

## 次のタスク

- **T4-3-3**: UI とリポジトリの連携
- **依存関係**: 本タスクの完了。

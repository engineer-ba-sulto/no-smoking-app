# T4-2-1: リポジトリ層における価格更新ロジックの実装

## 概要

`user-profile-repository.ts`に、ユーザーのタバコ一箱あたりの価格（`packagePrice`）を更新するためのメソッドを実装します。

## 目的

- データベースの価格情報を更新するための、再利用可能で型安全なメソッドを提供する。
- ビジネスロジック（バリデーションなど）をリポジトリ層にカプセル化する。

## 依存関係

- **依存タスク**: `T4-2-0`
- **担当領域**: バックエンド (データベース)

## 実装詳細

### 1. 対象ファイル

- `src/drizzle/repositories/user-profile-repository.ts`

### 2. メソッドの設計

`userProfileRepository`オブジェクトに、`updatePackagePrice`という新しい非同期メソッドを追加します。

#### メソッドシグネチャ:

```typescript
async updatePackagePrice(
  db: DrizzleDB,
  newPrice: number
): Promise<{ success: boolean; message?: string }>
```

- **引数**:
  - `db: DrizzleDB`: データベースインスタンス。
  - `newPrice: number`: UI から受け取る新しいタバコ価格。
- **戻り値**:
  - `Promise<{ success: boolean; message?: string }>`: 処理の成功/失敗を示すオブジェクト。

### 3. 更新ロジックの実装

`T4-1-1`と同様に Drizzle ORM の`update`メソッドを使用し、`user_profiles`テーブルの`packagePrice`カラムを更新します。ユーザーは 1 人のため、`id: 1`を対象にします。

#### 具体的な実装コード:

```typescript
// src/drizzle/repositories/user-profile-repository.ts
import { eq } from "drizzle-orm";
import { userProfiles } from "src/drizzle/schema";
import { DrizzleDB } from "src/drizzle/db";

export const userProfileRepository = {
  // ... 既存のメソッド ...

  async updatePackagePrice(db: DrizzleDB, newPrice: number) {
    try {
      if (typeof newPrice !== "number" || newPrice < 0) {
        throw new Error("価格は 0 以上の数値を入力してください。");
      }

      await db
        .update(userProfiles)
        .set({ pricePerPack: newPrice, updatedAt: new Date() })
        .where(eq(userProfiles.id, 1)); // ユーザーは1人の想定

      return { success: true };
    } catch (error) {
      console.error("価格の更新に失敗しました:", error);
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

- **バリデーション**: `newPrice`が 0 未満の場合や数値でない場合はエラーをスローします。
- **データベースエラー**: `try...catch`ブロックで Drizzle の操作を囲み、エラー発生時には失敗を示すオブジェクトを返します。

## 実装手順

1. **ファイルを開く**: `src/drizzle/repositories/user-profile-repository.ts` を開きます。
2. **メソッド追加**: 上記の`updatePackagePrice`メソッドを`userProfileRepository`オブジェクト内に実装します。（既存の`updateCigarettesPerDay`メソッドの後など）
3. **インポートの確認**: `eq`, `userProfiles`, `DrizzleDB`がインポート済みであることを確認します。

## 完了条件

- [ ] `userProfileRepository`に`updatePackagePrice`メソッドが実装されている。
- [ ] `newPrice`が 0 未満の場合、エラーメッセージが返される。
- [ ] メソッドを正常に呼び出すと、データベースの`packagePrice`カラムが更新される。
- [ ] `updatedAt`カラムが現在の日時で更新される。

## 次のタスク

- **T4-2-2**: UI とリポジトリの連携
- **依存関係**: 本タスクの完了。

## トラブルシューティング

- **Drizzle の Update クエリが動作しない**:
  - `T4-1-1`と同様に、スキーマ定義、`where`句、DB 接続を確認する。
- **型エラーが発生する**:
  - `DrizzleDB`の型定義が正しいか、`db`インスタンスが正しく渡されているか確認する。

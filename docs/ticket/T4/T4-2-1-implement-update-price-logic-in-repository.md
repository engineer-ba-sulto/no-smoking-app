# T4-2-2: リポジトリ層における価格更新ロジックの実装

## 概要

`user-profile-repository.ts`に、ユーザーのタバコ価格を更新するためのメソッドを実装します。

## 目的

- データベースの価格情報を更新するための、再利用可能なメソッドを提供する。

## 依存関係

- **依存タスク**: T4-2-0
- **担当領域**: バックエンド

## 実装詳細

### 1. メソッドの設計
`src/drizzle/repositories/user-profile-repository.ts`内の`userProfileRepository`オブジェクトに、`updatePackagePrice`という新しい非同期メソッドを追加します。

```typescript
// 想定されるメソッドシグネチャ
async updatePackagePrice(newPrice: number): Promise<void>
```

### 2. 更新ロジック
このメソッドは、引数で受け取った`newPrice`を使用して、`user_profiles`テーブルの`packagePrice`カラムを更新します。

## 実装手順

1. **ファイルを開く**: `src/drizzle/repositories/user-profile-repository.ts` を開きます。
2. **メソッド追加**: `updatePackagePrice`メソッドを実装します。Drizzle ORMの`db.update(...).set(...)`を使用します。

## 完了条件

- [ ] `userProfileRepository`に`updatePackagePrice`メソッドが実装されている。
- [ ] メソッドを呼び出すと、データベースの`packagePrice`が正しく更新される。

## 次のタスク

- **T4-2-3**: UIとリポジトリの連携
- **依存関係**: このタスクの完了が前提となる。

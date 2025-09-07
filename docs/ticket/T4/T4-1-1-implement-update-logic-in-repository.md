# T4-1-2: リポジトリ層における更新ロジックの実装

## 概要

`user-profile-repository.ts`に、ユーザーの 1 日の喫煙本数を更新するためのメソッドを実装します。

## 目的

- フロントエンドから独立した、再利用可能なデータ更新ロジックを提供する。
- データベース操作をリポジトリ層に集約し、関心の分離を図る。

## 依存関係

- **依存タスク**: T4-1-0
- **担当領域**: バックエンド

## 実装詳細

### 1. メソッドの設計

`src/drizzle/repositories/user-profile-repository.ts`内の`userProfileRepository`オブジェクトに、`updateCigarettesPerDay`という新しい非同期メソッドを追加します。

```typescript
// 想定されるメソッドシグネチャ
async updateCigarettesPerDay(newCount: number): Promise<void>
```

### 2. 更新ロジック

このメソッドは、引数で受け取った`newCount`を使用して、`user_profiles`テーブルの`cigarettesPerDay`カラムを更新します。ユーザーは 1 人しかいない想定なので、特定の ID を指定せずに全件更新、または ID `1` を対象に更新します。

## 実装手順

1. **ファイルを開く**: `src/drizzle/repositories/user-profile-repository.ts` を開きます。
2. **メソッド追加**: `updateCigarettesPerDay`メソッドを実装します。Drizzle ORM の`db.update(...).set(...)`を使用します。
3. **エラーハンドリング**: データベース操作でエラーが発生した場合に備え、適切なエラーハンドリングを実装します。

## 完了条件

- [ ] `userProfileRepository`に`updateCigarettesPerDay`メソッドが実装されている。
- [ ] メソッドを呼び出すと、データベースの`cigarettesPerDay`が正しく更新される。

## 次のタスク

- **T4-1-3**: UI とリポジトリの連携
- **依存関係**: このタスクの完了が前提となる。

## トラブルシューティング

### よくある問題

1. **Drizzle の Update クエリが動作しない**

   ```bash
   # 解決方法
   # スキーマ定義（src/drizzle/schema.ts）とテーブル名、カラム名が一致しているか確認する。
   # where句が必要な場合は正しく指定されているか確認する。
   ```

## 備考

このリポジトリは UI に依存しないため、単体でテストすることが可能です。

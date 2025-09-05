# T3-2-1: 汎用アチーブメント判定ロジックの呼び出し

## 概要

`achievements.tsx`内にハードコードされているアチーブメントの配列を削除し、`useQuitTimer`フックから得られる成果データをもとに、`src/utils/achievement-logic.ts` の `checkAllAchievements` 関数を呼び出して動的にアチーブメントの達成状況を判定するようリファクタリングします。

## 目的

- アチーブメントのデータとロジックをコンポーネントから分離する。
- 保守性とテスト容易性を向上させる。

## 依存関係

- **依存タスク**: `T2-3`
- **担当領域**: フロントエンド

## 実装詳細

- `achievements.tsx` から、ハードコードされた `achievements` 配列を削除します。
- `useQuitTimer` フックから返される `quitStats` オブジェクトを、`checkAllAchievements` 関数が要求する `OutcomeData` 型のオブジェクトに変換します。（例: `{ durationInSeconds: quitStats.totalSeconds, resistedCigarettes: quitStats.cigarettesNotSmoked, savedMoney: quitStats.moneySaved }`）
- 変換した `OutcomeData` オブジェクトを `checkAllAchievements` 関数に渡し、達成状況が判定されたアチーブメントのリストを取得します。

## 完了条件

- [ ] `achievements.tsx` 内のハードコードされた `achievements` 配列が削除される。
- [ ] `checkAllAchievements` 関数が呼び出され、全アチーブメントの達成状況を含むリストが返される。

## 次のタスク

- **T3-2-2**: アチーブメント達成状況のデータ管理

# T1-4-1: ダミーデータ生成機能の実装

## 概要

T1-4-0 で設計したシーディング機能の基盤となる、ダミーデータ生成機能を実装する。様々なシナリオに対応したテストデータを自動生成し、開発・テスト効率を向上させる。

## 目的

- ランダムなユーザープロファイルデータを生成する
- 特定のシナリオ用のデータを生成する
- テストデータの一貫性と多様性を保証する
- 開発・テスト効率を向上させる

## 依存関係

- **依存タスク**: T1-4-0（開発用データのシーディング）
- **担当領域**: 開発効率

## 実装詳細

### 1. 基本的なダミーデータ生成器の実装

#### ランダムデータ生成器

```typescript
// src/drizzle/seeders/dummy-data-generator.ts
import { CreateUserProfileInput } from "../types";

export class DummyDataGenerator {
  // ランダムなユーザープロファイルデータの生成
  static generateRandomUserProfile(): CreateUserProfileInput {
    const smokingStartDate = this.generateRandomDate();
    const cigsPerDay = this.generateRandomCigsPerDay();
    const pricePerPack = this.generateRandomPricePerPack();
    const cigsPerPack = this.generateRandomCigsPerPack();

    return {
      smokingStartDate,
      cigsPerDay,
      pricePerPack,
      cigsPerPack,
    };
  }

  // 複数のランダムデータを生成
  static generateMultipleRandomProfiles(
    count: number
  ): CreateUserProfileInput[] {
    const profiles: CreateUserProfileInput[] = [];

    for (let i = 0; i < count; i++) {
      profiles.push(this.generateRandomUserProfile());
    }

    return profiles;
  }

  // ランダムな日付生成（過去1年以内）
  private static generateRandomDate(): string {
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const randomTime =
      oneYearAgo.getTime() +
      Math.random() * (now.getTime() - oneYearAgo.getTime());
    return new Date(randomTime).toISOString();
  }

  // ランダムな1日の喫煙本数生成（5-50本）
  private static generateRandomCigsPerDay(): number {
    return Math.floor(Math.random() * 46) + 5; // 5-50本
  }

  // ランダムな1箱の価格生成（300-1000円）
  private static generateRandomPricePerPack(): number {
    return Math.round((Math.random() * 700 + 300) * 10) / 10; // 300.0-1000.0円
  }

  // ランダムな1箱の本数生成（10-30本）
  private static generateRandomCigsPerPack(): number {
    const options = [10, 20, 25, 30];
    return options[Math.floor(Math.random() * options.length)];
  }
}
```

#### シナリオ別データ生成器

```typescript
// src/drizzle/seeders/scenario-data-generator.ts
import { CreateUserProfileInput } from "../types";

export class ScenarioDataGenerator {
  // 特定のシナリオ用のデータ生成
  static generateScenarioData(
    scenario: "beginner" | "intermediate" | "advanced" | "heavy_smoker"
  ): CreateUserProfileInput {
    const baseDate = new Date();

    switch (scenario) {
      case "beginner":
        return {
          smokingStartDate: new Date(
            baseDate.getTime() - 24 * 60 * 60 * 1000
          ).toISOString(), // 1日前
          cigsPerDay: 10,
          pricePerPack: 400.0,
          cigsPerPack: 20,
        };

      case "intermediate":
        return {
          smokingStartDate: new Date(
            baseDate.getTime() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 1週間前
          cigsPerDay: 20,
          pricePerPack: 500.0,
          cigsPerPack: 20,
        };

      case "advanced":
        return {
          smokingStartDate: new Date(
            baseDate.getTime() - 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 1ヶ月前
          cigsPerDay: 30,
          pricePerPack: 600.0,
          cigsPerPack: 20,
        };

      case "heavy_smoker":
        return {
          smokingStartDate: new Date(
            baseDate.getTime() - 90 * 24 * 60 * 60 * 1000
          ).toISOString(), // 3ヶ月前
          cigsPerDay: 40,
          pricePerPack: 700.0,
          cigsPerPack: 20,
        };

      default:
        throw new Error(`Unknown scenario: ${scenario}`);
    }
  }

  // 複数のシナリオデータを生成
  static generateMultipleScenarioData(): CreateUserProfileInput[] {
    return [
      this.generateScenarioData("beginner"),
      this.generateScenarioData("intermediate"),
      this.generateScenarioData("advanced"),
      this.generateScenarioData("heavy_smoker"),
    ];
  }

  // カスタムシナリオのデータ生成
  static generateCustomScenarioData(config: {
    daysAgo: number;
    cigsPerDay: number;
    pricePerPack: number;
    cigsPerPack: number;
  }): CreateUserProfileInput {
    const baseDate = new Date();
    const smokingStartDate = new Date(
      baseDate.getTime() - config.daysAgo * 24 * 60 * 60 * 1000
    ).toISOString();

    return {
      smokingStartDate,
      cigsPerDay: config.cigsPerDay,
      pricePerPack: config.pricePerPack,
      cigsPerPack: config.cigsPerPack,
    };
  }
}
```

### 2. テストデータセットの実装

#### 基本的なテストデータセット

```typescript
// src/drizzle/seeders/test-data-sets.ts
import { CreateUserProfileInput } from "../types";

export const testDataSets = {
  // 基本的なテストデータ
  basic: [
    {
      smokingStartDate: new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString(), // 1日前
      cigsPerDay: 20,
      pricePerPack: 500.0,
      cigsPerPack: 20,
    },
    {
      smokingStartDate: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(), // 1週間前
      cigsPerDay: 15,
      pricePerPack: 450.0,
      cigsPerPack: 20,
    },
  ],

  // エッジケース用のテストデータ
  edgeCases: [
    {
      smokingStartDate: new Date(Date.now() - 60 * 1000).toISOString(), // 1分前
      cigsPerDay: 1,
      pricePerPack: 100.0,
      cigsPerPack: 10,
    },
    {
      smokingStartDate: new Date(
        Date.now() - 365 * 24 * 60 * 60 * 1000
      ).toISOString(), // 1年前
      cigsPerDay: 50,
      pricePerPack: 1000.0,
      cigsPerPack: 30,
    },
  ],

  // アチーブメントテスト用のデータ
  achievementTest: [
    {
      smokingStartDate: new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString(), // 24時間達成
      cigsPerDay: 20,
      pricePerPack: 500.0,
      cigsPerPack: 20,
    },
    {
      smokingStartDate: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(), // 3日達成
      cigsPerDay: 20,
      pricePerPack: 500.0,
      cigsPerPack: 20,
    },
    {
      smokingStartDate: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(), // 1週間達成
      cigsPerDay: 20,
      pricePerPack: 500.0,
      cigsPerPack: 20,
    },
  ],
};
```

#### 動的テストデータセット

```typescript
// src/drizzle/seeders/dynamic-test-data-sets.ts
import { CreateUserProfileInput } from "../types";
import { DummyDataGenerator } from "./dummy-data-generator";
import { ScenarioDataGenerator } from "./scenario-data-generator";

export class DynamicTestDataSets {
  // 動的な基本データセットの生成
  static generateBasicDataSet(count: number = 5): CreateUserProfileInput[] {
    return DummyDataGenerator.generateMultipleRandomProfiles(count);
  }

  // 動的なエッジケースデータセットの生成
  static generateEdgeCaseDataSet(): CreateUserProfileInput[] {
    return [
      // 最小値のケース
      {
        smokingStartDate: new Date(Date.now() - 60 * 1000).toISOString(), // 1分前
        cigsPerDay: 1,
        pricePerPack: 100.0,
        cigsPerPack: 10,
      },
      // 最大値のケース
      {
        smokingStartDate: new Date(
          Date.now() - 365 * 24 * 60 * 60 * 1000
        ).toISOString(), // 1年前
        cigsPerDay: 50,
        pricePerPack: 1000.0,
        cigsPerPack: 30,
      },
      // 境界値のケース
      {
        smokingStartDate: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30日前
        cigsPerDay: 25,
        pricePerPack: 500.0,
        cigsPerPack: 20,
      },
    ];
  }

  // 動的なアチーブメントテストデータセットの生成
  static generateAchievementTestDataSet(): CreateUserProfileInput[] {
    const baseDate = new Date();
    const achievementMilestones = [
      { days: 1, name: "24時間達成" },
      { days: 3, name: "3日達成" },
      { days: 7, name: "1週間達成" },
      { days: 30, name: "1ヶ月達成" },
      { days: 90, name: "3ヶ月達成" },
    ];

    return achievementMilestones.map((milestone) => ({
      smokingStartDate: new Date(
        baseDate.getTime() - milestone.days * 24 * 60 * 60 * 1000
      ).toISOString(),
      cigsPerDay: 20,
      pricePerPack: 500.0,
      cigsPerPack: 20,
    }));
  }

  // 動的なシナリオデータセットの生成
  static generateScenarioDataSet(): CreateUserProfileInput[] {
    return ScenarioDataGenerator.generateMultipleScenarioData();
  }

  // カスタムデータセットの生成
  static generateCustomDataSet(config: {
    count: number;
    minDaysAgo: number;
    maxDaysAgo: number;
    minCigsPerDay: number;
    maxCigsPerDay: number;
    minPricePerPack: number;
    maxPricePerPack: number;
  }): CreateUserProfileInput[] {
    const profiles: CreateUserProfileInput[] = [];

    for (let i = 0; i < config.count; i++) {
      const daysAgo =
        Math.floor(
          Math.random() * (config.maxDaysAgo - config.minDaysAgo + 1)
        ) + config.minDaysAgo;
      const cigsPerDay =
        Math.floor(
          Math.random() * (config.maxCigsPerDay - config.minCigsPerDay + 1)
        ) + config.minCigsPerDay;
      const pricePerPack =
        Math.round(
          (Math.random() * (config.maxPricePerPack - config.minPricePerPack) +
            config.minPricePerPack) *
            10
        ) / 10;
      const cigsPerPack = [10, 20, 25, 30][Math.floor(Math.random() * 4)];

      profiles.push({
        smokingStartDate: new Date(
          Date.now() - daysAgo * 24 * 60 * 60 * 1000
        ).toISOString(),
        cigsPerDay,
        pricePerPack,
        cigsPerPack,
      });
    }

    return profiles;
  }
}
```

### 3. データ生成の検証機能

#### データ検証器

```typescript
// src/drizzle/seeders/data-validator.ts
import { CreateUserProfileInput } from "../types";

export class DataValidator {
  // 生成されたデータの検証
  static validateGeneratedData(data: CreateUserProfileInput): boolean {
    try {
      // 必須フィールドのチェック
      if (
        !data.smokingStartDate ||
        !data.cigsPerDay ||
        !data.pricePerPack ||
        !data.cigsPerPack
      ) {
        return false;
      }

      // データ型のチェック
      if (
        typeof data.cigsPerDay !== "number" ||
        typeof data.pricePerPack !== "number" ||
        typeof data.cigsPerPack !== "number"
      ) {
        return false;
      }

      // 値の範囲チェック
      if (data.cigsPerDay < 0 || data.cigsPerDay > 100) {
        return false;
      }

      if (data.pricePerPack < 0 || data.pricePerPack > 10000) {
        return false;
      }

      if (data.cigsPerPack < 0 || data.cigsPerPack > 50) {
        return false;
      }

      // 日付の妥当性チェック
      const date = new Date(data.smokingStartDate);
      if (isNaN(date.getTime())) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // 複数データの検証
  static validateMultipleData(dataArray: CreateUserProfileInput[]): {
    valid: CreateUserProfileInput[];
    invalid: CreateUserProfileInput[];
  } {
    const valid: CreateUserProfileInput[] = [];
    const invalid: CreateUserProfileInput[] = [];

    for (const data of dataArray) {
      if (this.validateGeneratedData(data)) {
        valid.push(data);
      } else {
        invalid.push(data);
      }
    }

    return { valid, invalid };
  }

  // データの統計情報を取得
  static getDataStatistics(dataArray: CreateUserProfileInput[]): {
    count: number;
    avgCigsPerDay: number;
    avgPricePerPack: number;
    avgCigsPerPack: number;
    dateRange: { earliest: string; latest: string };
  } {
    if (dataArray.length === 0) {
      return {
        count: 0,
        avgCigsPerDay: 0,
        avgPricePerPack: 0,
        avgCigsPerPack: 0,
        dateRange: { earliest: "", latest: "" },
      };
    }

    const totalCigsPerDay = dataArray.reduce(
      (sum, data) => sum + data.cigsPerDay,
      0
    );
    const totalPricePerPack = dataArray.reduce(
      (sum, data) => sum + data.pricePerPack,
      0
    );
    const totalCigsPerPack = dataArray.reduce(
      (sum, data) => sum + data.cigsPerPack,
      0
    );

    const dates = dataArray.map((data) => new Date(data.smokingStartDate));
    const earliest = new Date(
      Math.min(...dates.map((d) => d.getTime()))
    ).toISOString();
    const latest = new Date(
      Math.max(...dates.map((d) => d.getTime()))
    ).toISOString();

    return {
      count: dataArray.length,
      avgCigsPerDay: Math.round((totalCigsPerDay / dataArray.length) * 10) / 10,
      avgPricePerPack:
        Math.round((totalPricePerPack / dataArray.length) * 10) / 10,
      avgCigsPerPack:
        Math.round((totalCigsPerPack / dataArray.length) * 10) / 10,
      dateRange: { earliest, latest },
    };
  }
}
```

## 実装手順

1. **基本的なダミーデータ生成器の実装**

   ```bash
   # ダミーデータ生成器ファイルを作成
   touch src/drizzle/seeders/dummy-data-generator.ts
   ```

2. **シナリオ別データ生成器の実装**

   ```bash
   # シナリオデータ生成器ファイルを作成
   touch src/drizzle/seeders/scenario-data-generator.ts
   ```

3. **テストデータセットの実装**

   ```bash
   # テストデータセットファイルを作成
   touch src/drizzle/seeders/test-data-sets.ts
   touch src/drizzle/seeders/dynamic-test-data-sets.ts
   ```

4. **データ検証機能の実装**

   ```bash
   # データ検証器ファイルを作成
   touch src/drizzle/seeders/data-validator.ts
   ```

5. **テストの実装**

   ```bash
   # テストファイルを作成
   touch src/drizzle/seeders/__tests__/dummy-data-generator.test.ts
   touch src/drizzle/seeders/__tests__/scenario-data-generator.test.ts
   touch src/drizzle/seeders/__tests__/data-validator.test.ts
   ```

6. **動作確認**

   ```bash
   # TypeScriptの型チェック
   npx tsc --noEmit src/drizzle/seeders/dummy-data-generator.ts

   # テストの実行
   npm test src/drizzle/seeders/__tests__/dummy-data-generator.test.ts
   ```

## 完了条件

- [ ] ランダムなユーザープロファイルデータの生成機能が実装されている
- [ ] 特定のシナリオ用のデータ生成機能が実装されている
- [ ] 基本的なテストデータセットが定義されている
- [ ] 動的なテストデータセットの生成機能が実装されている
- [ ] データ検証機能が実装されている
- [ ] 各機能の単体テストが実装されている
- [ ] TypeScript の型チェックが通る
- [ ] 生成されたデータの統計情報が取得できる

## 次のタスク

- **T1-4-2**: シーディングスクリプトの実装
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **ランダムデータ生成のエラー**

   ```bash
   # データ生成器のテスト
   npx tsx test-dummy-data-generator.ts
   ```

2. **シナリオデータ生成のエラー**

   ```bash
   # シナリオデータ生成器のテスト
   npx tsx test-scenario-data-generator.ts
   ```

3. **データ検証のエラー**

   ```bash
   # データ検証器のテスト
   npx tsx test-data-validator.ts
   ```

4. **型定義エラー**
   ```bash
   # 型定義の確認
   npx tsc --noEmit src/drizzle/seeders/dummy-data-generator.ts
   ```

## 備考

- ダミーデータ生成機能は様々なシナリオに対応している
- 生成されたデータは検証機能で品質を保証している
- テストデータセットは動的に生成可能で柔軟性が高い
- 統計情報の取得により、生成されたデータの特性を把握できる

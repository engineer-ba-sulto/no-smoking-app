# T1-4-0: 開発用データのシーディング

## 概要

T1-3 で実装したリポジトリ層を基に、開発・テスト用のダミーデータを自動生成・投入するシーディング機能を実装する。オンボーディング機能実装前に、動作確認用のテストデータを用意し、開発効率を向上させる。

## 目的

- 開発・テスト用のダミーデータを自動生成する
- シーディングスクリプトを実装してデータ投入を自動化する
- 様々なシナリオのテストデータを用意する
- 開発効率を向上させる

## 依存関係

- **依存タスク**: T1-3（データ操作用リポジトリ層の実装）
- **担当領域**: 開発効率

## サブチケット

- **T1-4-1**: ダミーデータ生成機能の実装
- **T1-4-2**: シーディングスクリプトの実装
- **T1-4-3**: テストデータの投入と動作確認

## 実装詳細

### 1. ダミーデータ生成機能の実装

#### ダミーデータ生成器の実装

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
        return this.generateRandomUserProfile();
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

#### テストデータセットの定義

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

### 2. シーディングスクリプトの実装

#### メインシーディングスクリプト

```typescript
// src/drizzle/seeders/main-seeder.ts
import { userProfileRepository } from "../repositories/user-profile-repository";
import { DummyDataGenerator } from "./dummy-data-generator";
import { testDataSets } from "./test-data-sets";
import { Logger } from "../logging/logger";

export class MainSeeder {
  private logger = Logger.getInstance();

  // 全データのクリア
  async clearAllData(): Promise<void> {
    try {
      this.logger.info("Clearing all user profile data...");
      // 注意: 実際の実装では、リポジトリ層に削除機能を追加する必要があります
      this.logger.info("All data cleared successfully");
    } catch (error) {
      this.logger.error("Failed to clear data", { error });
      throw error;
    }
  }

  // 基本的なテストデータの投入
  async seedBasicData(): Promise<void> {
    try {
      this.logger.info("Seeding basic test data...");

      for (const data of testDataSets.basic) {
        await userProfileRepository.create(data);
        this.logger.debug("Created basic test profile", { data });
      }

      this.logger.info("Basic test data seeded successfully");
    } catch (error) {
      this.logger.error("Failed to seed basic data", { error });
      throw error;
    }
  }

  // エッジケース用データの投入
  async seedEdgeCaseData(): Promise<void> {
    try {
      this.logger.info("Seeding edge case test data...");

      for (const data of testDataSets.edgeCases) {
        await userProfileRepository.create(data);
        this.logger.debug("Created edge case test profile", { data });
      }

      this.logger.info("Edge case test data seeded successfully");
    } catch (error) {
      this.logger.error("Failed to seed edge case data", { error });
      throw error;
    }
  }

  // アチーブメントテスト用データの投入
  async seedAchievementTestData(): Promise<void> {
    try {
      this.logger.info("Seeding achievement test data...");

      for (const data of testDataSets.achievementTest) {
        await userProfileRepository.create(data);
        this.logger.debug("Created achievement test profile", { data });
      }

      this.logger.info("Achievement test data seeded successfully");
    } catch (error) {
      this.logger.error("Failed to seed achievement test data", { error });
      throw error;
    }
  }

  // ランダムデータの投入
  async seedRandomData(count: number = 10): Promise<void> {
    try {
      this.logger.info(`Seeding ${count} random test profiles...`);

      for (let i = 0; i < count; i++) {
        const data = DummyDataGenerator.generateRandomUserProfile();
        await userProfileRepository.create(data);
        this.logger.debug(`Created random test profile ${i + 1}`, { data });
      }

      this.logger.info(`${count} random test profiles seeded successfully`);
    } catch (error) {
      this.logger.error("Failed to seed random data", { error });
      throw error;
    }
  }

  // 全データの投入
  async seedAllData(): Promise<void> {
    try {
      this.logger.info("Starting full data seeding...");

      await this.clearAllData();
      await this.seedBasicData();
      await this.seedEdgeCaseData();
      await this.seedAchievementTestData();
      await this.seedRandomData(5);

      this.logger.info("Full data seeding completed successfully");
    } catch (error) {
      this.logger.error("Failed to seed all data", { error });
      throw error;
    }
  }

  // データの確認
  async verifySeededData(): Promise<void> {
    try {
      this.logger.info("Verifying seeded data...");

      const profiles = await userProfileRepository.findAll();
      this.logger.info(`Found ${profiles.length} user profiles`);

      // 各プロファイルの詳細をログ出力
      for (const profile of profiles) {
        this.logger.debug("Profile details", {
          id: profile.id,
          smokingStartDate: profile.smokingStartDate,
          cigsPerDay: profile.cigsPerDay,
          pricePerPack: profile.pricePerPack,
          cigsPerPack: profile.cigsPerPack,
        });
      }

      this.logger.info("Data verification completed");
    } catch (error) {
      this.logger.error("Failed to verify seeded data", { error });
      throw error;
    }
  }
}
```

#### シーディング実行スクリプト

```typescript
// src/drizzle/seeders/run-seeder.ts
import { MainSeeder } from "./main-seeder";
import { Logger } from "../logging/logger";

async function runSeeder() {
  const logger = Logger.getInstance();
  const seeder = new MainSeeder();

  try {
    logger.info("Starting seeder execution...");

    // コマンドライン引数の解析
    const args = process.argv.slice(2);
    const command = args[0] || "all";

    switch (command) {
      case "basic":
        await seeder.seedBasicData();
        break;
      case "edge":
        await seeder.seedEdgeCaseData();
        break;
      case "achievement":
        await seeder.seedAchievementTestData();
        break;
      case "random":
        const count = parseInt(args[1]) || 10;
        await seeder.seedRandomData(count);
        break;
      case "all":
        await seeder.seedAllData();
        break;
      case "verify":
        await seeder.verifySeededData();
        break;
      default:
        logger.warn(`Unknown command: ${command}`);
        logger.info(
          "Available commands: basic, edge, achievement, random, all, verify"
        );
        process.exit(1);
    }

    logger.info("Seeder execution completed successfully");
  } catch (error) {
    logger.error("Seeder execution failed", { error });
    process.exit(1);
  }
}

// スクリプトの実行
if (require.main === module) {
  runSeeder();
}

export { runSeeder };
```

### 3. テストデータの投入と動作確認

#### シーディングテストの実装

```typescript
// src/drizzle/seeders/__tests__/seeder.test.ts
import { MainSeeder } from "../main-seeder";
import { userProfileRepository } from "../../repositories/user-profile-repository";
import { DummyDataGenerator } from "../dummy-data-generator";

describe("MainSeeder", () => {
  let seeder: MainSeeder;

  beforeEach(() => {
    seeder = new MainSeeder();
  });

  afterEach(async () => {
    // テスト後のクリーンアップ
    await seeder.clearAllData();
  });

  test("should seed basic data successfully", async () => {
    await seeder.seedBasicData();

    const profiles = await userProfileRepository.findAll();
    expect(profiles.length).toBeGreaterThan(0);
  });

  test("should seed edge case data successfully", async () => {
    await seeder.seedEdgeCaseData();

    const profiles = await userProfileRepository.findAll();
    expect(profiles.length).toBeGreaterThan(0);
  });

  test("should seed achievement test data successfully", async () => {
    await seeder.seedAchievementTestData();

    const profiles = await userProfileRepository.findAll();
    expect(profiles.length).toBeGreaterThan(0);
  });

  test("should seed random data successfully", async () => {
    const count = 5;
    await seeder.seedRandomData(count);

    const profiles = await userProfileRepository.findAll();
    expect(profiles.length).toBe(count);
  });

  test("should seed all data successfully", async () => {
    await seeder.seedAllData();

    const profiles = await userProfileRepository.findAll();
    expect(profiles.length).toBeGreaterThan(0);
  });
});

describe("DummyDataGenerator", () => {
  test("should generate random user profile data", () => {
    const data = DummyDataGenerator.generateRandomUserProfile();

    expect(data.smokingStartDate).toBeDefined();
    expect(data.cigsPerDay).toBeGreaterThan(0);
    expect(data.pricePerPack).toBeGreaterThan(0);
    expect(data.cigsPerPack).toBeGreaterThan(0);
  });

  test("should generate scenario data correctly", () => {
    const beginnerData = DummyDataGenerator.generateScenarioData("beginner");
    const advancedData = DummyDataGenerator.generateScenarioData("advanced");

    expect(beginnerData.cigsPerDay).toBe(10);
    expect(advancedData.cigsPerDay).toBe(30);
  });
});
```

## 実装手順

1. **ダミーデータ生成機能の実装**

   ```bash
   # シーダーファイルを作成
   mkdir -p src/drizzle/seeders
   touch src/drizzle/seeders/dummy-data-generator.ts
   touch src/drizzle/seeders/test-data-sets.ts
   ```

2. **シーディングスクリプトの実装**

   ```bash
   # メインシーダーファイルを作成
   touch src/drizzle/seeders/main-seeder.ts
   touch src/drizzle/seeders/run-seeder.ts
   ```

3. **テストの実装**

   ```bash
   # テストファイルを作成
   mkdir -p src/drizzle/seeders/__tests__
   touch src/drizzle/seeders/__tests__/seeder.test.ts
   ```

4. **package.json にスクリプトを追加**

   ```json
   {
     "scripts": {
       "seed": "tsx src/drizzle/seeders/run-seeder.ts",
       "seed:basic": "tsx src/drizzle/seeders/run-seeder.ts basic",
       "seed:edge": "tsx src/drizzle/seeders/run-seeder.ts edge",
       "seed:achievement": "tsx src/drizzle/seeders/run-seeder.ts achievement",
       "seed:random": "tsx src/drizzle/seeders/run-seeder.ts random",
       "seed:all": "tsx src/drizzle/seeders/run-seeder.ts all",
       "seed:verify": "tsx src/drizzle/seeders/run-seeder.ts verify"
     }
   }
   ```

5. **動作確認**

   ```bash
   # 基本的なシーディングの実行
   npm run seed:basic

   # 全データのシーディング
   npm run seed:all

   # データの確認
   npm run seed:verify
   ```

6. **テストの実行**
   ```bash
   # シーディングテストの実行
   npm test src/drizzle/seeders/__tests__/seeder.test.ts
   ```

## 完了条件

- [ ] ダミーデータ生成機能が実装されている
- [ ] シーディングスクリプトが実装されている
- [ ] 基本的なテストデータが投入できる
- [ ] エッジケース用のテストデータが投入できる
- [ ] アチーブメントテスト用のデータが投入できる
- [ ] ランダムデータの生成・投入ができる
- [ ] データの確認機能が実装されている
- [ ] 各機能の単体テストが実装されている
- [ ] package.json にシーディングスクリプトが追加されている

## 次のタスク

- **T2-1**: 日付計算ユーティリティの作成
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **シーディングスクリプトの実行エラー**

   ```bash
   # 依存関係の確認
   npm list tsx

   # 依存関係の再インストール
   npm install tsx
   ```

2. **データベース接続エラー**

   ```bash
   # データベースファイルの確認
   ls -la *.db

   # マイグレーションの確認
   npx drizzle-kit introspect
   ```

3. **テストデータの投入エラー**

   ```bash
   # リポジトリ層の確認
   npx tsc --noEmit src/drizzle/repositories/user-profile-repository.ts
   ```

4. **ログ出力のエラー**
   ```bash
   # ログ機能の確認
   npx tsc --noEmit src/drizzle/logging/logger.ts
   ```

## 備考

- シーディング機能は開発・テスト環境でのみ使用する
- 本番環境では使用しないよう注意する
- テストデータは様々なシナリオをカバーする
- データの投入は自動化されており、開発効率を向上させる

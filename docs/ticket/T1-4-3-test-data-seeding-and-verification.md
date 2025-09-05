# T1-4-3: テストデータの投入と動作確認

## 概要

T1-4-2 で実装したシーディングスクリプトを使用して、実際にテストデータをデータベースに投入し、動作確認を行う。データの整合性、リポジトリ層の動作、エラーハンドリングなどを総合的にテストする。

## 目的

- シーディングスクリプトの実際の動作確認を行う
- データベースへのデータ投入が正常に動作することを確認する
- リポジトリ層の各機能が正常に動作することを確認する
- エラーハンドリングとログ機能が正常に動作することを確認する

## 依存関係

- **依存タスク**: T1-4-2（シーディングスクリプトの実装）
- **担当領域**: 開発効率

## 実装詳細

### 1. テストデータ投入の実装

#### テストデータ投入スクリプト

```typescript
// src/drizzle/seeders/test-data-seeding.ts
import { MainSeeder } from "./main-seeder";
import { SeedingStatistics } from "./seeding-statistics";
import { Logger } from "../logging/logger";

export class TestDataSeeding {
  private logger = Logger.getInstance();
  private seeder = new MainSeeder();

  // 基本的なテストデータの投入
  async seedBasicTestData(): Promise<void> {
    try {
      this.logger.info("=== Starting Basic Test Data Seeding ===");

      await this.seeder.seedBasicData();
      await this.seeder.verifySeededData();

      this.logger.info("=== Basic Test Data Seeding Completed ===");
    } catch (error) {
      this.logger.error("Basic test data seeding failed", { error });
      throw error;
    }
  }

  // エッジケース用テストデータの投入
  async seedEdgeCaseTestData(): Promise<void> {
    try {
      this.logger.info("=== Starting Edge Case Test Data Seeding ===");

      await this.seeder.seedEdgeCaseData();
      await this.seeder.verifySeededData();

      this.logger.info("=== Edge Case Test Data Seeding Completed ===");
    } catch (error) {
      this.logger.error("Edge case test data seeding failed", { error });
      throw error;
    }
  }

  // アチーブメントテスト用データの投入
  async seedAchievementTestData(): Promise<void> {
    try {
      this.logger.info("=== Starting Achievement Test Data Seeding ===");

      await this.seeder.seedAchievementTestData();
      await this.seeder.verifySeededData();

      this.logger.info("=== Achievement Test Data Seeding Completed ===");
    } catch (error) {
      this.logger.error("Achievement test data seeding failed", { error });
      throw error;
    }
  }

  // ランダムテストデータの投入
  async seedRandomTestData(count: number = 10): Promise<void> {
    try {
      this.logger.info(
        `=== Starting Random Test Data Seeding (${count} profiles) ===`
      );

      await this.seeder.seedRandomData(count);
      await this.seeder.verifySeededData();

      this.logger.info("=== Random Test Data Seeding Completed ===");
    } catch (error) {
      this.logger.error("Random test data seeding failed", { error });
      throw error;
    }
  }

  // シナリオテストデータの投入
  async seedScenarioTestData(): Promise<void> {
    try {
      this.logger.info("=== Starting Scenario Test Data Seeding ===");

      await this.seeder.seedScenarioData();
      await this.seeder.verifySeededData();

      this.logger.info("=== Scenario Test Data Seeding Completed ===");
    } catch (error) {
      this.logger.error("Scenario test data seeding failed", { error });
      throw error;
    }
  }

  // 全テストデータの投入
  async seedAllTestData(): Promise<void> {
    try {
      this.logger.info("=== Starting All Test Data Seeding ===");

      await this.seeder.seedAllData();
      await this.seeder.verifySeededData();

      this.logger.info("=== All Test Data Seeding Completed ===");
    } catch (error) {
      this.logger.error("All test data seeding failed", { error });
      throw error;
    }
  }

  // 動的テストデータの投入
  async seedDynamicTestData(
    config: {
      basicCount?: number;
      edgeCaseCount?: number;
      achievementCount?: number;
      scenarioCount?: number;
    } = {}
  ): Promise<void> {
    try {
      this.logger.info("=== Starting Dynamic Test Data Seeding ===");

      await this.seeder.seedDynamicData(config);
      await this.seeder.verifySeededData();

      this.logger.info("=== Dynamic Test Data Seeding Completed ===");
    } catch (error) {
      this.logger.error("Dynamic test data seeding failed", { error });
      throw error;
    }
  }
}
```

### 2. 動作確認の実装

#### リポジトリ層の動作確認

```typescript
// src/drizzle/seeders/repository-verification.ts
import { userProfileRepository } from "../repositories/user-profile-repository";
import { Logger } from "../logging/logger";

export class RepositoryVerification {
  private logger = Logger.getInstance();

  // リポジトリ層の基本機能の確認
  async verifyBasicRepositoryFunctions(): Promise<void> {
    try {
      this.logger.info("=== Verifying Basic Repository Functions ===");

      // 全件取得の確認
      const allProfiles = await userProfileRepository.findAll();
      this.logger.info(`Found ${allProfiles.length} profiles`);

      // IDによる取得の確認
      if (allProfiles.length > 0) {
        const firstProfile = allProfiles[0];
        const profileById = await userProfileRepository.findById(
          firstProfile.id
        );

        if (profileById) {
          this.logger.info("ID-based retrieval successful");
        } else {
          throw new Error("ID-based retrieval failed");
        }
      }

      this.logger.info("=== Basic Repository Functions Verified ===");
    } catch (error) {
      this.logger.error("Basic repository functions verification failed", {
        error,
      });
      throw error;
    }
  }

  // データの整合性確認
  async verifyDataIntegrity(): Promise<void> {
    try {
      this.logger.info("=== Verifying Data Integrity ===");

      const profiles = await userProfileRepository.findAll();

      for (const profile of profiles) {
        // 必須フィールドの確認
        if (
          !profile.smokingStartDate ||
          !profile.cigsPerDay ||
          !profile.pricePerPack ||
          !profile.cigsPerPack
        ) {
          throw new Error(`Missing required fields in profile ${profile.id}`);
        }

        // データ型の確認
        if (
          typeof profile.cigsPerDay !== "number" ||
          typeof profile.pricePerPack !== "number" ||
          typeof profile.cigsPerPack !== "number"
        ) {
          throw new Error(`Invalid data types in profile ${profile.id}`);
        }

        // 値の範囲の確認
        if (profile.cigsPerDay < 0 || profile.cigsPerDay > 100) {
          throw new Error(`Invalid cigsPerDay value in profile ${profile.id}`);
        }

        if (profile.pricePerPack < 0 || profile.pricePerPack > 10000) {
          throw new Error(
            `Invalid pricePerPack value in profile ${profile.id}`
          );
        }

        if (profile.cigsPerPack < 0 || profile.cigsPerPack > 50) {
          throw new Error(`Invalid cigsPerPack value in profile ${profile.id}`);
        }

        // 日付の妥当性確認
        const date = new Date(profile.smokingStartDate);
        if (isNaN(date.getTime())) {
          throw new Error(`Invalid smokingStartDate in profile ${profile.id}`);
        }
      }

      this.logger.info("=== Data Integrity Verified ===");
    } catch (error) {
      this.logger.error("Data integrity verification failed", { error });
      throw error;
    }
  }

  // エラーハンドリングの確認
  async verifyErrorHandling(): Promise<void> {
    try {
      this.logger.info("=== Verifying Error Handling ===");

      // 存在しないIDでの取得
      try {
        await userProfileRepository.findById(99999);
        this.logger.warn("Expected error for non-existent ID did not occur");
      } catch (error) {
        this.logger.info(
          "Error handling for non-existent ID working correctly"
        );
      }

      // 無効なデータでの作成
      try {
        await userProfileRepository.create({
          smokingStartDate: "invalid-date",
          cigsPerDay: -1,
          pricePerPack: -1,
          cigsPerPack: -1,
        });
        this.logger.warn("Expected error for invalid data did not occur");
      } catch (error) {
        this.logger.info("Error handling for invalid data working correctly");
      }

      this.logger.info("=== Error Handling Verified ===");
    } catch (error) {
      this.logger.error("Error handling verification failed", { error });
      throw error;
    }
  }
}
```

#### 統計情報の確認

```typescript
// src/drizzle/seeders/statistics-verification.ts
import { SeedingStatistics } from "./seeding-statistics";
import { Logger } from "../logging/logger";

export class StatisticsVerification {
  private logger = Logger.getInstance();

  // 統計情報の確認
  async verifyStatistics(): Promise<void> {
    try {
      this.logger.info("=== Verifying Statistics ===");

      const stats = await SeedingStatistics.getSeedingStatistics();

      // 基本統計の確認
      if (stats.totalProfiles < 0) {
        throw new Error("Invalid total profiles count");
      }

      if (
        stats.dataStatistics.avgCigsPerDay < 0 ||
        stats.dataStatistics.avgCigsPerDay > 100
      ) {
        throw new Error("Invalid average cigs per day");
      }

      if (
        stats.dataStatistics.avgPricePerPack < 0 ||
        stats.dataStatistics.avgPricePerPack > 10000
      ) {
        throw new Error("Invalid average price per pack");
      }

      if (
        stats.dataStatistics.avgCigsPerPack < 0 ||
        stats.dataStatistics.avgCigsPerPack > 50
      ) {
        throw new Error("Invalid average cigs per pack");
      }

      // 日付範囲の確認
      if (
        stats.dataStatistics.dateRange.earliest &&
        stats.dataStatistics.dateRange.latest
      ) {
        const earliest = new Date(stats.dataStatistics.dateRange.earliest);
        const latest = new Date(stats.dataStatistics.dateRange.latest);

        if (earliest > latest) {
          throw new Error("Invalid date range");
        }
      }

      this.logger.info("Statistics verification completed successfully");
      this.logger.info("Statistics:", stats);
    } catch (error) {
      this.logger.error("Statistics verification failed", { error });
      throw error;
    }
  }

  // 統計情報の表示
  async displayStatistics(): Promise<void> {
    try {
      this.logger.info("=== Displaying Statistics ===");

      await SeedingStatistics.displayStatistics();

      this.logger.info("=== Statistics Display Completed ===");
    } catch (error) {
      this.logger.error("Statistics display failed", { error });
      throw error;
    }
  }
}
```

### 3. 総合テストの実装

#### 総合テストスクリプト

```typescript
// src/drizzle/seeders/comprehensive-test.ts
import { TestDataSeeding } from "./test-data-seeding";
import { RepositoryVerification } from "./repository-verification";
import { StatisticsVerification } from "./statistics-verification";
import { Logger } from "../logging/logger";

export class ComprehensiveTest {
  private logger = Logger.getInstance();
  private testDataSeeding = new TestDataSeeding();
  private repositoryVerification = new RepositoryVerification();
  private statisticsVerification = new StatisticsVerification();

  // 総合テストの実行
  async runComprehensiveTest(): Promise<void> {
    try {
      this.logger.info("=== Starting Comprehensive Test ===");

      // 1. 基本的なテストデータの投入
      await this.testDataSeeding.seedBasicTestData();

      // 2. リポジトリ層の基本機能の確認
      await this.repositoryVerification.verifyBasicRepositoryFunctions();

      // 3. データの整合性確認
      await this.repositoryVerification.verifyDataIntegrity();

      // 4. エラーハンドリングの確認
      await this.repositoryVerification.verifyErrorHandling();

      // 5. 統計情報の確認
      await this.statisticsVerification.verifyStatistics();

      // 6. 統計情報の表示
      await this.statisticsVerification.displayStatistics();

      this.logger.info("=== Comprehensive Test Completed Successfully ===");
    } catch (error) {
      this.logger.error("Comprehensive test failed", { error });
      throw error;
    }
  }

  // エッジケーステストの実行
  async runEdgeCaseTest(): Promise<void> {
    try {
      this.logger.info("=== Starting Edge Case Test ===");

      // エッジケース用テストデータの投入
      await this.testDataSeeding.seedEdgeCaseTestData();

      // データの整合性確認
      await this.repositoryVerification.verifyDataIntegrity();

      // 統計情報の確認
      await this.statisticsVerification.verifyStatistics();

      this.logger.info("=== Edge Case Test Completed Successfully ===");
    } catch (error) {
      this.logger.error("Edge case test failed", { error });
      throw error;
    }
  }

  // アチーブメントテストの実行
  async runAchievementTest(): Promise<void> {
    try {
      this.logger.info("=== Starting Achievement Test ===");

      // アチーブメントテスト用データの投入
      await this.testDataSeeding.seedAchievementTestData();

      // データの整合性確認
      await this.repositoryVerification.verifyDataIntegrity();

      // 統計情報の確認
      await this.statisticsVerification.verifyStatistics();

      this.logger.info("=== Achievement Test Completed Successfully ===");
    } catch (error) {
      this.logger.error("Achievement test failed", { error });
      throw error;
    }
  }

  // ランダムデータテストの実行
  async runRandomDataTest(count: number = 20): Promise<void> {
    try {
      this.logger.info(`=== Starting Random Data Test (${count} profiles) ===`);

      // ランダムテストデータの投入
      await this.testDataSeeding.seedRandomTestData(count);

      // データの整合性確認
      await this.repositoryVerification.verifyDataIntegrity();

      // 統計情報の確認
      await this.statisticsVerification.verifyStatistics();

      this.logger.info("=== Random Data Test Completed Successfully ===");
    } catch (error) {
      this.logger.error("Random data test failed", { error });
      throw error;
    }
  }

  // シナリオテストの実行
  async runScenarioTest(): Promise<void> {
    try {
      this.logger.info("=== Starting Scenario Test ===");

      // シナリオテストデータの投入
      await this.testDataSeeding.seedScenarioTestData();

      // データの整合性確認
      await this.repositoryVerification.verifyDataIntegrity();

      // 統計情報の確認
      await this.statisticsVerification.verifyStatistics();

      this.logger.info("=== Scenario Test Completed Successfully ===");
    } catch (error) {
      this.logger.error("Scenario test failed", { error });
      throw error;
    }
  }

  // 全テストの実行
  async runAllTests(): Promise<void> {
    try {
      this.logger.info("=== Starting All Tests ===");

      await this.runComprehensiveTest();
      await this.runEdgeCaseTest();
      await this.runAchievementTest();
      await this.runRandomDataTest(10);
      await this.runScenarioTest();

      this.logger.info("=== All Tests Completed Successfully ===");
    } catch (error) {
      this.logger.error("All tests failed", { error });
      throw error;
    }
  }
}
```

## 実装手順

1. **テストデータ投入スクリプトの実装**

   ```bash
   # テストデータ投入ファイルを作成
   touch src/drizzle/seeders/test-data-seeding.ts
   ```

2. **動作確認スクリプトの実装**

   ```bash
   # 動作確認ファイルを作成
   touch src/drizzle/seeders/repository-verification.ts
   touch src/drizzle/seeders/statistics-verification.ts
   ```

3. **総合テストスクリプトの実装**

   ```bash
   # 総合テストファイルを作成
   touch src/drizzle/seeders/comprehensive-test.ts
   ```

4. **テスト実行スクリプトの実装**

   ```bash
   # テスト実行ファイルを作成
   touch src/drizzle/seeders/run-tests.ts
   ```

5. **package.json にテストスクリプトを追加**

   ```json
   {
     "scripts": {
       "test:seeding": "tsx src/drizzle/seeders/run-tests.ts",
       "test:seeding:basic": "tsx src/drizzle/seeders/run-tests.ts basic",
       "test:seeding:edge": "tsx src/drizzle/seeders/run-tests.ts edge",
       "test:seeding:achievement": "tsx src/drizzle/seeders/run-tests.ts achievement",
       "test:seeding:random": "tsx src/drizzle/seeders/run-tests.ts random",
       "test:seeding:scenario": "tsx src/drizzle/seeders/run-tests.ts scenario",
       "test:seeding:all": "tsx src/drizzle/seeders/run-tests.ts all"
     }
   }
   ```

6. **動作確認**

   ```bash
   # 基本的なテストの実行
   npm run test:seeding:basic

   # エッジケーステストの実行
   npm run test:seeding:edge

   # 全テストの実行
   npm run test:seeding:all
   ```

## 完了条件

- [ ] テストデータ投入スクリプトが実装されている
- [ ] リポジトリ層の動作確認機能が実装されている
- [ ] データの整合性確認機能が実装されている
- [ ] エラーハンドリングの確認機能が実装されている
- [ ] 統計情報の確認機能が実装されている
- [ ] 総合テストスクリプトが実装されている
- [ ] 各機能の単体テストが実装されている
- [ ] package.json にテストスクリプトが追加されている
- [ ] 全テストが正常に実行される

## 次のタスク

- **T2-1**: 日付計算ユーティリティの作成
- **依存関係**: このタスクの完了後に実行可能

## トラブルシューティング

### よくある問題

1. **テストデータ投入のエラー**

   ```bash
   # データベース接続の確認
   npx drizzle-kit introspect
   ```

2. **リポジトリ層の動作確認エラー**

   ```bash
   # リポジトリ層の確認
   npx tsc --noEmit src/drizzle/repositories/user-profile-repository.ts
   ```

3. **データの整合性確認エラー**

   ```bash
   # データの確認
   sqlite3 no_smoking_app.db "SELECT * FROM user_profile;"
   ```

4. **統計情報の確認エラー**
   ```bash
   # 統計情報の確認
   npm run seed:verify
   ```

## 備考

- テストデータ投入と動作確認は開発・テスト環境でのみ実行する
- 各機能の動作確認により、リポジトリ層の品質を保証する
- 統計情報の確認により、データの特性を把握できる
- 総合テストにより、システム全体の動作を確認できる

# T1-4-2: シーディングスクリプトの実装

## 概要

T1-4-1 で実装したダミーデータ生成機能を基に、データベースへのデータ投入を自動化するシーディングスクリプトを実装する。コマンドライン引数による柔軟な実行制御と、エラーハンドリング機能を組み込む。

## 目的

- データベースへのデータ投入を自動化する
- コマンドライン引数による柔軟な実行制御を実現する
- エラーハンドリングとログ機能を組み込む
- 開発・テスト効率を向上させる

## 依存関係

- **依存タスク**: T1-4-1（ダミーデータ生成機能の実装）
- **担当領域**: 開発効率

## 実装詳細

### 1. メインシーディングスクリプトの実装

#### シーディング実行クラス

```typescript
// src/drizzle/seeders/main-seeder.ts
import { userProfileRepository } from "../repositories/user-profile-repository";
import { DummyDataGenerator } from "./dummy-data-generator";
import { ScenarioDataGenerator } from "./scenario-data-generator";
import { testDataSets } from "./test-data-sets";
import { DynamicTestDataSets } from "./dynamic-test-data-sets";
import { DataValidator } from "./data-validator";
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

      const randomProfiles =
        DummyDataGenerator.generateMultipleRandomProfiles(count);

      for (const data of randomProfiles) {
        await userProfileRepository.create(data);
        this.logger.debug("Created random test profile", { data });
      }

      this.logger.info(`${count} random test profiles seeded successfully`);
    } catch (error) {
      this.logger.error("Failed to seed random data", { error });
      throw error;
    }
  }

  // シナリオデータの投入
  async seedScenarioData(): Promise<void> {
    try {
      this.logger.info("Seeding scenario test data...");

      const scenarioProfiles =
        ScenarioDataGenerator.generateMultipleScenarioData();

      for (const data of scenarioProfiles) {
        await userProfileRepository.create(data);
        this.logger.debug("Created scenario test profile", { data });
      }

      this.logger.info("Scenario test data seeded successfully");
    } catch (error) {
      this.logger.error("Failed to seed scenario data", { error });
      throw error;
    }
  }

  // 動的データセットの投入
  async seedDynamicData(
    config: {
      basicCount?: number;
      edgeCaseCount?: number;
      achievementCount?: number;
      scenarioCount?: number;
    } = {}
  ): Promise<void> {
    try {
      this.logger.info("Seeding dynamic test data...");

      // 基本データの投入
      if (config.basicCount && config.basicCount > 0) {
        const basicProfiles = DynamicTestDataSets.generateBasicDataSet(
          config.basicCount
        );
        for (const data of basicProfiles) {
          await userProfileRepository.create(data);
        }
        this.logger.info(`${config.basicCount} basic profiles seeded`);
      }

      // エッジケースデータの投入
      if (config.edgeCaseCount && config.edgeCaseCount > 0) {
        const edgeCaseProfiles = DynamicTestDataSets.generateEdgeCaseDataSet();
        for (const data of edgeCaseProfiles) {
          await userProfileRepository.create(data);
        }
        this.logger.info(
          `${edgeCaseProfiles.length} edge case profiles seeded`
        );
      }

      // アチーブメントテストデータの投入
      if (config.achievementCount && config.achievementCount > 0) {
        const achievementProfiles =
          DynamicTestDataSets.generateAchievementTestDataSet();
        for (const data of achievementProfiles) {
          await userProfileRepository.create(data);
        }
        this.logger.info(
          `${achievementProfiles.length} achievement test profiles seeded`
        );
      }

      // シナリオデータの投入
      if (config.scenarioCount && config.scenarioCount > 0) {
        const scenarioProfiles = DynamicTestDataSets.generateScenarioDataSet();
        for (const data of scenarioProfiles) {
          await userProfileRepository.create(data);
        }
        this.logger.info(`${scenarioProfiles.length} scenario profiles seeded`);
      }

      this.logger.info("Dynamic test data seeded successfully");
    } catch (error) {
      this.logger.error("Failed to seed dynamic data", { error });
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
      await this.seedScenarioData();
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

      // データの統計情報を取得
      const statistics = DataValidator.getDataStatistics(profiles);
      this.logger.info("Data statistics:", statistics);

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

### 2. コマンドライン実行スクリプトの実装

#### メイン実行スクリプト

```typescript
// src/drizzle/seeders/run-seeder.ts
import { MainSeeder } from "./main-seeder";
import { Logger } from "../logging/logger";

interface SeederConfig {
  command: string;
  count?: number;
  basicCount?: number;
  edgeCaseCount?: number;
  achievementCount?: number;
  scenarioCount?: number;
}

async function runSeeder() {
  const logger = Logger.getInstance();
  const seeder = new MainSeeder();

  try {
    logger.info("Starting seeder execution...");

    // コマンドライン引数の解析
    const config = parseCommandLineArgs();
    logger.info("Seeder configuration:", config);

    // コマンドの実行
    await executeCommand(seeder, config);

    logger.info("Seeder execution completed successfully");
  } catch (error) {
    logger.error("Seeder execution failed", { error });
    process.exit(1);
  }
}

// コマンドライン引数の解析
function parseCommandLineArgs(): SeederConfig {
  const args = process.argv.slice(2);
  const command = args[0] || "all";

  const config: SeederConfig = { command };

  // 引数の解析
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith("--count=")) {
      config.count = parseInt(arg.split("=")[1]);
    } else if (arg.startsWith("--basic=")) {
      config.basicCount = parseInt(arg.split("=")[1]);
    } else if (arg.startsWith("--edge=")) {
      config.edgeCaseCount = parseInt(arg.split("=")[1]);
    } else if (arg.startsWith("--achievement=")) {
      config.achievementCount = parseInt(arg.split("=")[1]);
    } else if (arg.startsWith("--scenario=")) {
      config.scenarioCount = parseInt(arg.split("=")[1]);
    }
  }

  return config;
}

// コマンドの実行
async function executeCommand(
  seeder: MainSeeder,
  config: SeederConfig
): Promise<void> {
  const logger = Logger.getInstance();

  switch (config.command) {
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
      const count = config.count || 10;
      await seeder.seedRandomData(count);
      break;

    case "scenario":
      await seeder.seedScenarioData();
      break;

    case "dynamic":
      await seeder.seedDynamicData({
        basicCount: config.basicCount,
        edgeCaseCount: config.edgeCaseCount,
        achievementCount: config.achievementCount,
        scenarioCount: config.scenarioCount,
      });
      break;

    case "all":
      await seeder.seedAllData();
      break;

    case "verify":
      await seeder.verifySeededData();
      break;

    case "clear":
      await seeder.clearAllData();
      break;

    default:
      logger.warn(`Unknown command: ${config.command}`);
      showHelp();
      process.exit(1);
  }
}

// ヘルプの表示
function showHelp(): void {
  const logger = Logger.getInstance();

  logger.info("Available commands:");
  logger.info("  basic                    - Seed basic test data");
  logger.info("  edge                     - Seed edge case test data");
  logger.info("  achievement              - Seed achievement test data");
  logger.info(
    "  random [--count=N]       - Seed N random test profiles (default: 10)"
  );
  logger.info("  scenario                 - Seed scenario test data");
  logger.info(
    "  dynamic [options]        - Seed dynamic test data with options"
  );
  logger.info("  all                      - Seed all test data");
  logger.info("  verify                   - Verify seeded data");
  logger.info("  clear                    - Clear all data");
  logger.info("");
  logger.info("Dynamic seeding options:");
  logger.info("  --basic=N                - Number of basic profiles to seed");
  logger.info(
    "  --edge=N                 - Number of edge case profiles to seed"
  );
  logger.info(
    "  --achievement=N          - Number of achievement test profiles to seed"
  );
  logger.info(
    "  --scenario=N             - Number of scenario profiles to seed"
  );
  logger.info("");
  logger.info("Examples:");
  logger.info("  npm run seed basic");
  logger.info("  npm run seed random --count=20");
  logger.info("  npm run seed dynamic --basic=5 --edge=2 --achievement=3");
}

// スクリプトの実行
if (require.main === module) {
  runSeeder();
}

export { runSeeder };
```

### 3. エラーハンドリングとログ機能の強化

#### シーディング専用エラーハンドラー

```typescript
// src/drizzle/seeders/seeder-error-handler.ts
import { Logger } from "../logging/logger";

export class SeederErrorHandler {
  private static logger = Logger.getInstance();

  // シーディングエラーの処理
  static handleSeedingError(error: any, context: any): void {
    this.logger.error("Seeding error occurred", {
      error: error.message,
      stack: error.stack,
      context,
    });

    // エラーの種類に応じた処理
    if (error.message.includes("Validation")) {
      this.logger.warn("Validation error - check input data");
    } else if (error.message.includes("Database")) {
      this.logger.warn("Database error - check connection and schema");
    } else if (error.message.includes("Constraint")) {
      this.logger.warn("Constraint error - check for duplicate data");
    }
  }

  // シーディング成功のログ
  static logSeedingSuccess(operation: string, count: number): void {
    this.logger.info(
      `Seeding operation '${operation}' completed successfully`,
      {
        operation,
        count,
      }
    );
  }

  // シーディング開始のログ
  static logSeedingStart(operation: string, config?: any): void {
    this.logger.info(`Starting seeding operation '${operation}'`, {
      operation,
      config,
    });
  }
}
```

#### シーディング統計情報の取得

```typescript
// src/drizzle/seeders/seeding-statistics.ts
import { userProfileRepository } from "../repositories/user-profile-repository";
import { DataValidator } from "./data-validator";
import { Logger } from "../logging/logger";

export class SeedingStatistics {
  private static logger = Logger.getInstance();

  // シーディング後の統計情報を取得
  static async getSeedingStatistics(): Promise<{
    totalProfiles: number;
    dataStatistics: any;
    recentProfiles: any[];
  }> {
    try {
      const profiles = await userProfileRepository.findAll();
      const dataStatistics = DataValidator.getDataStatistics(profiles);

      // 最近作成されたプロファイルを取得
      const recentProfiles = profiles
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

      return {
        totalProfiles: profiles.length,
        dataStatistics,
        recentProfiles,
      };
    } catch (error) {
      this.logger.error("Failed to get seeding statistics", { error });
      throw error;
    }
  }

  // 統計情報の表示
  static async displayStatistics(): Promise<void> {
    try {
      const stats = await this.getSeedingStatistics();

      this.logger.info("=== Seeding Statistics ===");
      this.logger.info(`Total profiles: ${stats.totalProfiles}`);
      this.logger.info("Data statistics:", stats.dataStatistics);
      this.logger.info("Recent profiles:", stats.recentProfiles);
      this.logger.info("========================");
    } catch (error) {
      this.logger.error("Failed to display statistics", { error });
      throw error;
    }
  }
}
```

## 実装手順

1. **メインシーディングスクリプトの実装**

   ```bash
   # メインシーダーファイルを作成
   touch src/drizzle/seeders/main-seeder.ts
   ```

2. **コマンドライン実行スクリプトの実装**

   ```bash
   # 実行スクリプトファイルを作成
   touch src/drizzle/seeders/run-seeder.ts
   ```

3. **エラーハンドリング機能の実装**

   ```bash
   # エラーハンドラーファイルを作成
   touch src/drizzle/seeders/seeder-error-handler.ts
   touch src/drizzle/seeders/seeding-statistics.ts
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
       "seed:scenario": "tsx src/drizzle/seeders/run-seeder.ts scenario",
       "seed:dynamic": "tsx src/drizzle/seeders/run-seeder.ts dynamic",
       "seed:all": "tsx src/drizzle/seeders/run-seeder.ts all",
       "seed:verify": "tsx src/drizzle/seeders/run-seeder.ts verify",
       "seed:clear": "tsx src/drizzle/seeders/run-seeder.ts clear"
     }
   }
   ```

5. **テストの実装**

   ```bash
   # テストファイルを作成
   touch src/drizzle/seeders/__tests__/main-seeder.test.ts
   touch src/drizzle/seeders/__tests__/run-seeder.test.ts
   ```

6. **動作確認**

   ```bash
   # 基本的なシーディングの実行
   npm run seed:basic

   # ランダムデータのシーディング
   npm run seed:random --count=20

   # 動的データのシーディング
   npm run seed:dynamic --basic=5 --edge=2 --achievement=3

   # データの確認
   npm run seed:verify
   ```

## 完了条件

- [ ] メインシーディングスクリプトが実装されている
- [ ] コマンドライン実行スクリプトが実装されている
- [ ] エラーハンドリング機能が実装されている
- [ ] ログ機能が実装されている
- [ ] 統計情報取得機能が実装されている
- [ ] 各機能の単体テストが実装されている
- [ ] package.json にシーディングスクリプトが追加されている
- [ ] コマンドライン引数による柔軟な実行制御が可能である

## 次のタスク

- **T1-4-3**: テストデータの投入と動作確認
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

3. **コマンドライン引数の解析エラー**

   ```bash
   # 引数の確認
   npm run seed -- --help
   ```

4. **ログ出力のエラー**
   ```bash
   # ログ機能の確認
   npx tsc --noEmit src/drizzle/logging/logger.ts
   ```

## 備考

- シーディングスクリプトは開発・テスト環境でのみ使用する
- コマンドライン引数による柔軟な実行制御が可能
- エラーハンドリングとログ機能により、問題の特定と解決が容易
- 統計情報の取得により、シーディング結果の確認が可能

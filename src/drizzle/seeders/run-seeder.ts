import { MainSeeder } from "./main-seeder";
import { testDataSets } from "./test-data-sets";

/**
 * シーディングスクリプトの実行エントリーポイント
 * コマンドライン引数に基づいて適切なシーディング処理を実行する
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "all";
  const seeder = new MainSeeder();

  console.log("Seeding started...");

  try {
    switch (command) {
      case "clean":
        console.log("データベースをクリアしています...");
        await seeder.clearAllData();
        console.log("データベースのクリアが完了しました。");
        break;

      case "basic":
        console.log("基本データセットを投入しています...");
        await seeder.clearAllData();
        await seeder.seedFromDataSet(testDataSets.basicSet);
        console.log("基本データセットの投入が完了しました。");
        break;

      case "edge":
        console.log("境界値テストデータセットを投入しています...");
        await seeder.clearAllData();
        await seeder.seedFromDataSet(testDataSets.edgeCaseSet);
        console.log("境界値テストデータセットの投入が完了しました。");
        break;

      case "achievement":
        console.log("アチーブメントテストデータセットを投入しています...");
        await seeder.clearAllData();
        await seeder.seedFromDataSet(testDataSets.achievementTestSet);
        console.log("アチーブメントテストデータセットの投入が完了しました。");
        break;

      case "random":
        const count = parseInt(args[1]) || 10;
        console.log(`${count}件のランダムデータを投入しています...`);
        await seeder.clearAllData();
        await seeder.seedRandomData(count);
        console.log(`${count}件のランダムデータの投入が完了しました。`);
        break;

      case "all":
        console.log("すべての静的データセットを投入しています...");
        await seeder.clearAllData();
        await seeder.seedFromDataSet(testDataSets.basicSet);
        await seeder.seedFromDataSet(testDataSets.edgeCaseSet);
        await seeder.seedFromDataSet(testDataSets.achievementTestSet);
        console.log("すべての静的データセットの投入が完了しました。");
        break;

      case "verify":
        console.log("データベースの状態を確認しています...");
        await seeder.verify();
        break;

      default:
        console.log("使用可能なコマンド:");
        console.log("  clean        - データベースをクリア");
        console.log("  basic        - 基本データセットを投入");
        console.log("  edge         - 境界値テストデータセットを投入");
        console.log("  achievement  - アチーブメントテストデータセットを投入");
        console.log("  random <count> - 指定された件数のランダムデータを投入");
        console.log(
          "  all          - すべての静的データセットを投入（デフォルト）"
        );
        console.log("  verify       - データベースの状態を確認");
        process.exit(1);
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合のみmain関数を呼び出す
if (require.main === module) {
  main();
}

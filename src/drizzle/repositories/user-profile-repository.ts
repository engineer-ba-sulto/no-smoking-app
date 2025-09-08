import { db, userProfile } from "@/drizzle";
import {
  UserProfileNotFoundError,
  UserProfileValidationError,
} from "@/drizzle/errors";
import {
  CreateUserProfileInput,
  UpdateUserProfileInput,
  userProfileInputSchema,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const userProfileRepository = {
  /**
   * ID に基づいてユーザープロファイルを 1 件取得する
   * @param id - ユーザープロファイルの ID
   * @returns ユーザープロファイルオブジェクト
   */
  async findById(id: number) {
    const result = await db.query.userProfile.findFirst({
      where: eq(userProfile.id, id),
    });
    if (!result) {
      throw new UserProfileNotFoundError(id);
    }
    return result;
  },

  /**
   * すべてのユーザープロファイルを取得する
   * @returns ユーザープロファイルの配列
   */
  async findAll() {
    const result = await db.query.userProfile.findMany();
    return result;
  },

  /**
   * ユーザープロファイルを更新する
   * @param id - 更新対象のユーザープロファイル ID
   * @param input - 更新データ
   * @returns 更新後のユーザープロファイルオブジェクト、または null
   */
  async update(id: number, input: UpdateUserProfileInput) {
    const validationResult = userProfileInputSchema.partial().safeParse(input);
    if (!validationResult.success) {
      throw new UserProfileValidationError(validationResult.error.issues);
    }

    // 最初にユーザーが存在するか確認
    const existingProfile = await this.findById(id);
    if (!existingProfile) {
      return null;
    }

    // データの更新
    await db
      .update(userProfile)
      .set({
        ...input,
        updatedAt: new Date().toISOString(), // updatedAt を現在時刻で更新
      })
      .where(eq(userProfile.id, id));

    // 更新後のデータを再取得して返す
    const updatedProfile = await this.findById(id);
    return updatedProfile;
  },

  /**
   * 新規ユーザープロファイルを作成する
   * @param input - 作成データ
   * @returns 作成されたユーザープロファイルオブジェクト
   */
  async create(input: CreateUserProfileInput) {
    const validationResult = userProfileInputSchema.safeParse(input);
    if (!validationResult.success) {
      throw new UserProfileValidationError(validationResult.error.issues);
    }

    const now = new Date().toISOString();

    const [newUserProfile] = await db
      .insert(userProfile)
      .values({
        ...input,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return newUserProfile;
  },

  /**
   * ユーザーの1日の喫煙本数を更新する
   * @param newCount - 新しい1日の喫煙本数
   * @returns Promise<void>
   */
  async updateCigarettesPerDay(newCount: number): Promise<void> {
    try {
      await db
        .update(userProfile)
        .set({
          cigsPerDay: newCount,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(userProfile.id, 1)); // ユーザーは1人しかいない想定なのでID=1を対象
    } catch (error) {
      throw new Error(`Failed to update cigarettes per day: ${error}`);
    }
  },

  /**
   * ユーザーのタバコ一箱あたりの価格と本数を同時に更新する
   * @param newPrice - 新しいタバコ価格（オプション）
   * @param newCount - 新しい一箱あたりの本数（オプション）
   * @returns Promise<{ success: boolean; message?: string }>
   */
  async updatePackageSettings(
    newPrice?: number,
    newCount?: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // バリデーション
      if (
        newPrice !== undefined &&
        (typeof newPrice !== "number" || newPrice < 0)
      ) {
        throw new Error("価格は 0 以上の数値を入力してください。");
      }
      if (
        newCount !== undefined &&
        (typeof newCount !== "number" || newCount <= 0)
      ) {
        throw new Error("本数は 1 以上の数値を入力してください。");
      }

      // まず、存在するユーザープロファイルを取得
      const allProfiles = await this.findAll();

      if (allProfiles.length === 0) {
        throw new Error(
          "ユーザープロファイルが存在しません。まずオンボーディングを完了してください。"
        );
      }

      const targetProfile = allProfiles[0]; // 最初のプロファイルを使用
      const userId = targetProfile.id;

      // 更新するフィールドを動的に構築
      const updateFields: any = {
        updatedAt: new Date().toISOString(),
      };

      if (newPrice !== undefined) {
        updateFields.pricePerPack = newPrice;
      }
      if (newCount !== undefined) {
        updateFields.cigsPerPack = newCount;
      }

      await db
        .update(userProfile)
        .set(updateFields)
        .where(eq(userProfile.id, userId));

      return { success: true };
    } catch (error) {
      console.error("タバコ設定の更新に失敗しました:", error);
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

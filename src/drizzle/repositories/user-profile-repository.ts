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
};

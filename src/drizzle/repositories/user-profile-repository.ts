import { db, userProfile } from "@/drizzle";
import { eq } from "drizzle-orm";

export const userProfileRepository = {
  /**
   * ID に基づいてユーザープロファイルを 1 件取得する
   * @param id - ユーザープロファイルの ID
   * @returns ユーザープロファイルオブジェクト、または null
   */
  async findById(id: number) {
    const result = await db.query.userProfile.findFirst({
      where: eq(userProfile.id, id),
    });
    return result || null;
  },

  /**
   * すべてのユーザープロファイルを取得する
   * @returns ユーザープロファイルの配列
   */
  async findAll() {
    const result = await db.query.userProfile.findMany();
    return result;
  },
};

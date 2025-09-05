import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Text, View } from "react-native";
import { db } from "../drizzle";
import * as schema from "../drizzle/schema";

export const UserProfileDisplay = () => {
  // データが変更されると自動的に再レンダリング
  const { data, error } = useLiveQuery(db.select().from(schema.userProfile));

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!data || data.length === 0) {
    return <Text>No user profile found</Text>;
  }

  const profile = data[0];

  return (
    <View>
      <Text>禁煙開始日: {profile.smokingStartDate}</Text>
      <Text>1日の喫煙本数: {profile.cigsPerDay}</Text>
      <Text>1箱の価格: {profile.pricePerPack}円</Text>
      <Text>1箱の本数: {profile.cigsPerPack}</Text>
    </View>
  );
};

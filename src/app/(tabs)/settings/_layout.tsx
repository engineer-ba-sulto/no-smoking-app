import { Stack } from "expo-router";

export default function SettingsLayout() {
  return <Stack screenOptions={{ headerShown: false }}>
		<Stack.Screen name="index" />
		<Stack.Screen name="cigarettes-setting" />
		<Stack.Screen name="database-manager" />
		<Stack.Screen name="price-setting" />
		<Stack.Screen name="name-setting" />
	</Stack>;
}

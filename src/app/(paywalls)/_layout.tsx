import { Stack } from "expo-router";

export default function PaywallsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="paywall" />
    </Stack>
  );
}

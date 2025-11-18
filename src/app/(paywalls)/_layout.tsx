import { Stack } from "expo-router";

export default function PaywallsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="paywall" />
      <Stack.Screen
        name="one-time-offer"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}

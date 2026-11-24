import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#090F1F" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#090F1F" },
        }}
      />
    </>
  );
}

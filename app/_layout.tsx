import { AppProvider } from "@/context/AppContext";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack initialRouteName="(tabs)">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pokemon/[name]" options={{ headerShown: true }} />
          <Stack.Screen name="camera/[name" options={{ headerShown: true }} />
      </Stack>
      <StatusBar style="auto" />
    </AppProvider>
  );
}

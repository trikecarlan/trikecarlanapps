import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signInDriver" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(driver)" options={{ headerShown: false }} />
        <Stack.Screen name="signUpPassenger" options={{ headerShown: false }} />
        <Stack.Screen name="signInPassenger" options={{ headerShown: false }} />
        <Stack.Screen name="signUpDriver" options={{ headerShown: false }} />
        <Stack.Screen name="forgotDriverPassword" options={{ headerShown: false }} />
        <Stack.Screen name="forgotUserPassword" options={{ headerShown: false }} />
        <Stack.Screen name="createNewPassword" options={{ headerShown: false }} />
        <Stack.Screen name="verifyEmail" options={{ headerShown: false }} />
        <Stack.Screen name="screens/rateDriver" options={{ headerShown: false }} />
        <Stack.Screen name="screens/changeProfile" options={{ headerShown: false }} />
        <Stack.Screen name="screens/myReport" options={{ headerShown: false }} />
        <Stack.Screen name="screens/driversInfo" options={{ headerShown: false }} />
        <Stack.Screen name="screens/reportDriver" options={{ headerShown: false }} />
        <Stack.Screen name="screens/reportIncident" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

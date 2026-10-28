import { useColorScheme } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { DatabaseProvider } from '@nozbe/watermelondb/react'
import { database } from '@/database/database';
import Toast from 'react-native-toast-message';
import { agentStore } from '@/storage/MMKV';
import { ThemeProvider } from '@/theme';
import SyncBanner from '@/components/SyncBanner';

function InitalRoot(){

  const { hasAccount, isUnlocked } = agentStore();

  return (
   <Stack
     screenOptions={{
       animation: 'fade',
       animationDuration: 250,
     }}
   >
     {/* Compte enregistré et session déverrouillée → application */}
     <Stack.Protected guard={hasAccount && isUnlocked}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
     </Stack.Protected>
     {/* Compte enregistré mais verrouillé → déverrouillage rapide (mot de passe hors-ligne) */}
     <Stack.Protected guard={hasAccount && !isUnlocked}>
          <Stack.Screen name="unlock" options={{ headerShown: false }} />
     </Stack.Protected>
     {/* Aucun compte → connexion complète */}
     <Stack.Protected guard={!hasAccount}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
     </Stack.Protected>
    </Stack>
  )
}


const Layout = () => {
   const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ThemeProvider>
    <BottomSheetModalProvider>
    <DatabaseProvider database={database} >

      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <InitalRoot />
      </NavigationThemeProvider>
    </DatabaseProvider>
    </BottomSheetModalProvider>
    {/* Bandeau de sync : dans le ThemeProvider, superposé au-dessus des écrans */}
    <SyncBanner />
    </ThemeProvider>
    <Toast />
    </GestureHandlerRootView>

  )
}

export default Layout
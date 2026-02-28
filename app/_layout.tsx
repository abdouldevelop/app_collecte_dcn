import { useColorScheme } from 'react-native'
import React, { useContext } from 'react'
import { Stack } from 'expo-router';

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { DatabaseProvider } from '@nozbe/watermelondb/react'
import { database } from '@/database/database';
import Toast from 'react-native-toast-message';
import { AuthContext } from '@/context/auth';
import { agentStore } from '@/storage/MMKV';
import { ThemeProvider } from '@/theme';

function InitalRoot(){

  const contextValue = useContext(AuthContext);
  const {isAgentAuth} = agentStore();

  return (
   <Stack
     screenOptions={{
       animation: 'fade',
       animationDuration: 250,
     }}
   >
     <Stack.Protected guard={isAgentAuth}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
     </Stack.Protected>
     <Stack.Protected guard={!isAgentAuth}>
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
      <Toast />
    <ThemeProvider>
    <BottomSheetModalProvider>
    <DatabaseProvider database={database} >

      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <InitalRoot />
      </NavigationThemeProvider>
    </DatabaseProvider>
    </BottomSheetModalProvider>
    </ThemeProvider>
    </GestureHandlerRootView>

  )
}

export default Layout
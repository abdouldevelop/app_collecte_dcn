import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { Stack, Tabs } from 'expo-router';

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { DatabaseProvider } from '@nozbe/watermelondb/react'
import { database } from '@/database/database';
import Toast from 'react-native-toast-message';
import { AuthContext } from '@/context/auth';
import { agentStore } from '@/storage/MMKV';

function InitalRoot(){

  const contextValue = useContext(AuthContext);

  const {isAgentAuth} = agentStore();
 console.log("vvvvvvvvvvvvvvvv",  isAgentAuth);
  return (
   <Stack>
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
    <BottomSheetModalProvider>
    <DatabaseProvider database={database} >

      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <InitalRoot />
        {/* <StatusBar style="auto" /> */}
      </ThemeProvider>
    </DatabaseProvider>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>

  )
}

export default Layout

const styles = StyleSheet.create({})
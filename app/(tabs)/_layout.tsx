import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, View, Text } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { colors, Rs, SIZES } from '@/shared/utils';
import { ThemedText } from '@/components/ThemedText';
import { agentStore } from '@/storage/MMKV';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const {agent} = agentStore();
  console.log("agent===", agent)
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.gloryColor.c_1 , //Colors[colorScheme ?? 'light'].tint
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
        headerStyle: {
          backgroundColor: colors.gloryColor.c_2,
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 0,
        },
        headerRight: () => (
          <View style={{flexDirection: "row", alignItems: "center", gap: Rs(10), marginRight: Rs(10)}}>
            <View style={{width: Rs(40), height: Rs(40), borderRadius: Rs(20), backgroundColor: colors.white, justifyContent: "center", alignItems: "center"}}>
              {/* <Ionicons name="person" size={20} color={colors.gloryColor.c_2} />   */}
              <Text  style={{fontWeight: "bold", fontSize: SIZES.sm, color: colors.gloryColor.c_3}} > 
                {agent?.agent?.firstName.charAt(0).toUpperCase()}
                {agent?.agent?.lastName.charAt(0).toUpperCase()}
              </Text>
            </View>
            {/* <View style={{width: Rs(40), height: Rs(40), borderRadius: Rs(20), backgroundColor: colors.white, justifyContent: "center", alignItems: "center"}}>
              <Ionicons name="notifications" size={20} color={colors.titleColor} />
            </View> */}
          </View>
        ),
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: SIZES.xl + 3,
          color: "white"
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tableau de bord',
          tabBarLabel: "Accueil",
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clients de la saison',
          tabBarLabel: 'Clients',
          tabBarIcon: ({ color }) => <Ionicons size={28} name='people' color={color} />,
          
        }}
      />

      <Tabs.Screen
        name="clients/[id]"
        options={{
          href: null,
          tabBarLabel: 'Clients',
          tabBarIcon: ({ color }) => <Feather size={28} name="users" color={color} />,
          
        }}
      />

      <Tabs.Screen
        name="payment"
        options={{
          title: 'Versment',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons  name="wallet" size={Rs(20)} color={color} />,
          
        }}
      />

       <Tabs.Screen
        name="payment/[id]"
        options={{
          href: null,
          title: 'Explore',
          tabBarIcon: ({ color }) => <Ionicons  name="wallet" size={Rs(20)} color={color} />,
        }}
      />
    </Tabs>
  );
}

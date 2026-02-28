import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppTabBar } from '@/components/ui';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size ?? 28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clients',
          tabBarLabel: 'Clients',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size ?? 28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="payment"
        options={{
          title: 'Versement',
          tabBarLabel: 'Versement',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size ?? 28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

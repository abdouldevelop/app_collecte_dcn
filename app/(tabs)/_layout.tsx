import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppTabBar } from '@/components/ui';
import { checkLocalChanges, syncWithBackend } from '@/database/db_utils';
import { useSyncStore } from '@/storage/syncStore';

/**
 * Au démarrage de la session : synchronisation en arrière-plan (non bloquante).
 * S'il y a des données locales à envoyer, on affiche le bandeau animé de chargement,
 * mais l'agent garde la main immédiatement pour continuer ses enregistrements.
 */
function useLaunchSync() {
  useEffect(() => {
    let cancelled = false;
    const sync = useSyncStore.getState();

    (async () => {
      const { hasChanges } = await checkLocalChanges();
      if (cancelled) return;

      if (hasChanges) sync.start('Synchronisation…');

      const result = await syncWithBackend();
      if (cancelled) return;

      if (hasChanges) {
        if (result.success) sync.succeed('Données synchronisées');
        else sync.fail('Synchronisation différée');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);
}

export default function TabLayout() {
  useLaunchSync();

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

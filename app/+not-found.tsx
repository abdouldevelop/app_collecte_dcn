import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { AppEmptyState } from '@/components/ui';
import { useAppTheme } from '@/theme';

export default function NotFoundScreen() {
  const { colors, spacing } = useAppTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: spacing.xl }}>
        <AppEmptyState
          icon="alert-circle"
          title="Page introuvable"
          description="Cette page n'existe pas ou a ete deplacee."
          actionLabel="Retour a l'accueil"
          onAction={() => {}}
        />
        <Link href="/" style={{ alignSelf: 'center', marginTop: spacing.lg }}>
          {/* Empty link, action handled by AppEmptyState */}
        </Link>
      </View>
    </>
  );
}

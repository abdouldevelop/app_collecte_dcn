import { View, Text } from 'react-native';
import React from 'react';
import { formatXOF } from '@/shared/utils';
import Versement from '@/database/model/versement';
import { database } from '@/database/database';
import { withObservables } from '@nozbe/watermelondb/react';
import Souscription from '@/database/model/Souscription';
import Client from '@/database/model/Client';
import Kit from '@/database/model/Kit';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';

type Props = {
  versement: Versement;
};

const PaymentItem = ({ versement }: Props) => {
  const { colors, spacing, typography } = useAppTheme();
  const [client, setClient] = React.useState<Client>();
  const [kit, setKit] = React.useState<Kit>();

  React.useEffect(() => {
    let cancelled = false;

    async function loadRelated() {
      try {
        const sub = await database
          .get<Souscription>('souscriptions')
          .find(versement.souscriptionId);

        if (cancelled) return;

        const [foundClient, foundKit] = await Promise.all([
          database.get<Client>('clients').find(sub.clientId),
          database.get<Kit>('kits').find(sub.kitId),
        ]);

        if (!cancelled) {
          setClient(foundClient);
          setKit(foundKit);
        }
      } catch {
        // silently ignore if records not found
      }
    }

    loadRelated();
    return () => { cancelled = true; };
  }, [versement.souscriptionId]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.sm,
      }}
    >
      <Ionicons name="checkmark-circle" size={18} color={colors.success} />

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs }}>
          <Text style={[typography.labelLarge, { color: colors.onSurface }]}>
            {formatXOF(versement?.montant)}
          </Text>
          {kit?.label && (
            <Text style={[typography.caption, { color: colors.primary }]}>
              {kit.label}
            </Text>
          )}
        </View>
        <Text style={[typography.caption, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
          {client ? `${client.firstName} ${client.lastName}` : '...'} · {new Date(versement.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

const enhance = withObservables(['versement'], ({ versement }: { versement: Versement }) => ({
  versement: versement.observe(),
}));

export default enhance(PaymentItem);

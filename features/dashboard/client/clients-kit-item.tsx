import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { withObservables } from '@nozbe/watermelondb/react'
import Souscription from '@/database/model/Souscription'
import Client from '@/database/model/Client'
import Kit from '@/database/model/Kit'
import { colors, formatPhoneNumber, formatXOF, Rs, SIZES } from '@/shared/utils'
import { COLORS } from '@/shared/common/colors'
import { Feather } from '@expo/vector-icons'
import { ThemedText } from '@/components/ThemedText'
import { database } from '@/database/database'
import Versement from '@/database/model/versement'
import { Q } from '@nozbe/watermelondb'

type Props = {
subs: Souscription;
client: Client;
kit: Kit;
payments: Versement[];
}

const clientKitItem = ({client, kit, subs, payments}: Props) => {
  
  const totalPaid = payments?.reduce((sum, p) => sum + p.montant, 0);
  const remaining = kit.montantTotal - totalPaid;
  const progress = (totalPaid / kit.montantTotal) * 100;

   return (
    <View style={styles.container}>
      <Pressable
        onPress={() =>{}}
        style={styles.card}
        android_ripple={{ color: colors.gloryColor.c_1 + '20' }}
      >
        <View style={styles.icon}>
          <Feather name="user" size={20} color={colors.gloryColor.c_1} />
        </View>
        
        <View style={styles.clientInfo}>
          <ThemedText numberOfLines={1} style={styles.clientName}>
            {client.firstName}
          </ThemedText>
          <ThemedText style={styles.phoneNumber}>
            {formatPhoneNumber(client.phone)}
          </ThemedText>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {Math.round(progress)}%
          </Text>
        </View>
      </Pressable>

      <View style={styles.divider} />

      <View style={styles.detailsContainer}>
        <View style={styles.kitHeader}>
          <View style={styles.kitIconContainer}>
            <Feather name="package" size={16} color={colors.gloryColor.c_1} />
          </View>
          <ThemedText style={styles.kitLabel}>
            {kit.label}
          </ThemedText>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
          </View>
        </View>

        <View style={styles.financialGrid}>
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>Prix total</Text>
            <Text style={styles.financialValue}>{formatXOF(kit.montantTotal)}</Text>
          </View>
          
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>Versements</Text>
            <Text style={[styles.financialValue, styles.paidAmount]}>{formatXOF(totalPaid)}</Text>
          </View>
          
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>Reste</Text>
            <Text style={[styles.financialValue, remaining > 0 ? styles.remainingAmount : styles.completedAmount]}>
              {formatXOF(remaining)}
            </Text>
          </View>
        </View>

        {remaining <= 0 && (
          <View style={styles.completedBadge}>
            <Feather name="check-circle" size={16} color="#10B981" />
            <Text style={styles.completedText}>Paiement terminé</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const enhance = withObservables(['subs'], ({ subs }:{subs: Souscription}) => ({
  subs: subs ? subs.observe() : null,
  client: subs ? subs.client.observe() : null,
  kit: subs ? subs.kit.observe() : null,
  payments: database.collections
        .get<Versement>("versements")
        .query(
          Q.where("souscription_id", subs.id),
          Q.sortBy("created_at", Q.desc)
        )
        .observe(),
}))
const EnhancedClientKitItem = enhance(clientKitItem)

export default EnhancedClientKitItem

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: Rs(16),
    marginVertical: Rs(4),
    boxShadow: COLORS.boxshadow,
    overflow: 'hidden',
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Rs(10),
    gap: Rs(12),
  },
  icon: {
    width: Rs(48),
    height: Rs(48),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${colors.gloryColor.c_1}15`,
    borderRadius: Rs(24),
    borderWidth: 2,
    borderColor: `${colors.gloryColor.c_1}30`,
  },
  clientInfo: {
    flex: 1,
    gap: Rs(4),
  },
  clientName: {
    fontWeight: "700",
    fontSize: SIZES.lg,
    color: colors.titleColor,
  },
  phoneNumber: {
    fontWeight: "400",
    fontSize: SIZES.sm,
    color: colors.textColor,
    opacity: 0.8,
  },
  statusBadge: {
    backgroundColor: colors.gloryColor.c_1,
    paddingHorizontal: Rs(12),
    paddingVertical: Rs(6),
    borderRadius: Rs(20),
  },
  statusText: {
    color: 'white',
    fontSize: SIZES.xs,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: Rs(16),
  },
  detailsContainer: {
    padding: Rs(16),
    gap: Rs(16),
  },
  kitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Rs(8),
  },
  kitIconContainer: {
    width: Rs(32),
    height: Rs(32),
    backgroundColor: `${colors.gloryColor.c_1}15`,
    borderRadius: Rs(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  kitLabel: {
    flex: 1,
    fontWeight: "600",
    fontSize: SIZES.md,
    color: colors.titleColor,
  },
  progressContainer: {
    gap: Rs(8),
  },
  progressBar: {
    height: Rs(8),
    backgroundColor: '#f0f0f0',
    borderRadius: Rs(4),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gloryColor.c_1,
    borderRadius: Rs(4),
  },
  financialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Rs(12),
  },
  financialItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: Rs(12),
    paddingHorizontal: Rs(8),
    borderRadius: Rs(12),
  },
  financialLabel: {
    fontSize: SIZES.xs,
    color: colors.textColor,
    opacity: 0.7,
    marginBottom: Rs(4),
    textAlign: 'center',
  },
  financialValue: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: colors.titleColor,
    textAlign: 'center',
  },
  paidAmount: {
    color: '#10B981',
  },
  remainingAmount: {
    color: '#F59E0B',
  },
  completedAmount: {
    color: '#10B981',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Rs(8),
    backgroundColor: '#10B98110',
    paddingVertical: Rs(8),
    paddingHorizontal: Rs(16),
    borderRadius: Rs(20),
    alignSelf: 'center',
  },
  completedText: {
    color: '#10B981',
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
})
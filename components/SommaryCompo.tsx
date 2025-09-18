import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {}

const SommaryCompo = (props: Props) => {
  return (
   <View style={styles.summarySection}>
               <Text style={styles.summaryTitle}>Order Summary</Text>
               <View style={styles.summaryRow}>
                 <Text style={styles.summaryLabel}>Selected Users:</Text>
                 <Text style={styles.summaryValue}>1</Text>
               </View>
               <View style={styles.summaryRow}>
                 <Text style={styles.summaryLabel}>Selected Kits:</Text>
                 <Text style={styles.summaryValue}>2</Text>
               </View>
               <View style={[styles.summaryRow, styles.totalRow]}>
                 <Text style={styles.totalLabel}>Total:</Text>
                 <Text style={styles.totalValue}>1000/month</Text>
               </View>
             </View>
  )
}

export default SommaryCompo

const styles = StyleSheet.create({
   summarySection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },

})
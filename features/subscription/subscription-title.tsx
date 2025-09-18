import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SubscriptionTitle = ({ icon, title, description }: Props) => {
  return (
          <View style={styles.section}>
          <View style={styles.sectionHeader}>
            {icon}
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
          <Text style={styles.sectionSubtitle}>{description}</Text>
          
        </View>


  )
}

export default SubscriptionTitle

const styles = StyleSheet.create({

  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    marginLeft: 36,
  }
})
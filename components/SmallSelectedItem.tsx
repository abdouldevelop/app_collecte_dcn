import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'

type Props = {}

const SmallSelectedItem = (props: Props) => {
  return (
           <View style={styles.section}>
          
          
            <TouchableOpacity
              
              style={[
                styles.paymentCard,
                // selectedPayment === method.id && styles.selectedCard
              ]}
              onPress={() => {}}
            >
              <View style={styles.paymentInfo}>
                <Feather name="check" size={24} color="#4F46E5" />
                <Text style={styles.paymentName}>Label</Text>
              </View>
              <View style={[
                styles.radioButton,
                // selectedPayment === method.id && styles.selectedRadio
              ]}>
               
                  <View style={styles.radioInner} />
                
              </View>
            </TouchableOpacity>
        </View>

  )
}

export default SmallSelectedItem

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
  },

    paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginLeft: 16,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: '#4F46E5',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
  },

})
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

type Props = {}

const SelectItem = (props: Props) => {
  return (
            <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Select Users</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Choose team members for this subscription</Text>
          
          
            <TouchableOpacity
              
              style={[
                styles.userCard,
                // selectedUsers.includes(user.id) && styles.selectedCard
              ]}
              onPress={() => {}}
            >
              <View style={styles.userInfo}>
                <Text style={styles.avatar}>👨‍💻</Text>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>Fullname</Text>
                  <Text style={styles.userEmail}>phone number</Text>
                </View>
              </View>
              <View style={[
                styles.checkbox,
                
              ]}>
                
                  <Ionicons name="checkmark" size={16} color="#fff" />
                
              </View>
            </TouchableOpacity>
          
        </View>

  )
}

export default SelectItem

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
  userCard: {
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
  selectedCard: {
    borderWidth: 2,
    borderColor: '#4F46E5',
    backgroundColor: '#f0f9ff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    fontSize: 32,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
})
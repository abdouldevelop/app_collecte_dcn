import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors, Rs } from '@/shared/utils'

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: object;
  textStyle?: object;
  icon?: React.ReactNode;
}

const CustomBtn = ({label, onPress, style, textStyle, icon, disabled}: Props) => {
  return (
    <TouchableOpacity 
    style={[styles.subscribeButton, disabled && styles.disabledButton, style]}
    onPress={onPress}
    disabled={disabled}
     >
          <Text style={styles.subscribeText}> {label} </Text>
          {icon}
     </TouchableOpacity>
  )
}

export default CustomBtn

const styles = StyleSheet.create({

   subscribeButton: {
    marginTop: Rs(20),
    backgroundColor: colors.blue,
    borderRadius: Rs(12),
    paddingVertical: Rs(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  subscribeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },



})
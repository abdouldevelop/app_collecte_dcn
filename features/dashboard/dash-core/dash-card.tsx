import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { colors, Rs, SIZES } from '@/shared/utils'

type Props = {
 label: string
 value: string | number
 icon?: React.ReactNode
 action?: () => void
 border: string
}

const DashCard = ({label, value,icon, border, action}: Props) => { 
  return (
    <View style={[styles.card, {borderLeftColor: border,}]}>
     <View style={{flex: 1,  height: '100%', justifyContent: "center", gap: Rs(10)}}>
      <Text style={styles.headerSubtitle}> {label} </Text>
      <Text style={styles.headerTitle}> {value} </Text>
     </View>
     <View style={[styles.icon, {backgroundColor: `${border}20` }]}>
      {icon}
     </View>
    </View>
  )
}

export default  DashCard

const styles = StyleSheet.create({
  card: {
   position: "relative",
   backgroundColor: "white",
    boxShadow: colors.boxShadow.sm,
    padding: Rs(5),
    borderLeftWidth: Rs(3),
    
    borderRadius: Rs(10),
    flexDirection: "row",
    maxHeight: Rs(100),
    alignItems: "center",
    flex: 1
  },
    headerTitle: {
    fontSize: SIZES.sm,
    fontWeight: 'bold',
    color: colors.titleColor,
  },
  headerSubtitle: {
    fontSize: SIZES.mx - 1,
    color: colors.textColor,
    marginTop: 4,
    fontWeight: '600',
  },
  icon: {
   position: "absolute",
   top: Rs(5),
   right: Rs(8),
    width: Rs(30),
    height: Rs(30),
    justifyContent: "center",
    alignItems: "center",
    boxShadow: colors.boxShadow.sm,
    borderRadius: Rs(20),
  },
});
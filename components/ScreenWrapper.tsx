import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'
import { colors, Rs } from '@/shared/utils'
import { Colors } from '@/constants/Colors'

type Props = {
 children: React.ReactNode,
 style?: ViewStyle
}

const ScreenWrapper = ({children, style}: Props) => {
  return (
    <View style={[{flex: 1, paddingHorizontal: Rs(20), paddingTop: Rs(20) , backgroundColor: colors.bg_screen,}, style]} >
      {children}
    </View>
  )
}

export default ScreenWrapper

const styles = StyleSheet.create({})
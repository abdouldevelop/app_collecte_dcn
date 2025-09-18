import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react';
import { Feather } from '@expo/vector-icons'
import { colors } from '@/shared/utils';

type Props = {
 backAction: () => void,
 icon?: React.ReactNode
}

const BackButton = ({backAction, icon}: Props) => {
  return (
    <View>
      <TouchableOpacity style={[styles.button, {zIndex: icon? 0 : 100}]} onPress={backAction}>
       {icon? icon : <Feather name='arrow-left' size={20} color={colors.titleColor} />}
      </TouchableOpacity>
    </View>
  )
}

export default BackButton

const styles = StyleSheet.create({
 button:{
   backgroundColor: colors.white,
   borderWidth: StyleSheet.hairlineWidth,
   borderColor: colors.titleColor,
   borderRadius: 10,
   height: 35,
   width: 35,
   justifyContent: 'center',
   alignItems: 'center',
  //  zIndex: 100
 }
})
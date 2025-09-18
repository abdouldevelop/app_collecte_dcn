import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/shared/utils'
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  action?: () => void
  bg?: string
}

const FlatBtn = ({action,}: Props) => {

   const addButtonScale = useSharedValue(1);

   const  router = useRouter();

   const addButtonAnimatedStyle = useAnimatedStyle(() => {
     return {
       transform: [{ scale: addButtonScale.value }],
     };
   });
 
 

  return (
    // <View>
       <Animated.View style={[styles.addButtonContainer, addButtonAnimatedStyle]}>
        <LinearGradient
        colors={[colors.gloryColor.c_1, colors.gloryColor.c_2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.addButton]}
        >

          <TouchableOpacity
            style={[styles.addButton]}
            onPress={() => {
              action?.()
              // addButtonScale.value = withSpring(0.9, {}, () => {
              //   addButtonScale.value = withSpring(1);
              // });
              

            }}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

    // </View>
  )
}

export default FlatBtn

const styles = StyleSheet.create({
   addButtonContainer: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 100,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gloryColor.c_1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0000003a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },

})
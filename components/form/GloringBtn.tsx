import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import React from "react";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/shared/utils";

type Props = {
 label: string
 icon?: React.ReactNode;
 action: () => void;
 VStyle?: ViewStyle;
 TStyle?: TextStyle;
 isLoading?: boolean
};

const GloringBtn = ({VStyle, TStyle, label, icon, action, isLoading }: Props) => {
    
   const buttonScale = useSharedValue(1);
  

   const animatedButtonScale = useAnimatedStyle(() => ({
     transform: [{ scale: buttonScale.value }],
   }));
 

  return (
    <Animated.View
      style={[styles.buttonContainer, animatedButtonScale, ]}
      entering={FadeInDown.delay(200).springify()}
    >
      <TouchableOpacity
        onPress={() => action()}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[colors.gloryColor.c_1, colors.gloryColor.c_2]}
          style={[styles.primaryButton, VStyle]}
        >
        { isLoading? <ActivityIndicator size={20} color={'white'} /> : (
          <>
           {icon}
          <Text style={[styles.buttonText, TStyle]}>{label}</Text>
          </>
        ) }
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default GloringBtn;

const styles = StyleSheet.create({
   buttonContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
    buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },


});

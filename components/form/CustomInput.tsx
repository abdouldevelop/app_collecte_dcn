import { colors, SIZES } from '@/shared/utils';
import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';

// Custom Input Component
interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnimation = useSharedValue(0);
  const errorAnimation = useSharedValue(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusAnimation.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusAnimation.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
    });
    onBlur?.(e);
  };

  React.useEffect(() => {
    errorAnimation.value = withTiming(error ? 1 : 0, { duration: 300 });
  }, [error]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusAnimation.value,
      [0, 1],
      [error ? '#FF6B6B' : '#E5E5E5', error ? '#FF6B6B' : colors.blue]
    );

    const shadowOpacity = focusAnimation.value * 0.15;
    
    return {
      borderColor,
      shadowOpacity,
      elevation: focusAnimation.value * 4,
      transform: [
        {
          scale: withSpring(1 + focusAnimation.value * 0.01),
        },
      ],
    };
  });

  const labelAnimatedStyle = useAnimatedStyle(() => {
    const translateY = focusAnimation.value * -8;
    const scale = 1 - focusAnimation.value * 0.15;
    const color = interpolateColor(
      focusAnimation.value,
      [0, 1],
      [colors.titleColor, colors.gloryColor.c_1]
    );

    return {
      transform: [{ translateY }, { scale }],
      color,
    };
  });

  const errorAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: errorAnimation.value,
      transform: [
        {
          translateY: withTiming(errorAnimation.value * 0, { duration: 300 }),
        },
      ],
    };
  });

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label && (
        <Animated.Text style={[styles.label, labelAnimatedStyle]}>
          {label}
        </Animated.Text>
      )}
      
      <Animated.View style={[styles.inputWrapper, containerAnimatedStyle]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          {...props}
          style={[
            styles.textInput,
            leftIcon && styles.textInputWithLeftIcon,
            rightIcon && styles.textInputWithRightIcon,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="#999"
        />
        
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </Animated.View>

      {error && (
        <Animated.Text style={[styles.errorText, errorAnimatedStyle]}>
          {error}
        </Animated.Text>
      )}
      
    </View>
  );
};

// Custom Button Component

// Example Usage Component

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#1A1A1A',
  },
  
  // Input Styles
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
    color: colors.titleColor,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  textInput: {
    flex: 1,
    fontSize: SIZES.md,
    color: colors.titleColor,  
    paddingVertical: 0,
  },
  textInputWithLeftIcon: {
    marginLeft: 12,
  },
  textInputWithRightIcon: {
    marginRight: 12,
  },
  leftIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
    color: '#007AFF',
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
    marginLeft: 4,
  },

});

export default CustomInput
// ============================================================
// AppInput - Material Design 3 Animated Input
// Premium outlined text field with floating label, animated
// border, icon support, and react-hook-form integration.
// ============================================================

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  type TextInputProps,
  type KeyboardTypeOptions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  useDerivedValue,
  FadeInDown,
  FadeOut,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { s } from 'react-native-size-matters';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';

import { useAppTheme } from '@/theme';

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

export interface AppInputProps {
  /** Floating label text */
  label: string;
  /** Current value (controlled) */
  value?: string;
  /** Value change handler */
  onChangeText?: (text: string) => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Error message string -- triggers error state when truthy */
  error?: string;
  /** Feather icon name rendered inside the input on the left */
  leftIcon?: FeatherIconName;
  /** Feather icon name rendered inside the input on the right (pressable) */
  rightIcon?: FeatherIconName;
  /** Callback when the right icon is pressed */
  rightIconPress?: () => void;
  /** Secure text entry (password) */
  secureTextEntry?: boolean;
  /** Keyboard type */
  keyboardType?: KeyboardTypeOptions;
  /** Placeholder shown when label is floating and input is empty */
  placeholder?: string;
  /** Whether the input is editable (false = disabled state) */
  editable?: boolean;
  /** Maximum character length */
  maxLength?: number;
  /** Multiline input (height auto-expands) */
  multiline?: boolean;
  /** Helper text shown below the input when there is no error */
  helperText?: string;
  /** Force the success state */
  success?: boolean;
  /** Additional TextInput props */
  textInputProps?: Omit<
    TextInputProps,
    | 'value'
    | 'onChangeText'
    | 'onBlur'
    | 'secureTextEntry'
    | 'keyboardType'
    | 'placeholder'
    | 'editable'
    | 'maxLength'
    | 'multiline'
  >;
}

export interface FormInputProps<T extends FieldValues> extends Omit<AppInputProps, 'value' | 'onChangeText' | 'onBlur' | 'error'> {
  /** react-hook-form control object */
  control: Control<T>;
  /** Field name registered in the form */
  name: Path<T>;
  /** Optional validation rules */
  rules?: RegisterOptions<T, Path<T>>;
}

// ────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────

const INPUT_HEIGHT = s(56);
const LABEL_TRANSLATE_Y_RESTING = 0; // vertically centered
const LABEL_TRANSLATE_Y_FLOATING = -INPUT_HEIGHT / 2 + s(2); // above the top border
const LABEL_SCALE_RESTING = 1;
const LABEL_SCALE_FLOATING = 0.75;
const TIMING_DURATION = 200;

// Animated border view
const AnimatedView = Animated.View;

// ────────────────────────────────────────────────────────────
// AppInput Component
// ────────────────────────────────────────────────────────────

export function AppInput({
  label,
  value = '',
  onChangeText,
  onBlur: onBlurProp,
  error,
  leftIcon,
  rightIcon,
  rightIconPress,
  secureTextEntry,
  keyboardType,
  placeholder,
  editable = true,
  maxLength,
  multiline = false,
  helperText,
  success = false,
  textInputProps,
}: AppInputProps) {
  const { colors, spacing, radius, typography } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  // ── Shared animation values ──────────────────────────────
  // 0 = resting (label in center), 1 = floating (label at top)
  const labelPosition = useSharedValue(value.length > 0 ? 1 : 0);
  // 0 = default, 1 = focused, 2 = error
  const borderState = useSharedValue(error ? 2 : 0);

  // Determine the current visual state and drive animations
  const hasValue = value.length > 0;
  const isDisabled = !editable;
  const hasError = !!error;

  // ── Derived color for border ─────────────────────────────
  const animatedBorderColor = useDerivedValue(() => {
    return interpolateColor(
      borderState.value,
      [0, 1, 2],
      [colors.outline, colors.primary, colors.error],
    );
  });

  const animatedBorderWidth = useDerivedValue(() => {
    return borderState.value === 1 ? 2 : 1;
  });

  // ── Update animation drivers ─────────────────────────────
  const updateAnimations = useCallback(
    (focused: boolean, hasVal: boolean, hasErr: boolean) => {
      // Label position
      const shouldFloat = focused || hasVal;
      labelPosition.value = withTiming(shouldFloat ? 1 : 0, {
        duration: TIMING_DURATION,
      });

      // Border state
      if (hasErr) {
        borderState.value = withTiming(2, { duration: TIMING_DURATION });
      } else if (focused) {
        borderState.value = withTiming(1, { duration: TIMING_DURATION });
      } else {
        borderState.value = withTiming(0, { duration: TIMING_DURATION });
      }
    },
    [labelPosition, borderState],
  );

  // ── Focus / Blur handlers ────────────────────────────────
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    updateAnimations(true, hasValue, hasError);
  }, [hasValue, hasError, updateAnimations]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlurProp?.();
    updateAnimations(false, hasValue, hasError);
  }, [hasValue, hasError, onBlurProp, updateAnimations]);

  // Re-sync border state when error changes externally
  React.useEffect(() => {
    updateAnimations(isFocused, hasValue, hasError);
  }, [hasError, hasValue, isFocused, updateAnimations]);

  // ── Animated styles ──────────────────────────────────────

  // Label: translateY + scale
  const animatedLabelStyle = useAnimatedStyle(() => {
    const translateY =
      LABEL_TRANSLATE_Y_RESTING +
      labelPosition.value *
        (LABEL_TRANSLATE_Y_FLOATING - LABEL_TRANSLATE_Y_RESTING);
    const scale =
      LABEL_SCALE_RESTING +
      labelPosition.value * (LABEL_SCALE_FLOATING - LABEL_SCALE_RESTING);

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  // Container border
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      borderColor: animatedBorderColor.value,
      borderWidth: animatedBorderWidth.value,
    };
  });

  // ── Computed static colors ───────────────────────────────
  const labelColor = hasError
    ? colors.error
    : isFocused
      ? colors.primary
      : success
        ? colors.success
        : colors.onSurfaceVariant;

  const iconColor = hasError
    ? colors.error
    : isFocused
      ? colors.primary
      : colors.onSurfaceVariant;

  const inputTextColor = isDisabled
    ? colors.onSurfaceVariant
    : colors.onSurface;

  const containerBackgroundColor = isDisabled
    ? colors.surfaceContainerHigh
    : colors.surface;

  // ── Styles ───────────────────────────────────────────────
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          marginBottom: spacing.sm,
        },
        container: {
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          minHeight: multiline ? INPUT_HEIGHT : INPUT_HEIGHT,
          height: multiline ? undefined : INPUT_HEIGHT,
          borderRadius: radius.sm,
          backgroundColor: containerBackgroundColor,
          paddingHorizontal: spacing.lg,
          overflow: 'visible',
        },
        labelContainer: {
          position: 'absolute',
          left: leftIcon ? spacing.lg + s(24) + spacing.sm : spacing.lg,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
          pointerEvents: 'none',
        },
        labelText: {
          ...typography.bodyLarge,
          color: labelColor,
          backgroundColor: containerBackgroundColor,
          paddingHorizontal: spacing.xs,
        },
        input: {
          flex: 1,
          ...typography.bodyLarge,
          color: inputTextColor,
          paddingVertical: multiline ? spacing.lg : 0,
          paddingTop: multiline ? spacing.xl : 0,
          textAlignVertical: multiline ? 'top' : 'center',
          minHeight: multiline ? INPUT_HEIGHT * 1.5 : undefined,
        },
        leftIconContainer: {
          marginRight: spacing.sm,
          justifyContent: 'center',
          alignItems: 'center',
        },
        rightIconContainer: {
          marginLeft: spacing.sm,
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing.xs,
        },
        helperContainer: {
          flexDirection: 'row',
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xs,
        },
        helperText: {
          ...typography.bodySmall,
          color: colors.onSurfaceVariant,
        },
        errorText: {
          ...typography.bodySmall,
          color: colors.error,
        },
      }),
    [
      colors,
      spacing,
      radius,
      typography,
      multiline,
      leftIcon,
      labelColor,
      inputTextColor,
      containerBackgroundColor,
    ],
  );

  // ── Render ───────────────────────────────────────────────
  return (
    <View style={styles.wrapper}>
      {/* Input Container */}
      <AnimatedView style={[styles.container, animatedContainerStyle]}>
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Feather name={leftIcon} size={s(20)} color={iconColor} />
          </View>
        )}

        {/* Text Input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          placeholder={isFocused ? placeholder : undefined}
          placeholderTextColor={colors.onSurfaceVariant}
          editable={editable}
          maxLength={maxLength}
          multiline={multiline}
          style={styles.input}
          selectionColor={colors.primary}
          cursorColor={colors.primary}
          {...textInputProps}
        />

        {/* Right Icon (Pressable) */}
        {rightIcon && (
          <Pressable
            onPress={rightIconPress}
            style={styles.rightIconContainer}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            disabled={isDisabled}
          >
            <Feather name={rightIcon} size={s(20)} color={iconColor} />
          </Pressable>
        )}

        {/* Floating Label */}
        <Animated.View style={[styles.labelContainer, animatedLabelStyle]}>
          <Animated.Text style={styles.labelText} numberOfLines={1}>
            {label}
          </Animated.Text>
        </Animated.View>
      </AnimatedView>

      {/* Error Message */}
      {hasError && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOut.duration(150)}
          style={styles.helperContainer}
        >
          <Animated.Text style={styles.errorText}>{error}</Animated.Text>
        </Animated.View>
      )}

      {/* Helper Text (only when no error) */}
      {!hasError && helperText && (
        <View style={styles.helperContainer}>
          <Animated.Text style={styles.helperText}>{helperText}</Animated.Text>
        </View>
      )}
    </View>
  );
}

// ────────────────────────────────────────────────────────────
// FormInput - react-hook-form wrapper
// ────────────────────────────────────────────────────────────

export function FormInput<T extends FieldValues>({
  control,
  name,
  rules,
  ...inputProps
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <AppInput
          {...inputProps}
          value={value ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
        />
      )}
    />
  );
}

// ────────────────────────────────────────────────────────────
// Default export & named exports
// ────────────────────────────────────────────────────────────

export default AppInput;

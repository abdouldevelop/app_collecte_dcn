import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Kit from '@/database/model/Kit';
import { formatXOF } from '@/shared/utils';
import { AppCard } from '@/components/ui';
import { useAppTheme } from '@/theme';

type Props = {
  kit: Kit;
  handleSelectKit: (kitId: string) => void;
};

const SubscriptionItem = ({ kit, handleSelectKit }: Props) => {
  const { colors, spacing, radius, typography, animations } = useAppTheme();
  const [isSelected, setIsSelected] = useState(false);

  const checkScale = useSharedValue(1);

  const animatedCheckStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handlePress = () => {
    setIsSelected(!isSelected);
    handleSelectKit(kit.id);
    checkScale.value = withSpring(
      isSelected ? 1 : 1.15,
      animations.springs.bouncy
    );
    // Reset scale after bounce
    setTimeout(() => {
      checkScale.value = withSpring(1, animations.springs.bouncy);
    }, 150);
  };

  return (
    <AppCard
      variant="outlined"
      onPress={handlePress}
      padding="lg"
      style={{
        marginBottom: spacing.md,
        borderColor: isSelected ? colors.primary : colors.outlineVariant,
        borderWidth: isSelected ? 2 : 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
        }}
      >
        {/* Icon circle */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.md,
            backgroundColor: colors.primaryContainer,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="build-outline" size={22} color={colors.primary} />
        </View>

        {/* Kit name + price */}
        <View style={{ flex: 1 }}>
          <Text
            style={[typography.titleMedium, { color: colors.onSurface }]}
            numberOfLines={1}
          >
            {kit?.label}
          </Text>
          <Text
            style={[typography.bodyMedium, { color: colors.primary }]}
          >
            {formatXOF(kit?.montantTotal)}
          </Text>
        </View>

        {/* Checkbox */}
        <Animated.View style={animatedCheckStyle}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: isSelected ? 0 : 2,
              borderColor: colors.outline,
              backgroundColor: isSelected ? colors.primary : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
            )}
          </View>
        </Animated.View>
      </View>
    </AppCard>
  );
};

export default SubscriptionItem;

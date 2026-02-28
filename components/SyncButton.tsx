import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, ToastAndroid } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { syncWithBackend, checkLocalChanges } from '@/database/db_utils';
import { useAppTheme } from '@/theme';

export default function SyncButton() {
  const { colors, spacing, typography, radius } = useAppTheme();
  const [isSyncing, setIsSyncing] = useState(false);
  const [dirtyCount, setDirtyCount] = useState(0);
  const rotation = useSharedValue(0);

  const refreshDirtyCount = useCallback(async () => {
    const result = await checkLocalChanges();
    setDirtyCount(result.totalDirty);
  }, []);

  useEffect(() => {
    refreshDirtyCount();
    const interval = setInterval(refreshDirtyCount, 10000);
    return () => clearInterval(interval);
  }, [refreshDirtyCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleSync = useCallback(async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false,
    );

    const result = await syncWithBackend();

    cancelAnimation(rotation);
    rotation.value = withTiming(0, { duration: 200 });
    setIsSyncing(false);

    if (result.success) {
      ToastAndroid.show(
        `Sync OK — ${result.pullCount || 0} recu(s), ${result.pushCount || 0} envoye(s)`,
        ToastAndroid.SHORT,
      );
    } else {
      ToastAndroid.show(
        `Echec sync : ${result.error || 'erreur inconnue'}`,
        ToastAndroid.LONG,
      );
    }

    await refreshDirtyCount();
  }, [isSyncing, rotation, refreshDirtyCount]);

  return (
    <TouchableOpacity
      onPress={handleSync}
      disabled={isSyncing}
      style={{
        width: 40,
        height: 40,
        borderRadius: radius.full,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Animated.View style={animatedStyle}>
        <MaterialIcons name="sync" size={22} color={colors.primary} />
      </Animated.View>

      {dirtyCount > 0 && !isSyncing && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: colors.error,
            minWidth: 18,
            height: 18,
            borderRadius: radius.full,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: spacing.xs,
          }}
        >
          <Text
            style={[
              typography.caption,
              { color: '#FFFFFF', fontWeight: '700' },
            ]}
            allowFontScaling={false}
          >
            {dirtyCount > 99 ? '99+' : dirtyCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

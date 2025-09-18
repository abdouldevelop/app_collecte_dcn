import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { colors, Rs } from '@/shared/utils'
import Animated, { BounceIn } from 'react-native-reanimated'

type Props = {
  icon?: any;
  title?: string;
}

const SubscriptionEmptyPay = ({
  icon = "💳",
  title = "Aucun paiement",
}: Props) => {
  return (
    <Animated.View entering={BounceIn.duration(400).springify()} style={{}}>
      <View style={styles.iconContainer}>
        <View style={styles.walletIcon}>
          <Text style={styles.iconText}> {icon} </Text>
        </View>
      </View>
      
      <Text style={styles.subtitle}> {title} </Text>
      
    </Animated.View>
  )
}

export default SubscriptionEmptyPay

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    height: Rs(100),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#f8fafc',
    position: 'relative',
    minHeight: 400,
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  walletIcon: {
    width: 80,
     height: 80,
    borderRadius: 40,
    backgroundColor:colors.dashitem.bg_2 ,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: colors.boxShadow.sm
  },
  iconText: {
    fontSize: 36,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: width - 80,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    width: '100%',
    maxWidth: 320,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0891b2',
    marginRight: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#475569',
    flex: 1,
    fontWeight: '500',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  circle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#0891b2',
    opacity: 0.05,
  },
  circle1: {
    width: 100,
    height: 100,
    top: '10%',
    left: '5%',
  },
  circle2: {
    width: 60,
    height: 60,
    top: '20%',
    right: '10%',
  },
  circle3: {
    width: 80,
    height: 80,
    bottom: '15%',
    left: '15%',
  },
})
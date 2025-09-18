import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../BackButton';
import GloringBtn from '../form/GloringBtn';
import { colors, formatPhoneNumber, Rs, SIZES } from '@/shared/utils';
import Client from '@/database/model/Client';

// Props interface for the component
interface ClientInfoProps {
  client: Client | null,
  photo?: string;
  onEditProfile?: () => void;
  onSettings?: () => void;
  containerStyle?: ViewStyle;
  headerStop?: boolean;
  handleSwitch?: () => void;
  handleBack?: () => void;
}

const ClientInfo: React.FC<ClientInfoProps> = ({
  client,
  photo = "😊",
  onEditProfile = () => console.log('Edit Profile pressed'),
  onSettings = () => console.log('Settings pressed'),
  containerStyle,
  headerStop,
  handleSwitch,
  handleBack
}) => {

  const InfoItem: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    iconBgColor: string;
    label: string;
    value: string;
  }> = ({ icon, iconColor, iconBgColor, label, value }) => (
    <TouchableOpacity style={styles.infoItem} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Header with gradient background */}
      <LinearGradient
        colors={[colors.gloryColor.c_1, colors.gloryColor.c_2, colors.gloryColor.c_3]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Profile Photo */}
        <View style={styles.photoContainer}>
          <Text style={styles.photo}>{photo}</Text>
        </View>
        
        {/* Full Name */}
        <View>

        <Text style={styles.fullName}>{client?.firstName}</Text>
        <Text style={styles.membershipType}> {formatPhoneNumber(client?.phone || '')} </Text>
        </View>
      </LinearGradient>

      {/* User Details */}
      <View style={styles.detailsContainer}>
        {/* Contact Information */}
        <View style={[styles.infoSection, {display: "none"}]}>
          <InfoItem
            icon="call"
            iconColor="#059669"
            iconBgColor="#ECFDF5"
            label="Phone Number"
            value={client?.phone}
          />

          <InfoItem
            icon="location"
            iconColor="#DC2626"
            iconBgColor="#FEF2F2"
            label="Location"
            value={client?.numeroOrdre || 'N/A'}
          />

          {/* <InfoItem
            icon="mail"
            iconColor="#2563EB"
            iconBgColor="#EFF6FF"
            label="Email Address"
            value={email}
          /> */}

          <InfoItem
            icon="calendar"
            iconColor="#7C3AED"
            iconBgColor="#F3E8FF"
            label="Member Since"
            value={new Date(client?.createdAt ).toLocaleDateString()}
          />
        </View>


        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          <BackButton backAction={() => handleBack?.()} />
           <View style={{flexDirection: "row", alignItems: "center", gap: 8}}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Activé</Text>
           </View>
           <GloringBtn
            VStyle={{height: Rs(40), paddingVertical: 0}}
            TStyle={{fontSize: SIZES.xs}}
            label='Kits'
            icon={<Ionicons name="add" size={24} color="white" />}
            action={() => handleSwitch?.()}
            />
        </View>
      </View>
    </View>
  );
};

export default ClientInfo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    // borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    // margin: 16,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    flexDirection: "row",
    gap: Rs(16),
  },
  photoContainer: {
    width: 96,
    height: 96,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  photo: {
    fontSize: 40,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  membershipType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  detailsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusDot: {
    width: 12,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
  },
});


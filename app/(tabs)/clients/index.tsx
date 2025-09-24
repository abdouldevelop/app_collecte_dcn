import { ScrollView, StyleSheet, Text, View, Pressable, Animated } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import SearchInput from '@/components/SearchInput'
import { ThemedText } from '@/components/ThemedText'
import { colors, Rs, SIZES } from '@/shared/utils'
import FlatBtn from '@/components/FlatBtn'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import ClientItem from '@/features/dashboard/client/clients-item'
import { Link } from 'expo-router'
import BottomSheetCompoForm from '@/components/BottomSheetCompoForm'
import CustomInput from '@/components/form/CustomInput'
import { Feather } from '@expo/vector-icons'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import AddClient from '@/features/dashboard/client/add-client'
import EnhancedClientItem from '@/features/dashboard/client/clients-item'
import { useClients } from '@/hooks/app/useClient'
import { database } from '@/database/database'
import Client from '@/database/model/Client'
import Kit from '@/database/model/Kit'
import { withObservables } from '@nozbe/watermelondb/react'
import { useSouscription } from '@/hooks/app/useSubscription'
import BottomSheetCompo from '@/components/BottomSheetCompo'
import BackButton from '@/components/BackButton'
import { Q } from '@nozbe/watermelondb'
import SubscriptionEmptyPay from '@/features/subscription/subscription-empty-pay'
import Souscription from '@/database/model/Souscription'
import EnhancedClientKitItem from '@/features/dashboard/client/clients-kit-item'

type Props = {
  clients?: Client[]
  subscriptions?: Souscription[]
  kits?: Kit[]
}

const Page = ({clients, subscriptions, kits}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKitId, setSelectedKitId] = useState<string | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // console.log("9999999999999999999999999999999", subscriptions)

  // Filter subscriptions based on selected kit
  const filteredSubscriptions = selectedKitId 
    ? subscriptions?.filter(sub => sub.kitId === selectedKitId)
    : subscriptions;

  const filteredClients = clients?.filter(client =>
    client.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone?.includes(searchQuery)
  );

  const KitCard = ({ kit, isSelected, onPress }: { kit: Kit, isSelected: boolean, onPress: () => void }) => {
    const subscriptionsCount = subscriptions?.filter(sub => sub.kitId === kit.id).length || 0;
    
    return (
      <Pressable
        onPress={onPress}
        style={[
          styles.kitCard,
          isSelected && styles.selectedKitCard
        ]}
        // android_ripple={{ color: colors.gloryColor.c_1 + '20' }}
      >
        <View style={[styles.kitIconContainer, { backgroundColor: !isSelected ? colors.gloryColor.c_1 : 'white' }]}>
          {/* <Feather 
            name="package" 
            size={16} 
            color={isSelected ? 'white' : colors.gloryColor.c_1} 
          /> */}
          <Text style={{fontSize: SIZES.xs, color: !isSelected ? 'white' : 'black'}} >{subscriptionsCount}</Text>
        </View>
        
        <ThemedText style={[
          styles.kitTitle,
          isSelected && styles.selectedKitTitle
        ]} numberOfLines={2}>
          {kit.label}
        </ThemedText>

       
      </Pressable>
    );
  };

  return (
    <>
    <ScreenWrapper>
      {/* <SearchInput 
        placeholder="Rechercher un client" 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      /> */}
      
   
      <FlatBtn action={() => bottomSheetModalRef.current?.present()} />

      {/* Kit Selection Header */}
      <View style={styles.kitSelectionContainer}>
        <View style={styles.kitHeaderRow}>
          <ThemedText style={styles.sectionTitle}>
            Sélectionner un Kit
          </ThemedText>
          {selectedKitId && (
            <Pressable 
              onPress={() => setSelectedKitId(null)}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Tout afficher</Text>
              <Feather name="x" size={16} color={colors.gloryColor.c_1} />
            </Pressable>
          )}
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.kitsScrollContainer}
          style={styles.kitsScrollView}
        >
          {kits?.map((kit) => (
            <KitCard
              key={kit.id}
              kit={kit}
              isSelected={selectedKitId === kit.id}
              onPress={() => setSelectedKitId(selectedKitId === kit.id ? null : kit.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Subscriptions List */}
      <View style={styles.subscriptionsHeader}>
        {/* <ThemedText style={styles.sectionTitle}>
          {selectedKitId 
            ? `Souscriptions (${filteredSubscriptions?.length || 0})`
            : `Toutes les souscriptions (${subscriptions?.length || 0})`
          }
        </ThemedText> */}
        
        {/* {selectedKitId && (
          <View style={styles.filterChip}>
            <Feather name="filter" size={14} color={colors.gloryColor.c_1} />
            <Text style={styles.filterChipText}>Filtré</Text>
          </View>
        )} */}
      </View>

      <Animated.ScrollView 
        style={styles.subscriptionsScrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.subscriptionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredSubscriptions?.map((item) => (
          <EnhancedClientKitItem key={item?.id} subs={item} />
        ))}
           
        {filteredSubscriptions?.length === 0 && selectedKitId && (
          <SubscriptionEmptyPay 
            title='Aucune souscription pour ce kit' 
            icon='📦'
          />
        )}

        {subscriptions?.length === 0 && !selectedKitId && (
          <SubscriptionEmptyPay 
            title="Aucun client n'a souscrit "
            icon='👤'
          />
        )}
      </Animated.ScrollView>
     
    </ScreenWrapper>

    <BottomSheetCompo bottomSheetModalRef={bottomSheetModalRef} snapPoints={["90%"]}>
      <View style={styles.bottomSheetHeader}>
        <BackButton
          backAction={() => bottomSheetModalRef.current?.close()}
          icon={<Feather size={Rs(18)} name="x" color={colors.red} />}
        />
      </View>
      <AddClient closeModal={() => bottomSheetModalRef.current?.close()} />
    </BottomSheetCompo>
    </>
  )
}

const enhance = withObservables([], () =>({
  clients: database.get('clients')
    .query(
      Q.sortBy('created_at', Q.desc),
    )
    .observeWithColumns(['firstName', 'lastName', 'phone']),

  subscriptions: database.collections
    .get<Souscription>('souscriptions')
    .query(
      Q.sortBy('created_at', Q.desc)
    )
    .observe(),

  kits: database.collections
    .get<Kit>('kits')
    .query(
      Q.sortBy('label', Q.asc)
    )
    .observe()
}))

const EnhancedPage = enhance(Page)

export default EnhancedPage

const styles = StyleSheet.create({
  kitSelectionContainer: {
    marginVertical: Rs(10),
  },
  kitHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Rs(15),
    // paddingHorizontal: Rs(16),
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: colors.titleColor,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Rs(5),
    paddingHorizontal: Rs(12),
    paddingVertical: Rs(6),
    backgroundColor: `${colors.gloryColor.c_1}15`,
    borderRadius: Rs(20),
  },
  clearButtonText: {
    fontSize: SIZES.xs,
    color: colors.gloryColor.c_1,
    fontWeight: '600',
  },
  kitsScrollView: {
    flexGrow: 0,
  },
  kitsScrollContainer: {
    paddingHorizontal: Rs(2),
    gap: Rs(12),
  },
  kitCard: {
    backgroundColor: 'white',
    borderRadius: Rs(16),
    padding: Rs(6),
    minWidth: Rs(120),
    flexDirection: 'row',
    alignItems: 'center',
    gap: Rs(6),
    borderColor: colors.blackOpacity,
    borderWidth: StyleSheet.hairlineWidth,
    position: 'relative',
  },
  selectedKitCard: {
    backgroundColor: colors.gloryColor.c_1,
    borderColor: colors.gloryColor.c_1,
    transform: [{ scale: 1.05 }],
  },
  kitIconContainer: {
    width: Rs(35),
    height: Rs(35),
    backgroundColor: `${colors.gloryColor.c_1}15`,
    borderRadius: Rs(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  kitTitle: {
    fontSize: SIZES.xs,
    fontWeight: '600',
    color: colors.titleColor,
    textAlign: 'center',
  },
  selectedKitTitle: {
    color: 'white',
  },
  countBadge: {
    backgroundColor: colors.gloryColor.c_1,
    minWidth: Rs(28),
    height: Rs(28),
    borderRadius: Rs(14),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Rs(8),
    position: 'absolute',
    top: Rs(-8),
    right: Rs(-8),
  },
  selectedCountBadge: {
    backgroundColor: 'white',
  },
  countText: {
    color: 'white',
    fontSize: SIZES.sm,
    fontWeight: '700',
  },
  selectedCountText: {
    color: colors.gloryColor.c_1,
  },
  subscriptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Rs(16),
    marginBottom: Rs(15),
    // marginTop: Rs(15),
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Rs(5),
    backgroundColor: `${colors.gloryColor.c_1}15`,
    paddingHorizontal: Rs(10),
    paddingVertical: Rs(5),
    borderRadius: Rs(15),
  },
  filterChipText: {
    fontSize: SIZES.xs,
    color: colors.gloryColor.c_1,
    fontWeight: '600',
  },
  subscriptionsScrollView: {
    flex: 1,
  },
  subscriptionsContainer: {
    gap: Rs(8),
    paddingBottom: Rs(20),
  },
  bottomSheetHeader: {
    position: "absolute", 
    top: Rs(15), 
    right: Rs(20), 
    zIndex: 1,
  },
})
import { 
  ActivityIndicator, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import { colors, Rs } from '@/shared/utils'
import SubscriptionNew from '@/features/subscription/subscription-new'
import { useClients } from '@/hooks/app/useClient'
import { database } from '@/database/database'
import Client from '@/database/model/Client'
import ClientInfo from '@/components/client/ClientInfo'
import EnhancedSubscriptionList from '@/features/subscription/subscription-list'

type Props = {}

const Page = (props: Props) => {
  const router = useRouter();
  const {id} = useLocalSearchParams<{id: string}>();
  const [headerStop, setHeaderStop] = React.useState(false);
  const [isChanging, setIsChanging] = React.useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  function handleSwitch(){
    setIsChanging(!isChanging);
  }

  const {getClientById, loading, error,} = useClients(database);
  const [client, setClient] = useState<Client | null>(null);
  
  useEffect(() => {
    handleGetClient();
  }, [id, getClientById]);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  async function handleGetClient(){
    if(id){
      const client = await getClientById(id);
      if(client){
        setClient(client);
      }else{
        
      }
    }
  }



  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        onScroll={(event) => {
          // Your scroll handler logic here
        }}
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: keyboardHeight > 0 ? keyboardHeight + Rs(20) : Rs(20) }
        ]}
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='interactive'
      >
        <ClientInfo 
          client={client}
          handleBack={() => router.replace('/(tabs)/clients')}
          handleSwitch={handleSwitch}
          headerStop={headerStop} 
        />

        <View style={styles.contentContainer}>
          { id &&  <EnhancedSubscriptionList clientId={id}
           // goBack={router.push('/(tabs)/clients')}
            />  } 
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    marginTop: Rs(0), 
    flex: 1
  },
  header: {
    position: "absolute",
    top: Rs(20),
    left: Rs(20),
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '100%',
    paddingRight: Rs(40),
  },
});
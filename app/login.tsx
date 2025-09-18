import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, Image, ActivityIndicator, Keyboard, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, Rs, SCREEN_H, SIZES } from '@/shared/utils'
import CustomInput from '@/components/form/CustomInput'
import { Feather } from '@expo/vector-icons'
import GloringBtn from '@/components/form/GloringBtn'
import { Controller, useForm } from 'react-hook-form'
import { loginSchema, LoginSchemaData } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { http } from '@/shared/http'
import { HTTPError } from 'ky'
import { IAgent, IAuth, TError } from '@/interfaces'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated'
import { agentStore, setStorageItem } from '@/storage/MMKV'

type Props = {}

const Page = (props: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

    const {login} = agentStore();


  const {handleSubmit, control, reset, formState:{errors, isSubmitting}} = useForm<LoginSchemaData>({
    resolver: zodResolver(loginSchema),
    defaultValues:{
      password: '',
      phone: ''
    }
  })

  async function onSubmit(data: LoginSchemaData) {
    Keyboard.dismiss();
    setIsLoading(true)
    try {
      const response = await http.post('agents/login', data)
      if(response){
        console.log("resp===", response)
        const agent  = response as IAuth;
        setStorageItem("USER", response);
        login(agent);
        ToastAndroid.show("Connexion réussie", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error)
      if(error instanceof HTTPError) {
          const errorData: TError = await error.response.json().catch(() => ({
          message: "Unexpected error",
          statusCode: error.response.status,
        }));
        setError(errorData.message);
        setTimeout(() => {
          setError(null)
        }, 2000);
      }
     
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <ScreenWrapper style={{gap: Rs(40)}}>
      
       <Text style={{fontSize: SIZES.xl, fontWeight: 'bold', color: colors.gloryColor.c_1}}>
        Connexion
      </Text>

        {/* <Image 
        source={require('@/assets/app/login-img.png')}
        style={{width: Rs(300), height: Rs(300), resizeMode: 'contain', alignSelf: "center"}}
         /> */}
       <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        enabled={true}
      >

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={[
              styles.scrollContent,
              // isKeyboardVisible && { paddingBottom: keyboardHeight * 0.1 }
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            scrollEnabled={true}
            bounces={false}
            keyboardDismissMode="interactive"
          > 

             <Controller
             name="phone"
             control={control}
             render={({field:{onChange, onBlur, value}}) =>(
               <CustomInput
                 label='Téléphone'
                 placeholder=' 00 00 00 00 00'
                 leftIcon={<Feather name='phone' size={20} color={colors.gloryColor.c_1} />}
                 keyboardType='phone-pad'
                 contextMenuHidden={true}
                 onChangeText={(text) => onChange(text)}
                 onBlur={onBlur}
                 value={value}
                 error={errors.phone?.message}
               />
             )}
             />
            
            <Controller
            name="password"
            control={control}
            render={({field:{onChange, onBlur, value}}) =>(
              <CustomInput
                label='Mot de passe'
                placeholder=' ********'
                leftIcon={<Feather name='lock' size={20} color={colors.gloryColor.c_1} />}
                keyboardType='default'
                onChangeText={(text) => onChange(text)}
                onBlur={onBlur}
                value={value}
                error={errors.password?.message}
              />
            )}

             /> 

              <GloringBtn
               label='Connexion'
               action={handleSubmit(onSubmit)}
               isLoading={isLoading}
              //  icon={<ActivityIndicator size={20} color={'white'} />}

              />

             {error && <Animated.Text style={{color: colors.red}}
              entering={FadeInDown.duration(400).springify().damping(12)}
              exiting={FadeOut.duration(300)}
              > {error}</Animated.Text>}

          </ScrollView>
         </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default Page

const styles = StyleSheet.create({
 keyboardAvoidingView: {
    flex: 1
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: SCREEN_H * 0.6,
    gap: Rs(20),
  },
})
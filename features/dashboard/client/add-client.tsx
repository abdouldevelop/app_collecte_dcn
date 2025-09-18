import { StyleSheet, Text, View, ToastAndroid } from 'react-native'
import React from 'react'

import Toast from 'react-native-toast-message';

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';

import ScreenWrapper from '@/components/ScreenWrapper'
import CustomInput from '@/components/form/CustomInput'
import { Feather } from '@expo/vector-icons'
import { colors, Rs, SIZES } from '@/shared/utils'
import GloringBtn from '@/components/form/GloringBtn'
import { ClientSchemaData, newClentSchema } from '@/schema'
import { database } from '@/database/database';
import Client from '@/database/model/Client';
import { agentStore } from '@/storage/MMKV';


type Props = {
  closeModal: () => void
}

const AddClient = ({closeModal}: Props) => {
const {agent} = agentStore();
const {handleSubmit, control, reset, formState:{errors, isSubmitting}} = useForm<ClientSchemaData>({
  resolver: zodResolver(newClentSchema), 
  defaultValues:{
    fullName: '',
    address: '',
    phone: ''
  }
})

async function onSubmit(data: ClientSchemaData) {

  try {
    return database.write(async () => {
      const client = await database.get<Client>('clients').create((newClient) => {
        newClient.firstName = data.fullName
        newClient.lastName = data.fullName
        newClient.phone = data.phone,
        newClient.agentId = agent?.agent?.id
        // Don't set relation during creation
      })
      
      if (client.id) {
        reset()
        closeModal()
        ToastAndroid.showWithGravityAndOffset(
        'Vous avez ajouté un client',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25, // xOffset
        50  // yOffset
      );
      }
      return client
    })
    
  } catch (error) {
    console.log(error);
  }
    
}

  return (
    <ScreenWrapper style={{backgroundColor: colors.white}}>
      <Controller
      name="fullName"
      control={control}
      render={({field:{onChange, onBlur, value}}) =>(
        <CustomInput
          label='Nom complet'
          placeholder='Nom complet'
          leftIcon={<Feather name='user' size={20} color={colors.gloryColor.c_1} />}
          keyboardType='default'
          onChangeText={(text) => onChange(text)}
          onBlur={onBlur}
          value={value}
          error={errors.fullName?.message}
        />

      )}
      />


      <Controller
      name='address'
      control={control}
      render={({field:{onChange, onBlur, value}}) =>(
        <CustomInput
        label='Adresse'
        placeholder='Cocody, plateau dokui'
        leftIcon={<Feather name='map-pin' size={20} color={colors.gloryColor.c_1} />}
        keyboardType='default'
        onChangeText={(text) => onChange(text)}
        onBlur={onBlur}
        value={value}
        error={errors.address?.message}
      />

      )}
      />
      
      <Controller
      name="phone"
      control={control}
      render={({field:{onChange, onBlur, value}}) =>(
        <CustomInput
          label='Numéro de téléphone'
          placeholder='Numéro de téléphone'
          leftIcon={<Feather name='phone' size={20} color={colors.gloryColor.c_1} />}
          keyboardType="numeric"
          onChangeText={(text) => onChange(text)}
          onBlur={onBlur}
          value={value}
          error={errors.phone?.message}
        />

      )}
      
      />

      <View
      style={{marginTop: Rs(20)}}
      >

        <GloringBtn
          label='Ajouter'
          action={handleSubmit(onSubmit)}
          TStyle={{ fontSize: SIZES.mx }}
          VStyle={{ height: Rs(50), paddingVertical: 0 }}
        />
      </View>
              
    </ScreenWrapper>
  )
}

export default AddClient

const styles = StyleSheet.create({})
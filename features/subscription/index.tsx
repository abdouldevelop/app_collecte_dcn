import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SubscriptionNew from './subscription-new';
import EnhancedClientItem from './subscription-list';

type Props = {}

const SubscriptionCore = (props: Props) => {
  return (
    <>
      <EnhancedClientItem />
      {/* <SubscriptionNew /> */}
    </>
  )
}

export default SubscriptionCore

const styles = StyleSheet.create({})
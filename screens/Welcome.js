import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Map from '../component/Map';

export default function Welcome() {
  return (
    <View style= {styles.container}>
      <Text>search for the nearby language schools</Text>
      <Map />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
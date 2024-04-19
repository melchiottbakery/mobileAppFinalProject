import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from "react";
import Map from '../component/Map';


export default function Welcome() {



  return (
    <View style={styles.container}>
      <Text>Welcome to our Japanese-English vocabulary application.</Text>
      <Text>You can search for the nearest Japanese language schools below</Text>
      <Text>You can also browse existing vocabulary books on the library tab</Text>
      <Text>You can create a new account to manage your learning progress on the profile tab.</Text>
      <Map/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  slider: {
    width: '80%',
  },
  sliderValue: {
    fontSize: 18,
    marginTop: 10,
  },
  newTime: {
    fontSize: 18,
    marginTop: 10,
    fontStyle: 'italic',
  },
})
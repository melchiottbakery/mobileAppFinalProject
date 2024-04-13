import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from "react";
import Map from '../component/Map';


import { getProfile } from "../firebase-files/FirebaseHelper";
import { auth } from '../firebase-files/FirebaseSetup';
import LocationManager from './LocationManager';



export default function Welcome() {



  return (
    <View style={styles.container}>
      <Text>This is the Welcome screen</Text>
      <Text>map will on this screen</Text>
      <Map></Map>

      {/* <LocationManager></LocationManager> */}







    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from "react";
import Map from '../component/Map';


import { getProfile } from "../firebase-files/FirebaseHelper";
import { auth } from '../firebase-files/FirebaseSetup';
import LocationManager from './LocationManager';



export default function Welcome() {
  // function loginHandler(){
  //   console.log("ziyoule")
  //   navigation.navigate('Login')
  // }


  return (
    <View style={styles.container}>
      <Text>Welcome to our Japanese-English vocabulary application.</Text>
      <Text>You can search for the nearest Japanese language schools below</Text>
      <Text>You can also browse existing vocabulary books on the library tab</Text>
      <Text>You can create a new account to manage your learning progress on the profile tab.</Text>
      {/* <Button title = "login" onPress={loginHandler}></Button> */}

      <Map/>

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
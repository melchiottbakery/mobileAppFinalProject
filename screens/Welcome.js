import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from "react";


import { getProfile } from "../firebase-files/FirebaseHelper";
import { auth } from '../firebase-files/FirebaseSetup';
import LocationManager from './LocationManager';


export default function Welcome() {



  return (
    <View>
      <Text>This is the Welcome screen</Text>
      <Text>map will on this screen</Text>

      <LocationManager></LocationManager>







    </View>
  )
}

const styles = StyleSheet.create({})
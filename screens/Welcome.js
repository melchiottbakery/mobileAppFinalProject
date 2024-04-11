import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from "react";


import { getProfile } from "../firebase-files/FirebaseHelper";
import { auth } from '../firebase-files/FirebaseSetup';


export default function Welcome() {



  return (
    <View>
      <Text>This is the Welcome screen</Text>
      <Text>map will on this screen</Text>

    </View>
  )
}

const styles = StyleSheet.create({})
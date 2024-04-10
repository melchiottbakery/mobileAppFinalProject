import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from "react";
// import Sound from 'react-native-sound';
// import { Platform } from 'react-native';

import { Audio, Video } from 'expo-av';
import { getProfile } from "../firebase-files/FirebaseHelper";
import { auth } from '../firebase-files/FirebaseSetup';


export default function Welcome() {


  async function playsoundtest(){
    const soundObject = new Audio.Sound();

    try {
      await soundObject.loadAsync({ uri: 'https://dict.youdao.com/dictvoice?le=jap&type3&audio=%27%E5%A4%A9%E5%AE%89%E9%96%80' });
      await soundObject.playAsync();
  } catch (error) {
      console.error('Error playing sound:', error);
  }
      console.log('playsound')
  }



  return (
    <View>
      <Text>This is the Welcome screen</Text>
      <Button title="sound test" onPress={playsoundtest}></Button>
    </View>
  )
}

const styles = StyleSheet.create({})
import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from "react";
// import Sound from 'react-native-sound';
// import { Platform } from 'react-native';

import { Audio, Video } from 'expo-av';
import { getProfile } from "../firebase-files/FirebaseHelper";
import { auth } from '../firebase-files/FirebaseSetup';


export default function Welcome({route}) {
  // console.log(route)

  // const audioUrl= "https://dict.youdao.com/dictvoice?le=jap&type3&audio=%27%E5%A4%A9%E5%AE%89%E9%96%80"

  // const playAudioFromUrl = async () => {
  //   try {
  //     // Download the audio file
  //     const response = await fetch(audioUrl);
  //     const audioFile = await response.blob();
  
  //     // Create a new Sound instance with the downloaded audio file
  //     const sound = new Sound(audioFile, null, (error) => {
  //       if (error) {
  //         console.log('Failed to load the sound', error);
  //         return;
  //       }
  //       // Loaded successfully, play the sound
  //       sound.play((success) => {
  //         if (success) {
  //           console.log('Sound played successfully');
  //         } else {
  //           console.log('Failed to play the sound');
  //         }
  //       });
  //     });
  
  //     // For iOS, you may need to enable streaming mode
  //     if (Platform.OS === 'ios') {
  //       sound.setNumberOfLoops(-1); // Set looping (-1 for infinite loop)
  //       sound.setVolume(1); // Set volume (0 to 1)
  //       sound.play(); // Start playing the audio
  //     }
  //   } catch (error) {
  //     console.log('Error playing audio from URL:', error);
  //   }
  // };

  function playsound(){
      console.log('playsound')
  }



  return (
    <View>
      <Text>This is the Welcome screen</Text>
      <Button title="nihao" onPress={playsound}></Button>
    </View>
  )
}

const styles = StyleSheet.create({})
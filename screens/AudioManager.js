import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Audio } from 'expo-av';


export default function AudioManager({wordToSound}) {


  async function playsoundtest(){
    const soundObject = new Audio.Sound();

    try {
        await soundObject.loadAsync({ uri: `https://dict.youdao.com/dictvoice?le=jap&type3&audio=${wordToSound}` });
        await soundObject.playAsync();
  } catch (error) {
      console.error('Error playing sound:', error);
  }
      console.log('playsound for', wordToSound)
  }

  return (
    <View>
      {/* <Text>AudioManager</Text> */}
      <Button title= 'play the sound' onPress={playsoundtest}></Button>
    </View>
  )
}

const styles = StyleSheet.create({})
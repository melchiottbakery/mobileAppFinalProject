import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Audio } from 'expo-av';


export default function AudioManager({wordToSound}) {

  // const { sound: playbackObject } = await Audio.Sound.createAsync({ uri: 'http://foo/bar.mp3' },{ shouldPlay: true });


  async function playsoundtest(){
    console.log("playsound")
    const soundObject = new Audio.Sound();

    try {

      const { sound } = await Audio.Sound.createAsync({ uri: `https://dict.youdao.com/dictvoice?le=jap&type3&audio=${wordToSound}` },{ shouldPlay: true });
        // await soundObject.loadAsync({ uri: `https://dict.youdao.com/dictvoice?le=jap&type3&audio=${wordToSound}` });
        await sound.playAsync();
  } catch (error) {
      console.log('Error playing sound:', error);
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
import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Audio } from 'expo-av';


export default function AudioManager({wordToSound}) {

  // const { sound: playbackObject } = await Audio.Sound.createAsync({ uri: 'http://foo/bar.mp3' },{ shouldPlay: true });


  async function playsoundtest(){
    console.log("playsound")
    const soundObject = new Audio.Sound();

    try {
      console.log("try to play the sound")

      const { sound } = await Audio.Sound.createAsync({ uri: `https://dict.youdao.com/dictvoice?le=jap&type3&audio=${wordToSound}` },{ shouldPlay: true });
        // await soundObject.loadAsync({ uri: `https://dict.youdao.com/dictvoice?le=jap&type3&audio=${wordToSound}` });
        await sound.playAsync();
  } catch (error) {
      console.log('Error playing sound:', error);
  }
      console.log('playsound for', wordToSound)
  }





  const [sound, setSound] = useState();

  async function playSound() {
    console.log('Loading Sound');
    const encodedString = encodeURIComponent(wordToSound);
    const { sound } = await Audio.Sound.createAsync({ uri: `https://dict.youdao.com/dictvoice?le=jap&type3&audio=${encodedString}`}

  );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }


  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);



  return (
    <View>
      {/* <Text>AudioManager</Text> */}
      <Button title= 'play the sound' onPress={playSound}></Button>
    </View>
  )
}

const styles = StyleSheet.create({})
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Audio } from 'expo-av';

import { Ionicons } from '@expo/vector-icons';

export default function AudioManager({ wordToSound }) {

  const [sound, setSound] = useState();

  async function playSound() {
    console.log('Loading Sound');
    const encodedString = encodeURIComponent(wordToSound);
    const { sound } = await Audio.Sound.createAsync({ uri: `https://dict.youdao.com/dictvoice?le=jap&type3&audio=${encodedString}` }
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
      <TouchableOpacity onPress={playSound}>
        <Ionicons name="volume-high-outline" size={30} color="black" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})
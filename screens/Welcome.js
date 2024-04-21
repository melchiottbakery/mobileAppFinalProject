import { StyleSheet, Text, View } from 'react-native'
import React from "react";
import Map from '../component/Map';

export default function Welcome() {

  return (
    <View style={styles.container}>
      <View style={{ padding: 5 }}>
        <Text style={styles.text}>Thanks for using our Japanese-English vocabulary library.</Text>
        <Text style={styles.text}>Please feel free to browse our vocabulary books.</Text>
        <Text style={styles.text}>Track your learning progress by creating an account.</Text>
      </View>
      <Map />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "#FFE2C2"
  },
  text: {
    fontSize: 16
  }


})
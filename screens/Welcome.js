import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from "react";
import Map from '../component/Map';


export default function Welcome() {



  return (
    <View style={styles.container}>
      <Text>Thanks for using our Japanese-English vocabulary library.</Text>
      <Text>Please feel free to browse our vocabulary books.</Text>
      <Text>Track your learning progress by creating an account.</Text>
      <Map />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFE2C2"
  },
  // Mapcontainer: {
  //   flex: 1,
  //   // alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor:"#FFE2C2"
  // },

})
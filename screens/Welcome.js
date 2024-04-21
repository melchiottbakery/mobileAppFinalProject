import { StyleSheet, Text, View } from 'react-native'
import React from "react";
import Map from '../component/Map';
import colors from '../ColorHelper';
import screenStyleHelper from '../styleHelperFolder/screenStyleHelper';

export default function Welcome() {

  return (
    <View style={screenStyleHelper.containerAlignItemsCenter}>
      <View style={{ padding: 5 }}>
        <Text style={screenStyleHelper.textFontSize}>Thanks for using our Japanese-English vocabulary library.</Text>
        <Text style={screenStyleHelper.textFontSize}>Please feel free to browse our vocabulary books.</Text>
        <Text style={screenStyleHelper.textFontSize}>Track your learning progress by creating an account.</Text>
      </View>
      <Map />
    </View>
  )
}

const styles = StyleSheet.create({})
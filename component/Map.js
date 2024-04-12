import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import MapView, { Marker } from "react-native-maps";
//import getLocationHandler from "../component/LocationManager";

export default function Map() {
  return (
    <View style={styles.container}>
      {/* <Button title="Search nearby language schools" onPress={getLocationHandler} /> */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider="google"
      >
        <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 200,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MapView, { Marker }from "react-native-maps";

export default function Map() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
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

import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { mapsApiKey } from "@env";

export default function Map() {
    const [location, setLocation] = useState(null);
  //const [schools, setSchools] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
//   const [status, requestPermission] = Location.useForegroundPermissions();
//   async function verifyLocationPermission() {
//     if (status.granted) {
//       return true;
//     }
//     try {
//       const permissonResponse = await requestPermission();
//       return permissonResponse.granted;
//     } catch (error) {
//       console.log(error);
//     }
//   }
useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need location permissions');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setMapRegion({
        ...mapRegion,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        provider="google"
      >
        {location &&  (<Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} /> )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 500,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

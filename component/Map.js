import { Alert, StyleSheet, Text, View, Button } from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { mapsApiKey } from "@env";

export default function Map() {
  const [location, setLocation] = useState(null);
  const [schools, setSchools] = useState([]);
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
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Sorry, we need location permissions");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setMapRegion(prevRegion => ({
        ...prevRegion,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
    })();
  }, []);

  const findESLHandler = async () => {
    if (!location) {
      Alert.alert("Location not found", "Please enable location services");
      return;
    }
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=10000&type=school&keyword=ESL&key=${mapsApiKey}`;
    //const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=49.2721869,-123.147307&radius=10000&keyword=ESL%20school&key=${mapsApiKey}`;
    const response = await fetch(apiUrl);
    const json = await response.json();
    if (json.results) {
        setSchools(json.results);
      } else {
        Alert.alert("Error", "No schools found or API error.");
        console.log(json); // Log to see what the API returned
      }
    };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={(region) => setMapRegion(region)}
        provider="google"
      >
        {/* {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />
        )} */}
        {schools.map((school, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: school.geometry.location.lat,
              longitude: school.geometry.location.lng,
            }}
            title={school.name}
            description={school.vicinity}
          />
        ))}
      </MapView>
      <Button title="Find nearby ESL Schools" onPress={findESLHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 400,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

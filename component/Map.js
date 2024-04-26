import { Alert, StyleSheet, View, ActivityIndicator, Text } from "react-native";
import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { mapsApiKey } from "@env";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../ColorHelper";
import screenStyleHelper from "../styleHelperFolder/screenStyleHelper";

export default function Map() {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [schools, setSchools] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    // map initial region of Vancouver
    latitude: 49.2721869,
    longitude: -123.147307,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  async function verifyPermission() {
    if (status.granted) {
      return true;
    }
    try {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    } catch (err) {
      console.log(err);
    }
  }

  async function findESLHandler() {
    setIsLoading(true);
    try {
      const checkPermission = await verifyPermission();
      if (!checkPermission) {
        Alert.alert(
          "Location Permission",
          "Please grant location permission to find nearby schools."
        );
        return;
      }
      const locationResult = await Location.getCurrentPositionAsync();
      const userLocation = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      };
      setLocation(userLocation);
      fetchNearbySchools(userLocation);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchNearbySchools(userLocation) {
    try {
      fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.latitude},${userLocation.longitude}&language=ja&radius=50000&keyword=japanese%20school&key=${mapsApiKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // Limit to first 5 results and extract GPS coordinates
          const limitedResults = data.results.slice(0, 5).map((result) => ({
            name: result.name,
            vicinity: result.vicinity,
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
          }));
          setSchools(limitedResults);
          console.log(limitedResults);
        })
        .catch((error) => {
          console.error("Error fetching nearby schools:", error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={(region) => setMapRegion(region)}
        provider="google"
        showsUserLocation
        showsMyLocationButton
      >
        {schools.map((school, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: school.latitude,
              longitude: school.longitude,
            }}
            //show school name and address
            title={school.name}
            description={school.vicinity}
          />
        ))
        }
      </MapView>
      {isLoading ? <ActivityIndicator size="large" /> : (
        <View style={styles.findESLButton}>

          <TouchableOpacity style={screenStyleHelper.button} onPress={findESLHandler}>
            <Text style={screenStyleHelper.buttonText}>Find Nearby Japanese Language Schools</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  findESLButton: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: "100%",
    height: "60%",
    // flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  map: {
    width: "100%",
    height: "100%",
  },

});

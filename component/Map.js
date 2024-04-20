import { Alert, StyleSheet, View, Button, ActivityIndicator,Text } from "react-native";
import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { mapsApiKey } from "@env";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Map() {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [status, requestPermission] = Location.useForegroundPermissions();
  console.log(status)
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
      console.log('nihao',locationResult)
      const userLocation = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      };
      setLocation(userLocation);
      //setMapRegion(userLocation);
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
      {isLoading? <ActivityIndicator size="large" /> :(
        <View style={{width: '50%',
        alignItems: 'center',
        
        justifyContent: 'center', }}>

            <TouchableOpacity style={styles.button} onPress={findESLHandler}>
            <Text style={styles.buttonText}>Find Nearby Japanese Language Schools</Text>
            </TouchableOpacity>
        </View>
      )
      // <Button title="Find Nearby Japanese Language Schools" onPress={findESLHandler} />
      }
      {/* <Button title="Find Nearby Japanese Language Schools" onPress={findESLHandler} />
      {isLoading && <ActivityIndicator size="large" />} */}
    </View>
  );
}

const styles = StyleSheet.create({
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
  button: {
    backgroundColor: '#976732', // Example color
    padding: 10,
    borderRadius: 5,
    width:"50",
  },
  buttonText: {
    color: '#fff1e1', // Example color
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

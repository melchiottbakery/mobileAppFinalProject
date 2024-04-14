import { Alert, StyleSheet, View, Button } from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { mapsApiKey } from "@env";

export default function Map() {
  const [location, setLocation] = useState(null);
  const [schools, setSchools] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);
    // latitude: 37.78825,
    // longitude: -122.4324,
    // latitudeDelta: 0.0922,
    // longitudeDelta: 0.0421,
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
        Alert.alert("Permission Denied", "location permissions is required");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });
    })();
  }, []);


  const findESLHandler = async () => {
    if (!location) {
      Alert.alert("Location Error", "Current location not available.");
      return;
    }
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=10000&type=school&keyword=ESL&key=${mapsApiKey}`;
    //const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=49.2721869,-123.147307&radius=10000&keyword=ESL%20school&key=${mapsApiKey}`;
    try {
    const response = await fetch(apiUrl);
    const json = await response.json();
    if (json.results) {
        setSchools(json.results);
      } else {
        throw new Error("No results found");
        }
        } catch (error) {
            Alert.alert("API Error", 'Failed to fetch nearby schools');
            console.error(error);
        
        //console.log(json); // Log to see what the API returned
      }
    };


    // function findESLHandler() {
    //     console.log("findESLHandler works")
    //     try {
    //       fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=10000&keyword=ESL%20school&key=${mapsApiKey}`)
    //       .then(response => response.json(),
    //       )
    //       // .then(data => {
    //       //   setNearbySchools(data.results);
    //       //   // console.log(data.results)
    //       //   console.log(data.results[0].geometry)
    
    //       .then(data => {
    //         // Limit to first 5 results and extract GPS coordinates
    //         const limitedResults = data.results.slice(0, 5).map(result => ({
    //           name: result.name,
    //           vicinity: result.vicinity,
    //           latitude: result.geometry.location.lat,
    //           longitude: result.geometry.location.lng
    //         }));
    //         setSchools(limitedResults);
    
    //       })
    //       .catch(error => {
    //         console.error('Error fetching nearby schools:', error);
    //       });
    
    //     } catch (error) {
    //       console.log(error)
          
    //     }
    //   }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={region => setMapRegion(region)}
        provider="google"
        showsUserLocation
        showsMyLocationButton
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
          />
        ))}
      </MapView>
      <Button title="Find nearby ESL Schools" onPress={findESLHandler} />
      {/* {schools.map((school, index) => (
          <Text key={index}>{school.name}, {school.vicinity} (GPS: {school.latitude}, {school.longitude})</Text>
        ))} */}
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

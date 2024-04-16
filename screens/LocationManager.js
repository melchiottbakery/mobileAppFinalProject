import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location';
import { mapsApiKey } from "@env";



export default function LocationManager() {

  const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState(null);
  const [nearbySchools, setNearbySchools] = useState([]);
  const [nearbyESLSchools, setNearbyESLSchools] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);

  function findESLHandler() {
    console.log("findESLHandler works")
    try {
      fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=49.2721869,-123.147307&radius=5000&keyword=ESL%20school&key=${mapsApiKey}`)
        .then(response => response.json(),
        )
        // .then(data => {
        //   setNearbySchools(data.results);
        //   // console.log(data.results)
        //   console.log(data.results[0].geometry)

        .then(data => {
          // Limit to first 5 results and extract GPS coordinates
          const limitedResults = data.results.slice(0, 5).map(result => ({
            name: result.name,
            vicinity: result.vicinity,
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng
          }));
          setNearbyESLSchools(limitedResults);

        })
        .catch(error => {
          console.error('Error fetching nearby schools:', error);
        });

    } catch (error) {
      console.log(error)

    }
  }
  // useEffect(() => {
  //   console.log(nearbySchools)
  // }, [])
  // return (
  //   <View>
  //     <Text>LocationManager</Text>
  //     <Button title = "find the most ESL school" onPress={findESLHandler}></Button>
  //   {/* <Text></Text> */}


  //   {nearbyESLSchools.map((school, index) => (
  //         <Text key={index}>{school.name}, {school.vicinity} (GPS: {school.latitude}, {school.longitude})</Text>
  //       ))}

  //   </View>
  // )




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
        {nearbyESLSchools.map((school, index) => (
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
    </View>
  )
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

import { StyleSheet, View, Button, Image } from "react-native";
import React, { useState } from "react";
import * as Location from "expo-location";
import { mapsApiKey } from "@env";

export default function LocationManager() {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState(null);
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

  async function getLocationHandler() {
    try {
      const havePermission = await verifyPermission();
      if (!havePermission) {
        Alert.alert("You need to give permission");
        return;
      }
      const receivedLocation = await Location.getCurrentPositionAsync();
      setLocation({
        latitude: receivedLocation.coords.latitude,
        longitude: receivedLocation.coords.longitude,
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View>
      <Button title="Get Location" onPress={getLocationHandler} />
      {location && (
        <Image
          style={styles.mapPreview}
          source={{
            uri: `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:L%7C${location.latitude},${location.longitude}&key=${mapsApiKey}`,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginTop: 20,
  },
});

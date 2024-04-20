import { StyleSheet, Text, View, Button, Alert } from "react-native";
import React, { useState } from "react";
import * as Notifications from "expo-notifications";
import Slider from '@react-native-community/slider';


export default function NotificationManager({ remindHandler }) {

  async function verifyPermission() {
    try {
      const status = await Notifications.getPermissionsAsync();
      console.log(status);
      if (status.granted) {
        return true;
      }
      const permissionResponse = await Notifications.requestPermissionsAsync();
      //console.log(permissionResponse);
      return permissionResponse.granted;
    } catch (err) {
      console.log(err);
    }
  }

  async function localNotificationHandler() {

    try {
      const havePermission = await verifyPermission();
      if (!havePermission) {
        Alert.alert("please give permission for notification");
        return;
      }

      //const trigger = new Date(date.getTime());
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "time's up!",
          body: "It is time to review words!",
        },
        trigger: {
          seconds: parseInt(quotient) * 3600 + parseInt(remainder) * 60,
        },
      });

      setSelectedNumber(1);
      setQuotient(0);
      setRemainder(1);
      setNewTime(null);
      remindHandler();

    } catch (err) {
      console.log(err);
    }
  }


  const [selectedNumber, setSelectedNumber] = useState(1);
  const [quotient, setQuotient] = useState(0);
  const [remainder, setRemainder] = useState(1);
  const [newTime, setNewTime] = useState(null);


  const handleValueChange = (value) => {
    const number = Math.floor(value);
    setSelectedNumber(number);
    const q = Math.floor(number / 60);
    const r = number % 60;
    setQuotient(q);
    setRemainder(r);

    const currentTime = new Date();
    // Calculate new time by adding quotient (hours) and remainder (minutes)
    const updatedTime = new Date(currentTime.getTime() + q * 60 * 60 * 1000 + r * 60 * 1000);
    setNewTime(updatedTime);
  };

  return (
    <View >
      <Slider
        // style={{width: 200, height: 40}}

        style={styles.slider}
        minimumValue={1}
        maximumValue={2160}
        step={1}
        value={selectedNumber}
        onValueChange={handleValueChange}
      />

      <Text style={styles.sliderValue}>{selectedNumber}</Text>
      <Text style={styles.sliderValue}>{quotient} Hours and {remainder} Minutes</Text>
      {newTime && (
        <Text style={styles.newTime}>The expected reminder time is : {newTime.toLocaleString()}</Text>
      )}

      <Button title="set time interval here" onPress={localNotificationHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  slider: {
    width: '80%',
  },
  sliderValue: {
    fontSize: 18,
    marginTop: 10,
  },
  newTime: {
    fontSize: 18,
    marginTop: 10,
    fontStyle: 'italic',
  },
});

import { StyleSheet, Text, View, Button, Alert} from "react-native";
import React, { useState } from "react";
import * as Notifications from "expo-notifications";
import InputComponent from '../component/InputComponent';


export default function NotificationManager() {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [hoursError, setHoursError] = useState("");
  const [minutesError, setMinutesError] = useState("");

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
    if (!validateInput(hours, setHoursError) || !validateInput(minutes, setMinutesError)) {
        Alert.alert("Invalid Time Input");
        return; // Prevent a schedul if validation fails
      }
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
          body: "Don't forget to set timer to start learning!",
        },
        trigger: {
        seconds: parseInt(hours) * 3600 + parseInt(minutes) * 60,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  function validateInput(input, setError) {
    // Check if the input is a number and within the range 0 to 99
    const number = parseInt(input, 10);
    if (!isNaN(number) && number >= 0 && number <= 99) {
        setError("");
        return true;
    } else {
        setError("Please enter a valid number between 0 and 99");
        return false;
    }
}

  return (
    <View>
        <InputComponent
        label="Set hours here:"
        value={hours}
        onChangeText={(input) => {
            setHours(input);
            validateInput(input, setHoursError);
        }}
        error={hoursError}
        />

        <InputComponent
        label="Set minutes here:"
        value={minutes}
        onChangeText={(input) => {
            setMinutes(input);
            validateInput(input, setMinutesError);
        }}
        error={minutesError}
        />

      <Button
        title="set time interval here"
        onPress={localNotificationHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

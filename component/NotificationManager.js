import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useState } from "react";
import * as Notifications from "expo-notifications";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome6 } from '@expo/vector-icons';
import colors from "../ColorHelper";

export default function NotificationManager({ remindHandler }) {

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [newTime, setNewTime] = useState(null);

  const handleHoursPlus = () => {
    if (hours < 36) {
      setHours(hours + 1);
      handleTimeChange()
    }
  };

  const handleHourMinus = () => {
    if (hours > 0) {
      setHours(hours - 1);
      handleTimeChange()
    }
  };
  const handleMinutesPlus = () => {
    if (minutes < 50) {
      setMinutes(minutes + 10);
      handleTimeChange()
    }
  };

  const handleMinutesMinus = () => {
    if (minutes > 10) {
      setMinutes(minutes - 10);
      handleTimeChange()
    }
  };

  const handleTimeChange = () => {
    const currentTime = new Date();
    const updatedTime = new Date(currentTime.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);
    setNewTime(updatedTime);
  };

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

  async function newLocalNotificationHandler() {

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
          seconds: parseInt(hours) * 3600 + parseInt(minutes) * 60,
        },
      });
      setHours(0);
      setMinutes(1);
      setNewTime(null);
      remindHandler();
    } catch (err) {
      console.log(err);
    }
  }

  const newLocalNotification = (
    <TouchableOpacity style={styles.button} onPress={newLocalNotificationHandler}>
      <Text style={styles.buttonText}>Set Reminder</Text>
    </TouchableOpacity>
  )
  return (
    <View>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>{hours} hours</Text>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleHoursPlus}>
          <FontAwesome6 name="add" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleHourMinus}>
          <FontAwesome6 name="minus" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>{minutes} minutes</Text>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleMinutesPlus}>
          <FontAwesome6 name="add" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleMinutesMinus}>
          <FontAwesome6 name="minus" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {newTime && (
        <>
          <Text style={styles.newTime}>The expected reminder time is : </Text>
          <Text style={styles.newTime}>{newTime.toLocaleString()}</Text>

        </>
      )}

      {newLocalNotification}
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

  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    marginBottom: 0,
    justifyContent: "space-evenly"
  },
  counterText: {
    fontSize: 30,
    marginRight: 20,
  },
  buttonContainer: {
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: colors.buttonColor, // Example color
    padding: 10,
    borderRadius: 5,
    width: "50",
  },
  buttonText: {
    color: colors.buttonText, // Example color
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

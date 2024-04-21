import { StyleSheet, Text, View, Button, Alert } from "react-native";
import React, { useState } from "react";
import * as Notifications from "expo-notifications";
import Slider from '@react-native-community/slider';
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome6 } from '@expo/vector-icons';

export default function NotificationManager({ remindHandler }) {

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);

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
    // Calculate new time by adding quotient (hours) and remainder (minutes)
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

      // setSelectedNumber(1);
      setHours(0);
      setMinutes(0);
      setNewTime(null);
      remindHandler();

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

  const newLocalNotification = (
    <TouchableOpacity style={styles.button} onPress={newLocalNotificationHandler}>
      <Text style={styles.buttonText}>Set Reminder</Text>
    </TouchableOpacity>
  )
  return (
    <View
    // style={{borderBottomWidth:3, borderColor:"#B88956"}} 
    >

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>{hours} hours</Text>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleHoursPlus}>
          <FontAwesome6 name="add" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleHourMinus}>
          <FontAwesome6 name="minus" size={24} color="black" />
        </TouchableOpacity>

        {/* <FontAwesome6 name="minus" size={24} color="black" /> */}

        {/* <View style={styles.buttonContainer}>
          <Button title="Plus" onPress={handleHoursPlus} />
        </View> */}
        {/* <View style={styles.buttonContainer}>
          <Button title="Minus" onPress={handleHourMinus} />
        </View> */}
      </View>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>{minutes} minutes</Text>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleMinutesPlus}>
          <FontAwesome6 name="add" size={24} color="black" />
        </TouchableOpacity>

        {/* <View style={styles.buttonContainer}>
          <Button title="Plus" onPress={handleMinutesPlus} />
        </View> */}

        <TouchableOpacity style={styles.buttonContainer} onPress={handleMinutesMinus}>
          <FontAwesome6 name="minus" size={24} color="black" />
        </TouchableOpacity>
        {/* <View style={styles.buttonContainer}>
          <Button title="Minus" onPress={handleMinutesMinus} />
        </View> */}
      </View>
      {/* <Slider
        // style={{width: 200, height: 40}}

        style={styles.slider}
        minimumValue={1}
        maximumValue={2160}
        step={1}
        value={selectedNumber}
        onValueChange={handleValueChange}
      />

      <Text style={styles.sliderValue}>{selectedNumber}</Text>
      <Text style={styles.sliderValue}>{quotient} Hours and {remainder} Minutes</Text> */}
      {newTime && (
        <>
          <Text style={styles.newTime}>The expected reminder time is : </Text>
          <Text style={styles.newTime}>{newTime.toLocaleString()}</Text>

        </>
      )}


      {/* <Button title="set time interval here" onPress={localNotificationHandler} /> */}
      {newLocalNotification}

      {/* {newTime && newLocalNotification} */}
      {/* {String(hours) && (
        <Text style={styles.newTime}>The expected reminder time is : {newTime.toLocaleString()}</Text>
      )}
       */}

      {/* {(hours && minutes) ?newLocalNotification : null} */}



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
    backgroundColor: '#976732', // Example color
    padding: 10,
    borderRadius: 5,
    width: "50",
  },
  buttonText: {
    color: '#fff1e1', // Example color
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

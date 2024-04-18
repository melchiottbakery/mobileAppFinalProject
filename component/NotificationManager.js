import { StyleSheet, Text, View, Button, Alert, Platform } from "react-native";
import React, { useState } from "react";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function NotificationManager() {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

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

      const trigger = new Date(date.getTime());
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "time's up!",
          body: "Don't forget to set timer to start learning!",
        },
        trigger: {
          hour: trigger.getHours(),
          minute: trigger.getMinutes(),
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);
    if (event.type === "set") {
      localNotificationHandler();
      setShowPicker(false);
    }
  };

  return (
    <View>
      <Button
        title="set time interval here"
        onPress={() => setShowPicker(true)}
      />
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({});

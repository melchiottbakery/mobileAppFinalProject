import { StyleSheet, Text, View, Image, Button, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputComponent from "../component/InputComponent";
import { auth } from "../firebase-files/firebaseSetup";

export default function Profile({ navigation }) {
  // You can give me some const and useState for the name, the email and the password

  const [nickname, setNickname] = useState("nihao");
  const [email, setEmail] = useState("www@qq.com");
  const [password, setPassword] = useState("12345");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  //add Alert for the Cancel button
  const handleCancel = () => {
    Alert.alert("Cancel", "Are you going back to Login?", [
      {
        text: "No",
        onPress: () => console.log("No Pressed"),
      },
      { text: "Yes", onPress: () => navigation.navigate("Login") },
    ]);
  };

  return (
    <SafeAreaView>
      {/*  <Text>This is the Profile screen</Text> */}

      {/*  <Text>Add a pic as a placeholder</Text> */}
      <View style={styles.imageContainer}>
        <Image source={require("../assets/myImage.png")} style={styles.image} />
      </View>

      <InputComponent
        //here is a InputComponent can show the name from Registration nickname, but user cannot pressed or chage(until now)
        label="Nickname"
        //value={nickname}
        value={auth.currentUser.uid}
        editable={false}
      />

      <InputComponent
        //here is a InputComponent can show the email, but user cannot pressed or
        label="Email"
        //value={email}
        value={auth.currentUser.email}
        editable={false}
      />

      <InputComponent
        //here is a InputComponent can show the password, but user can pressed. it
        //show from stars to characters until the user presses.
        label="Password"
        value={password}
        secureTextEntry={secureTextEntry}
        editable={false}
        onPressIn={() => {
          setSecureTextEntry(!secureTextEntry);
        }}
      />

      {/* // if you can add a alert for this one? */}
      <View style={styles.buttonContainer}>
      <Button
        //a button cancel and go back to the Login screen
        title="Cancel"
        onPress={handleCancel}
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
  buttonContainer: {
    margin: 20,
    alignItems: "center",
  },
});

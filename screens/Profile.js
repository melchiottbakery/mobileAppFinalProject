import { StyleSheet, Text, View, Image, Button, Alert, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputComponent from "../component/InputComponent";
import { auth } from '../firebase-files/FirebaseSetup';

import * as ImagePicker from 'expo-image-picker';


import { getProfile } from "../firebase-files/FirebaseHelper";



export default function Profile({ route, navigation }) {
  // You can give me some const and useState for the name, the email and the password
  // const {nickname, email, password } = route.params;
  console.log(auth.currentUser.email)

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("12345");
  const [secureTextEntry, setSecureTextEntry] = useState(true);



  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  // console.log(status)



  async function verifyCameraPermission(){

    if(status.granted){
      return true;
    }

    try {
      const permissonResponse = await requestPermission();
      return permissonResponse.granted;

    } catch (error) {

      console.log(error);
      
    }

  }




  useEffect(() => {
    async function getDataFromDB() {
      const data = await getProfile("users", auth.currentUser.uid);
      // console.log(data)
      setNickname(data.nickname)
      setEmail(data.email)
    }
    getDataFromDB();
  }, []);

  //add Alert for the Cancel button
  function handleCancel() {
    Alert.alert("Cancel", "Are you going back to Login?", [
      {
        text: "No",
        onPress: () => console.log("No Pressed"),
      },
      { text: "Yes", onPress: () => navigation.navigate("Login") },
    ]);
  };

  const [imageLocalUri, setImageLocalUri] = useState("");
  
  async function cameraFunction(){
    try {

      const checkPermission = await verifyCameraPermission();

      if (!checkPermission){
        Alert.alert("Please give permission for the use of camera");
        return;
    }

      const useCamera =  await ImagePicker.launchCameraAsync(
        {allowsEditing: true});
      // console.log(useCamera)
      // console.log(useCamera.assets[0].uri)
      setImageLocalUri(useCamera.assets[0].uri)
    } catch (error) {
      console.log(error)
      
    }
  }

  return (
    <SafeAreaView>
      {/*  <Text>This is the Profile screen</Text> */}

      {/*  <Text>Add a pic as a placeholder</Text> */}
      <Pressable onPress={cameraFunction}>
      <View style={styles.imageContainer}>
        <Image source={require("../assets/myImage.png")} style={styles.image} />
        {imageLocalUri && (
        // 如果网络图片存在，则加载网络图片
        <Image source={{ uri: imageLocalUri }} style={{ width: 100, height: 100 }} />
      )}
      </View>

      
      </Pressable>

      <InputComponent
        //here is a InputComponent can show the name from Registration nickname, but user cannot pressed or chage(until now)
        label="Nickname"
        value={nickname}
        editable={false}
      />

      <InputComponent
        //here is a InputComponent can show the email, but user cannot pressed or
        label="Email"
        value={email}
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
        title="LOG OUT"
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

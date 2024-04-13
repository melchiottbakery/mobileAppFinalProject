import { StyleSheet, Text, View, Image, Button, Alert, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputComponent from "../component/InputComponent";
import { auth,storage } from '../firebase-files/FirebaseSetup';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";



import * as ImagePicker from 'expo-image-picker';


import { editImageLinkInDB, getProfile } from "../firebase-files/FirebaseHelper";



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
      downloadImageFromDatabase(data)
    }
    getDataFromDB();
  }, []);

  const [imageDatabasetaUri, setImageDatabasetaUri] = useState("");

  async function downloadImageFromDatabase(data){
    try {
      downloadImageUri = data.imageUri
      const imageRef = ref(storage, downloadImageUri);
      const imageDownloadUri= await getDownloadURL(imageRef);
      console.log("downloaded" +imageDownloadUri)
      setImageDatabasetaUri(imageDownloadUri)
      


      // setDownloadImage(data.imageUri)
    } catch (error) {
      
    }
  }



  //add Alert for the Cancel button
  function logoutHandler() {
    Alert.alert("Cancel", "Are you going back to Login?", [
      {
        text: "No",
        onPress: () => console.log("No Pressed"),
      },
      { text: "Yes", onPress: () => 
      
      {
        try {
          signOut(auth)
          navigation.navigate("Login")
        } catch (error) {
          console.log(error)
        }
      }
       },
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
      setOpenSaveButton(true)
      // uploadImageFromLocal(imageLocalUri)
    } catch (error) {
      console.log(error)
      
    }
  }

  const[openSaveButton, setOpenSaveButton]= useState(false)



  function saveImageChange(){
    uploadImageFromLocal(imageLocalUri)
  }

  async function uploadImageFromLocal(imageLocalUri){
    try {
      const response = await fetch(imageLocalUri);
      // console.log("uploadImageFromLocal is",response)
      const imageBlob = await response.blob();
      // console.log(blob)
      const imageName = imageLocalUri.substring(imageLocalUri.lastIndexOf('/') + 1);
      const imageRef = await ref(storage, `profileImages/${imageName}`)
      const uploadResult = await uploadBytes(imageRef, imageBlob);
      console.log("upload successed")
      

      // setImageLocalUri('')
      setOpenSaveButton(false)

      // return 
      console.log(uploadResult.metadata.fullPath)
      writeImageLinkToUser(uploadResult.metadata.fullPath)
    } catch (error) {
      console.log(error)
    }

  }


function writeImageLinkToUser(storagePath){
  editImageLinkInDB(auth.currentUser.uid,{imageUri:storagePath},)

 
}


  return (
    <SafeAreaView>
      {/*  <Text>This is the Profile screen</Text> */}

      {/*  <Text>Add a pic as a placeholder</Text> */}
      <Pressable onPress={cameraFunction}>
      <View style={styles.imageContainer}>
        {/* <Image source={require("../assets/imageUpload.jpeg")} style={styles.image} />
        {imageLocalUri && (
        <Image source={{ uri: imageLocalUri }} style={{ width: 100, height: 100 }} />
      )}
      {
        imageDatabasetaUri &&   <Image style = {styles.image} source= {{uri:imageDatabasetaUri}}/>
      } */}
      {imageLocalUri ?
      <Image source={{ uri: imageLocalUri }} style={{ width: 100, height: 100 }} />:
      <>
      {imageDatabasetaUri ? 
  <Image style={styles.image} source={{ uri: imageDatabasetaUri }} />
  : <Image source={require("../assets/imageUpload.jpeg")} style={styles.image} />}
      </>
      }

{/* {imageDatabasetaUri ? 
  <Image style={styles.image} source={{ uri: imageDatabasetaUri }} />
  : <Image source={require("../assets/imageUpload.jpeg")} style={styles.image} />} */}

{/* {!imageLocalUri && (
      <Image source={require("../assets/imageUpload.jpeg")} style={styles.image} />
    )}
    {imageLocalUri && (
      <Image source={{ uri: imageLocalUri }} style={{ width: 100, height: 100 }} />
    )}
    {imageDatabasetaUri && (
      <Image style={styles.image} source={{ uri: imageDatabasetaUri }} />
    )} */}

      
      </View>
     

      
      </Pressable>
      {openSaveButton &&

(      <Button title="save image changes" onPress={saveImageChange}></Button>
)      
}

      <InputComponent
        label="Nickname"
        value={nickname}
        onChangeText={setNickname}
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
        onPress={logoutHandler}
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

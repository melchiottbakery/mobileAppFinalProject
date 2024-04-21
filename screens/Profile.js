import { StyleSheet, Text, View, Image, Button, Alert, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputComponent from "../component/InputComponent";
import { auth, database, storage } from '../firebase-files/FirebaseSetup';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { editImageLinkInDB, getProfile, setNewUserDocToDB } from "../firebase-files/FirebaseHelper";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";

import { AntDesign } from '@expo/vector-icons';

export default function Profile({ navigation }) {

  const [originNickname, setOriginNickname] = useState('');

  const [nickname, setNickname] = useState('');

  const [email, setEmail] = useState('');

  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const [openButton, setOpenButton] = useState(false);
  const showButton = originNickname !== nickname;

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [imageDatabasetaUri, setImageDatabasetaUri] = useState("");
  const [imageLocalUri, setImageLocalUri] = useState("");
  const [openSaveButton, setOpenSaveButton] = useState(false)

  useEffect(() => {
    let unsubscribe; // Declare unsubscribe outside the try block
    if (auth.currentUser) {
      try {

        unsubscribe = onSnapshot(
          doc(database, "users", auth.currentUser.uid),
          (doc) => {
            const data = doc.data();
            setOriginNickname(data.nickname);
            setNickname(data.nickname);
            setEmail(data.email);
            downloadImageFromDatabase(data);
          }
        );
      } catch (error) {
        console.log('type of error', error);
      }
    }

    return () => {
      if (unsubscribe) { // Check if unsubscribe is defined before calling it
        console.log("unsubscribe");
        unsubscribe();
      }
    };
  }, [userLoggedIn]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
      }
      else {
        setUserLoggedIn(false);
      }
    })
  }, [])

  async function verifyCameraPermission() {
    if (status.granted) {
      return true;
    }
    try {
      const permissonResponse = await requestPermission();
      return permissonResponse.granted;

    } catch (error) {
      console.log(error);
    }
  }

  async function downloadImageFromDatabase(data) {
    if (data.imageUri) {
      try {
        downloadImageUri = data.imageUri
        const imageRef = ref(storage, downloadImageUri);
        const imageDownloadUri = await getDownloadURL(imageRef);
        console.log("downloaded" + imageDownloadUri)
        setImageDatabasetaUri(imageDownloadUri)

      } catch (error) {
        console.log('console.error', error)
        setImageDatabasetaUri('https://t4.ftcdn.net/jpg/04/81/13/43/360_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg')
      }
    }
  }

  function logoutHandler() {
    Alert.alert("LOGOUT", "Are you going to LOGOUT?", [
      {
        text: "No",
        onPress: () => console.log("No Pressed"),
      },
      {
        text: "Yes", onPress: () => {
          try {
            signOut(auth)
            setNickname('')
            setOriginNickname('')
            setEmail('')
            setImageDatabasetaUri('https://t4.ftcdn.net/jpg/04/81/13/43/360_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg')
          } catch (error) {
            console.log(error)
          }
        }
      },
    ]);
  };

  async function cameraFunction() {
    try {
      const checkPermission = await verifyCameraPermission();
      if (!checkPermission) {
        Alert.alert("Please give permission for the use of camera");
        return;
      }
      const useCamera = await ImagePicker.launchCameraAsync(
        { allowsEditing: true });
      console.log(useCamera.assets[0].uri)
      setImageLocalUri(useCamera.assets[0].uri)
      setOpenSaveButton(true)
    } catch (error) {
      console.log(error)
    }
  }

  function saveImageChange() {
    uploadImageFromLocal(imageLocalUri)
    setImageLocalUri('')
  }

  async function uploadImageFromLocal(imageLocalUri) {
    try {
      const response = await fetch(imageLocalUri);
      const imageBlob = await response.blob();
      const imageName = imageLocalUri.substring(imageLocalUri.lastIndexOf('/') + 1);
      const imageRef = await ref(storage, `profileImages/${imageName}`)
      const uploadResult = await uploadBytes(imageRef, imageBlob);
      console.log("upload successed")
      setOpenSaveButton(false)
      console.log(uploadResult.metadata.fullPath)
      writeImageLinkToUser(uploadResult.metadata.fullPath)
    } catch (error) {
      console.log(error)
    }
  }

  function writeImageLinkToUser(storagePath) {
    editImageLinkInDB(auth.currentUser.uid, { imageUri: storagePath },)
  }

  function changeNameHandler() {
    console.log("pressed")
    setNewUserDocToDB({ nickname: nickname }, "users", auth.currentUser.uid)
    setNickname(nickname)
    setOpenButton(false)
  }

  function cancelchangeNameHandler() {
    setNickname(originNickname);
  }

  const AppStack = (
    <>
      <Pressable onPress={cameraFunction}>
        <View style={styles.imageContainer}>
          <View style={{
            position: "absolute",
            right: 100,
            bottom: 3,
          }
          }>
            <Entypo name="camera" size={30} color="black" />
          </View>

          {imageLocalUri ?
            <Image source={{ uri: imageLocalUri }} style={{ width: 100, height: 100 }} /> :
            <>
              {imageDatabasetaUri ?
                <Image style={styles.image} source={{ uri: imageDatabasetaUri }} />
                : <Image source={require("../assets/imageUpload.jpeg")} style={styles.image} />}
            </>
          }
        </View>

      </Pressable>
      {openSaveButton &&
        (
          <TouchableOpacity onPress={saveImageChange}>
            <FontAwesome name="upload" size={30} color="black" />
          </TouchableOpacity>
        )
      }

      <InputComponent
        label="Nickname (Touch the textbox to change)"
        value={nickname}
        onChangeText={setNickname}
        editable={true}
      />

<View style={{flexDirection:"row",justifyContent:"center"}}>
      {showButton && (
        <TouchableOpacity style={styles.buttonContainer} onPress={changeNameHandler}>
          <AntDesign name="checkcircleo" size={30} color="black" />
        </TouchableOpacity>
      )}

      {showButton && (
        <TouchableOpacity style={styles.buttonContainer} onPress={cancelchangeNameHandler}>
          <AntDesign name="closecircleo" size={30} color="black" />
        </TouchableOpacity>
      )}
      </View>

      <InputComponent
        label="Email"
        value={email}
        editable={false}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={logoutHandler}>
          <SimpleLineIcons name="logout" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </>
  )

  function loginHandler() {
    navigation.navigate('Login')
  }

  const AppAuth = (
    <View style={styles.appauthcontainer}>
      <TouchableOpacity onPress={loginHandler}>
        <SimpleLineIcons name="login" size={30} color="black" />
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {userLoggedIn ? AppStack : AppAuth}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appauthcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFE2C2"
  },

  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: "#FFE2C2"
  },

  imageContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  buttonContainer: {
    margin: 10,
    alignItems: "center",
  },
});

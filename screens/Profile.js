import { StyleSheet, Text, View, Image, Button, Alert, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputComponent from "../component/InputComponent";
import { auth, database, storage } from '../firebase-files/FirebaseSetup';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";





import * as ImagePicker from 'expo-image-picker';


import { editImageLinkInDB, getProfile, setNewUserDocToDB } from "../firebase-files/FirebaseHelper";
import { collection, doc, onSnapshot } from "firebase/firestore";



export default function Profile({ route, navigation }) {


  const [originNickname, setOriginNickname] = useState('');


  const [nickname, setNickname] = useState('');
  const [uploadnickname, setUploadNickname] = useState('');

  const [email, setEmail] = useState('');

  const [status, requestPermission] = ImagePicker.useCameraPermissions();

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
  const [userLoggedIn, setUserLoggedIn] = useState(false);

//   useEffect(() => {

// // try {
//   const unsubscribe = onSnapshot(

//     doc(database, "users", auth.currentUser.uid),

//     (doc) => {

//       const data = doc.data();
//       setOriginNickname(data.nickname)
//               setNickname(data.nickname)
//               setEmail(data.email)
//               downloadImageFromDatabase(data)
//     });

  
// // } catch (error) {
// //   console.log(error)
  
// // }
    


//     return () => {
//       console.log("unsubscribe");
//       unsubscribe();
//     };
//   }, [userLoggedIn]);




  useEffect(() => {
    let unsubscribe; // Declare unsubscribe outside the try block
  
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
      console.log(error);
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


        //       async function getDataFromDB() {

        //         const data = await getProfile("users", auth.currentUser.uid);
        //         console.log("onauth ",data)
        //         setOriginNickname(data.nickname)
        //         setNickname(data.nickname)
        //         setEmail(data.email)
        //         downloadImageFromDatabase(data)
        //       }
        //       if (auth.currentUser) {
        //         getDataFromDB();
        //       }


      }
      else {
        setUserLoggedIn(false);


      }
    })
  }, [])


  // useEffect(() => {
  //   async function getDataFromDB() {

  //     const data = await getProfile("users", auth.currentUser.uid);
  //     // console.log(data)
  //     setOriginNickname(data.nickname)
  //     setNickname(data.nickname)
  //     setEmail(data.email)
  //     downloadImageFromDatabase(data)


  //   }
  //   if (auth.currentUser) {
  //     getDataFromDB();
  //   }
  // }, []);

  const [imageDatabasetaUri, setImageDatabasetaUri] = useState("");

  async function downloadImageFromDatabase(data) {
    try {
      downloadImageUri = data.imageUri
      const imageRef = ref(storage, downloadImageUri);
      const imageDownloadUri = await getDownloadURL(imageRef);
      console.log("downloaded" + imageDownloadUri)
      setImageDatabasetaUri(imageDownloadUri)



      // setDownloadImage(data.imageUri)
    } catch (error) {
      console.log(error)
      setImageDatabasetaUri('https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljfGVufDB8fDB8fHww')


    }
  }



  //add Alert for the Cancel button
  function logoutHandler() {
    Alert.alert("Cancel", "Are you going back to Login?", [
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
            setImageDatabasetaUri('https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljfGVufDB8fDB8fHww')

            // navigation.navigate("Registration")
          } catch (error) {
            console.log(error)
          }
        }
      },
    ]);
  };

  const [imageLocalUri, setImageLocalUri] = useState("");

  async function cameraFunction() {
    try {

      const checkPermission = await verifyCameraPermission();

      if (!checkPermission) {
        Alert.alert("Please give permission for the use of camera");
        return;
      }

      const useCamera = await ImagePicker.launchCameraAsync(
        { allowsEditing: true });
      // console.log(useCamera)
      console.log(useCamera.assets[0].uri)
      setImageLocalUri(useCamera.assets[0].uri)

      setOpenSaveButton(true)
      // uploadImageFromLocal(imageLocalUri)
    } catch (error) {
      console.log(error)

    }
  }

  const [openSaveButton, setOpenSaveButton] = useState(false)



  function saveImageChange() {
    uploadImageFromLocal(imageLocalUri)
    setImageLocalUri('')
  }

  async function uploadImageFromLocal(imageLocalUri) {
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


  function writeImageLinkToUser(storagePath) {
    editImageLinkInDB(auth.currentUser.uid, { imageUri: storagePath },)


  }


  // function changeNameHandler() {
  //   console.log("pressed")
  //   setNewUserDocToDB({ nickname: uploadnickname }, "users", auth.currentUser.uid)
  //   // setOriginNickname(nickname);
  //   setNickname(uploadnickname)
  //   setOpenButton(false)


  // }



  function changeNameHandler() {
    console.log("pressed")
    setNewUserDocToDB({ nickname: nickname }, "users", auth.currentUser.uid)
    // setOriginNickname(nickname);
    setNickname(nickname)
    setOpenButton(false)



  }


  function cancelchangeNameHandler(){
    setNickname(originNickname);
  }

  const [openButton, setOpenButton] = useState(false)

  const showButton = originNickname !== nickname;

  const AppStack = (
    <>
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
            <Image source={{ uri: imageLocalUri }} style={{ width: 100, height: 100 }} /> :
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

        <Text>You can change your nickname and your avatar</Text>
      </Pressable>
      {openSaveButton &&

        (<Button title="save image changes" onPress={saveImageChange}></Button>
        )
      }
      {/* <Pressable onPressIn={() => setOpenButton(!openButton)}> */}
        <InputComponent
          label="Nickname"
          value={nickname}
          onChangeText={setNickname}
          editable={true}
        />
      {/* </Pressable> */}

      {/* {openButton && (

        <InputComponent
          value={uploadnickname}
          onChangeText={setUploadNickname}
          editable={true}
        />)} */}

{showButton && (

<Button title="Change The Nickname" onPress={changeNameHandler}></Button>
)}

{showButton && (

<Button title="cancel" onPress={cancelchangeNameHandler}></Button>
)}


      {/* {openButton && (

        <Button title="Change The Nickname" onPress={changeNameHandler}></Button>)} */}

      <InputComponent
        //here is a InputComponent can show the email, but user cannot pressed or
        label="Email"
        value={email}
        editable={false}
      />

      {/* // if you can add a alert for this one? */}
      <View style={styles.buttonContainer}>
        <Button
          //a button cancel and go back to the Login screen
          title="LOG OUT"
          onPress={logoutHandler}
        />

      </View>
    </>
  )

  function loginHandler() {
    navigation.navigate('Login')
  }
  const AppAuth = (
    <>
      <Button title="Login/Signup" onPress={loginHandler}></Button>
    </>
  )

  return (
    <SafeAreaView>
      {userLoggedIn ? AppStack : AppAuth}
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

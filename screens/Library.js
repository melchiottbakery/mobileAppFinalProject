import { StyleSheet, Text, View, FlatList, Pressable, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import CountryFlag from "react-native-country-flag";
import DropDownPicker from 'react-native-dropdown-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesome6 } from '@expo/vector-icons';
import { collection, onSnapshot, } from "firebase/firestore"
import { database, auth, storage, } from "../firebase-files/FirebaseSetup"
import InputComponent from '../component/InputComponent';
import { writeWholeWordBookToDB, getProfile, editImageLinkInCover } from '../firebase-files/FirebaseHelper';
import { MaterialIcons } from '@expo/vector-icons';
import { ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import screenStyleHelper from '../styleHelperFolder/screenStyleHelper';
import colors from '../ColorHelper';

export default function Library() {

  const navigation = useNavigation();

  const [imageLocalUri, setImageLocalUri] = useState("");

  const [selectedBook, setSelectedBook] = useState('');

  const [adminTerminalOpen, setAdminTerminalOpen] = useState(false)

  const [library, setlibrary] = useState([]);
  const [isadmin, setIsadmin] = useState(false)
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const [jsonLink, setJsonLink] = useState("https://raw.githubusercontent.com/melchiottbakery/testtesttest/main/db.json")

  const [open, setOpen] = useState(false);

  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  useEffect(() => {
    async function listenonSnapshot() {
      onSnapshot(collection(database, "library"), (querySnapshot) => {
        let newArray = [];
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            newArray.push({
              ...doc.data(),
              // :imageLocalUri,
              id: doc.id
            });
          });
        };
        newlibrary(newArray);
      });
    }
    listenonSnapshot();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
        async function getDataFromDB() {
          const data = await getProfile("users", auth.currentUser.uid);
          setIsadmin(data.isAdmin)
        }
        getDataFromDB();
      }
      else {
        setUserLoggedIn(false);
        setIsadmin(false);
      }
    })
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return isadmin && adminButton
      },
    });
  },);

  function newlibrary(newArray) {
    setlibrary(newArray);
    downloadImageFromDatabase(newArray)
  }

  async function downloadImageFromDatabase(data) {
    try {
      const newData = [];
      for (const item of data) {
        if (item.imageUri) {
          const imageRef = ref(storage, item.imageUri);
          const imageDownloadUri = await getDownloadURL(imageRef);
          console.log("Downloaded: " + imageDownloadUri);
          const newItem = { ...item, imageDownloadUri };
          newData.push(newItem);
        } else {
          newData.push(item);
        }
      }
      setlibrary(newData);
    } catch (error) {
      console.error("Error downloading images: ", error);
    }
  }

  function onPressFunction({ item }) {
    console.log("whichone youare pressing", item)
    // console.log({ item , isadmin })
    navigation.navigate("WordList", { item, isadmin })
  }

  function loadJsonLinkHandler() {
    Alert.alert("Loading", "Would you like to load this book", [
      {
        text: "No",
        onPress: () => console.log("No Pressed"),
      },
      {
        text: "Yes", onPress: () => {
          console.log('jsonLink is' + jsonLink)
          fetchJsonLink(jsonLink)
        }
      },
    ]);
  }

  async function fetchJsonLink(inputText) {
    try {
      const response = await fetch(
        inputText
      );
      if (!response.ok) {
        throw new Error("data wasn't there!");
      }
      const data = await response.json()
      console.log(data)
      let newBookNativeLanguage = data[0].nativeLanguage
      let newBookNumber = data[0].number
      let newBookTitle = data[0].title
      let newBookTranslationLanguage = data[0].translationLanguage
      let newBookWordlist = data[0].wordlist

      console.log(newBookWordlist)

      writeWholeWordBookToDB({
        nativeLanguage: newBookNativeLanguage,
        number: newBookNumber,
        title: newBookTitle,
        translationLanguage: newBookTranslationLanguage
      }, newBookWordlist)

    }
    catch (error) {
      console.log("fetch users ", error);
    }
  }

  const AdminTerminal = (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.jsonContainer}>
        <View style={{ flex: 1 }}>
          <InputComponent
            label="The link of vocabulary book "
            value={jsonLink}
            onChangeText={setJsonLink}
          ></InputComponent>
        </View>
        <View>

          <TouchableOpacity onPress={loadJsonLinkHandler}>
            <MaterialIcons name="cloud-upload" size={30} color="black" />
          </TouchableOpacity>
        </View>

      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
      }}>

        <View style={{ width: "85%" }}>
          <DropDownPicker
            open={open}
            setOpen={setOpen}
            items={library.map(item => ({ label: item.id, value: item.id }))}

            style={{
              backgroundColor: '',
              marginBottom: 20,
              borderRadius: 5,
              borderColor: colors.borderColor,
              borderWidth: 3,
            }}

            textStyle={{
              fontSize: 16,
              // color: 'blue',
              // fontWeight: 'bold',
            }}
            onChangeItem={item => setSelectedId(item.value)
            }
            placeholder='Choose the book to add a cover'
            zIndex={5000}
            setValue={setSelectedBook}
            value={selectedBook}
          ></DropDownPicker>
        </View>

        <TouchableOpacity onPress={cameraFunction}>
          <Entypo name="camera" size={30} color="black" />
        </TouchableOpacity>

      </View>
      {imageLocalUri && (<Image source={{ uri: imageLocalUri }} style={{ width: 100, height: 100, zIndex: -1 }} />
      )
      }
      {imageLocalUri && selectedBook &&
        (
          <View>
            <TouchableOpacity style={{ zIndex: -1 }} onPress={saveImageChange}>
              <FontAwesome5 style={{ zIndex: -1 }} name="file-upload" size={30} color="black" />
            </TouchableOpacity>
          </View>)}
    </View>
  )

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
  function saveImageChange() {
    uploadImageFromLocal(imageLocalUri)
    setImageLocalUri('');
  }

  async function uploadImageFromLocal(imageLocalUri) {
    try {
      const response = await fetch(imageLocalUri);
      // console.log("uploadImageFromLocal is",response)
      const imageBlob = await response.blob();
      // console.log(blob)
      const imageName = imageLocalUri.substring(imageLocalUri.lastIndexOf('/') + 1);
      const imageRef = await ref(storage, `bookCover/${imageName}`)
      const uploadResult = await uploadBytes(imageRef, imageBlob);
      console.log("upload successed")
      console.log(uploadResult.metadata.fullPath)
      writeImageLinkToBook(uploadResult.metadata.fullPath)
    } catch (error) {
      console.log(error)
    }
  }

  function writeImageLinkToBook(storagePath) {
    editImageLinkInCover(selectedBook, { imageUri: storagePath },)
  }

  async function cameraFunction() {
    try {
      const checkPermission = await verifyCameraPermission();
      if (!checkPermission) {
        Alert.alert("Please give permission for the use of camera");
        return;
      }
      const useCamera = await ImagePicker.launchCameraAsync(
        { allowsEditing: true });
      setImageLocalUri(useCamera.assets[0].uri)
    } catch (error) {
      console.log(error)

    }
  }

  const renderItemUser = ({ item }) => (
    <Pressable onPress={() => onPressFunction({ item })} style={styles.pressable}>
      <View>
        {item.imageDownloadUri && <Image source={{ uri: item.imageDownloadUri }} style={{ width: "100%", height: 100 }} />}
        <Text>Title: {item.title}</Text>
        <Text>Word Numbers: {item.number}</Text>
        <View style={styles.flagContainer}>
          <View>
            <CountryFlag isoCode={item.nativeLanguage} size={25} />
          </View>
          <Text>={'>'}</Text>
          <View>
            <CountryFlag isoCode={item.translationLanguage} size={25} />
          </View>
        </View>

      </View>
    </Pressable>
  );


  const renderItemAdmin = ({ item }) => (
    <Pressable onPress={() => onPressFunction({ item })} style={styles.pressable}>
      <View>
        {item.imageDownloadUri && <Image source={{ uri: item.imageDownloadUri }} style={{ width: "100%", height: 100 }} />}
        <Text>ID: {item.id}</Text>
        <Text>Title: {item.title}</Text>
        <Text>Native Language: {item.nativeLanguage}</Text>
        <Text>Word Numbers: {item.number}</Text>
        <Text>Word Language: {item.translationLanguage}</Text>

        <View style={styles.flagContainer}>
          <View>
            <CountryFlag isoCode={item.nativeLanguage} size={25} />
          </View>
          <Text>={'>'}</Text>
          <View>
            <CountryFlag isoCode={item.translationLanguage} size={25} />
          </View>
        </View>
      </View>
    </Pressable>
  );

  const adminButton = (
    <>
      <TouchableOpacity onPress={() => setAdminTerminalOpen(!adminTerminalOpen)}>
        <FontAwesome6 name="computer" size={30} color="black" />
      </TouchableOpacity>
    </>
  )

  return (
    <View style={screenStyleHelper.container}>
      <View style={screenStyleHelper.padding5}>
        <Text style={screenStyleHelper.textFontSize}>All vocabulary books will be displayed here.</Text>
      </View>
      <View>
        {isadmin && (
          <>
            {adminTerminalOpen && AdminTerminal}
          </>
        )}
      </View>

      {isadmin ? <FlatList numColumns='3'
        style={{ zIndex: -1 }}
        horizontal={false}
        data={library}
        renderItem={renderItemAdmin}
        keyExtractor={(item, index) => index.toString()}
      /> : <FlatList numColumns='3'
        horizontal={false}
        data={library}
        renderItem={renderItemUser}
        keyExtractor={(item, index) => index.toString()}
      />}
    </View>
  )
}

const styles = StyleSheet.create({

  pressable: {
    margin: 5,
    padding: 5,
    borderColor: colors.borderColor,
    borderWidth: 3,
    width: '30%',
  },

  flagContainer: {
    flexDirection: 'row',
    justifyContent: "space-around",
    alignItems: 'center',
  },

  jsonContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },

})
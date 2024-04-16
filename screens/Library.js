import { StyleSheet, Text, View, FlatList, Pressable, Button,Image } from 'react-native'
import { SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import CountryFlag from "react-native-country-flag";
import DropDownPicker from 'react-native-dropdown-picker';

import { collection, onSnapshot, } from "firebase/firestore"
import { database, auth,storage } from "../firebase-files/FirebaseSetup"
import InputComponent from '../component/InputComponent';
import { writeNewWordBookToDB, writeWholeWordBookToDB,getProfile,editImageLinkInCover } from '../firebase-files/FirebaseHelper';

import { ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";

import * as ImagePicker from 'expo-image-picker';
import { editImageLinkInDB, setNewUserDocToDB } from "../firebase-files/FirebaseHelper";

export default function Library({route}) {
  
  const navigation = useNavigation();


  const [imageDatabasetaUri, setImageDatabasetaUri] = useState('');
  const [imageLocalUri, setImageLocalUri] = useState("");

  const [library, setlibrary] = useState([]);

  useEffect(() => {
    async function listenonSnapshot(){
    onSnapshot(collection(database, "library"), (querySnapshot) => {
      let newArray = [];
      if (querySnapshot) {
        querySnapshot.forEach((doc) => {
          // console.log(doc.data().imageUri)
          // const nihao =  downloadImageFromDatabase(doc.data().imageUri)
          // console.log("nihao+",nihao)
          newArray.push({ ...doc.data(),
            // downloaduri:imageLocalUri,
             id: doc.id });
        });
      };
      newlibrary(newArray);
      // setlibrary(newArray);
    });}

listenonSnapshot();

  }, []);

  function newlibrary(newArray){
    setlibrary(newArray);
    
    downloadImageFromDatabase(newArray)

  }

  useEffect(()=>{console.log("library is",library)})



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

  const [isadmin,setIsadmin]=useState(false)

  useEffect(() => {
    async function getDataFromDB() {
      const data = await getProfile("users", auth.currentUser.uid);
      // console.log(data)
      setIsadmin(data.isAdmin)
    }
    getDataFromDB();
  }, []);

  function onPressFunction({item}){
    console.log("whichone youare pressing",item)
    // console.log({ item,isadmin})
    navigation.navigate("WordList", { item,isadmin})
    

  }

  const renderItem = ({ item }) => (
    <Pressable onPress={()=>onPressFunction({item})}
    style={{margin:5, padding: 5, borderColor: "red", borderWidth: 3,width:'30%' }}>  
    <View 
    // style={{margin:5, padding: 5, borderColor: "red", borderWidth: 3,width:'50%' }}
    >
    {item.imageDownloadUri && <Image source={{ uri: item.imageDownloadUri }} style={{ width: 100, height: 100 }} />}
      <Text>ID: {item.id}</Text>
      <Text>Title: {item.title}</Text>
      <Text>Native Language: {item.nativeLanguage}</Text>
      <Text>Number: {item.number}</Text>
      <Text>Word Language: {item.translationLanguage}</Text>
      <CountryFlag isoCode={item.nativeLanguage} size={25} />
      <CountryFlag isoCode={item.translationLanguage} size={25} />
    </View>
    </Pressable>
  );

  const [jsonLink, setJsonLink]=useState(   "https://raw.githubusercontent.com/melchiottbakery/testtesttest/main/db.json")
  function loadJsonLinkHandler(){
    console.log('jsonLink is'+ jsonLink)
    fetchJsonLink(jsonLink)
  }
  // "https://raw.githubusercontent.com/melchiottbakery/testtesttest/main/db.json"
  // 'https://my-json-server.typicode.com/melchiottbakery/testtesttest/db.json' 


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
    let newBookNativeLanguage= data[0].nativeLanguage
    let newBookNumber= data[0].number
    let newBookTitle= data[0].title
    let newBookTranslationLanguage = data[0].translationLanguage
    let newBookWordlist= data[0].wordlist

    console.log(newBookWordlist)

    writeWholeWordBookToDB({nativeLanguage:newBookNativeLanguage,
      number:newBookNumber,
      title:newBookTitle,
      translationLanguage:newBookTranslationLanguage
    },newBookWordlist)

    } 
    catch (error) {
      console.log("fetch users ", error);
    }   
  }
  const [selectedBook, setSelectedBook] = useState('');


  
  const [adminTerminalOpen, setAdminTerminalOpen] =useState(false)

  const data=[{"id": "lXSKbJZFeqUbxf6f6F36", "nativeLanguage": "JP", "number": "3", "title": "JLPT-N2", "translationLanguage": "GB"}, {"id": "uNICsDT6tueasDidHB28", "nativeLanguage": "JP", "number": "2", "title": "JLPT-N5", "translationLanguage": "GB"}, {"id": "wrHWJ0EHDTAuPx71QFOD", "nativeLanguage": "JP", "number": "3", "title": "JLPT-N2", "translationLanguage": "GB"}, {"id": "wuBgTqXRkn31h5MY0W9t", "nativeLanguage": "JP", "number": "3", "title": "JLPT-N2", "translationLanguage": "GB"}, {"id": "wxhsT6QkmImt4ewQth5Q", "nativeLanguage": "JP", "number": "3", "title": "JLPT-N2", "translationLanguage": "GB"}]
  const [open, setOpen] = useState(false);
  const AdminTerminal= (
    <View>
    <InputComponent
      label="link"
      value={jsonLink}
      onChangeText={setJsonLink}
    ></InputComponent>
    <Button title='load the book' onPress={loadJsonLinkHandler}></Button>

<DropDownPicker
open={open}
setOpen={setOpen}
items={library.map(item => ({ label: item.id, value: item.id }))}
        containerStyle={{ height: 40, width: 200 }}
        style={{ backgroundColor: '#fafafa' }}
        dropDownStyle={{ backgroundColor: '#fafafa' }}
        onChangeItem={item => setSelectedId(item.value)
        }

        zIndex={1000}

        setValue={setSelectedBook}
        value={selectedBook}
></DropDownPicker>

<Button title= "nihao" onPress={cameraFunction}></Button>

{imageLocalUri &&(  <Image source={{ uri: imageLocalUri }} style={{ width: 100, height: 100 }} />
)
}
<Button title="save image changes" onPress={saveImageChange}></Button>
  </View>

  )
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

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
      const imageRef = await ref(storage, `bookCover/${imageName}`)
      const uploadResult = await uploadBytes(imageRef, imageBlob);
      console.log("upload successed")
      

      // setImageLocalUri('')
      // setOpenSaveButton(false)

      // return 
      console.log(uploadResult.metadata.fullPath)
      writeImageLinkToBook(uploadResult.metadata.fullPath)
    } catch (error) {
      console.log(error)
    }

  }  


  function writeImageLinkToBook(storagePath){
    editImageLinkInCover(selectedBook,{imageUri:storagePath},)
  
   
  }
  



  async function cameraFunction(){
    try {

      const checkPermission = await verifyCameraPermission();

      if (!checkPermission){
        Alert.alert("Please give permission for the use of camera");
        return;
    }

      const useCamera =  await ImagePicker.launchCameraAsync(
        {allowsEditing: true});
      console.log("have use camera",useCamera)
      // console.log(useCamera.assets[0].uri)
      setImageLocalUri(useCamera.assets[0].uri)
      // uploadImageFromLocal(imageLocalUri)
    } catch (error) {
      console.log(error)
      
    }
  }

  return (
    
    <View style={{flex:1}}> 

{isadmin && (
        <>
          <Button title="open admin terminal" onPress={()=>setAdminTerminalOpen(!adminTerminalOpen)}></Button>
          {adminTerminalOpen && AdminTerminal }
        </>
      )}
      
   {/* {isadmin && AdminButton} */}

      <FlatList numColumns='3' 
      horizontal={false}
      data={library}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />

    
    </View>
  )
}

const styles = StyleSheet.create({})
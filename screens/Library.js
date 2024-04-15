import { StyleSheet, Text, View, FlatList, Pressable, Button } from 'react-native'
import { SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import CountryFlag from "react-native-country-flag";

// import {query,where } from "firebase/firestore";

import { collection, onSnapshot, } from "firebase/firestore"
import { database, auth } from "../firebase-files/FirebaseSetup"
import InputComponent from '../component/InputComponent';
import { writeNewWordBookToDB, writeWholeWordBookToDB,getProfile } from '../firebase-files/FirebaseHelper';
// import {auth} from 

export default function Library({route}) {
  
  const navigation = useNavigation();

  const [library, setlibrary] = useState([]);

  useEffect(() => {
    onSnapshot(collection(database, "library"), (querySnapshot) => {
      let newArray = [];
      if (querySnapshot) {
        querySnapshot.forEach((doc) => {
          newArray.push({ ...doc.data(), id: doc.id });
        });
      };
      setlibrary(newArray);
    });
  }, []);

  // useEffect(() => {
  //   onSnapshot(console.log(route));
  // });
  

  // console.log(library)

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

  // fetch('https://raw.githubusercontent.com/melchiottbakery/testtesttest/main/word.json')
  //     .then(response => response.json())
  //     .then(json => console.log(json))

  // const [jsonLink, setJsonLink]=useState("https://jsonplaceholder.typicode.com/users")
  const [jsonLink, setJsonLink]=useState(   "https://raw.githubusercontent.com/melchiottbakery/testtesttest/main/db.json")
  function loadJsonLinkHandler(){
    console.log('jsonLink is'+ jsonLink)
    fetchJsonLink(jsonLink)
  }
  "https://raw.githubusercontent.com/melchiottbakery/testtesttest/main/db.json"
  'https://my-json-server.typicode.com/melchiottbakery/testtesttest/db.json' 


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

    ///can use later 
    // writeNewWordBookToDB(
    //   {nativeLanguage:newBookNativeLanguage,
    //     number:newBookNumber,
    //     title:newBookTitle,
    //     translationLanguage:newBookTranslationLanguage
    //   })


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


  const [adminTerminalOpen, setAdminTerminalOpen] =useState(false)

  const AdminTerminal= (
    <View>
    <Text>This is the Library screen</Text>
    <InputComponent
      label="link"
      value={jsonLink}
      onChangeText={setJsonLink}
    ></InputComponent>
    <Button title='load the book' onPress={loadJsonLinkHandler}></Button>
  </View>

  )

  return (
    
    <View style={{flex:1}}> 

{isadmin && (
        <>
          <Button title="open admin terminal" onPress={()=>setAdminTerminalOpen(!adminTerminalOpen)}></Button>
          {adminTerminalOpen && AdminTerminal }
        </>
      )}
      
   {/* {isadmin && AdminButton} */}

      <Text>This is the Library screen</Text>
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
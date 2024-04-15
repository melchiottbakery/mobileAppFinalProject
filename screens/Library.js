import { StyleSheet, Text, View, FlatList, Pressable, Button } from 'react-native'
import { SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import CountryFlag from "react-native-country-flag";

import { collection, onSnapshot } from "firebase/firestore"
import { database } from "../firebase-files/FirebaseSetup"
import InputComponent from '../component/InputComponent';
import { writeNewWordBookToDB, writeWholeWordBookToDB } from '../firebase-files/FirebaseHelper';

export default function Library() {
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

  // console.log(library)

  function onPressFunction({item}){
    console.log("whichone youare pressing",item)
    navigation.navigate("WordList", { item })
    

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



  return (
    <View style={{flex:1}}> 
      <View>
        <Text>This is the Library screen</Text>
        <InputComponent
          label="link"
          value={jsonLink}
          onChangeText={setJsonLink}
        ></InputComponent>
        <Button title='load the book' onPress={loadJsonLinkHandler}></Button>
      </View>
   
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
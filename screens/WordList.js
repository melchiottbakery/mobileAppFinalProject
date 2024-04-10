import { StyleSheet, Text, View, FlatList,Button } from 'react-native'
import { SafeAreaView } from 'react-native'
import { Pressable } from "react-native";
import React, { useEffect, useState } from 'react'

import { auth } from '../firebase-files/FirebaseSetup';

import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../firebase-files/FirebaseSetup"
import { writeToDB,writeNewWordToUserDB } from "../firebase-files/FirebaseHelper";


export default function WordList({route}) {

  // console.log("the item is ",route)
  const worldBookName = route.params.item.name
  const worldBookid = route.params.item.id
  const userId=auth.currentUser.uid

  // console.log(route.params.item.name)
  const [library, setlibrary] = useState([]);

  useEffect(() => {
    onSnapshot(collection(database, "library", worldBookid, "wordlist"), (querySnapshot) => {
      let newArray = [];
      if (querySnapshot) {
        querySnapshot.forEach((doc) => {
          newArray.push({ ...doc.data(), id: doc.id });
        });
      };
      setlibrary(newArray);
    });
  }, []);




  function onPressFunction({item}){

   
    const newWord = {
      nativeWord: item.nativeWord,
      translationMeaning: item.translationMeaning,
      remember: false,
   
    };

    // console.log("new word is",newWord)


    // setNewWord([...word, newWord]);
    // console.log(word)
    // writeToDB(newWord);
    writeNewWordToUserDB(newWord,userId)

  }

  const renderItem = ({ item }) => (
  
    

    <View style={{ padding: 30, borderColor: "green", borderWidth: 1 }}>
      <Text>ID: {item.id}</Text>
      <Text>nativeWord: {item.nativeWord}</Text>
      <Text>translationMeaning: {item.translationMeaning}</Text>
      <Button title="add" onPress={()=>onPressFunction({item})} />

      {/* <Pressable onPress={()=>{onPressFunction()}}>
        <Text>nihao</Text></Pressable> */}
      
    </View>
  );

  // //next time use this api to add database
  // fetch('https://raw.githubusercontent.com/melchiottbakery/testtesttest/main/word.json')
  //     .then(response => response.json())
  //     .then(json => console.log(json))

  return (
    <View>
      <Text>This is the wordlist screen</Text>
      <FlatList
      data={library}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
    </View>
  )
}

const styles = StyleSheet.create({})
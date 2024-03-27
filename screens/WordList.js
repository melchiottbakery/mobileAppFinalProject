import { StyleSheet, Text, View, FlatList,Button } from 'react-native'
import { SafeAreaView } from 'react-native'
import { Pressable } from "react-native";
import React, { useEffect, useState } from 'react'


import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../firebase-files/FirebaseSetup"

export default function WordList({route}) {

  console.log("the item is ",route)
  const worldBookName = route.params.item.name
  const worldBookid = route.params.item.id

  console.log(route.params.item.name)
  const [library, setlibrary] = useState([]);

  useEffect(() => {
    onSnapshot(collection(database, "public", worldBookid, "wordlist"), (querySnapshot) => {
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
    // console.log("add")
    console.log(item.id)
    audioUrl='https://dict.youdao.com/dictvoice?le=jap&type3&audio=%27%E5%A4%A9%E5%AE%89%E9%96%80'
    const fetchSound = fetch(audioUrl);
    fetchSound.then(response => {
      if (response.ok) {
        console.log("ok")
        return response.blob();
      }
      throw new Error('Network response was not ok.');
    })

    // fetch('https://raw.githubusercontent.com/melchiottbakery/testtesttest/main/word.json')

  }
  // const handleButtonPress = () => {
  //   navigation.navigate('WebPage', { id: id });
  // };

  const renderItem = ({ item }) => (
  
    

    <View style={{ padding: 30, borderColor: "green", borderWidth: 1 }}>
      <Text>ID: {item.id}</Text>
      <Text>nativeword: {item.nativeword}</Text>
      <Text>meaning: {item.meaning}</Text>
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
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import CountryFlag from "react-native-country-flag";

import { collection, onSnapshot } from "firebase/firestore"
import { database } from "../firebase-files/FirebaseSetup"

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
    <Pressable onPress={()=>onPressFunction({item})}>  
    <View style={{ padding: 30, borderColor: "red", borderWidth: 3 }}>
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

  return (
    <View>
      <Text>This is the Library screen</Text>
      <FlatList
      data={library}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
    </View>
  )
}

const styles = StyleSheet.create({})
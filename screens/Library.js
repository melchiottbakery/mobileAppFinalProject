import { StyleSheet, Text, View, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'


import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../firebase-files/FirebaseSetup"

export default function Library() {
  const [library, setlibrary] = useState([]);

  useEffect(() => {
    onSnapshot(collection(database, "public"), (querySnapshot) => {
      let newArray = [];
      if (querySnapshot) {
        querySnapshot.forEach((doc) => {
          newArray.push({ ...doc.data(), id: doc.id });
        });
      };
      setlibrary(newArray);
    });
  }, []);

  console.log(library)

  const renderItem = ({ item }) => (
    
    <View style={{ padding: 10 }}>
      <Text>ID: {item.id}</Text>
      <Text>Name: {item.name}</Text>
      <Text>Native Language: {item.navtivelanguage}</Text>
      <Text>Number: {item.number}</Text>
      <Text>Word Language: {item.wordlanguage}</Text>
    </View>
  );
  fetch('https://raw.githubusercontent.com/melchiottbakery/testtesttest/main/word.json')
      .then(response => response.json())
      .then(json => console.log(json))

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
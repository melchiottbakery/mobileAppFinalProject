import { StyleSheet, Text, View, FlatList, Pressable, Button, Alert } from 'react-native'
import { SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';



import { collection, onSnapshot } from "firebase/firestore"
import { database } from "../firebase-files/FirebaseSetup"
import { deleteFromDB, editInDB, editRememberInDB } from '../firebase-files/FirebaseHelper';

import { auth } from '../firebase-files/FirebaseSetup';

export default function MyList() {

  const userId=auth.currentUser.uid
  const [library, setlibrary] = useState([]);

  useEffect(() => {
    //need to fix if there is as the new user registeration, there is no collection called wordlist

    try {
      onSnapshot(collection(database, "users",auth.currentUser.uid,'wordlist'), (querySnapshot) => {
        let newArray = [];
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            newArray.push({ ...doc.data(), id: doc.id });
          });
        };
        setlibrary(newArray);
      });
  
    } catch (error) {
      console.log(error)
    }
 


  }, []);

  function onPressFunction({item}){
    console.log(item)

    const rememberWord = {
      translationMeaning: item.translationMeaning,
      nativeWord: item.nativeWord,
      remember: true,
  };
  editRememberInDB(item.id,userId,rememberWord)
  // editInDB(item.id, rememberWord);
  }

  function onDeleteFunction({item}) {
    Alert.alert(
        'Confirmation',
        'Are you sure you want to delete this remembered word?',
        [
            {
                text: 'Cancel',
                onPress: () => { },
            },
            {
                text: 'Delete',
                onPress: deleteAction,
            },
        ]
    );

    function deleteAction() {
        try {
            deleteFromDB(item.id);
            // navigation.goBack();
        }
        catch (error) {
            Alert.alert('Error', error);
        }
    };
}


  function onForgetFunction({item}){
    console.log(item)

    const forgetWord = {
      // translationMeaning: item.translationMeaning,
      // nativeWord: item.nativeWord,
      
      remember: false,
  };
  editRememberInDB(item.id,userId,forgetWord)

  // editInDB(item.id, forgetWord);
  }

  const renderItem = ({ item }) => (
    <Pressable >
    
    <View style={{ padding: 30, borderColor: "blue", borderWidth: 3 }}>
      <Text>ID: {item.id}</Text>
      <Text>nativeword: {item.nativeWord}</Text>
      <Text>meaning: {item.translationMeaning}</Text>
      <Text>remember: {String(item.remember)}</Text>

      {item.remember === false && ( // Check if item.remember is false
    <Button title=" MARK AS REMEBERED" onPress={() => onPressFunction({item})} />
    
  )}
  {item.remember === true && ( // Check if item.remember is false
    <Button title="i need review again" onPress={() => onForgetFunction({item})} />

  )}

{item.remember === true && ( // Check if item.remember is false
    <Button color='red' title="Delete" onPress={() => onDeleteFunction({item})} />
  )}
      {/* <Button title="marker" onPress={()=>onPressFunction({item})} /> */}



    </View>
    </Pressable>
  );


  return (
    <View>
    <Text>This is the my screen</Text>
    <FlatList
    data={library}
    renderItem={renderItem}
    keyExtractor={(item, index) => index.toString()}
  />
  </View>
  )
}

const styles = StyleSheet.create({})
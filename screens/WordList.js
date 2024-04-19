import { StyleSheet, Text, View, FlatList, Button, Alert,TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native'
import { Pressable } from "react-native";
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

import { auth } from '../firebase-files/FirebaseSetup';

import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../firebase-files/FirebaseSetup"
import { writeToDB, writeNewWordToUserDB, deleteBookFromLibraryDB, deleteCollection } from "../firebase-files/FirebaseHelper";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WordList({ route }) {
  const navigation = useNavigation();

  // console.log("the item is ",route)
  const worldBookName = route.params.item.name
  const wordBookid = route.params.item.id
  const isadmin = route.params.isadmin
  // const userId = auth.currentUser.uid

  // console.log(route.params.item.name)
  const [library, setlibrary] = useState([]);
  const [deleteLink, setDeleteLink]= useState("")

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return  isadmin && deleteButton;
// isadmin && <Button title="delete" onPress={deleteHandler} />;
      },
    });
  }, []);


  const deleteButton =(
    <>
     <TouchableOpacity onPress={deleteHandler}>
     <MaterialCommunityIcons name="delete-alert" size={30} color="red" />
      </TouchableOpacity>
    
    </>

  )

  useEffect(() => {
    onSnapshot(collection(database, "library", wordBookid, "wordlist"), (querySnapshot) => {
      let newArray = [];
      if (querySnapshot) {
        querySnapshot.forEach((doc) => {
          newArray.push({ ...doc.data(), id: doc.id });
        });
      };
      setlibrary(newArray);
      setDeleteLink(wordBookid);
    });
  }, []);




  function onPressFunction({ item }) {
    const newWord = {
      nativeWord: item.nativeWord,
      translationMeaning: item.translationMeaning,
      remember: false,
      nativeWordShow: true,
      translationMeaningShow: true,

    };

    // console.log("new word is",newWord)


    // setNewWord([...word, newWord]);
    // console.log(word)
    // writeToDB(newWord);
    if(auth.currentUser){
    writeNewWordToUserDB(newWord, auth.currentUser.uid)}

  }

  const addButton =(
    <>
     <TouchableOpacity onPress={() => onPressFunction({ item })}>
     <AntDesign name="pluscircleo" size={24} color="black" />
     {/* <MaterialIcons name="add-alarm" size={30} color="black" /> */}
    </TouchableOpacity>
    
    </>

  )

  const renderItemUser = ({ item }) => (



    <View style={{ padding: 30, borderColor: "green", borderWidth: 1 }}>
      <Text>ID: {item.id}</Text>
      <Text>nativeWord: {item.nativeWord}</Text>
      <Text>translationMeaning: {item.translationMeaning}</Text>

      {/* {auth.currentUser && addButton} */}


      {auth.currentUser && <Button title="add" onPress={() => onPressFunction({ item })} />}
    </View>
  );


  const renderItemAdmin = ({ item }) => (



    <View style={{ padding: 30, borderColor: "green", borderWidth: 1 }}>
      <Text>ID: {item.id}</Text>
      <Text>nativeWord: {item.nativeWord}</Text>
      <Text>translationMeaning: {item.translationMeaning}</Text>

      {auth.currentUser && addButton}

      {/* {auth.currentUser && <Button title="add" onPress={() => onPressFunction({ item })} />} */}
    </View>
  );

  function deleteHandler() {
    Alert.alert("Delete", "Are you going to delete ?", [
      {
        text: "No",
        onPress: () => console.log("No Pressed"),
      },
      {
        text: "Yes", onPress: () => {
          // console.log("deletbuttonpress")
          // console.log(wordBookid)
          deleteCollection(wordBookid)
          deleteBookFromLibraryDB(wordBookid)
          navigation.goBack()
        }
      },
    ]);
  }

  return (
    <View styles={{flex:1}}>
      <Text>This is the wordlist screen</Text>
      {!auth.currentUser && <Text>You can add the word and play the pronounciation when you log in</Text> }

      {/* {isadmin && <Button title="delete the whole book" onPress={deleteHandler}></Button>} */}
      {isadmin &&<FlatList
        data={library}
        renderItem={renderItemAdmin}
        keyExtractor={(item, index) => index.toString()}
      />}
      {!isadmin && <FlatList
        data={library}
        renderItem={renderItemUser}
        keyExtractor={(item, index) => index.toString()}
      />}
    </View>
  )
}

const styles = StyleSheet.create({})
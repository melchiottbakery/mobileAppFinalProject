import { StyleSheet, Text, View, FlatList, Button, Alert, TouchableOpacity } from 'react-native'

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

  const worldBookName = route.params.item.name
  const wordBookid = route.params.item.id
  const isadmin = route.params.isadmin

  const [library, setlibrary] = useState([]);
  const [deleteLink, setDeleteLink] = useState("")

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return isadmin && deleteButton;
      },
    });
  }, []);

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

  const deleteButton = (
    <>
      <TouchableOpacity onPress={deleteHandler}>
        <MaterialCommunityIcons name="delete-alert" size={30} color="red" />
      </TouchableOpacity>
    </>
  )

  function onPressFunction({ item }) {
    const newWord = {
      nativeWord: item.nativeWord,
      translationMeaning: item.translationMeaning,
      remember: false,
      nativeWordShow: true,
      translationMeaningShow: true,

    };
    if (auth.currentUser) {
      writeNewWordToUserDB(newWord, auth.currentUser.uid)
    }
  }

  const renderItemUser = ({ item }) => (
    <View style={{
      padding: 20, margin: 3, borderColor: "#B88956", borderWidth: 2,
      flexDirection: 'row', flex: 1,
      alignItems: 'center',
      // justifyContent: 'center',
    }}>
      {auth.currentUser && (
        <View>
          <TouchableOpacity onPress={() => onPressFunction({ item })}>
            <AntDesign name="pluscircleo" size={24} color="black" />
            {/* <MaterialIcons name="add-alarm" size={30} color="black" /> */}
          </TouchableOpacity>
        </View>
      )}
      <View style={{ paddingLeft: 20 }}>
        <Text style={{ fontSize: 25 }}>Word: {item.nativeWord}</Text>
        <Text style={{ fontSize: 20 }}>Meaning: {item.translationMeaning}</Text>
      </View>
    </View>
  );

  const renderItemAdmin = ({ item }) => (
    <View style={{
      padding: 20, margin: 3, borderColor: "#B88956", borderWidth: 2,
      flexDirection: 'row', flex: 1,
      alignItems: 'center',
      // justifyContent: 'center',
    }}>
      {auth.currentUser &&
        (
          <View>
            <TouchableOpacity onPress={() => onPressFunction({ item })}>
              <AntDesign name="pluscircleo" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )
      }
      <View style={{ paddingLeft: 20 }}>
        <Text>ID: {item.id}</Text>
        <Text>nativeWord: {item.nativeWord}</Text>
        <Text>translationMeaning: {item.translationMeaning}</Text>
      </View>

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
    <View style={styles.container}>
      <View style={{ padding: 5 }}>

        {!auth.currentUser && <Text style={{ fontSize: 16 }}>You can add the word and play the pronunciation when you are logged in</Text>}
      </View>

      {isadmin && <FlatList
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

const styles = StyleSheet.create({

  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFE2C2"
  },

})
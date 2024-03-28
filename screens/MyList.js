import { StyleSheet, Text, View, FlatList, Pressable, Button, Alert } from 'react-native'
import { SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';



import { collection, onSnapshot } from "firebase/firestore"
import { database } from "../firebase-files/FirebaseSetup"
import { deleteFromDB, editInDB } from '../firebase-files/FirebaseHelper';

export default function MyList() {

  const [library, setlibrary] = useState([]);

  useEffect(() => {
    onSnapshot(collection(database, "usertest"), (querySnapshot) => {
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
    console.log(item)

    const newActivity = {
      meaning: item.meaning,
      nativeword: item.nativeword,
      
      remember: true,
  };

  editInDB(item.id, newActivity);
  }

  function onDeleteFunction({item}) {
    Alert.alert(
        'Confirmation',
        'Are you sure you want to delete this activity?',
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

    const newActivity = {
      meaning: item.meaning,
      nativeword: item.nativeword,
      
      remember: false,
  };

  editInDB(item.id, newActivity);
  }

  const renderItem = ({ item }) => (
    <Pressable >
    
    <View style={{ padding: 30, borderColor: "blue", borderWidth: 3 }}>
      <Text>ID: {item.id}</Text>
      <Text>nativeword: {item.nativeword}</Text>
      <Text>meaning: {item.meaning}</Text>
      <Text>remember: {String(item.remember)}</Text>
      {item.remember === false && ( // Check if item.remember is false
    <Button title="nihao" onPress={() => onPressFunction({item})} />
    
  )}
  {item.remember === true && ( // Check if item.remember is false
    <Button title="i need review again" onPress={() => onForgetFunction({item})} />

   

  )}

{item.remember === true && ( // Check if item.remember is false
    <Button title="Delete" onPress={() => onDeleteFunction({item})} />
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
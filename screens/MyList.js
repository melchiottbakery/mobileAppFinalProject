import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Button,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import NotificationManager from "../component/NotificationManager";


import { collection, onSnapshot, query } from "firebase/firestore";
import { database } from "../firebase-files/FirebaseSetup";
import {
  deleteFromDB,
  deleteWordFromUserDB,
  editInDB,
  editRememberInDB,
  writeAllAnkiToDB,
  writeAnkiToDB,
  writeAntiAnkiToDB,
  writeClearAnkiToDB,
} from "../firebase-files/FirebaseHelper";
import { MaterialIcons } from '@expo/vector-icons';

import { auth } from "../firebase-files/FirebaseSetup";
import AudioManager from "../component/AudioManager";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function MyList() {
  const userId = auth.currentUser.uid;
  const [library, setlibrary] = useState([]);
  const navigation = useNavigation();


  useEffect(() => {
    //need to fix if there is as the new user registeration, there is no collection called wordlist

    try {
      onSnapshot(
        collection(database, "users", auth.currentUser.uid, "wordlist"),
        (querySnapshot) => {
          let newArray = [];
          if (querySnapshot) {
            querySnapshot.forEach((doc) => {
              newArray.push({
                ...doc.data(),
                id: doc.id,
              });
            });
          }
          setlibrary(newArray);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(library);



  function onPressFunction({ item }) {
    // console.log(item)

    const rememberWord = {
      translationMeaning: item.translationMeaning,
      nativeWord: item.nativeWord,
      remember: true,
    };
    editRememberInDB(item.id, userId, rememberWord);
    // editInDB(item.id, rememberWord);
  }

  function onDeleteFunction({ item }) {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this remembered word?",
      [
        {
          text: "Cancel",
          onPress: () => { },
        },
        {
          text: "Delete",
          onPress: deleteAction,
        },
      ]
    );

    function deleteAction() {
      try {
        // deleteFromDB(item.id);
        // navigation.goBack();
        deleteWordFromUserDB(item.id, userId);
      } catch (error) {
        Alert.alert("Error", error);
      }
    }
  }

  function onForgetFunction({ item }) {
    // console.log(item)

    const forgetWord = {
      // translationMeaning: item.translationMeaning,
      // nativeWord: item.nativeWord,

      remember: false,
    };
    editRememberInDB(item.id, userId, forgetWord);

    // editInDB(item.id, forgetWord);
  }
  //   const [showText, setShowText] = useState(false);

  //  function  presshandler({remember}){
  // setShowText(true);
  //  }

  function showTranslationMeaning({ item }) {
    console.log("which one will you change", item);

    const translationMeaningShow = {
      translationMeaningShow: !item.translationMeaningShow,
    };
    editRememberInDB(item.id, userId, translationMeaningShow);
    // editInDB(item.id, rememberWord);
  }

  function showNativeMeaning({ item }) {
    // console.log(item)

    const nativeWordShow = {
      nativeWordShow: !item.nativeWordShow,
    };
    editRememberInDB(item.id, userId, nativeWordShow);
    // console.log('show nativemeaning pressed')

    // editInDB(item.id, rememberWord);
  }



  const renderItem = ({ item }) => (
    <Pressable>
      <View style={{ padding: 30, borderColor: "blue", borderWidth: 3 }}>
        <Text>ID: {item.id}</Text>
        <Text>nativeword: {item.nativeWord}</Text>
        <Button
          title="change nativeWordShow"
          onPress={() => showNativeMeaning({ item })}
        ></Button>


        <Button
          title="change translationMeaningShow"
          onPress={() => showTranslationMeaning({ item })}
        ></Button>

        {!item.nativeWordShow && <Text>show the nativeWord</Text>}
        {item.nativeWordShow && <Text>meaning: {item.nativeWord}</Text>}


        {/* <Button title="change showNative" onPress={() => showNativeHandler({ item })}></Button>

{!item.showNative && <Text>show the nativeWord</Text>}
{item.showNative && <Text>meaning: {item.nativeWord}</Text>}
<Text>nativeWordShow: {String(item.showNative)}</Text> */}


        {/* <Button title="change showTranslation" onPress={() => showTranslationHandler({ item })}></Button>
        {!item.showTranslation && <Text>show the translationMeaning</Text>}
{item.showTranslation && <Text>meaning: {item.translationMeaning}</Text>}
<Text>nativeWordShow: {String(item.showTranslation)}</Text> */}

        {!item.translationMeaningShow && <Text>show the translationMeaning</Text>}
        {item.translationMeaningShow && <Text>meaning: {item.translationMeaning}</Text>}

        {/* <Text>meaning: {item.translationMeaning}</Text> */}

        <Text>nativeWordShow: {String(item.nativeWordShow)}</Text>

        <Text>translationMeaningShow: {String(item.translationMeaningShow)}</Text>

        <Text>remember: {String(item.remember)}</Text>
        <AudioManager wordToSound={item.id}></AudioManager>

        {item.remember === false && ( // Check if item.remember is false
          <Button
            title=" MARK AS REMEBERED"
            onPress={() => onPressFunction({ item })}
          />

          // ✅
        )}
        {item.remember === true && ( // Check if item.remember is false
          <Button
            title="i need review again"
            onPress={() => onForgetFunction({ item })}
          />
        )}

        {item.remember === true && ( // Check if item.remember is false
          <Button
            color="red"
            title="Delete"
            onPress={() => onDeleteFunction({ item })}
          />
        )}
        {/* <Button title="marker" onPress={()=>onPressFunction({item})} /> */}
      </View>
    </Pressable>
  );

  // console.log(library)

  const [showRemember, setShowRemember] = useState(false);
  const [showForget, setShowForget] = useState(false);

  function showRememberHandler() {
    setShowRemember(true);
    setShowForget(false);
  }
  function showForgetHandler() {
    setShowRemember(false);
    setShowForget(true);
  }

  function showClearHandler() {
    setShowRemember(false);
    setShowForget(false);
  }

  const [openRemind, setOpenRemind] = useState(false)

  function remindHandler() {

    setOpenRemind(!openRemind)
  }

  const reminderButton = (
    <>
      <TouchableOpacity onPress={remindHandler}>
        <MaterialIcons name="add-alarm" size={30} color="black" />
      </TouchableOpacity>
    </>
  )

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return library.length !== 0 && reminderButton;
      },
    });
  },);

  function ankiModeHandler() {
    console.log("anki");
    writeAnkiToDB(auth.currentUser.uid);
  }

  function antiankiModeHandler() {
    console.log("antianki");
    writeAntiAnkiToDB(auth.currentUser.uid);
  }


  // function allankiModeHandler() {
  //   console.log("allanki");
  //   writeAnkiToDB(auth.currentUser.uid);
  //   writeAntiAnkiToDB(auth.currentUser.uid);
  // }

  function allankiModeHandler() {
    console.log("allanki");
    writeAllAnkiToDB(auth.currentUser.uid);
  }

  function clearankiModeHandler() {
    console.log("anki-clear");
    writeClearAnkiToDB(auth.currentUser.uid);
  }

  return (
    <View style={styles.container}>
      <Text>This is the my screen</Text>

      {/* <NotificationManager /> */}
      {/* {library && <Text>please add new words</Text>} */}
      {library.length === 0 ? (
        <Text>There is no new word for you, try to add some from library</Text>
      ) : (
        // Render something else when the library is not empty
        <>
          {openRemind && <NotificationManager remindHandler={remindHandler} />}
          <Button title="anki-mode" onPress={ankiModeHandler} />
          <Button title="Anti-anki-mode" onPress={antiankiModeHandler} />
          <Button title="All-Hidden-mode" onPress={allankiModeHandler} />
          <Button title="Clear-anki-mode" onPress={clearankiModeHandler} />

          {/* <Button title='choose remember' onPress={showRememberHandler} />
  <Button title='choose forget' onPress={showForgetHandler}/>
  <Button title='choose clear' onPress={showClearHandler}/> */}

          {showRemember && (
            <FlatList
              data={library.filter((item) => item.remember)}
              // data={library}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
          {showForget && (
            <FlatList
              data={library.filter((item) => !item.remember)}
              // data={library}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
          {!showForget && !showRemember && (
            <FlatList
              // data={library.filter(item => item.remember)}
              data={library}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFE2C2"
  },


});

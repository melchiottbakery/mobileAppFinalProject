import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import NotificationManager from "../component/NotificationManager";
import { AntDesign } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../firebase-files/FirebaseSetup";
import {
  deleteWordFromUserDB,
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
import screenStyleHelper from "../styleHelperFolder/screenStyleHelper";
import colors from "../ColorHelper";
import ImageManager from "../component/ImageManager";

export default function MyList() {
  const userId = auth.currentUser.uid;
  const [library, setlibrary] = useState([]);
  const navigation = useNavigation();

  const [openRemind, setOpenRemind] = useState(false);

  const [showRemember, setShowRemember] = useState(false);
  const [showForget, setShowForget] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return library.length !== 0 && reminderButton;
      },
    });
  },);

  function onPressFunction({ item }) {
    const rememberWord = {
      translationMeaning: item.translationMeaning,
      nativeWord: item.nativeWord,
      remember: true,
    };
    editRememberInDB(item.id, userId, rememberWord);
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
        deleteWordFromUserDB(item.id, userId);
      } catch (error) {
        Alert.alert("Error", error);
      }
    }
  }

  function onForgetFunction({ item }) {
    const forgetWord = {
      remember: false,
    };
    editRememberInDB(item.id, userId, forgetWord);
  }

  function showTranslationMeaning({ item }) {
    console.log("which one will you change", item);

    const translationMeaningShow = {
      translationMeaningShow: !item.translationMeaningShow,
    };
    editRememberInDB(item.id, userId, translationMeaningShow);
  }

  function showNativeMeaning({ item }) {
    const nativeWordShow = {
      nativeWordShow: !item.nativeWordShow,
    };
    editRememberInDB(item.id, userId, nativeWordShow);
  }

  const renderItem = ({ item }) => (
    <Pressable>
      <View style={styles.words}>

        <View style={{ flexDirection: "row" }}>
          <View style={{ marginRight: 30 }}>
            <AudioManager wordToSound={item.id}></AudioManager>
          </View>

          <View >
            <View>
              {!item.nativeWordShow && (
                <TouchableOpacity onPress={() => showNativeMeaning({ item })}>
                  <Text style={styles.fontSize30}>Show the Word</Text>
                </TouchableOpacity>
              )}
              {item.nativeWordShow && (
                <TouchableOpacity onPress={() => showNativeMeaning({ item })}>
                  <Text style={styles.fontSize30}>{item.nativeWord}</Text>
                </TouchableOpacity>
              )}

            </View>
            <View>

              {!item.translationMeaningShow && (
                <TouchableOpacity onPress={() => showTranslationMeaning({ item })}>
                  <Text style={screenStyleHelper.fontSize20}>Show the Meaning</Text>
                </TouchableOpacity>
              )}
              {item.translationMeaningShow && (
                <TouchableOpacity onPress={() => showTranslationMeaning({ item })}>
                  <Text style={screenStyleHelper.fontSize20}>{item.translationMeaning}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View>
            <ImageManager selectedWord={ item.id } />
            </View>




        </View>

        <View>
          <View>
            {item.remember === false && (
              <TouchableOpacity onPress={() => onPressFunction({ item })}>
                <Fontisto name="checkbox-passive" size={30} color="black" />
              </TouchableOpacity>
            )}

          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View >
              {item.remember === true && (
                <TouchableOpacity onPress={() => onForgetFunction({ item })}>
                  <Fontisto name="checkbox-active" size={30} color="black" />
                </TouchableOpacity>
              )}

            </View>
            {item.remember === true && (
              <TouchableOpacity onPress={() => onDeleteFunction({ item })}>
                <AntDesign name="delete" size={30} color="red" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );

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

  function ankiModeHandler() {
    console.log("anki");
    writeAnkiToDB(auth.currentUser.uid);
  }

  function antiankiModeHandler() {
    console.log("antianki");
    writeAntiAnkiToDB(auth.currentUser.uid);
  }

  function allankiModeHandler() {
    console.log("allanki");
    writeAllAnkiToDB(auth.currentUser.uid);
  }

  function clearankiModeHandler() {
    console.log("anki-clear");
    writeClearAnkiToDB(auth.currentUser.uid);
  }

  return (
    <View style={screenStyleHelper.container}>
      {library.length === 0 ? (
        <View style={screenStyleHelper.padding5}>
          <Text style={screenStyleHelper.textFontSize}>There is no new word for you, try to add some from library</Text>
        </View>
      ) : (
        <>
          {openRemind && <NotificationManager remindHandler={remindHandler} />}

          <View style={styles.functionMode}>

            <Text>HIDDEN MODE:</Text>

            <TouchableOpacity style={styles.ankiButton} onPress={antiankiModeHandler}>
              <Text>Word</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ankiButton} onPress={ankiModeHandler}>
              <Text>Meaning</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ankiButton} onPress={allankiModeHandler}>
              <Text>All</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ankiButton} onPress={clearankiModeHandler}>
              <Text>Clear</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.functionMode}>

            <Text>REVISION MODE:</Text>
            <TouchableOpacity style={styles.ankiButton} onPress={showForgetHandler}>
              <Text>To Learn</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ankiButton} onPress={showRememberHandler}>
              <Text>Remembered</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ankiButton} onPress={showClearHandler}>
              <Text>Clear</Text>
            </TouchableOpacity>

          </View>

          {showRemember && (
            <FlatList
              data={library.filter((item) => item.remember)}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
          {showForget && (
            <FlatList
              data={library.filter((item) => !item.remember)}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
          {!showForget && !showRemember && (
            <FlatList
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

  ankiButton: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    padding: 5,
    margin: 7,
    borderColor: colors.borderColor,
  },
  functionMode: {
    flexDirection: "row",
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  words: {
    padding: 10,
    borderColor: colors.borderColor,
    borderWidth: 3,
    margin: 5
  },

  fontSize30: {
    fontSize: 30,
  },


});

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
  writeAnkiToDB,
} from "../firebase-files/FirebaseHelper";

import { auth } from "../firebase-files/FirebaseSetup";
import AudioManager from "./AudioManager";

export default function MyList() {
  const userId = auth.currentUser.uid;
  const [library, setlibrary] = useState([]);

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
                showTranslation: true,
                showNative: true,
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

  function ankiModeHandler() {
    console.log("anki");
    handleToggleMeaningShow();
  }

  // const handleButtonPress = () => {
  //   // 使用map函数遍历数据，并更新translationMeaningShow属性为false
  //   const newData = data.map(item => {
  //     return {
  //       ...item,
  //       translationMeaningShow: false
  //     };
  //   });

  //   // 更新数据
  //   setData(newData); // 这里假设您使用useState来管理数据
  // };

  // function ankiModeHandler() {
  //   console.log("anki")
  //   const newData = library.map(item => {
  //     return {
  //       ...item,
  //       translationMeaningShow: false
  //     };
  //   });

  //   // 更新数据
  //   setlibrary(newData);

  // }

  // function ankiModeHandler() {
  //   console.log("anki")
  //   handleToggleMeaningShow()

  // }

  function handleToggleMeaningShow() {
    writeAnkiToDB(auth.currentUser.uid);
  }

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
          onPress: () => {},
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
    // editInDB(item.id, rememberWord);
  }

  // function ankiModeHandler(){
  //   const q = query(collection(database, "users",auth.currentUser.uid,'wordlist'));
  //   // console.log(q.firestore.databaseId)
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //         // cities.push(doc.data().name);
  //         console.log("niha54765876576o",doc.data())
  //         const translationMeaningShow = {
  //                     translationMeaningShow : false
  //                 };
  //                 editRememberInDB(doc.data().nativeWord,userId,translationMeaningShow)

  //     });
  //   })
  // }

  // const q = query(collection(database, "users",auth.currentUser.uid,'wordlist'));
  // console.log(q)

  // function ankiModeHandler(){
  //   console.log("anki presseed")

  //   const unsubscribe= onSnapshot(collection(database, "users",auth.currentUser.uid,'wordlist'), (querySnapshot) => {
  //      console.log("nihao",querySnapshot)
  //     // let newArray = [];
  //     if (querySnapshot) {
  //       querySnapshot.forEach((doc) => {

  //         console.log(doc.data().nativeWord)
  //         const translationMeaningShow = {
  //           translationMeaningShow : false
  //       };
  //       editRememberInDB(doc.data().nativeWord,userId,translationMeaningShow)

  //         // newArray.push({ ...doc.data(), id: doc.id });
  //       });
  //     };
  //     // setlibrary(newArray);
  //   });
  //   // unsubscribe();
  // }

  function showNativeHandler({ item }) {
    console.log("press word is", { item });
    // 使用map函数遍历数据，仅更新id为“千代田”的对象的nativeWordShow属性为false，其他对象保持不变
    const newData = library.map((items) => {
      if (items.id === item.nativeWord) {
        return {
          ...items,
          showNative: !item.showNative,
        };
      } else {
        return items;
      }
    });

    // 更新数据
    setlibrary(newData); // 这里假设您使用useState来管理数据
  }

  function showTranslationHandler({ item }) {
    console.log("press word is", { item });
    const newData = library.map((items) => {
      if (items.id === item.nativeWord) {
        return {
          ...items,
          showTranslation: !item.showTranslation,
        };
      } else {
        return items;
      }
    });
    setlibrary(newData);
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

        {!item.nativeWordShow && <Text>show the nativeWord</Text>}
        {item.nativeWordShow && <Text>meaning: {item.nativeWord}</Text>}

        {/* 
        <Button title="change showNative" onPress={() => showNativeHandler({ item })}></Button>

{!item.showNative && <Text>show the nativeWord</Text>}
{item.showNative && <Text>meaning: {item.nativeWord}</Text>}
<Text>nativeWordShow: {String(item.showNative)}</Text>


        <Button title="change showTranslation" onPress={() => showTranslationHandler({ item })}></Button>
        {!item.showTranslation && <Text>show the translationMeaning</Text>}
{item.showTranslation && <Text>meaning: {item.translationMeaning}</Text>}
<Text>nativeWordShow: {String(item.showTranslation)}</Text> */}

        {/* {!item.translationMeaningShow && <Text>show the translationMeaning</Text>}
        {item.translationMeaningShow && <Text>meaning: {item.translationMeaning}</Text>} */}

        {/* <Text>meaning: {item.translationMeaning}</Text> */}

        {/* <Text>nativeWordShow: {String(item.nativeWordShow)}</Text>

        <Text>translationMeaningShow: {String(item.translationMeaningShow)}</Text> */}

        <Text>remember: {String(item.remember)}</Text>
        <AudioManager wordToSound={item.id}></AudioManager>

        {item.remember === false && ( // Check if item.remember is false
          <Button
            title=" MARK AS REMEBERED"
            onPress={() => onPressFunction({ item })}
          />
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

  return (
    <View style={{ flex: 1 }}>
      <Text>This is the my screen</Text>

      {/* <NotificationManager /> */}
      {/* {library && <Text>please add new words</Text>} */}
      {library.length === 0 ? (
        <Text>There is no new word for you, try to add some from library</Text>
      ) : (
        // Render something else when the library is not empty
        <>
          <NotificationManager />
          <Button title="anki-mode" onPress={ankiModeHandler} />
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

const styles = StyleSheet.create({});

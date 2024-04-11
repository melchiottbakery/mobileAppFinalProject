import { StyleSheet, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./Profile";
import Library from "./Library";
import MyList from "./MyList";
import Welcome from "./Welcome";

const Tab = createBottomTabNavigator();
import { getProfile } from "../firebase-files/FirebaseHelper";
import { auth } from '../firebase-files/FirebaseSetup';


// const [jsonUrl, setJsonUrl]= useState('');




export default function TabNavigator() {


  // function showAlertWithTextInput(){

  // };
  
  async function fetchUsers(inputText) {
    try { 
      const response = await fetch(
        inputText
    );
    if (!response.ok) {
      throw new Error("data wasn't there!"); 
    }
    const data = await response.json()
    console.log(data)
    } 
    catch (error) {
      console.log("fetch users ", error);
    }   
  }
  


  function showAlertWithTextInput(){
    // Alert.alert('Email or Password is not correct ')
    // andriod cannot 
    Alert.prompt();

    Alert.prompt(
      'Add a dictionary to the library',
      'Please enter url of json file:',
      (inputText) => {
        if (inputText) {
          // Handle the text input here
          fetchUsers(inputText)
          console.log('You entered: ' + inputText);
        }
       
      },

      );
   
  };
  // "https://jsonplaceholder.typicode.com/users"




  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Welcome" component={Welcome} />
      <Tab.Screen
        name="Library"
        component={Library}
        options={{
          headerRight: () => (
            <Button
              title="Add"
              // onPress={() => console.log("Add button pressed")}
              onPress={showAlertWithTextInput}

            />
          ),
        }}
      />
      <Tab.Screen name="MyList" component={MyList} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});

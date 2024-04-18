import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";
import Login from "./screens/Login";
import WordList from "./screens/WordList";

import Registration from "./screens/Registration";
import TabNavigator from "./screens/TabNavigator";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async function () {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
    };
  }
});

const Stack = createStackNavigator();

export default function App({wordBookid}) {

  const [deleteLink, setDeleteLink]= useState("")

  function deleteHandler(wordBookid){
    setDeleteLink(wordBookid)


  }
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{headerShown: false}}>
          
         <Stack.Screen name="User" component={TabNavigator} />

         
         <Stack.Screen name="Login" component={Login} 
         
         options={({ navigation }) => ({
          headerShown:true,

          headerLeft: () => (
            <Button title="Back to Profile" onPress={() => navigation.goBack()}>
            </Button>
          ),
          // headerRight: () => (
          //   <Button title="delete" onPress={()=>deleteHandler(wordBookid)}>
          //   </Button>
          // ),
        })}
         />
        <Stack.Screen name="Registration" component={Registration} 
        
        options={({ navigation }) => ({
          headerShown:true,

          headerLeft: () => (
            <Button title="Back to Login" onPress={() => navigation.navigate('Login')}>
            </Button>
          ),
          // headerRight: () => (
          //   <Button title="delete" onPress={()=>deleteHandler(wordBookid)}>
          //   </Button>
          // ),
        })}
        />
        <Stack.Screen name="WordList" component={WordList}

          options={({ navigation }) => ({
            headerShown:true,

            headerLeft: () => (
              <Button title="Go to Library" onPress={() => navigation.goBack()}>
              </Button>
            ),
            // headerRight: () => (
            //   <Button title="delete" onPress={()=>deleteHandler(wordBookid)}>
            //   </Button>
            // ),
          })}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});

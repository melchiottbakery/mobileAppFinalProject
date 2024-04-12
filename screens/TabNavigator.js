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



export default function TabNavigator() {



  // "https://jsonplaceholder.typicode.com/users"


  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Welcome" component={Welcome} />
      <Tab.Screen
        name="Library"
        component={Library}
        options={{
          
        }}
      />
      <Tab.Screen name="MyList" component={MyList} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});

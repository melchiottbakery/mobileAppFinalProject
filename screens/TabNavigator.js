import { StyleSheet, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./Profile";
import Library from "./Library";
import MyList from "./MyList";
import Welcome from "./Welcome";
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../firebase-files/FirebaseSetup';
import colors from "../ColorHelper";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {

  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
      }
      else {
        setUserLoggedIn(false);

      }
    })
  })

  return (
    <Tab.Navigator initialRouteName="Welcome"
      screenOptions={{
        tabBarActiveTintColor: colors.borderColor,
        tabBarStyle: { backgroundColor: colors.buttonText },
        headerStyle: {
          backgroundColor: colors.tan,
        },
        headerTitleStyle: {
          fontSize: 20,
        },
      }}>

      <Tab.Screen name="Welcome" component={Welcome}
        options={{
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={30} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Library"
        component={Library}
        options={{
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library" size={30} color={color} />),
        }}
      />

      <Tab.Screen name="Profile" component={Profile}
        options={{
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person-fill" size={30} color={color} />),
        }}
      />

      {userLoggedIn && <
        Tab.Screen name="MyList"
        component={MyList}
        options={{
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-list" size={30} color={color} />
          ),
        }}
      />}

    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});

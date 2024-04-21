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

const Tab = createBottomTabNavigator();

export default function TabNavigator(props) {

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
        tabBarActiveTintColor: "#B88956",
        tabBarStyle: { backgroundColor: '#FFF1E1' },
        headerStyle: {
          backgroundColor: '#DEB68A',
        },
        // headerTintColor: '#957A5D',
        headerTitleStyle: {
          // fontWeight: 'bold',
          fontSize: 20,
        },
        // #976732
      }}
    >

      <Tab.Screen name="Welcome" component={Welcome}
        options={{
          // headerStyle: { height: 100 },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          // headerTitleStyle: {
          //   fontSize: 20,
          // },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Library"
        component={Library}
        options={{
          // headerStyle: { height: 30 },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          // headerTitleStyle: {
          //   fontSize: 20,
          // },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library" size={24} color={color} />),
        }}

      />
      <Tab.Screen name="Profile" component={Profile}
        options={{
          // headerStyle: { height: 100 },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          // headerTitleStyle: {
          //   fontSize: 20,
          // },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person-fill" size={24} color={color} />),
        }}

      />
      {userLoggedIn && <
        Tab.Screen name="MyList"
        component={MyList}
        options={{
          // headerStyle: { height: 100 },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          // headerTitleStyle: {
          //   fontSize: 20,
          // },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-list" size={24} color={color} />
          ),
        }}
      />}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});

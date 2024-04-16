import { StyleSheet, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./Profile";
import Library from "./Library";
import MyList from "./MyList";
import Welcome from "./Welcome";
import { onAuthStateChanged } from "firebase/auth";


const Tab = createBottomTabNavigator();
import { getProfile } from "../firebase-files/FirebaseHelper";
import { auth } from '../firebase-files/FirebaseSetup';

// import { useNavigation } from '@react-navigation/native';

// const navigation = useNavigation();

export default function TabNavigator() {



  // "https://jsonplaceholder.typicode.com/users"

  // const [isadmin,setIsadmin]=useState(false)

  // function openHandler(){
  //   console.log(isadmin)
  //   setIsadmin(!isadmin)
  //   // navigation.setParams({ open: !open });
  // }
  // const hello = 'nihao'


  const [userLoggedIn, setUserLoggedIn] = useState(false);


  useEffect(()=>{
    onAuthStateChanged(auth,(user) => {
      if (user){
  setUserLoggedIn(true);
      }
      else{
        setUserLoggedIn(false);
  
      }
    })
  })


  return (
    <Tab.Navigator initialRouteName="Welcome">
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Welcome" component={Welcome} />

      
      <Tab.Screen
        name="Library"
        component={Library}
      // params={{ customParam: isadmin }} 

      // options={{
      //   headerRight: () => (

      //       <Button title="nihao" onPress={openHandler}></Button>
      //   ),

      // }}
      />
      {userLoggedIn && <Tab.Screen name="MyList" component={MyList} />}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});

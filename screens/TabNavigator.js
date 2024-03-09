import { StyleSheet, Button } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./Profile";
import Library from "./Library";
import MyList from "./MyList";
import Welcome from "./Welcome";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
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
              onPress={() => console.log("Add button pressed")}
            />
          ),
        }}
      />
      <Tab.Screen name="MyList" component={MyList} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});

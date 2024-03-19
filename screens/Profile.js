import { StyleSheet, Text, View, Image, Button } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputComponent from "../component/InputComponent";

export default function Profile({ route, navigation }) {
  // You can give me some const and useState for the name, the email and the password
  // const {nickname, email, password } = route.params;
  
  return (
    <SafeAreaView>
     {/*  <Text>This is the Profile screen</Text> */}

      {/*  <Text>Add a pic as a placeholder</Text> */}
      <View style={styles.imageContainer}>
        <Image source={require("../assets/myImage.png")} style={styles.image} />
      </View>

      <InputComponent
        //here is a InputComponent can show the name from Registration nickname, but user cannot pressed or chage(until now)
        Label="Nickname"
        value={nickname}
        editable={false}
      />

      <InputComponent
        //here is a InputComponent can show the email, but user cannot pressed or
        Label="Email"
        value={email}
        editable={false}
      />

      <InputComponent
        //here is a InputComponent can show the password, but user can pressed. it
        //show from stars to characters until the user presses.
        Label="Password"
        value={password}
        secureTextEntry={true}
        editable={false}

      />
      
      <Button
      //a button cancel and go back to the Login screen
        title="Cancel"
        onPress={() => navigation.navigate("Login")}
      />


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
});

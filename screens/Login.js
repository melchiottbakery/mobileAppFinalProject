import { Alert, Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import InputComponent from "../component/InputComponent";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-files/FirebaseSetup";

export default function Login({ navigation, route }) {
  console.log('route is', route)
  const [email, setEmail] = useState("ww2w@qq.com");
  const [password, setPassword] = useState("dongbeidaban");
  const [error, setError] = useState("");

  function validateEmail() {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  function validateForm() {
    // Check if email or password is empty
    return !email || !password;
  };

  function handleReset() {
    // the function on when Reset button pressed
    setEmail("");
    setPassword("");
    setError("");
  };

  function handleLogin() {
    // the function on when Login button pressed
    if (validateEmail()) {
      setError("");
      //console.log(email);
      console.log(password);
      userAuthHandler();
    } else {
      setError("Please enter a valid email");
    }
  };


  async function userAuthHandler() {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCred)
      navigation.navigate("User");


    } catch (error) {
      console.log(error);
      if (error.code == 'auth/invalid-credential') {
        Alert.alert('Email or Password is not correct ')
      }

    }
  }

  function handleRegister() {
    // the function on when Register button pressed
    //console.log(email);
    //console.log(password);
    navigation.replace("Registration");
  };

  useEffect(() => {
    if (route.params && route.params.userEmail) {

      setEmail(route.params.userEmail)
      setPassword(route.params.userPassword)

    }
  }, []);



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text>Welcome</Text>
      </View>

      <View style={styles.inputContainer}>
        {/*  <Text>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          />
          <Text style={{ color: "red" }}>{error}</Text> */}

        <InputComponent
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={error}
        ></InputComponent>

        <InputComponent
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        ></InputComponent>

        {/* <Text>Password</Text>
          <TextInput
            value={password}
            secureTextEntry={true}
            onChangeText={setPassword}
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          /> */}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Reset" onPress={handleReset} />
        <Button title="Login" onPress={handleLogin} disabled={validateForm()} />
        <Button title="Register" onPress={handleRegister} />

        {/* <Text>{displayText}</Text> */}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFE2C2",


  },

  headerContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
  },

  /* inputContainer: {
      width: "80%",
      alignSelf: "center",
      paddingTop: 20,
    }, */

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
});

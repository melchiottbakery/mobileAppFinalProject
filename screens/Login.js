import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import InputComponent from "../component/InputComponent";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-files/FirebaseSetup";
import { TouchableOpacity } from "react-native-gesture-handler";
import screenStyleHelper from "../styleHelperFolder/screenStyleHelper";

export default function Login({ navigation, route }) {
  console.log('route is', route)
  const [email, setEmail] = useState("ww2w@qq.com");
  const [password, setPassword] = useState("dongbeidaban");
  const [error, setError] = useState("");

  function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  function validateForm() {
    return !email || !password;
  };

  function handleReset() {
    setEmail("");
    setPassword("");
    setError("");
  };

  function handleLogin() {
    if (validateEmail()) {
      setError("");
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
    navigation.navigate("Registration");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
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
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={screenStyleHelper.button} onPress={handleReset}>
          <Text style={screenStyleHelper.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={screenStyleHelper.button} onPress={handleLogin} disabled={validateForm()}>
          <Text style={screenStyleHelper.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={screenStyleHelper.button} onPress={handleRegister} >
          <Text style={screenStyleHelper.buttonText}>Register</Text>
        </TouchableOpacity>

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

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },

});

import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import InputComponent from "../component/InputComponent";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebase-files/FirebaseSetup";

export default function Login({ navigation }) {
  console.log(database);
  const [email, setEmail] = useState("111@qq.com");
  const [password, setPassword] = useState("12345");
  const [error, setError] = useState("");

  const validateEmail = () => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    // Check if email or password is empty
    return !email || !password;
  };

  const handleReset = () => {
    // the function on when Reset button pressed
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleLogin = async () => {
    // the function on when Login button pressed
    try {
      if (validateEmail()) {
        setError("");
        //console.log(email);
        //console.log(password);
        const user = await signInWithEmailAndPassword(auth, email, password);
        console.log(user);
        navigation.navigate("User");
      } else {
        setError("Please enter a valid email");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = () => {
    // the function on when Register button pressed
    //console.log(email);
    //console.log(password);
    navigation.replace("Registration");
  };

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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

import { StyleSheet, Text, View, Button, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputComponent from "../component/InputComponent";
import Checkbox from "expo-checkbox";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-files/FirebaseSetup";
import { setDocToDB, setNewUserDocToDB } from "../firebase-files/FirebaseHelper";

export default function Registration({ navigation }) {
  // const [nickname, setNickname] = useState("");
  // const [email, setEmail] = useState("");
  // const [confirmedEmail, setConfirmedEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmedPassword, setConfirmedPassword] = useState("");
  // const [emailError, setEmailError] = useState("");
  // const [confirmedEmailError, setConfirmedEmailError] = useState("");
  // const [confirmedPasswordError, setConfirmedPasswordError] = useState("");
  // const [isAdmin, setIsAdmin] = useState(false);

  //for data test
  const [nickname, setNickname] = useState("nihao");
  const [email, setEmail] = useState("ww2w@qq.com");
  const [confirmedEmail, setConfirmedEmail] = useState("ww2w@qq.com");
  const [password, setPassword] = useState("dongbeidaban");
  const [confirmedPassword, setConfirmedPassword] = useState("dongbeidaban");
  const [emailError, setEmailError] = useState("");
  const [confirmedEmailError, setConfirmedEmailError] = useState("");
  const [confirmedPasswordError, setConfirmedPasswordError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  function handleCancel() {
    setNickname("");
    setEmail("");
    setConfirmedEmail("");
    setPassword("");
    setConfirmedPassword("");
    setIsAdmin(false);
    // navigation.navigate("Login");
    navigation.navigate("Login");


  };

  function validateForm() {
    // Check if all input box are empty
    return (
      !nickname || !email || !confirmedEmail || !password || !confirmedPassword
    );
  };

  function validateEmail() {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  function validateConfirmedEmail() {
    //check if email and confirmed email are the same
    return email === confirmedEmail;
  };

  function validateConfirmedPassword() {
    //check if password and confirmed password are the same
    return password === confirmedPassword;
  };

  function handleSet() {
    setEmailError("");
    setConfirmedEmailError("");
    setConfirmedPasswordError("");
    if (

      validateEmail() &&
      validateConfirmedEmail() &&
      validateConfirmedPassword()
    ) {
      //to be changed
      // handleChange("nickname", nickname);
      // handleChange("email", email);
      // handleChange("password", password);
      // handleChange("isAdmin", isAdmin);

      // console.log(formData);
      createUserAuthHandler()

      // console.log([nickname, email, password, isAdmin]);
      // Return a new array of the user's information
      // return
      // [nickname, email, password, isAdmin];
    } else if (!validateEmail()) {
      setEmailError("Please enter a valid email");
    } else if (!validateConfirmedEmail()) {
      setConfirmedEmailError("Emails do not match");
    } else if (!validateConfirmedPassword()) {
      setConfirmedPasswordError("Passwords do not match");
    }
  };

  async function createUserAuthHandler() {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      // console.log(userCred)
      console.log(userCred._tokenResponse.localId)
      // console.log(nickname)
      setNewUserDocToDB({
        nickname: nickname,
        email: email,
        isAdmin: isAdmin
      }, "users", userCred._tokenResponse.localId)
      navigation.navigate("Login", { userEmail: email, userPassword: password });

    } catch (error) {
      console.log(error.code)
      if (error.code === "auth/weak-password") {
        Alert.alert("Please use strong password.")
      }
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Please use another email address to register.")
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>This is the Registration screen</Text>

      {/* a InputComponent input the nickname */}
      <InputComponent
        label="Nickname"
        value={nickname}
        onChangeText={setNickname}
      />

      {/* <Text>a InputComponent input the email</Text> */}
      <InputComponent
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={emailError}
      />

      {/* <Text>a InputComponent confirm the email</Text> */}
      <InputComponent
        label="Confirm Email"
        value={confirmedEmail}
        onChangeText={setConfirmedEmail}
        error={confirmedEmailError}
      />

      {/*  <Text>a InputComponent input the passpord</Text> */}
      <InputComponent
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {/* <Text>a InputComponent confirm the password</Text> */}
      <InputComponent
        label="Confirm Password"
        value={confirmedPassword}
        onChangeText={setConfirmedPassword}
        secureTextEntry={true}
        error={confirmedPasswordError}
      />

      {/* <Text>a checkbox for the terms and conditions</Text> */}
      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={isAdmin}
          onValueChange={setIsAdmin}
          color={isAdmin ? "#4630EB" : undefined}
        />
        <Text>admin?</Text>
      </View>

      {/* <Text>a button cancel and go back</Text>
      <Text>a button Registration</Text> */}
      <View style={styles.buttonContainer}>
        <Button title="Back to Login" onPress={handleCancel} />
        <Button title="SignUp" onPress={handleSet} disabled={validateForm()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE2C2"

  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },

  section: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  checkbox: {
    margin: 10,
  },
});

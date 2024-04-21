import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputComponent from "../component/InputComponent";
import Checkbox from "expo-checkbox";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-files/FirebaseSetup";
import { setNewUserDocToDB } from "../firebase-files/FirebaseHelper";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../ColorHelper";
import screenStyleHelper from "../styleHelperFolder/screenStyleHelper";

export default function Registration({ navigation }) {

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
    navigation.navigate("Login");
  };

  function validateForm() {
    return (
      !nickname || !email || !confirmedEmail || !password || !confirmedPassword
    );
  };

  function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  function validateConfirmedEmail() {
    return email === confirmedEmail;
  };

  function validateConfirmedPassword() {
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
      createUserAuthHandler()

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
      navigation.navigate("Profile", { userEmail: email, userPassword: password });

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

      <InputComponent
        label="Nickname"
        value={nickname}
        onChangeText={setNickname}
      />

      <InputComponent
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={emailError}
      />

      <InputComponent
        label="Confirm Email"
        value={confirmedEmail}
        onChangeText={setConfirmedEmail}
        error={confirmedEmailError}
      />

      <InputComponent
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <InputComponent
        label="Confirm Password"
        value={confirmedPassword}
        onChangeText={setConfirmedPassword}
        secureTextEntry={true}
        error={confirmedPasswordError}
      />

      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={isAdmin}
          onValueChange={setIsAdmin}
          color={isAdmin ? colors.tan : undefined}
        />
        <Text>admin?</Text>
      </View>

      <View style={styles.buttonContainer}>

        <TouchableOpacity style={screenStyleHelper.button} onPress={handleCancel}>
          <Text style={screenStyleHelper.buttonText}>Back to Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={screenStyleHelper.button} onPress={handleSet} disabled={validateForm()}>
          <Text style={screenStyleHelper.buttonText}>SignUp</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.allbackgroundColor
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

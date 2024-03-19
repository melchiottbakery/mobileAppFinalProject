import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputComponent from "../component/InputComponent";
import Checkbox from "expo-checkbox";

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
  const [email, setEmail] = useState("www@qq.com");
  const [confirmedEmail, setConfirmedEmail] = useState("www@qq.com");
  const [password, setPassword] = useState("12345");
  const [confirmedPassword, setConfirmedPassword] = useState("12345");
  const [emailError, setEmailError] = useState("");
  const [confirmedEmailError, setConfirmedEmailError] = useState("");
  const [confirmedPasswordError, setConfirmedPasswordError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // I have dashed this line, it will be a wrong prompt for this one 

  // navigation.navigate("profile", {nickname: nickname, email: email, password: password});

  //to be changed
  const [formData, setFormData] = useState({

  });

  //to be changed
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };


  const handleCancel = () => {
    setNickname("");
    setEmail("");
    setConfirmedEmail("");
    setPassword("");
    setConfirmedPassword("");
    setIsAdmin(false);
    navigation.navigate("Login");
  };



  const validateForm = () => {
    // Check if all input box are empty
    return (
      !nickname || !email || !confirmedEmail || !password || !confirmedPassword
    );
  };

  const validateEmail = () => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateConfirmedEmail = () => {
    //check if email and confirmed email are the same
    return email === confirmedEmail;
  };

  const validateConfirmedPassword = () => {
    //check if password and confirmed password are the same
    return password === confirmedPassword;
  };


  //please check the status of "Please enter a valid email"
  //there are some bugs if the email is in the right style but not match.
  // the 'please enter a valid email is still here'
  // the better way to do that is once you are using handleSet, clear all the status first.


  const handleSet = () => {
    if (
      validateEmail() &&
      validateConfirmedEmail() &&
      validateConfirmedPassword()
    ) {
      setEmailError("");
      setConfirmedEmailError("");
      setConfirmedPasswordError("");

      //to be changed
      handleChange("nickname", nickname)
      handleChange("email", email)
      handleChange('password', password)
      handleChange('isAdmin', isAdmin)

      console.log(formData)

      console.log([nickname, email, password, isAdmin]);
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
        <Button title="Cancel" onPress={handleCancel} />
        <Button title="Set" onPress={handleSet} disabled={validateForm()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center'
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },

  section: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    margin: 10,
  },
});

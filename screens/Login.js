import {
    Button,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
  } from "react-native";
  import React, { useState } from "react";
  
  export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
  
    const handleLogin = () => {
      // the function on when Login button pressed
      if (validateEmail()) {
        setError("");
        console.log(email);
      } else {
        setError("Please enter a valid email");
      }
    };
  
    const handleRegister = () => {
      // the function on when Register button pressed
      console.log(email);
      console.log(password);
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text>Welcome</Text>
        </View>
  
        <View style={styles.inputContainer}>
          <Text>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          />
          <Text style={{ color: "red" }}>{error}</Text>
  
          <Text>Password</Text>
          <TextInput
            value={password}
            secureTextEntry={true}
            onChangeText={setPassword}
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          />
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
      alignItems: "center",
      justifyContent: "center",
    },
  
    headerContainer: {
      //justifyContent: "flex-start",
      marginBottom: 20,
    },
  
    inputContainer: {
      width: "80%",
      alignSelf: "center",
      paddingTop: 20,
    },
  
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%",
      marginTop: 40,
    },
  });
  
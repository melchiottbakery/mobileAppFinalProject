import React from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import colors from "../ColorHelper";

const InputComponent = ({
  label,
  value,
  onChangeText,
  error,
  onPressIn,
  showSoftInputOnFocus,
  secureTextEntry,
  editable,

}) => {
  return (
    <View style={style.inputContainer}>
      <Text style={style.text}>{label}</Text>
      <TextInput
        style={style.input}
        value={value}
        onChangeText={onChangeText}
        onPressIn={onPressIn}
        showSoftInputOnFocus={showSoftInputOnFocus}
        secureTextEntry={secureTextEntry}
        editable={editable}
      />

      {error && <Text style={style.inputError}>{error}</Text>}
    </View>
  );
};

export default InputComponent;

const style = StyleSheet.create({
  inputContainer: {
    margin: 10,
  },

  text: {
    marginBottom: 10,
    fontSize: 16
  },

  input: {
    alignSelf: "stretch",
    height: 40,
    borderColor: colors.borderColor,
    borderWidth: 3,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },

  inputError: {
    color: "red",
  },
});



import React from "react";
import { Text, TextInput, View } from "react-native";
import StyleHelper from "./StyleHelper";

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
    <View style={StyleHelper.inputContainer}>
      <Text style={StyleHelper.text}>{label}</Text>
      <TextInput
        style={StyleHelper.input}
        value={value}
        onChangeText={onChangeText}
        onPressIn={onPressIn}
        showSoftInputOnFocus={showSoftInputOnFocus}
        secureTextEntry={secureTextEntry}
        editable={editable}
      />

      {error && <Text style={StyleHelper.inputError}>{error}</Text>}
    </View>
  );
};

export default InputComponent;

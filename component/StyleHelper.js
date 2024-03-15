import { StyleSheet } from "react-native";

const StyleHelper = StyleSheet.create({
  //basic style for InputComponent
  inputContainer: {
    marginTop: 20,
    marginHorizontal: 30,

  },
  text: {
    marginBottom: 10,
  },
  input: {
    alignSelf: "stretch",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  inputError: {
    color: "red",
  },
});

export default StyleHelper;

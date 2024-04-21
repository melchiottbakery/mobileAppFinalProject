import { StyleSheet } from "react-native";

const StyleHelper = StyleSheet.create({
  //basic style for InputComponent
  inputContainer: {
    // marginTop: 20,
    // marginHorizontal: 30,
    margin: 10,

  },
  text: {
    marginBottom: 10,
    fontSize: 16

  },
  input: {
    alignSelf: "stretch",
    height: 40,
    borderColor: "#B88956",
    borderWidth: 3,
    borderRadius: 5,
    padding: 10,
    fontSize: 16

  },
  inputError: {
    color: "red",
  },
});

export default StyleHelper;

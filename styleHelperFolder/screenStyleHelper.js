import { StyleSheet } from "react-native";
import colors from '../ColorHelper';

const screenStyleHelper = StyleSheet.create({

    // Global styles   
    textFontSize: {
        fontSize: 16
    },
    padding5: {
        padding: 5
    },

    fontSize20: {
        fontSize: 20
    },

    button: {
        backgroundColor: colors.buttonColor,
        padding: 10,
        borderRadius: 5,
        width: "50",
    },
    buttonText: {
        color: colors.buttonText,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.allbackgroundColor,
    },

    containerAlignItemsCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: colors.allbackgroundColor
    },

});

export default screenStyleHelper;
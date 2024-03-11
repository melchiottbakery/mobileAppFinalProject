import React from 'react';
import { Text, TextInput, View } from 'react-native';

const InputComponent = ({ label, value, onChangeText, error, onPressIn, showSoftInputOnFocus }) => {
    return (

        <View 
        // style={StyleHelper.inputContainer}
        >
            <Text 
            // style={StyleHelper.text}
            >
                {label}</Text>
            <TextInput
                // style={StyleHelper.input}
                value={value}
                onChangeText={onChangeText}
                onPressIn={onPressIn}
                showSoftInputOnFocus={showSoftInputOnFocus}
            />

            {error &&
                <Text 
                // style={StyleHelper.inputError}
                >
                    {error}</Text>}
        </View>
    );

};

export default InputComponent;
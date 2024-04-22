import { StyleSheet, Text, View, Button, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { editImageLinkInWord } from '../firebase-files/FirebaseHelper';
import { getDownloadURL } from 'firebase/storage';
import { set } from 'firebase/database';

export default function ImageManager({ selectedWord }) {
    const [status, requestPermission] = ImagePicker.useCameraPermissions();
    const [imageUri, setImageUri] = useState("");

    async function verifyCameraPermissions() {
        if (status.granted) {
            return true;
        }
        try {
            const response = await requestPermission();
            return response.granted;
        
        } catch (error) {
            console.log(error);
        }
    }


    async function takeImageHandler() {
        try {
            const hasPermission = await verifyCameraPermissions();
            if (!hasPermission) {
                Alert.alert("Please grant camera permissions to use this feature.");
                return;
            }
            const results = await ImagePicker.launchCameraAsync({
               allowsEditing: true,
            });
            console.log(results);
            //receiveImageURI(results.assets[0].uri);
            setImageUri(results.assets[0].uri)
            uploadImage(results.assets[0].uri);
        } catch (error) {
            console.log(error);
        
        }
    }

    async function uploadImage(uri) {
        try {
            const response = await fetch(uri);
            const imageBlob = await response.blob();
            const imageName = uri.substring(uri.lastIndexOf('/') + 1);
            const imageRef = ref(storage, `wordImages/${imageName}`);
            const uploadResult = await uploadBytes(imageRef, imageBlob);
            console.log("Upload Success");
            console.log(uploadResult.metadata.fullPath);
            //writeImageLinkToWord(uploadResult.metadata.fullPath);
            //return uploadResult.metadata.fullPath;
            getDownloadURL(imageRef).then((downloadURL) => { 
                console.log("File available at", downloadURL);
                setImageUri(downloadURL);
                writeImageLinkToWord(downloadURL);
            });
        } catch (error) {
            console.log(error);
        }
    }

    function writeImageLinkToWord(downloadURL) {
        editImageLinkInWord(selectedWord, { imageUri: downloadURL });
 }

    // function saveImageChange() {
    //     uploadImage(imageUri);
    // }

    










  return (
    <View>
      <Button title="Add Image" onPress={takeImageHandler} />
      {/* <Button title="Save Image" onPress={saveImageChange} /> */}
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />}
    </View>
  )
}

const styles = StyleSheet.create({})
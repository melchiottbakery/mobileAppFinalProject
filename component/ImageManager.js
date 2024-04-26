import { StyleSheet, View, Button, Alert, Image } from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { database, storage, auth } from "../firebase-files/FirebaseSetup";

export default function ImageManager(docId) {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [imageUri, setImageUri] = useState("");
  const [imageURL, setImageURL] = useState("");

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
      setImageUri(results.assets[0].uri);
      //receiveImageURI(docId);
      //uploadImage(results.assets[0].uri);
    } catch (error) {
      console.log(error);
    }
  }

  async function linkImageUriToWord(docId) {
    try {
      if (imageUri) {
        const uploadImageUri = await getImageData(imageUri);
        const wordRef = doc(
          database,
          "users",
          auth.currentUser.uid,
          "wordlist",
          docId
        );
        await setDoc(wordRef, { imageUri: uploadImageUri }, { merge: true });
        console.log("Image link added to word");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getImageData(uri) {
    try {
      const response = await fetch(uri);
      const imageBlob = await response.blob();
      const imageName = uri.substring(uri.lastIndexOf("/") + 1);
      const imageRef = ref(storage, `wordImages/${imageName}`);
      const uploadResult = await uploadBytes(imageRef, imageBlob);
      console.log(uploadResult);
      console.log("Upload Success");
      console.log(uploadResult.metadata.fullPath);
    
      return uploadResult.metadata.fullPath;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function getImageURL() {
      if (imageUri) {
        const uploadImageUri = await getImageData(imageUri);
        if (uploadImageUri) {
          const imageRef = ref(storage, uploadImageUri);
          try {
            const imageDownloadURL = await getDownloadURL(imageRef);
            setImageURL(imageDownloadURL);
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
    getImageURL();
  }, [imageUri]);

  return (
    <View>
      <Button title="Add/edit Image" onPress={takeImageHandler} />
      <Button title="Save Image" onPress={linkImageUriToWord} />

      {imageURL && (
        <Image source={{ uri: imageURL }} style={{ width: 100, height: 100 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({});

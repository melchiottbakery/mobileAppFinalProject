// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCM9oLreQ76KUcldfw9GvEjNglgEjeb5fM",
  authDomain: "groupproject-e9078.firebaseapp.com",
  projectId: "groupproject-e9078",
  storageBucket: "groupproject-e9078.appspot.com",
  messagingSenderId: "539915644722",
  appId: "1:539915644722:web:d6f28e6f874303c99c312b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
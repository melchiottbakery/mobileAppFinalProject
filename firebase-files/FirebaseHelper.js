import { collection, addDoc, setDoc } from "firebase/firestore";
import { database } from "./FirebaseSetup";
import { doc, deleteDoc } from "firebase/firestore";

//write to the database with data
export async function writeToDB(data) {
    try {
      const docRef = await addDoc(collection(database, "public"), data);
      console.log("Document ID is: ", docRef.id);
    } catch (err) {
      console.log(err);
    }
  }
  
  //delete the data with the id from the database 
export async function deleteFromDB(id) {
    try {
      await deleteDoc(doc(database, "activities", id));
      console.log("Delete confirmed, the id is ", id);
    } catch (err) {
      console.log(err);
    }
  }
import { collection, addDoc, setDoc } from "firebase/firestore";
import { database } from "./FirebaseSetup";
import { doc, deleteDoc,  } from "firebase/firestore";

//write to the database with data
// export async function writeToDB(data) {
//     try {
//       if(data.meaning){
//     const docRef = await addDoc(collection(database, "usertest"), data);
//       console.log("Document ID is: ", docRef.id);
//       console.log("the new data is",data)}
//     } catch (err) {
//       console.log(err);
//     }
//   }

  export async function writeToDB(data) {
    try {
      if(data.translationMeaning){
      console.log('123',data.translationMeaning)
    // const docRef = await addDoc(collection(database, "usertest"), data);
    await setDoc(doc(database, "usertest", data.nativeWord), data);
      // console.log("Document ID is: ", docRef.id);
      console.log("the new data is",data)}
    } catch (err) {
      console.log(err);
    }
  }



  // try {
  //   await setDoc(doc(database, "activities", id), data, { merge: true });
  //   console.log("Edit confirmed, the id is ", id);
  // } catch (err) {
  //   console.log(err);
  // }
  
  //delete the data with the id from the database 
export async function deleteFromDB(id) {
    try {
      await deleteDoc(doc(database, "usertest", id));
      console.log("Delete confirmed, the id is ", id);
    } catch (err) {
      console.log(err);
    }
  }

export async function editInDB(id, data) {
    try {
      await setDoc(doc(database, "usertest", id), data, { merge: true });
      console.log("Edit confirmed, the id is ", id);
    } catch (err) {
      console.log(err);
    }
  }
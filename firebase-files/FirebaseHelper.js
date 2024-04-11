import { collection, addDoc, setDoc,getDoc } from "firebase/firestore";
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

  export async function writeNewWordToUserDB(data,userId) {
    try {
      if(data.translationMeaning){
      console.log('123',data.translationMeaning)
    // const docRef = await addDoc(collection(database, "usertest"), data);
    await setDoc(doc(database, "users",userId,'wordlist', data.nativeWord), data);
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


  export async function editRememberInDB(wordId,userId, data) {
    try {
      await setDoc(doc(database, "users",userId,"wordlist", wordId), data, { merge: true });
      console.log("Edit confirmed, the id is ", wordId);
    } catch (err) {
      console.log(err);
    }
  }

  export async function editImageLinkInDB(userId, data) {
    try {
      await setDoc(doc(database, "users",userId,), data, { merge: true });
      console.log("link the picture", );
    } catch (err) {
      console.log(err);
    }
  }




  export async function setNewUserDocToDB(data, col, uid) {
    // the doc ID is user's uid
    try {
      setDoc(doc(database, col, uid), data, { merge: true });
    } catch (err) {
      console.log(err);
    }
  }

  export async function deleteWordFromUserDB(wordId,userId) {
    try {
      await deleteDoc(doc(database, "users",userId,'wordlist', wordId));
      console.log("Delete confirmed, the id is ", wordId);
    } catch (err) {
      console.log(err);
    }
  }


  export async function getProfile(col, docId) {
    try {
      const docSnap = await getDoc(doc(database, col, docId));
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (err) {
      console.log(err);
    }
  }
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
      await setDoc(doc(database, col, uid), data, { merge: true });
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

  export async function deleteBookFromLibraryDB(wordBookid) {
    try {
      await deleteDoc(doc(database, "library",wordBookid));
      console.log("Delete confirmed, the id is ", wordBookid);
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




export async function writeNewWordBookToDB(data) {
  try {    
    const docRef= await addDoc(collection(database, 'library' ), data);
    // return docRef.id
    console.log("writenewlibaray successful")

  } catch (err) {
    console.log(err);
  }
}

export async function writeWholeWordBookToDB(coverData,wordData) {
  try {    
    const docRef= await addDoc(collection(database, 'library' ), coverData);
    
    Object.keys(wordData).forEach(async key => {
      const { nativeWord, translationMeaning } = wordData[key];
      // console.log(newBookWordlist[key])
      await setDoc(doc(database, "library",docRef.id,'wordlist',key), 
      {nativeWord:nativeWord, translationMeaning:translationMeaning}, { merge: true });
      // console.log(`Key: ${key}, Native Word: ${nativeWord}, Translation Meaning: ${translationMeaning}`);
    });

    // await setDoc(doc(database, "users",userId,), data, { merge: true });

    // docRef.id
    console.log("writenewlibaray successful， the doc id is",docRef.id)

  } catch (err) {
    console.log(err);
  }
}

export async function writeNewWordToWordBookDB(id, data) {
  try {
    
      await addDoc(collection(database, 'library',id,'wordlist' ), data);
      await setDoc(doc(database, "users",userId,), data, { merge: true });
    
      console.log("writenewlibaray successful")
  } catch (err) {
    console.log(err);
  }
}
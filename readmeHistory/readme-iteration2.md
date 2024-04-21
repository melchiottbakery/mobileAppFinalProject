Group Member
SUN,YUMING
LIAO,TIANZHI

the screenshots have been added.

![screenshoot of library](/screenshotFolder/library.PNG)

![screenshoot of mylist](/screenshotFolder/mylist.PNG)

![screenshoot of profile](/screenshotFolder/profile.PNG)
---

you can use the api for application, but it won't be a dictionary called
"JLPT-N5"
.env

  apiKey= "AIzaSyCM9oLreQ76KUcldfw9GvEjNglgEjeb5fM" 
  authDomain= "groupproject-e9078.firebaseapp.com" 
  projectId= "groupproject-e9078" 
  storageBucket= "groupproject-e9078.appspot.com" 
  messagingSenderId= "539915644722" 
  appId= "1:539915644722:web:d6f28e6f874303c99c312b"


---

Current State of Application 

**For the contribution for each member, please see the commmits on the tag of iteration 2.**

Right now, I have done and am working on the following functions.

it can create the new user, 
user can add the word from library to its list of words.
user can use camera to upload a photo in the profile.
user can add the wordbook from link to the library.
user can play the sound of word from the mylist.


-------


There is a collection called 
library 

with the document with the following document

id: ramdom id

title: JLPT-N5
nativeLanguage: JP
number: 3
translationLanguage: GB

The second collections are called wordlist inside each of document of the library

id: equal to the nativeWord "戦車"
nativeWord: "戦車"
translationMeaning: 'tank'



for users storage.

there is from the users collection to the document with the id of the uid from auth of each user.
there 

email:
imageUri
isAdmin:
nickname:

and for each collection there is a sub-collection called wordlist based on the following document:

id: equal to the nativeWord "戦車"
nativeWord: "戦車"
translationMeaning: 'tank'
remember: (boolean) true or false

----

At present, the construction of the basic framework has been completed. 
For the public part of the word library, it is possible to load word books and detailed parts. 
For personal word lists, the part of loading the word list can already be done.

There are 3 collections.
The collection (A) named library stores the documents of all word books.
Each word book will have a corresponding collection (B) to store the document of the word.
At the same time, a collection (C) of personal word lists will be created for each user.

CRUD

C
(Completed) Add the entire vocabulary book to the library collection via json.
 ()
(Completed) Add the entire word book from the library (collection B) 
to the user's word list (collection C). 
(Completed) Add the individual word from the library (collection B) 
to the user's word list (collection C). 
R
(Completed) Read collection A.
(Completed) Read collection B.
(Completed) Read collection C.

U
(Completed)Mark the word's status of remembered or not in Collection C. 

D
(Completed)Delete the entire word book from collectionA. 
(Completed)Delete words from collection C.





----
YOU need TO INSTALL THE REACT NAVITE

npx create-expo-app a2

YOU ALSO NEED TO INSTALL THESE PACKAGES
npm install @react-navigation/native 

npm install @react-navigation/bottom-tabs 
npm install @react-navigation/native-stack 

npx expo install expo-checkbox

import { NavigationContainer, useNavigation } from '@react-navigation/native'; import { createNativeStackNavigator } from '@react-navigation/native-stack'; import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


npm i @react-native-async-storage/async-storage


---
for firebase
npm expo install firebase


---
for .env
npm install -D react-native-dotenv

you also need to change of the babel.config.js




0409

npx expo install expo-av

npx expo install expo-image-picker

npx expo install expo-location

for interactive map:
npx expo install react-native-maps

npx expo install expo-notifications
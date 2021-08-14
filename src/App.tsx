import React from "react";

import firebase from "firebase/app";
import "firebase/firestore";

import Home from "./pages/home";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
};

const firebaseConfig: FirebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const App = () => {
  const addData = () => {
    db.collection("test1").add({
      first: "Ada",
      last: "Lovelace",
      born: 1815
    }).then((docRef) => {
      console.log("Document written with ID: ", docRef);
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
  };

  return (
    <div>
      <Home />
    </div>
  );
};

export default App;

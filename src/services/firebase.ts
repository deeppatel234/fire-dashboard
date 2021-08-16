import firebase from "firebase/app";
import "firebase/firestore";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
};

class FirebaseService {
  constructor() {
    this.db = null;
  }

  init() {
    firebase.initializeApp(firebaseConfig);

    this.db = firebase.firestore();
  }
}

export default new FirebaseService();

// const addData = () => {
//   db.collection("test1")
//     .add({
//       first: "Ada",
//       last: "Lovelace",
//       born: 1815,
//     })
//     .then((docRef) => {
//       console.log("Document written with ID: ", docRef);
//     })
//     .catch((error) => {
//       console.error("Error adding document: ", error);
//     });
// };

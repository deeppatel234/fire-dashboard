import { initializeApp } from "firebase/app";

import { initializeFirestore } from "firebase/firestore";

import { collection, addDoc } from "firebase/firestore";

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
    const firebaseApp = initializeApp(firebaseConfig);

    this.db = initializeFirestore(firebaseApp, {});
  }

  async addData() {
    try {
      const docRef = await addDoc(collection(this.db, "test3"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
}

export default new FirebaseService();

import { initializeApp } from "firebase/app";

import { initializeFirestore } from "firebase/firestore";

import { collection, addDoc, deleteDoc } from "firebase/firestore";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
}

class FirebaseService {
  constructor() {
    this.db = null;
  }

  getConfig(config) {
    const projectId = config
      ? config.projectId
      : window.localStorage.getItem("firebase-projectId") || "";
    const apiKey = config
      ? config.apiKey
      : window.localStorage.getItem("firebase-apiKey") || "";

    return {
      projectId,
      apiKey,
      authDomain: `${projectId}.firebaseapp.com`,
    };
  }

  setConfig(config) {
    window.localStorage.setItem("firebase-projectId", config.projectId);
    window.localStorage.setItem("firebase-apiKey", config.apiKey);
  }

  init() {
    const localConfig = this.getConfig();

    if (localConfig.apiKey && localConfig.projectId) {
      const firebaseConfig: FirebaseConfig = {
        apiKey: localConfig.apiKey,
        authDomain: localConfig.authDomain,
        projectId: localConfig.projectId,
      };

      const firebaseApp = initializeApp(firebaseConfig);

      this.db = initializeFirestore(firebaseApp, {});
    }
  }

  async test(config) {
    const localConfig = this.getConfig(config);

    const firebaseConfig: FirebaseConfig = {
      apiKey: localConfig.apiKey,
      authDomain: localConfig.authDomain,
      projectId: localConfig.projectId,
    };

    const firebaseApp = initializeApp(firebaseConfig);

    const db = initializeFirestore(firebaseApp, {});

    try {
      const response = await addDoc(collection(db, "test-bookmark-app"), {
        hello: "world",
      });
      await deleteDoc(response);
    } catch (e) {
      return Promise.reject();
    }
  }
}

export default new FirebaseService();

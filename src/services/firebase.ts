import { initializeApp } from "firebase/app";

import { initializeFirestore } from "firebase/firestore";

import { collection, addDoc, deleteDoc } from "firebase/firestore";
import { localGet, localSet } from "utils/chromeStorage";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
}

class FirebaseService {
  constructor() {
    this.db = null;
  }

  getDb() {
    return this.db;
  }

  async getConfig(config) {
    const projectId = config
      ? config.projectId
      : await localGet("firebase-projectId");
    const apiKey = config ? config.apiKey : await localGet("firebase-apiKey");

    return {
      projectId,
      apiKey,
    };
  }

  async setConfig(config) {
    await localSet({
      "firebase-projectId": config.projectId,
      "firebase-apiKey": config.apiKey,
    });
  }

  async init() {
    const localConfig = await this.getConfig();

    if (localConfig.apiKey && localConfig.projectId) {
      const firebaseConfig: FirebaseConfig = {
        apiKey: localConfig.apiKey,
        authDomain: `${localConfig.projectId}.firebaseapp.com`,
        projectId: localConfig.projectId,
      };

      const firebaseApp = initializeApp(firebaseConfig);

      this.db = initializeFirestore(firebaseApp, {});
    }
  }

  async test(config) {
    const localConfig = await this.getConfig(config);

    const firebaseConfig: FirebaseConfig = {
      apiKey: localConfig.apiKey,
      authDomain: `${localConfig.projectId}.firebaseapp.com`,
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

import { initializeApp } from "firebase/app";

import {
  initializeFirestore,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
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
      : await localGet("firebaseProjectId");
    const apiKey = config ? config.apiKey : await localGet("firebaseApiKey");

    return {
      projectId: projectId || "",
      apiKey: apiKey || "",
    };
  }

  async setConfig(config) {
    await localSet({
      firebaseProjectId: config.projectId,
      firebaseApiKey: config.apiKey,
    });
  }

  initFirebase(config) {
    const firebaseConfig: FirebaseConfig = {
      apiKey: config.apiKey,
      authDomain: `${config.projectId}.firebaseapp.com`,
      projectId: config.projectId,
    };

    const firebaseApp = initializeApp(firebaseConfig);

    const db = initializeFirestore(firebaseApp, {
      ignoreUndefinedProperties: true,
    });

    return db;
  }

  async init() {
    const localConfig = await this.getConfig();

    if (localConfig.apiKey && localConfig.projectId) {
      this.db = this.initFirebase(localConfig);
    }
  }

  async test(config) {
    const db = this.initFirebase(config);

    const response = await addDoc(collection(db, "test-fire-dashboard-app"), {
      hello: "world",
    });

    await deleteDoc(response);
  }

  async hasBackup(config) {
    const db = this.initFirebase(config);

    const querySnapshot = await getDocs(
      query(collection(db, "workspace_workspace"), where("isDeleted", "==", 0)),
    );

    const workspaces = [];

    querySnapshot.forEach((doc) => workspaces.push(doc.data()));

    return !!workspaces.length;
  }

  async deleteAllWorkspace(config) {
    const db = this.initFirebase(config);

    const querySnapshot = await getDocs(
      query(collection(db, "workspace_workspace"), where("isDeleted", "==", 0)),
    );

    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, { isDeleted: 1 });
    });
  }
}

export default new FirebaseService();

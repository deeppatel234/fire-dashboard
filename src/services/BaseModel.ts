import {
  collection,
  setDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";

const createUUID = () => {
  // Decent solution from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
  let d = Date.now();
  const uuid = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : (r & 0x7) | 0x8).toString(16);
    },
  );
  return uuid;
};

class BaseModal {
  constructor() {
    this.db = null;
    this.dbName = null;
    this.firebaseDb = null;
    this.firebaseCollection = null;
  }

  getModalName() {
    return this.modalName;
  }

  getModalIndexes() {
    return ["id", "writeAt", "isDeleted", ...(this.modalIndexes || [])];
  }

  onModalCreate() {}

  getDb() {
    return this.db;
  }

  setDb(db, dbName) {
    this.db = db;
    this.dbName = dbName;

    db.hook("creating", (primKey, obj) => {
      const epoc = this.getTime();

      if (!obj.id) {
        obj.id = this.getUniqId();
      }

      if (!obj.createAt) {
        obj.createAt = epoc;
      }

      if (!obj.writeAt) {
        obj.writeAt = epoc;
      }

      if (typeof obj.isDeleted === "undefined") {
        obj.isDeleted = 0;
      }

      if (obj.syncAt) {
        delete obj.syncAt;
      }

      return obj.id;
    });

    db.hook("updating", (modifications, primKey, obj) => {
      const epoc = this.getTime();

      if (modifications.syncAt) {
        modifications.syncAt = null;
      } else {
        modifications.writeAt = epoc;
      }

      if (!obj.createAt) {
        modifications.createAt = epoc;
      }

      if (typeof obj.isDeleted === "undefined") {
        modifications.isDeleted = 0;
      }

      return modifications;
    });
  }

  getModalKey() {
    return `${this.dbName}_${this.getModalName()}`;
  }

  setFirebasedb(db) {
    this.firebaseDb = db;
    this.firebaseCollection = collection(db, this.getModalKey());
  }

  setToFirebase(data) {
    return setDoc(doc(this.firebaseDb, this.getModalKey(), data.id), data);
  }

  getAllFirebase() {
    return getDocs(this.firebaseCollection);
  }

  async getAllUpdatedFirebase(timeFrom, timeTo) {
    const querySnapshot = await getDocs(
      query(
        this.firebaseCollection,
        where("syncAt", ">", timeFrom),
        where("syncAt", "<=", timeTo),
      ),
    );

    const dataToUpdate = [];

    querySnapshot.forEach((doc) => dataToUpdate.push(doc.data()));

    return dataToUpdate;
  }

  getAllUpdatedLocal(timeFrom, timeTo) {
    return this.db.where("writeAt").between(timeFrom, timeTo).toArray();
  }

  async add(data) {
    const id = await this.db.add({
      ...data,
    });

    return this.db.get(id);
  }

  async bulkAdd(data) {
    const ids = await this.db.bulkAdd(
      data.map((d) => ({
        ...d,
      })),
      null,
      { allKeys: true },
    );

    return this.db.bulkGet(ids);
  }

  async update(data) {
    const isUpdated = await this.db.update(data.id, {
      ...data,
    });

    if (isUpdated) {
      return this.db.get(data.id);
    }

    return Promise.reject();
  }

  async put(data) {
    const id = await this.db.put({
      ...data,
    });

    if (id) {
      return this.db.get(id);
    }

    return Promise.reject();
  }

  async bulkPut(data) {
    const ids = await this.db.bulkPut(
      data.map((d) => ({ ...d })),
      { allKeys: true },
    );

    return this.db.bulkGet(ids);
  }

  getAll() {
    return this.db.where("isDeleted").notEqual(1).toArray();
  }

  getTime() {
    return new Date().getTime();
  }

  getUniqId() {
    return createUUID();
  }
}

export default BaseModal;

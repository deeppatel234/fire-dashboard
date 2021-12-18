import { collection, addDoc, getDocs } from "firebase/firestore";

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
  }

  getModalName() {
    return this.modalName;
  }

  getModalIndexes() {
    return ["id", "serverId", "writeAt", ...(this.modalIndexes || [])];
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

      if (!obj.serverId) {
        obj.serverId = "0";
      }

      return obj.id;
    });

    db.hook("updating", (modifications) => {
      const epoc = this.getTime();

      modifications.writeAt = epoc;

      return modifications;
    });
  }

  setFirebasedb(db) {
    this.firebaseDb = collection(db, `${this.dbName}_${this.getModalName()}`);
  }

  addToFirebase(data) {
    return addDoc(this.firebaseDb, data);
  }

  getAllFirebase() {
    return getDocs(this.firebaseDb);
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

  async bulkPut(data) {
    const ids = await this.db.bulkPut(
      data.map((d) => ({ ...d })),
      { allKeys: true },
    );

    return this.db.bulkGet(ids);
  }

  getAll() {
    return this.db.toArray();
  }

  getTime() {
    return new Date().getTime();
  }

  getUniqId() {
    return createUUID();
  }
}

export default BaseModal;

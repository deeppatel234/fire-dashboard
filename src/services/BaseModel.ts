const ObjectId = (
  m = Math,
  d = Date,
  h = 16,
  s = (str) => m.floor(str).toString(h),
) => s(d.now() / 1000) + " ".repeat(h).replace(/./g, () => s(m.random() * h));

class BaseModal {
  constructor() {
    this.db = null;
  }

  getModalName() {
    return this.modalName;
  }

  getModalIndexes() {
    return ["++id", "serverId", ...(this.modalIndexes || [])];
  }

  onModalCreate() {}

  setDb(db) {
    this.db = db;
  }

  insert(data) {
    const epoc = new Date().valueOf();

    return this.db.put({
      ...data,
      createAt: epoc,
      writeAt: epoc,
    });
  }

  getAll() {
    return this.db.toArray();
  }

  getUniqId() {
    return ObjectId();
  }
}

export default BaseModal;

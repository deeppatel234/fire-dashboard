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

  async add(data) {
    const epoc = new Date().valueOf();

    const id = await this.db.add({
      ...data,
      createAt: epoc,
      writeAt: epoc,
    });

    return this.db.get(id);
  }

  async bulkAdd(data) {
    const epoc = new Date().valueOf();

    const ids = await this.db.bulkAdd(
      data.map((d) => ({
        ...d,
        createAt: epoc,
        writeAt: epoc,
      })),
      null,
      { allKeys: true },
    );

    return this.db.bulkGet(ids);
  }

  async update(data) {
    const epoc = new Date().valueOf();

    const id = await this.db.update(data.id, {
      ...data,
      writeAt: epoc,
    });

    return this.db.get(id);
  }

  async bulkPut(data) {
    const epoc = new Date().valueOf();

    const ids = await this.db.bulkPut(
      data.map((d) => ({ ...d, writeAt: epoc })),
      { allKeys: true },
    );

    return this.db.bulkGet(ids);
  }

  getAll() {
    return this.db.toArray();
  }

  getUniqId() {
    return ObjectId();
  }
}

export default BaseModal;

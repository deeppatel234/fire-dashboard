import firebaseService from "./firebase";

import { initStorage, initWorkpaceStorage } from "./initService";

class Sync {
  async syncNewAddedFromServer(modal) {
    const querySnapshot = await modal.getAllFirebase();

    const dataToSave = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.serverId = doc.id;
      dataToSave.push(data);
    });

    await modal.bulkPut(dataToSave);
  }

  async syncNewAddedFromLocal(modal) {
    const modalDb = modal.getDb();

    const allNotSyncRecords = await modalDb
      .where("serverId")
      .equals("0")
      .toArray();

    await Promise.allSettled(
      allNotSyncRecords.map(async (record) => {
        const ref = await modal.addToFirebase(record);

        record.serverId = ref.id;

        return modal.update(record);
      }),
    );
  }

  async syncModal(modal) {
    modal.setFirebasedb(firebaseService.getDb());

    await this.syncNewAddedFromServer(modal);
    await this.syncNewAddedFromLocal(modal);
  }

  async syncWorkspaceDb(workspace) {
    const modals = initStorage(workspace);

    for (let j = 0; j < modals.length; j++) {
      const modal = modals[j];

      await this.syncModal(modal);
    }
  }

  async start() {
    firebaseService.init();

    const workspaceModal = initWorkpaceStorage();

    try {
      await this.syncModal(workspaceModal);

      const workspaces = await workspaceModal.getAll();

      for (let i = 0; i < workspaces.length; i++) {
        try {
          const workspace = workspaces[i];
          await this.syncWorkspaceDb(workspace);
        } catch (err) {}
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export default new Sync();

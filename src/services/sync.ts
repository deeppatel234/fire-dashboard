import firebaseService from "./firebase";

import { initStorage, initWorkpaceStorage } from "./initService";

class Sync {
  async syncModal(modal) {
    modal.setFirebasedb(firebaseService.getDb());

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

      await Promise.allSettled(
        workspaces.map((workspace) => this.syncWorkspaceDb(workspace)),
      );
    } catch (err) {
      console.log(err);
    }
  }
}

export default new Sync();

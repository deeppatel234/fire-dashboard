/* global chrome */

import firebaseService from "./firebase";
import _uniq from "lodash/uniq";
import _keyBy from "lodash/keyBy";

import { localGet, localSet } from "utils/chromeStorage";
import { initStorage, initWorkpaceStorage } from "./initService";

class Sync {
  async syncFromServer(modal) {
    const lastSyncTime = (await localGet(modal.getModalKey())) || 1577817000000;
    const currentTime = new Date().getTime();

    const updatedServerRecords = await modal.getAllUpdatedFirebase(
      lastSyncTime,
      currentTime,
    );

    const updatedLocalRecords = await modal.getAllUpdatedLocal(
      lastSyncTime,
      currentTime,
    );

    const idsToCheck = _uniq([
      ...updatedServerRecords.map((d) => d.id),
      ...updatedLocalRecords.map((d) => d.id),
    ]);

    const keyByUpdatedServerRecords = _keyBy(updatedServerRecords, "id");
    const keyByUpdatedLocalRecords = _keyBy(updatedLocalRecords, "id");

    const localRecordUpdateList = [];
    const serverRecordUpdateList = [];

    idsToCheck.forEach((id) => {
      if (!keyByUpdatedLocalRecords[id]) {
        localRecordUpdateList.push(keyByUpdatedServerRecords[id]);
        return;
      }

      if (!keyByUpdatedServerRecords[id]) {
        serverRecordUpdateList.push(keyByUpdatedLocalRecords[id]);
        return;
      }

      if (
        keyByUpdatedServerRecords[id].writeAt >
        keyByUpdatedLocalRecords[id].writeAt
      ) {
        localRecordUpdateList.push(keyByUpdatedServerRecords[id]);
      } else {
        serverRecordUpdateList.push(keyByUpdatedLocalRecords[id]);
      }
    });

    if (localRecordUpdateList.length) {
      await modal.bulkPut(localRecordUpdateList);
    }

    if (serverRecordUpdateList.length) {
      const syncAt = new Date().getTime();
      await Promise.all(
        serverRecordUpdateList.map((data) =>
          modal.setToFirebase({ ...data, syncAt }),
        ),
      );
    }

    await localSet({ [modal.getModalKey()]: currentTime });
  }

  async syncModal(modal) {
    modal.setFirebasedb(firebaseService.getDb());

    await this.syncFromServer(modal);
  }

  async syncWorkspaceDb(workspace) {
    const modals = initStorage(workspace);

    for (let j = 0; j < modals.length; j++) {
      const modal = modals[j];

      await this.syncModal(modal);
    }
  }

  async start() {
    try {
      await firebaseService.init();

      const workspaceModal = initWorkpaceStorage();

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

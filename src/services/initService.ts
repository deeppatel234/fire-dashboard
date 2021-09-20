import Dexie from "dexie";

import WorkspaceModal from "./WorkspaceModal";
import BookmarkModal from "./BookmarkModal";

const workspaceDBName = "workspace";
const workspaceDBVersion = 1;

const appDbVersion = 1;

export const initWorkpaceStorage = () => {
  const db = new Dexie(workspaceDBName);

  db.version(workspaceDBVersion).stores({
    [WorkspaceModal.getModalName()]: WorkspaceModal.getModalIndexes().join(","),
  });

  WorkspaceModal.setDb(db[WorkspaceModal.getModalName()]);
};

export const initStorage = (workspace) => {
  const modalList = [BookmarkModal];
  const db = new Dexie(workspace.collectionKey);

  db.version(appDbVersion).stores(
    modalList.reduce((memo, modal) => {
      return {
        ...memo,
        [modal.getModalName()]: modal.getModalIndexes().join(","),
      };
    }, {}),
  );

  modalList.forEach((modal) => {
    modal.setDb(db[modal.getModalName()]);
  });
};

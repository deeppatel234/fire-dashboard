import Dexie from "dexie";

import WorkspaceModal from "./WorkspaceModal";
import BookmarkModal from "./BookmarkModal";
import BookmarkGroupModal from "./BookmarkGroupModal";

const workspaceDBName = "workspace";
const workspaceDBVersion = 1;

const appDbVersion = 1;

export const initWorkpaceStorage = () => {
  const db = new Dexie(workspaceDBName);

  db.version(workspaceDBVersion).stores({
    [WorkspaceModal.getModalName()]: WorkspaceModal.getModalIndexes().join(","),
  });

  WorkspaceModal.setDb(db[WorkspaceModal.getModalName()], workspaceDBName);

  return WorkspaceModal;
};

export const initStorage = (workspace) => {
  const modalList = [BookmarkGroupModal, BookmarkModal];
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
    modal.setDb(db[modal.getModalName()], workspace.collectionKey);
  });

  return modalList;
};

export const deleteWorkspaceDb = (workspace) => {
  Dexie.delete(workspace.collectionKey);
};

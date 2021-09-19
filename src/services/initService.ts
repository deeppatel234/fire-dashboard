import Dexie from "dexie";

import WorkspaceModal from "./WorkspaceModal";

const idb =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;

export const isIDBSupported = !!idb;

export const initWorkpaceStorage = () => {
  const db = new Dexie("workspace");

  db.version(1).stores({
    [WorkspaceModal.getModalName()]: WorkspaceModal.getModalIndexes().join(","),
  });

  WorkspaceModal.setDb(db[WorkspaceModal.getModalName()]);
};

// export const initStorage = (workspace) => {
//   const modalList = [];

//   return new Promise((resolve, reject) => {
//     const dbRequest = idb.open(
//       workspace.collectionKey,
//       workspace.localDBVersion,
//     );

//     dbRequest.onerror = () => {
//       console.error("Error in open database");
//       reject();
//     };

//     dbRequest.onsuccess = () => {
//       const db = dbRequest.result;
//       modalList.forEach((modal) => {
//         modal.setDb(db);
//       });
//       resolve();
//     };

//     dbRequest.onupgradeneeded = (event) => {
//       const db = event.target.result;

//       modalList.forEach((modal) => {
//         if (!db.objectStoreNames.contains(modal.getModalName())) {
//           const ts = db.createObjectStore(
//             modal.getModalName(),
//             modal.getModalConfig(),
//           );
//           modal.getAllIndexes().forEach(({ name, keyPath, options = {} }) => {
//             ts.createIndex(name, keyPath, options);
//           });
//         }
//       });
//     };
//   });
// };

/* global chrome */

import { localGet } from "utils/chromeStorage";

import sync from "../services/sync";

const APP_NAME = "BOOKMARK_APP";
const SYNC_NOW = "SYNC_NOW";
const SYNC_STARTED = "SYNC_STARTED";
const SYNC_COMPLETED = "SYNC_COMPLETED";

let timeoutId = null;

const triggerSync = async () => {
  chrome.runtime.sendMessage({
    app: APP_NAME,
    type: SYNC_STARTED,
  });

  try {
    await sync.start();
  } catch (err) {}

  chrome.runtime.sendMessage({
    app: APP_NAME,
    type: SYNC_COMPLETED,
  });
};

const startSync = async (syncOnStart) => {
  const syncSetting = await localGet("syncSetting");

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  if (syncOnStart) {
    await triggerSync();
  }

  if (syncSetting?.syncInterval) {
    timeoutId = setTimeout(async () => {
      if (syncSetting?.autoSync) {
        await triggerSync();
        startSync();
      }
    }, syncSetting?.syncInterval);
  }
};

const init = async () => {
  const syncSetting = await localGet("syncSetting");

  if (syncSetting?.autoSync) {
    startSync(true);
  }
};

init();

chrome.runtime.onMessage.addListener((request) => {
  if (request.app === APP_NAME && request.type) {
    if (request.type === SYNC_NOW) {
      startSync(true);
    }
  }
});

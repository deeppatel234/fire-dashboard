/* global chrome */

import { localGet } from "utils/chromeStorage";

import sync from "../services/sync";

const APP_NAME = "BOOKMARK_APP";
const SYNC_NOW = "SYNC_NOW";
const SYNC_STARTED = "SYNC_STARTED";
const SYNC_COMPLETED = "SYNC_COMPLETED";

const SYNC_INTERVAL_TIME = 15 * 60 * 1000;
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
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  if (syncOnStart) {
    await triggerSync();
  }

  timeoutId = setTimeout(async () => {
    const isAutoSyncEnabled = await localGet("autoSyncEnabled");
    if (isAutoSyncEnabled) {
      await triggerSync();
      startSync();
    }
  }, SYNC_INTERVAL_TIME);
};

const init = async () => {
  const isAutoSyncEnabled = await localGet("autoSyncEnabled");

  if (isAutoSyncEnabled) {
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

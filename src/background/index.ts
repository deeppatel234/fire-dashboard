/* global chrome */

import { localGet, localSet } from "utils/chromeStorage";

import sync from "services/sync";

const APP_NAME = "BOOKMARK_APP";
const SYNC_NOW = "SYNC_NOW";
const SYNC_STARTED = "SYNC_STARTED";
const SYNC_COMPLETED = "SYNC_COMPLETED";

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

const startSync = async () => {
  const syncSetting = await localGet("syncSetting");

  chrome.alarms.clear("autoSync");

  await localSet({ lastSyncStartTime: new Date().valueOf() });

  try {
    await triggerSync();
  } catch (err) {}

  await localSet({ lastSyncEndTime: new Date().valueOf() });

  if (syncSetting?.syncInterval && syncSetting?.autoSync) {
    chrome.alarms.create("autoSync", {
      delayInMinutes: syncSetting.syncInterval,
    });
  }
};

const init = async () => {
  const syncSetting = await localGet("syncSetting");

  if (syncSetting?.autoSync) {
    startSync();
  }

  chrome.alarms.onAlarm.addListener((type) => {
    if (type?.name === "autoSync") {
      startSync();
    }
  });
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.app === APP_NAME && request.type) {
    if (request.type === SYNC_NOW) {
      startSync();
    }
  }
});

init();

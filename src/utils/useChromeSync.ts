import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const APP_NAME = "BOOKMARK_APP";
const SYNC_NOW = "SYNC_NOW";
const SYNC_STARTED = "SYNC_STARTED";
const SYNC_COMPLETED = "SYNC_COMPLETED";
const SYNC_FAILED = "SYNC_FAILED";

const useChromeSync = ({ onSyncComplete } = {}) => {
  const [isSyncInProgress, setIsSyncInProgress] = useState(false);

  const listener = useCallback((request) => {
    if (request.app === APP_NAME && request.type) {
      if (request.type === SYNC_STARTED) {
        setIsSyncInProgress(true);
      }
      if (request.type === SYNC_FAILED) {
        setIsSyncInProgress(false);
        toast.error("Sync failed. Please report a issue.");
      }
      if (request.type === SYNC_COMPLETED) {
        setIsSyncInProgress(false);
        if (onSyncComplete) {
          onSyncComplete();
        }
      }
    }
  }, []);

  const addListeners = () => {
    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  };

  useEffect(() => {
    addListeners();
  }, []);

  const startSync = () => {
    chrome.runtime.sendMessage({
      app: APP_NAME,
      type: SYNC_NOW,
    });
  };

  return { isSyncInProgress, startSync };
};

export default useChromeSync;

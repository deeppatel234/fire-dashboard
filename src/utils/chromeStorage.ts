/* global chrome */

export const localGet = (keys) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(Array.isArray(keys) ? keys : [keys], (result) => {
      resolve(Array.isArray(keys) ? result : result[keys]);
    });
  });
};

export const localSet = (values) => {
  return new Promise((resolve) => {
    chrome.storage.local.set(values, () => {
      resolve(values);
    });
  });
};

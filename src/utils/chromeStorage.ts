/* global chrome */

const appendId = (key, id) => {
  if (id) {
    return `${key}-workspace-${id}`;
  }
  return key;
};

const removeKey = (key, id) => {
  if (key && id) {
    return key.replace(`-workspace-${id}`, "");
  }
  return key;
};

export const localGet = (keys, id) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      Array.isArray(keys)
        ? keys.map((k) => appendId(k, id))
        : [appendId(keys, id)],
      (result) => {
        resolve(
          Array.isArray(keys)
            ? Object.keys(result).reduce((memo, key) => {
                return {
                  ...memo,
                  [removeKey(key, id)]: result[key],
                };
              }, {})
            : result[appendId(keys, id)],
        );
      },
    );
  });
};

export const localSet = (values, id) => {
  return new Promise((resolve) => {
    chrome.storage.local.set(
      Object.keys(values).reduce((memo, key) => {
        return {
          ...memo,
          [appendId(key, id)]: values[key],
        };
      }, {}),
      () => {
        resolve(values);
      },
    );
  });
};

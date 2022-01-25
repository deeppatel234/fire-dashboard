import { useCallback, useEffect, useMemo, useState } from "react";
import _keyBy from "lodash/keyBy";

const useChromeTabs = ({ ignoreUrls, listnerTabs = true } = {}) => {
  const [tabs, setTabs] = useState([]);

  const tabIds = useMemo(() => {
    return tabs.map((tab) => tab.id);
  }, [tabs]);

  const tabData = useMemo(() => {
    return _keyBy(tabs, "id");
  }, [tabs]);

  const getCurrentTab = () => {
    chrome.tabs.query({}, (tabs) => {
      if (ignoreUrls) {
        setTabs(tabs.filter((tab) => !ignoreUrls.includes(tab.url)));
      } else {
        setTabs(tabs);
      }
    });
  };

  const listener = useCallback(() => {
    getCurrentTab();
  }, []);

  const addListeners = () => {
    chrome.tabs.onRemoved.addListener(listener);
    chrome.tabs.onUpdated.addListener(listener);

    getCurrentTab();

    return () => {
      chrome.tabs.onRemoved.removeListener(listener);
      chrome.tabs.onUpdated.removeListener(listener);
    };
  };

  useEffect(() => {
    if (listnerTabs) {
      addListeners();
    }
  }, [listnerTabs]);

  const removeAllTabs = () => {
    return new Promise((resolve) => {
      chrome.tabs.getCurrent((currentTab) => {
        const otherTabs = tabIds.filter((id) => id !== currentTab.id);

        chrome.tabs.remove(otherTabs);

        resolve();
      });
    });
  };

  const createTabs = (tabList) => {
    tabList.forEach((tabToCreate) => {
      chrome.tabs.create(tabToCreate);
    });
  };

  const updateCurrentTab = (dataToUpdate) => {
    chrome.tabs.getCurrent((tabData) => {
      chrome.tabs.update(tabData.id, dataToUpdate);
    });
  };

  return { tabs, tabIds, tabData, removeAllTabs, createTabs, updateCurrentTab };
};

export default useChromeTabs;

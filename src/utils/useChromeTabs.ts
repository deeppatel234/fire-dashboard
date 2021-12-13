import { useCallback, useEffect, useMemo, useState } from "react";
import _keyBy from "lodash/keyBy";

const useChromeTabs = ({ ignoreUrls } = {}) => {
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
    addListeners();
  }, []);

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

  return { tabs, tabIds, tabData, removeAllTabs, createTabs };
};

export default useChromeTabs;

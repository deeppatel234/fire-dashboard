import { useCallback, useEffect, useMemo, useState } from "react";
import _keyBy from "lodash/keyBy";

const useChromeTabs = ({ ignoreUrls }) => {
  const [tabs, setTabs] = useState([]);

  const tabIds = useMemo(() => {
    return tabs.map((tab) => tab.id);
  }, [tabs]);

  const tabData = useMemo(() => {
    return _keyBy(tabs, "id");
  }, [tabs]);

  const getCurrentTab = () => {
    chrome.tabs.query({}, (tabs) => {
      setTabs(tabs.filter((tab) => !ignoreUrls.includes(tab.url)));
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

  return { tabs, tabIds, tabData };
};

export default useChromeTabs;

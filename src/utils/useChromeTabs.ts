import { useCallback, useEffect, useState } from "react";

const useChromeTabs = () => {
  const [tabs, setTabs] = useState([]);

  const getCurrentTab = () => {
    chrome.tabs.query({}, (tabs) => {
      setTabs(tabs);
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

  return { tabs };
};

export default useChromeTabs;

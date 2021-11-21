import React, { useContext, useEffect, useState } from "react";
import _keyBy from "lodash/keyBy";
import _groupBy from "lodash/groupBy";
import _sortBy from "lodash/sortBy";
import _isEqual from "lodash/isEqual";
import _cloneDeep from "lodash/cloneDeep";

import AppContext from "src/AppContext";
import useChromeTabs from "utils/useChromeTabs";

import BookmarkModal from "../../services/BookmarkModal";
import BookmarkGroupModal from "../../services/BookmarkGroupModal";

import BookmarkContext from "./BookmarkContext";
import BookmarkView from "./BookmarkView";

import "./index.scss";

const sortData = (list) => {
  return _sortBy(list, "position");
};

const Bookmark = (): JSX.Element => {
  const { workspace } = useContext(AppContext);
  const { tabIds, tabData } = useChromeTabs({
    ignoreUrls: ["chrome://newtab/"],
  });
  const [groups, setGroups] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [data, setData] = useState({});
  const [dataTabIds, setDataTabIds] = useState([]);
  const [originalData, setOriginalData] = useState({});

  const loadData = async () => {
    try {
      const groupResponse = await BookmarkGroupModal.getAll();
      const response = await BookmarkModal.getAll();
      setGroups(_keyBy(groupResponse, "id"));
      setBookmarks(_keyBy(response, "id"));
    } catch (err) {}
  };

  useEffect(() => {
    loadData();
  }, [workspace]);

  useEffect(() => {
    const groupedBookmark = _groupBy(bookmarks, "groupId");
    const items = Object.values(groups).reduce((memo, g) => {
      return {
        ...memo,
        [`Group-${g.id}`]: sortData(groupedBookmark[g.id] || []).map(
          (b) => `Bookmark-${g.id}-${b.id}`,
        ),
      };
    }, {});

    const dataToStore = {
      items,
      groupIds: sortData(Object.values(groups)).map((g) => `Group-${g.id}`),
    };

    setData(dataToStore);
    setOriginalData(_cloneDeep(dataToStore));
  }, [bookmarks, groups]);

  useEffect(() => {
    setDataTabIds(tabIds);
  }, [tabIds]);

  const resetData = () => {
    setData(originalData);
  };

  const updateGroupData = async (newGroupData) => {
    try {
      const newGroupResponse = await BookmarkGroupModal.bulkPut(newGroupData);
      setGroups(_keyBy(newGroupResponse, "id"));
    } catch (err) {}
  };

  const updateBookmarkData = async (newBookmark) => {
    try {
      const newBookmarkResponse = await BookmarkModal.bulkPut(newBookmark);
      setBookmarks((bookmarks) => ({
        ...bookmarks,
        ..._keyBy(newBookmarkResponse, "id"),
      }));
    } catch (err) {}
  };

  const updateData = (containerId, newData) => {
    if (containerId === "group") {
      updateGroupData(
        newData.groupIds.map((i, index) => {
          const [, groupId] = i.split("-");
          const intGroupId = parseInt(groupId, 10);

          return {
            ...groups[intGroupId],
            position: index,
          };
        }),
      );
    } else {
      const oldItems = originalData.items;
      const newItems = newData.items;
      Object.keys(newItems).forEach((key) => {
        const [, strGroupId] = key.split("-");
        const groupId = parseInt(strGroupId, 10);

        if (!_isEqual(newItems[key], oldItems[key])) {
          updateBookmarkData(
            newItems[key].map((i, index) => {
              const [type, tabId, bookmarkId] = i.split("-");
              const intBookmarkId = parseInt(bookmarkId, 10);
              let dataToSave = bookmarks[intBookmarkId];

              if (type === "tab") {
                const tab = tabData[tabId];
                dataToSave = {
                  favIconUrl: tab.favIconUrl,
                  url: tab.url,
                  title: tab.title,
                };
              }

              return {
                ...dataToSave,
                groupId,
                position: index,
              };
            }),
          );
        }
      });
    }

    setData(newData);
  };

  const createNewGroup = async (data) => {
    try {
      const groupResponse = await BookmarkGroupModal.add({
        icon: "ri-folder-line",
        ...data,
        name: data.name || `Untitled`,
        position: Object.keys(groups).length,
      });
      setGroups({ ..._keyBy([groupResponse], "id"), ...groups });
      return groupResponse;
    } catch (err) {
      console.log("err", err);
    }
  };

  const createGroupAndAddBookmark = async ({ groupData, bookmarkData }) => {
    try {
      const groupResponse = await createNewGroup(groupData);
      await updateBookmarkData([
        {
          ...bookmarkData,
          groupId: groupResponse.id,
          position: 0,
        },
      ]);
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <BookmarkContext.Provider
      value={{
        groups,
        bookmarks,
        data,
        dataTabIds,
        tabIds,
        tabData,
        setDataTabIds,
        setData,
        updateData,
        setGroups,
        setBookmarks,
        createNewGroup,
        createGroupAndAddBookmark,
        resetData,
      }}
    >
      <BookmarkView />
    </BookmarkContext.Provider>
  );
};

export default Bookmark;

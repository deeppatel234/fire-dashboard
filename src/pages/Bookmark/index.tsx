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
import BookmarkPositionModal from "../../services/BookmarkPositionModal";

import BookmarkContext from "./BookmarkContext";
import BookmarkView from "./BookmarkView";
import {
  getId,
  getGroupId,
  getBookmarkId,
  appendGroupId,
  appendBookmarkId,
} from "./utils";

const Bookmark = (): JSX.Element => {
  const { workspace } = useContext(AppContext);
  const { tabIds, tabData } = useChromeTabs({
    ignoreUrls: ["chrome://newtab/"],
  });
  const [groups, setGroups] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [positions, setPositions] = useState({});
  const [originalPositions, setOriginalPositions] = useState({});
  const [enableBulkAction, setEnableBulkAction] = useState(false);
  const [bulkActionIds, setBulkActionIds] = useState([]);

  console.log("positions", positions);

  const setPositionData = (cb) => {
    setPositions((currentData) => {
      const newData = cb(currentData);

      setOriginalPositions(_cloneDeep(newData));

      return newData;
    });
  };

  const fetchPositionData = async () => {
    const { group, ...rest } =
      _keyBy(await BookmarkPositionModal.getAll(), "id") || {};

    setPositionData(() => ({
      groupIds: group?.list || [],
      items: Object.keys(rest).reduce(
        (memo, key) => ({
          ...memo,
          [key]: rest[key].list,
        }),
        {},
      ),
    }));
  };

  const loadData = async () => {
    try {
      const groupResponse = await BookmarkGroupModal.getAll();
      const response = await BookmarkModal.getAll();
      await fetchPositionData();
      setGroups(_keyBy(groupResponse, "id"));
      setBookmarks(_keyBy(response, "id"));
    } catch (err) {}
  };

  useEffect(() => {
    loadData();
  }, [workspace]);

  const resetData = () => {
    setPositions(originalPositions);
  };

  const setGroupPosition = async (listToSave) => {
    BookmarkPositionModal.put({
      id: "group",
      list: listToSave,
    });
    setPositionData((oldData) => ({
      ...oldData,
      groupIds: listToSave,
    }));
  };

  const setBookmarkPosition = async (groupId, listToSave) => {
    BookmarkPositionModal.put({
      id: appendGroupId(groupId),
      list: listToSave,
    });
    setPositionData((oldData) => ({
      ...oldData,
      items: {
        ...oldData.items,
        [appendGroupId(groupId)]: listToSave,
      },
    }));
  };

  const updateGroupData = async (newGroupData) => {
    try {
      if (Array.isArray(newGroupData)) {
        const newGroupResponse = await BookmarkGroupModal.bulkPut(newGroupData);
        setGroups((groups) => {
          const dataToReturn = {
            ...groups,
            ..._keyBy(newGroupResponse, "id"),
          };

          Object.values(dataToReturn).forEach((data) => {
            if (data.isDeleted) {
              delete data[data.id];
            }
          });

          return dataToReturn;
        });
        return newGroupResponse;
      } else {
        const newGroupResponse = await BookmarkGroupModal.put(newGroupData);

        setGroups((current) => {
          if (newGroupResponse.isDeleted) {
            delete current[newGroupResponse.id];
            return { ...current };
          }

          return {
            ...current,
            [newGroupResponse.id]: newGroupResponse,
          };
        });
        return newGroupResponse;
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const updateBookmarkData = async (newBookmark) => {
    try {
      if (Array.isArray(newBookmark)) {
        const newBookmarkResponse = await BookmarkModal.bulkPut(newBookmark);
        setBookmarks((bookmarks) => {
          const dataToReturn = {
            ...bookmarks,
            ..._keyBy(newBookmarkResponse, "id"),
          };

          Object.values(dataToReturn).forEach((data) => {
            if (data.isDeleted) {
              delete dataToReturn[data.id];
            }
          });

          return dataToReturn;
        });

        return newBookmarkResponse;
      } else {
        const newBookmarkResponse = await BookmarkModal.put(newBookmark);

        setBookmarks((current) => {
          if (newBookmarkResponse.isDeleted) {
            delete current[newBookmarkResponse.id];
            return { ...current };
          }

          return {
            ...current,
            [newBookmarkResponse.id]: newBookmarkResponse,
          };
        });

        return newBookmarkResponse;
      }
    } catch (err) {}
  };

  const updatePositions = async (containerId, newData) => {
    if (containerId === "group") {
      BookmarkPositionModal.put({
        id: "group",
        list: newData.groupIds,
      });
    } else {
      const oldItems = originalPositions.items;
      const newItems = newData.items;
      const allKeys = Object.keys(newItems);

      for (let i = 0; i < allKeys.length; i++) {
        const key = allKeys[i];

        const { groupId } = getId(key);

        if (!_isEqual(newItems[key], oldItems[key])) {
          const newItemKeys = [];

          for (let j = 0; j < newItems[key].length; j++) {
            const { type, groupId: tabId } = getId(newItems[key][j]);

            if (type === "tab") {
              const tab = tabData[tabId];
              const newBookmark = await updateBookmarkData({
                favIconUrl: tab.favIconUrl,
                url: tab.url,
                title: tab.title,
                groupId,
              });

              newItemKeys.push(appendBookmarkId(groupId)(newBookmark.id));
            } else {
              newItemKeys.push(newItems[key][j]);
            }
          }

          BookmarkPositionModal.put({
            id: key,
            list: newItemKeys,
          });

          newItems[key] = newItemKeys;
        }
      }
    }

    setPositionData(() => newData);
  };

  const createNewGroup = async (newGroupData) => {
    try {
      const groupResponse = await updateGroupData(newGroupData);
      setGroupPosition([
        appendGroupId(groupResponse.id),
        ...positions.groupIds,
      ]);
      setBookmarkPosition(groupResponse.id, []);
      return groupResponse;
    } catch (err) {
      console.log("err", err);
    }
  };

  const createGroupAndAddBookmark = async ({
    groupData,
    bookmarkData,
    bookmarkList,
  }) => {
    try {
      const groupResponse = await createNewGroup(groupData);
      const listToAdd = bookmarkList || [bookmarkData];

      const dataToSave = listToAdd.map((b) => ({
        ...b,
        groupId: groupResponse.id,
      }));

      const bookmarkResponse = await updateBookmarkData(dataToSave);
      setBookmarkPosition(groupResponse.id, [
        ...(positions?.items?.[appendGroupId(groupResponse.id)] || []),
        ...bookmarkResponse.map((b) =>
          appendBookmarkId(groupResponse.id)(b.id),
        ),
      ]);
    } catch (err) {
      console.log("err", err);
    }
  };

  const getActiveTabsList = () => {
    return tabIds.map((id) => {
      const tab = tabData[id];
      return {
        favIconUrl: tab.favIconUrl,
        url: tab.url,
        title: tab.title,
        pinned: tab.pinned,
      };
    });
  };

  return (
    <BookmarkContext.Provider
      value={{
        groups,
        bookmarks,
        positions,
        tabIds,
        tabData,
        enableBulkAction,
        bulkActionIds,
        setEnableBulkAction,
        setBulkActionIds,
        setPositions,
        updatePositions,
        updateGroupData,
        updateBookmarkData,
        setGroups,
        setBookmarks,
        createNewGroup,
        createGroupAndAddBookmark,
        resetData,
        getActiveTabsList,
      }}
    >
      <BookmarkView />
    </BookmarkContext.Provider>
  );
};

export default Bookmark;

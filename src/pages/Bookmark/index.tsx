import React, { useContext, useEffect, useMemo, useState } from "react";
import _keyBy from "lodash/keyBy";
import _groupBy from "lodash/groupBy";
import _sortBy from "lodash/sortBy";

import AppContext from "src/AppContext";

import BookmarkModal from "../../services/BookmarkModal";
import BookmarkGroupModal from "../../services/BookmarkGroupModal";

import BookmarkContext from "./BookmarkContext";
import BookmarkView from "./BookmarkView";

import "./index.scss";

const Bookmark = (): JSX.Element => {
  const { workspace } = useContext(AppContext);
  const [groups, setGroups] = useState({});
  const [bookmarks, setBookmarks] = useState({});

  const groupedBookmark = useMemo(() => {
    return _groupBy(bookmarks, "groupId");
  }, [bookmarks]);

  const sortedGroupList = useMemo(() => {
    return _sortBy(Object.values(groups), "position");
  }, [groups]);

  const loadData = async () => {
    try {
      const groupResponse = await BookmarkGroupModal.getAll();
      const response = await BookmarkModal.getAll();
      setGroups(_keyBy(groupResponse, "id"));
      setBookmarks(_keyBy(response, "id"));
    } catch (err) {}
  };

  const updateGroupData = async (newGroupData) => {
    try {
      setGroups(_keyBy(newGroupData, "id"));
      const newGroupResponse = await BookmarkGroupModal.bulkPut(newGroupData);
      setGroups(_keyBy(newGroupResponse, "id"));
    } catch (err) {}
  };

  const updateBookmarkData = async (newBookmark) => {
    try {
      setBookmarks((bookmarks) => ({
        ...bookmarks,
        ..._keyBy(newBookmark, "id"),
      }));
      const newBookmarkResponse = await BookmarkModal.bulkPut(newBookmark);
      setBookmarks((bookmarks) => ({
        ...bookmarks,
        ..._keyBy(newBookmarkResponse, "id"),
      }));
    } catch (err) {}
  };

  useEffect(() => {
    loadData();
  }, [workspace]);

  return (
    <BookmarkContext.Provider
      value={{
        groups,
        sortedGroupList,
        setGroups,
        bookmarks,
        setBookmarks,
        groupedBookmark,
        updateGroupData,
        updateBookmarkData,
      }}
    >
      <BookmarkView />
    </BookmarkContext.Provider>
  );
};

export default Bookmark;

import React, { useContext, useEffect, useMemo, useState } from "react";
import _keyBy from "lodash/keyBy";
import _groupBy from "lodash/groupBy";
import _sortBy from "lodash/sortBy";

import AppContext from "src/AppContext";

import BookmarkModal from "../../services/BookmarkModal";
import BookmarkGroupModal from "../../services/BookmarkGroupModal";

import BookmarkContext from "./BookmarkContext";
import ActiveTabs from "./ActiveTabs";
import BookmarkCards from "./BookmarkCards";
import Collections from "./Collections";

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
      <div className="bookmark-wrapper">
        <Collections />
        <BookmarkCards />
        <ActiveTabs />
      </div>
    </BookmarkContext.Provider>
  );
};

export default Bookmark;

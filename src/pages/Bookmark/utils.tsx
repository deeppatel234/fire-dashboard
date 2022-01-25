import { exportFile } from "utils/download";

export const exportBookmark = (bookmarkToExport) => {
  const dataToExport = {
    bookmarkList: bookmarkToExport,
  };

  exportFile(dataToExport, `bookmarks-${Date.now()}.json`);
};

export const getId = (id) => {
  const [type, groupId, bookmarkId] = id.split("-");

  return {
    type,
    groupId,
    bookmarkId,
  };
};

export const getGroupId = (id) => {
  const { groupId } = getId(id);

  return groupId;
};

export const appendGroupId = (id) => {
  return `Group-${id}`;
};

export const appendBookmarkId = (groupId) => {
  return (id) => {
    return `Bookmark-${groupId}-${id}`;
  };
};

export const getBookmarkId = (id) => {
  const { bookmarkId } = getId(id);

  return bookmarkId;
};

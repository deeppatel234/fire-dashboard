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
